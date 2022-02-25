## Setup Instructions
1. Create a directory on your computer 
2. In the directory your created, run "git init" and "heroku create"
3. In comment line run "heroku addons:create heroku-postgresql:hobby-dev" to add a databae to your app
4. In comment line run "heroku config" to get database_url 
5. In comment line run "pip3 install Flask python-dotenv requests"
6. Create a ".env" file to add API key and database url by entering the following:
    "export TMDB_API_KEY=<your API key>"
    "export DATABASE_URL=<your database_url>"
7. In comment line run "python app.py"

## Detailed description of how implementing your project differed from your expectations during project planning.

During implementing my project, I was using only one database table to store all the information, but I cannot figure out how I can display the comment information by movie id if I use user id or user name as primary key. Then I decide to use two table(one for user and one for comments) and join the two table together using uid. 

## Detailed description of 2+ technical issues and how you solved them (your process, what you searched, what resources you used)

1. The database I created initially was incorrect and I cannot get movie id store into database therefore the comment history cannot be displayed. Later on I realized this issue and add it to database. But the query argument was incorrect too then I have to put both user and comment there and filter by movie id and user uid in order to get correct comment list

2. When I query comment from database, not sure why it keep adding () (line 73-78) into my code which querying two comments at the same time. I will have to put it into a list (line 80-83) and disply one at a time.  

