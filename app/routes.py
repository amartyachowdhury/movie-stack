from flask import request, jsonify
from . import app, db
from .models import User, Movie, Rating

@app.route('/')
def index():
    return "Welcome to Movie Stack!"

@app.route('/api/movies', methods=['GET'])
def get_movies():
    movies = Movie.query.all()
    return jsonify({'movies': [{'id': movie.id, 'title': movie.title, 'genre': movie.genre} for movie in movies]})

@app.route('/api/add_movie', methods=['POST'])
def add_movie():
    data = request.json
    movie = Movie(title=data['title'], genre=data['genre'])
    db.session.add(movie)
    db.session.commit()
    return jsonify({'message': 'Movie added successfully!'}), 201
