"""
Recommendation Service
"""
from typing import List, Dict
from ...domains.movies.models.movie import Movie
from ...domains.movies.models.rating import Rating
from ...domains.users.models.user import User
from app import db
from collections import defaultdict
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
import logging

logger = logging.getLogger(__name__)

class RecommendationService:
    """Service for generating movie recommendations"""
    
    def __init__(self):
        pass
    
    def get_collaborative_recommendations(self, user_id: int, limit: int = 10) -> List[Dict]:
        """Generate collaborative filtering recommendations"""
        try:
            # Get all ratings
            ratings = Rating.query.all()
            
            if len(ratings) < 10:
                return []
            
            # Create user-movie rating matrix
            user_ratings = defaultdict(dict)
            for rating in ratings:
                user_ratings[rating.user_id][rating.movie_id] = rating.rating
            
            # Convert to numpy array
            users = list(user_ratings.keys())
            movies = list(set(rating.movie_id for rating in ratings))
            
            user_matrix = []
            for u in users:
                user_vector = []
                for movie_id in movies:
                    user_vector.append(user_ratings[u].get(movie_id, 0))
                user_matrix.append(user_vector)
            
            user_matrix = np.array(user_matrix)
            
            # Calculate similarity
            user_similarity = cosine_similarity(user_matrix)
            
            # Get similar users
            if user_id not in users:
                return []
            
            user_index = users.index(user_id)
            similar_users = user_similarity[user_index]
            similar_users_indices = similar_users.argsort()[-6:-1][::-1]
            
            # Get recommendations
            recommendations = []
            user_movies = set(user_ratings[user_id].keys())
            
            for similar_user_index in similar_users_indices:
                similar_user_id = users[similar_user_index]
                for movie_id, rating in user_ratings[similar_user_id].items():
                    if movie_id not in user_movies and rating >= 4:
                        movie = Movie.query.get(movie_id)
                        if movie:
                            recommendations.append({
                                'id': movie.id,
                                'title': movie.title,
                                'poster_path': movie.poster_path,
                                'vote_average': movie.vote_average,
                                'similarity_score': float(similar_users[similar_user_index])
                            })
            
            # Remove duplicates and return top recommendations
            seen = set()
            unique_recommendations = []
            for rec in recommendations:
                if rec['id'] not in seen:
                    seen.add(rec['id'])
                    unique_recommendations.append(rec)
            
            return unique_recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error in collaborative recommendations: {str(e)}")
            return []
    
    def get_content_based_recommendations(self, movie_id: int, limit: int = 10) -> List[Dict]:
        """Generate content-based recommendations"""
        try:
            movie = Movie.query.get(movie_id)
            if not movie:
                return []
            
            movies = Movie.query.all()
            
            if len(movies) < 2:
                return []
            
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
            similar_movie_indices = similar_scores.argsort()[-limit-1:-1][::-1]
            
            recommendations = []
            for index in similar_movie_indices:
                similar_movie = movies[index]
                if similar_movie.id != movie_id:
                    recommendations.append({
                        'id': similar_movie.id,
                        'title': similar_movie.title,
                        'poster_path': similar_movie.poster_path,
                        'vote_average': similar_movie.vote_average,
                        'similarity_score': float(similar_scores[index])
                    })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error in content-based recommendations: {str(e)}")
            return []
    
    def get_hybrid_recommendations(self, user_id: int, limit: int = 10) -> List[Dict]:
        """Generate hybrid recommendations combining multiple approaches"""
        try:
            user = User.query.get(user_id)
            if not user:
                return []
            
            # Get user's rated movies
            user_ratings = Rating.query.filter_by(user_id=user_id).all()
            
            if not user_ratings:
                return []
            
            # Get content-based recommendations for highly rated movies
            content_recommendations = []
            for rating in user_ratings:
                if rating.rating >= 4:
                    similar_movies = rating.movie.get_similar_movies(limit=5)
                    content_recommendations.extend(similar_movies)
            
            # Get collaborative recommendations
            collaborative_recommendations = self.get_collaborative_recommendations(user_id, limit)
            
            # Combine and rank recommendations
            all_recommendations = {}
            
            # Add content-based recommendations
            for movie in content_recommendations:
                if movie.id not in all_recommendations:
                    all_recommendations[movie.id] = {
                        'id': movie.id,
                        'title': movie.title,
                        'poster_path': movie.poster_path,
                        'vote_average': movie.vote_average,
                        'score': 0.5
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
            
            return sorted_recommendations[:limit]
            
        except Exception as e:
            logger.error(f"Error in hybrid recommendations: {str(e)}")
            return []
    
    def get_popular_recommendations(self, limit: int = 10) -> List[Dict]:
        """Get popular movie recommendations"""
        try:
            movies = Movie.query.order_by(Movie.vote_average.desc()).limit(limit).all()
            
            recommendations = []
            for movie in movies:
                recommendations.append({
                    'id': movie.id,
                    'title': movie.title,
                    'poster_path': movie.poster_path,
                    'vote_average': movie.vote_average,
                    'popularity': movie.popularity
                })
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error in popular recommendations: {str(e)}")
            return []
