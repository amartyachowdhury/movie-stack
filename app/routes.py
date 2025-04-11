from flask import request, jsonify
from . import app, db
from .models import User, Movie, Rating
from datetime import datetime
import requests
import os
from collections import defaultdict
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

TMDB_API_KEY = os.environ.get('TMDB_API_KEY')
TMDB_BASE_URL = "https://api.themoviedb.org/3"

@app.route('/')
def index():
    return "Welcome to Movie Stack!"

@app.route('/api/movies', methods=['GET'])
def get_movies():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    sort_by = request.args.get('sort_by', 'popularity')
    
    query = Movie.query
    
    if sort_by == 'popularity':
        query = query.order_by(Movie.popularity.desc())
    elif sort_by == 'rating':
        query = query.order_by(Movie.vote_average.desc())
    elif sort_by == 'latest':
        query = query.order_by(Movie.release_date.desc())
        
    movies = query.paginate(page=page, per_page=per_page)
    
    return jsonify({
        'movies': [{
            'id': movie.id,
            'title': movie.title,
            'overview': movie.overview,
            'genres': movie.genres,
            'poster_path': movie.poster_path,
            'vote_average': movie.vote_average,
            'popularity': movie.popularity
        } for movie in movies.items],
        'total_pages': movies.pages,
        'current_page': movies.page
    })

@app.route('/api/movies/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    return jsonify({
        'id': movie.id,
        'title': movie.title,
        'overview': movie.overview,
        'genres': movie.genres,
        'poster_path': movie.poster_path,
        'vote_average': movie.vote_average,
        'popularity': movie.popularity,
        'release_date': movie.release_date.isoformat() if movie.release_date else None
    })

@app.route('/api/movies/<int:movie_id>/rate', methods=['POST'])
def rate_movie(movie_id):
    data = request.json
    user_id = data.get('user_id')
    rating_value = data.get('rating')
    review = data.get('review', '')
    
    if not all([user_id, rating_value]):
        return jsonify({'error': 'Missing required fields'}), 400
        
    existing_rating = Rating.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    
    if existing_rating:
        existing_rating.rating = rating_value
        existing_rating.review = review
    else:
        new_rating = Rating(user_id=user_id, movie_id=movie_id, rating=rating_value, review=review)
        db.session.add(new_rating)
    
    db.session.commit()
    return jsonify({'message': 'Rating submitted successfully'})

@app.route('/api/recommendations/collaborative/<int:user_id>', methods=['GET'])
def get_collaborative_recommendations(user_id):
    # Get all ratings
    ratings = Rating.query.all()
    
    # Create user-movie rating matrix
    user_ratings = defaultdict(dict)
    for rating in ratings:
        user_ratings[rating.user_id][rating.movie_id] = rating.rating
    
    # Convert to numpy array for calculations
    users = list(user_ratings.keys())
    user_matrix = []
    for u in users:
        user_vector = []
        for m in range(1, Movie.query.count() + 1):
            user_vector.append(user_ratings[u].get(m, 0))
        user_matrix.append(user_vector)
    
    user_matrix = np.array(user_matrix)
    
    # Calculate similarity between users
    user_similarity = cosine_similarity(user_matrix)
    
    # Get similar users
    user_index = users.index(user_id)
    similar_users = user_similarity[user_index]
    similar_users_indices = similar_users.argsort()[-6:-1][::-1]  # Top 5 similar users
    
    # Get recommendations based on similar users
    recommendations = []
    user_movies = set(user_ratings[user_id].keys())
    
    for similar_user_index in similar_users_indices:
        similar_user_id = users[similar_user_index]
        for movie_id, rating in user_ratings[similar_user_id].items():
            if movie_id not in user_movies and rating >= 4:  # Only recommend highly rated movies
                movie = Movie.query.get(movie_id)
                if movie:
                    recommendations.append({
                        'id': movie.id,
                        'title': movie.title,
                        'poster_path': movie.poster_path,
                        'vote_average': movie.vote_average
                    })
    
    return jsonify({'recommendations': recommendations[:10]})  # Return top 10 recommendations

@app.route('/api/recommendations/content/<int:movie_id>', methods=['GET'])
def get_content_based_recommendations(movie_id):
    movie = Movie.query.get_or_404(movie_id)
    movies = Movie.query.all()
    
    # Create feature vectors based on genres
    movie_features = []
    all_genres = set()
    for m in movies:
        if m.genres:
            genres = m.genres.split(',')
            all_genres.update(genres)
    
    genre_dict = {genre: i for i, genre in enumerate(all_genres)}
    
    for m in movies:
        feature_vector = [0] * len(genre_dict)
        if m.genres:
            for genre in m.genres.split(','):
                feature_vector[genre_dict[genre]] = 1
        movie_features.append(feature_vector)
    
    movie_features = np.array(movie_features)
    
    # Calculate similarity
    movie_similarity = cosine_similarity(movie_features)
    movie_index = [m.id for m in movies].index(movie_id)
    similar_scores = movie_similarity[movie_index]
    similar_movie_indices = similar_scores.argsort()[-11:-1][::-1]  # Top 10 similar movies
    
    recommendations = []
    for index in similar_movie_indices:
        similar_movie = movies[index]
        recommendations.append({
            'id': similar_movie.id,
            'title': similar_movie.title,
            'poster_path': similar_movie.poster_path,
            'vote_average': similar_movie.vote_average,
            'similarity_score': float(similar_scores[index])
        })
    
    return jsonify({'recommendations': recommendations})

@app.route('/api/movies/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
        
    # Search TMDB
    response = requests.get(
        f"{TMDB_BASE_URL}/search/movie",
        params={
            'api_key': TMDB_API_KEY,
            'query': query,
            'language': 'en-US',
            'page': 1
        }
    )
    
    if response.status_code == 200:
        results = response.json()['results']
        movies = []
        for result in results[:10]:  # Top 10 results
            movie = {
                'tmdb_id': result['id'],
                'title': result['title'],
                'overview': result['overview'],
                'poster_path': result['poster_path'],
                'vote_average': result['vote_average'],
                'release_date': result['release_date']
            }
            movies.append(movie)
        return jsonify({'results': movies})
    else:
        return jsonify({'error': 'Failed to fetch results from TMDB'}), response.status_code
