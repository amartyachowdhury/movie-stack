"""
Recommendations API endpoints
"""
from flask import Blueprint, request, current_app
from ...domains.movies.models.movie import Movie
from ...domains.movies.models.rating import Rating
from ...domains.users.models.user import User
from app.services.recommendation_service import RecommendationService
from app.utils.response import success_response, error_response
from collections import defaultdict
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

bp = Blueprint('recommendations', __name__)

@bp.route('/collaborative/<int:user_id>', methods=['GET'])
def get_collaborative_recommendations(user_id):
    """Get collaborative filtering recommendations for a user"""
    try:
        # Check if user exists
        user = User.query.get_or_404(user_id)
        
        # Get all ratings
        ratings = Rating.query.all()
        
        if len(ratings) < 10:  # Need minimum data for recommendations
            return success_response({
                "recommendations": [],
                "message": "Not enough rating data for recommendations"
            })
        
        # Create user-movie rating matrix
        user_ratings = defaultdict(dict)
        for rating in ratings:
            user_ratings[rating.user_id][rating.movie_id] = rating.rating
        
        # Convert to numpy array for calculations
        users = list(user_ratings.keys())
        movies = list(set(rating.movie_id for rating in ratings))
        movie_to_index = {movie_id: i for i, movie_id in enumerate(movies)}
        
        user_matrix = []
        for u in users:
            user_vector = []
            for movie_id in movies:
                user_vector.append(user_ratings[u].get(movie_id, 0))
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
                            'overview': movie.overview or '',
                            'poster_path': movie.poster_path or '',
                            'release_date': movie.release_date.isoformat() if movie.release_date else '',
                            'vote_average': movie.vote_average or 0,
                            'similarity_score': float(similar_users[similar_user_index])
                        })
        
        # Remove duplicates and sort by similarity
        seen = set()
        unique_recommendations = []
        for rec in recommendations:
            if rec['id'] not in seen:
                seen.add(rec['id'])
                unique_recommendations.append(rec)
        
        return success_response({
            "recommendations": unique_recommendations[:10]  # Return top 10 recommendations
        })
        
    except Exception as e:
        current_app.logger.error(f"Error generating collaborative recommendations for user {user_id}: {str(e)}")
        return error_response("Failed to generate recommendations", 500)

