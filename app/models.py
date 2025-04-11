from . import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    ratings = db.relationship('Rating', backref='user', lazy=True)
    favorites = db.relationship('Movie', secondary='favorite', backref='favorited_by', lazy=True)

class Movie(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tmdb_id = db.Column(db.Integer, unique=True)
    title = db.Column(db.String(200), nullable=False)
    overview = db.Column(db.Text)
    genres = db.Column(db.String(200))  # Stored as comma-separated values
    release_date = db.Column(db.DateTime)
    poster_path = db.Column(db.String(200))
    vote_average = db.Column(db.Float)
    popularity = db.Column(db.Float)
    ratings = db.relationship('Rating', backref='movie', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movie.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    review = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Association table for user favorites
favorite = db.Table('favorite',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('movie_id', db.Integer, db.ForeignKey('movie.id'), primary_key=True)
)
