import flask
import os
import random

from flask import request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from flask_login import LoginManager, login_user, logout_user, current_user, UserMixin

from wikipedia import get_wiki_link
from tmdb import get_movie_data

login_manager = LoginManager()

app = flask.Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8zkdifenrk/ec]/'


app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
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
    # movie_id = (flask.request.form["movie_id"],)

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


if __name__ == "__main__":
    app.run(
        host=os.getenv("IP", "0.0.0.0"), port=int(os.getenv("PORT", 8080)), debug=True
    )

# salty-springs-47005
# https://salty-springs-47005.herokuapp.com/
# https://git.heroku.com/salty-springs-47005.git