@bp.route('/content-based/<int:user_id>', methods=['GET'])
def get_content_based_recommendations_for_user(user_id):
    """Get content-based recommendations for a user based on their rated movies"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Get user's rated movies
        user_ratings = Rating.query.filter_by(user_id=user_id).all()
        
        if not user_ratings:
            return success_response({
                "recommendations": [],
                "message": "No ratings found for user"
            })
        
        # Get all movies for similarity calculation
        all_movies = Movie.query.all()
        
        if len(all_movies) < 2:
            return success_response({
                "recommendations": [],
                "message": "Not enough movies for recommendations"
            })
        
        # Create feature vectors based on genres
        movie_features = []
        all_genres = set()
        for movie in all_movies:
            if movie.genres:
                genres = movie.genres.split(',')
                all_genres.update(genres)
        
        genre_dict = {genre: i for i, genre in enumerate(all_genres)}
        
        for movie in all_movies:
            feature_vector = [0] * len(genre_dict)
            if movie.genres:
                for genre in movie.genres.split(','):
                    if genre in genre_dict:
                        feature_vector[genre_dict[genre]] = 1
            movie_features.append(feature_vector)
        
        movie_features = np.array(movie_features)
        
        # Calculate similarity matrix
        movie_similarity = cosine_similarity(movie_features)
        
        # Get user's highly rated movies
        user_movies = {rating.movie_id: rating.rating for rating in user_ratings}
        highly_rated_movies = [movie_id for movie_id, rating in user_movies.items() if rating >= 4]
        
        if not highly_rated_movies:
            return success_response({
                "recommendations": [],
                "message": "No highly rated movies found for user"
            })
        
        # Calculate average similarity scores for all movies based on user's preferences
        movie_scores = defaultdict(float)
        movie_counts = defaultdict(int)
        
        for movie_id in highly_rated_movies:
            movie_index = [m.id for m in all_movies].index(movie_id)
            similar_scores = movie_similarity[movie_index]
            
            for i, score in enumerate(similar_scores):
                other_movie_id = all_movies[i].id
                if other_movie_id not in user_movies:  # Don't recommend already rated movies
                    movie_scores[other_movie_id] += score
                    movie_counts[other_movie_id] += 1
        
        # Calculate average scores and create recommendations
        recommendations = []
        for movie_id, total_score in movie_scores.items():
            if movie_counts[movie_id] > 0:
                avg_score = total_score / movie_counts[movie_id]
                movie = Movie.query.get(movie_id)
                if movie:
                    recommendations.append({
                        'id': movie.id,
                        'title': movie.title,
                        'overview': movie.overview or '',
                        'poster_path': movie.poster_path or '',
                        'release_date': movie.release_date.isoformat() if movie.release_date else '',
                        'vote_average': movie.vote_average or 0,
                        'similarity_score': float(avg_score)
                    })
        
        # Sort by similarity score and return top recommendations
        recommendations.sort(key=lambda x: x['similarity_score'], reverse=True)
        
        return success_response({
            "recommendations": recommendations[:10]
        })
        
    except Exception as e:
        current_app.logger.error(f"Error generating content-based recommendations for user {user_id}: {str(e)}")
        return error_response("Failed to generate recommendations", 500)

@bp.route('/content/<int:movie_id>', methods=['GET'])
def get_content_based_recommendations_for_movie(movie_id):
    """Get content-based recommendations for a specific movie"""
    try:
        movie = Movie.query.get_or_404(movie_id)
        movies = Movie.query.all()
        
        if len(movies) < 2:
            return success_response({
                "recommendations": [],
                "message": "Not enough movies for recommendations"
            })
        
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
                    if genre in genre_dict:
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
            if similar_movie.id != movie_id:  # Don't recommend the same movie
                recommendations.append({
                    'id': similar_movie.id,
                    'title': similar_movie.title,
                    'overview': similar_movie.overview or '',
                    'poster_path': similar_movie.poster_path or '',
                    'release_date': similar_movie.release_date.isoformat() if similar_movie.release_date else '',
                    'vote_average': similar_movie.vote_average or 0,
                    'similarity_score': float(similar_scores[index])
                })
        
        return success_response({
            "recommendations": recommendations
        })
        
    except Exception as e:
        current_app.logger.error(f"Error generating content-based recommendations for movie {movie_id}: {str(e)}")
        return error_response("Failed to generate recommendations", 500)

@bp.route('/hybrid/<int:user_id>', methods=['GET'])
def get_hybrid_recommendations(user_id):
    """Get hybrid recommendations combining collaborative and content-based filtering"""
    try:
        user = User.query.get_or_404(user_id)
        
        # Get user's rated movies
        user_ratings = Rating.query.filter_by(user_id=user_id).all()
        
        if not user_ratings:
            return success_response({
                "recommendations": [],
                "message": "No ratings found for user"
            })
        
        # Get collaborative recommendations (extract logic directly)
        collaborative_recommendations = []
        try:
            # Get all ratings
            all_ratings = Rating.query.all()
            
            if len(all_ratings) >= 10:  # Need minimum data for recommendations
                # Create user-movie rating matrix
                user_ratings_dict = defaultdict(dict)
                for rating in all_ratings:
                    user_ratings_dict[rating.user_id][rating.movie_id] = rating.rating
                
                # Convert to numpy array for calculations
                users = list(user_ratings_dict.keys())
                movies = list(set(rating.movie_id for rating in all_ratings))
                
                user_matrix = []
                for u in users:
                    user_vector = []
                    for movie_id in movies:
                        user_vector.append(user_ratings_dict[u].get(movie_id, 0))
                    user_matrix.append(user_vector)
                
                user_matrix = np.array(user_matrix)
                
                # Calculate similarity between users
                user_similarity = cosine_similarity(user_matrix)
                
                # Get similar users
                user_index = users.index(user_id)
                similar_users = user_similarity[user_index]
                similar_users_indices = similar_users.argsort()[-6:-1][::-1]  # Top 5 similar users
                
                # Get recommendations based on similar users
                user_movies = set(user_ratings_dict[user_id].keys())
                
                for similar_user_index in similar_users_indices:
                    similar_user_id = users[similar_user_index]
                    for movie_id, rating in user_ratings_dict[similar_user_id].items():
                        if movie_id not in user_movies and rating >= 4:  # Only recommend highly rated movies
                            movie = Movie.query.get(movie_id)
                            if movie:
                                collaborative_recommendations.append({
                                    'id': movie.id,
                                    'title': movie.title,
                                    'overview': movie.overview or '',
                                    'poster_path': movie.poster_path or '',
                                    'release_date': movie.release_date.isoformat() if movie.release_date else '',
                                    'vote_average': movie.vote_average or 0,
                                    'similarity_score': float(similar_users[similar_user_index])
                                })
        except Exception as e:
            current_app.logger.warning(f"Error in collaborative part of hybrid recommendations: {str(e)}")
        
        # Get content-based recommendations (extract logic directly)
        content_recommendations = []
        try:
            # Get all movies for similarity calculation
            all_movies = Movie.query.all()
            
            if len(all_movies) >= 2:
                # Create feature vectors based on genres
                movie_features = []
                all_genres = set()
                for movie in all_movies:
                    if movie.genres:
                        genres = movie.genres.split(',')
                        all_genres.update(genres)
                
                genre_dict = {genre: i for i, genre in enumerate(all_genres)}
                
                for movie in all_movies:
                    feature_vector = [0] * len(genre_dict)
                    if movie.genres:
                        for genre in movie.genres.split(','):
                            if genre in genre_dict:
                                feature_vector[genre_dict[genre]] = 1
                    movie_features.append(feature_vector)
                
                movie_features = np.array(movie_features)
                
                # Calculate similarity matrix
                movie_similarity = cosine_similarity(movie_features)
                
                # Get user's highly rated movies
                user_movies = {rating.movie_id: rating.rating for rating in user_ratings}
                highly_rated_movies = [movie_id for movie_id, rating in user_movies.items() if rating >= 4]
                
                if highly_rated_movies:
                    # Calculate average similarity scores for all movies based on user's preferences
                    movie_scores = defaultdict(float)
                    movie_counts = defaultdict(int)
                    
                    for movie_id in highly_rated_movies:
                        movie_index = [m.id for m in all_movies].index(movie_id)
                        similar_scores = movie_similarity[movie_index]
                        
                        for i, score in enumerate(similar_scores):
                            other_movie_id = all_movies[i].id
                            if other_movie_id not in user_movies:  # Don't recommend already rated movies
                                movie_scores[other_movie_id] += score
                                movie_counts[other_movie_id] += 1
                    
                    # Calculate average scores and create recommendations
                    for movie_id, total_score in movie_scores.items():
                        if movie_counts[movie_id] > 0:
                            avg_score = total_score / movie_counts[movie_id]
                            movie = Movie.query.get(movie_id)
                            if movie:
                                content_recommendations.append({
                                    'id': movie.id,
                                    'title': movie.title,
                                    'overview': movie.overview or '',
                                    'poster_path': movie.poster_path or '',
                                    'release_date': movie.release_date.isoformat() if movie.release_date else '',
                                    'vote_average': movie.vote_average or 0,
                                    'similarity_score': float(avg_score)
                                })
        except Exception as e:
            current_app.logger.warning(f"Error in content-based part of hybrid recommendations: {str(e)}")
        
        # Combine and rank recommendations
        all_recommendations = {}
        
        # Add content-based recommendations
        for rec in content_recommendations:
            if rec['id'] not in all_recommendations:
                all_recommendations[rec['id']] = {
                    'id': rec['id'],
                    'title': rec['title'],
                    'overview': rec['overview'],
                    'poster_path': rec['poster_path'],
                    'release_date': rec['release_date'],
                    'vote_average': rec['vote_average'],
                    'score': 0.5  # Base score for content-based
                }
        
        # Add collaborative recommendations with higher weight
        for rec in collaborative_recommendations:
            if rec['id'] in all_recommendations:
                all_recommendations[rec['id']]['score'] += 0.5
            else:
                rec['score'] = 0.5
                all_recommendations[rec['id']] = rec
        
        # Sort by score and return top recommendations
        sorted_recommendations = sorted(
            all_recommendations.values(), 
            key=lambda x: x['score'], 
            reverse=True
        )
        
        return success_response({
            "recommendations": sorted_recommendations[:10]
        })
        
    except Exception as e:
        current_app.logger.error(f"Error generating hybrid recommendations for user {user_id}: {str(e)}")
        return error_response("Failed to generate recommendations", 500)
