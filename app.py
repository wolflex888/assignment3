import flask
import os
import random

from flask_cors import CORS
from flask import request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from flask_login import LoginManager, login_user, logout_user, current_user, UserMixin

from wikipedia import get_wiki_link
from tmdb import get_movie_data
import re

login_manager = LoginManager()

app = flask.Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8zkdifenrk/ec]/'

CORS(app)

bp = flask.Blueprint("bp", __name__, template_folder="./static/react",)

# route for serving React page
@bp.route("/")
def index():
    # NB: DO NOT add an "index.html" file in your normal templates folder
    # Flask will stop serving this React page correctly
    return flask.render_template("index.html")


uri = os.getenv("DATABASE_URL")  # or other relevant config var
if uri.startswith("postgres://"):
    uri = uri.replace("postgres://", "postgresql://", 1)
app.config["SQLALCHEMY_DATABASE_URI"] = uri
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
db.init_app(app)
login_manager.init_app(app)


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(10), unique=True)


class Comment(db.Model):
    cid = db.Column(db.Integer, primary_key=True, autoincrement=True)
    movie_id = db.Column(db.Integer)
    comment = db.Column(db.String(255))
    rate = db.Column(db.Integer)
    uid = db.Column(db.Integer, ForeignKey(User.id))


db.create_all()


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)


MOVIE_IDS = [157336]


@app.route("/comments", methods=["POST"])
def comments():
    # data = flask.request.form
    new_comment = Comment(
        rate=flask.request.form["rate"],
        comment=flask.request.form["comment"],
        movie_id=flask.request.form["movie_id"],
        uid=current_user.id,
    )
    db.session.add(new_comment)
    db.session.commit()
    flask.flash("Your comment has been added")
    return flask.redirect("/home")


@app.route("/home")
def index():
    movie_id = random.choice(MOVIE_IDS)

    # API calls
    (title, tagline, genre, poster_image) = get_movie_data(movie_id)
    wikipedia_url = get_wiki_link(title)
    comment = (
        db.session.query(User, Comment)
        .filter(Comment.movie_id == movie_id)
        .filter(Comment.uid == User.id)
        .all()
    )
    num_comment = len(comment)
    comments = [
        {"user_name": k[0].user_name, "rate": k[1].rate, "comment": k[1].comment}
        for k in comment
    ]
    return flask.render_template(
        "index.html",
        movie_id=movie_id,
        title=title,
        tagline=tagline,
        genre=genre,
        poster_image=poster_image,
        wiki_url=wikipedia_url,
        comment=comments,
        num_comment=num_comment,
    )


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        name = flask.request.form["user_name"]

        found_user = User.query.filter_by(user_name=name).first()
        if found_user:
            flask.flash(f"User Name {name} already exists!")
            return flask.redirect("/signup")
        else:
            user = User(user_name=name)
            db.session.add(user)
            db.session.commit()
            flask.flash(f"{name} has been added")
            return flask.redirect("/signup")
    else:
        return flask.render_template("signup.html")


@app.route("/")
def redirect_to_login():
    return flask.redirect("/login")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "GET":
        return flask.render_template("login.html")
    else:
        name = flask.request.form["user_name"]
        found_user = User.query.filter_by(user_name=name).first()
        if found_user:
            login_user(found_user)
            return flask.redirect("/home")
        else:
            flask.flash("Wrong User Name!")
            return flask.render_template("login.html")


@app.route("/logout", methods=["POST"])
def logout():
    logout_user()
    return flask.redirect("/login")


@app.route("/movie_comments", methods=["GET"])
def movie_comments():
    if request.method=="GET":
        movie_comments = Comment.query.filter_by(movie_id=157336).all()
        movie_comment_text = [
            {"movie_id": r.movie_id, "comment": r.comment, "rate": r.rate, "comment_id": r.cid}
            for r in movie_comments
        ]
        return flask.jsonify({"movie_comments": movie_comment_text})

@app.route("/edit_comments", methods = ["PATCH", "GET"])
def edit_comments():
    if request.method=="PATCH":
        data = request.form
        import pdb;pdb.set_trace()
        stmt = Comment.update().values(comment=data.get('comment'), rate=data.get("rate")).where(cid=data.get("comment_id"))
        db.session.execute(stmt)
        db.session.commit()

@app.route("/delete_comments", methods=["POST"])
def delete_comments():
    delComm = request.form.get("rate1")
    import pdb

    pdb.set_trace()
    delMovie = Comment.query.filter_by(rate=delComm).all()
    db.session.delete(delMovie)
    db.session.commit()
    return flask.jsonify({"delete_comments": movie_comments()})


# @app.route("/save_comments")
# def save_comments():
#     fact = " "
#     return flask.jsonify({"fact": fact})


app.register_blueprint(bp)

if __name__ == "__main__":
    app.run(
        host=os.getenv("IP", "localhost"), port=int(os.getenv("PORT", 3001)), debug=True
    )

