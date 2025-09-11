"""
Movies API endpoints
"""
from flask import Blueprint, request, jsonify, current_app
from ..models.movie import Movie
from ..models.rating import Rating
from app.services.tmdb_service import TMDBService
from app.utils.pagination import paginate
from app.utils.response import success_response, error_response
from app import db
from sqlalchemy import desc

bp = Blueprint('movies', __name__)

@bp.route('/', methods=['GET'])
def get_movies():
    """Get paginated list of movies"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', current_app.config['MOVIES_PER_PAGE'], type=int)
        sort_by = request.args.get('sort_by', 'popularity')
        genre = request.args.get('genre')
        
        # Build query
        query = Movie.query
        
        # Apply genre filter
        if genre:
            query = query.filter(Movie.genres.contains(genre))
        
        # Apply sorting
        if sort_by == 'popularity':
            query = query.order_by(desc(Movie.popularity))
        elif sort_by == 'rating':
            query = query.order_by(desc(Movie.vote_average))
        elif sort_by == 'latest':
            query = query.order_by(desc(Movie.release_date))
        elif sort_by == 'title':
            query = query.order_by(Movie.title)
        
        # Paginate results
        pagination = query.paginate(
            page=page, 
            per_page=min(per_page, current_app.config['MAX_PER_PAGE']),
            error_out=False
        )
        
        movies = [movie.to_dict() for movie in pagination.items]
        
        return success_response({
            'movies': movies,
            'pagination': {
                'page': pagination.page,
                'pages': pagination.pages,
                'per_page': pagination.per_page,
                'total': pagination.total,
                'has_next': pagination.has_next,
                'has_prev': pagination.has_prev
            }
        })
        
    except Exception as e:
        current_app.logger.error(f"Error fetching movies: {str(e)}")
        return error_response("Failed to fetch movies", 500)

@bp.route('/<int:movie_id>', methods=['GET'])
def get_movie(movie_id):
    """Get specific movie details"""
    try:
        # First try to find in local database
        movie = Movie.query.filter_by(id=movie_id).first()
        
        if not movie:
            # If not found locally, try to fetch from TMDB
            tmdb_service = TMDBService()
            tmdb_movie = tmdb_service.get_movie_details(movie_id)
            
            if tmdb_movie:
                # Get rating statistics for this movie
                ratings = Rating.query.filter_by(movie_id=movie_id).all()
                rating_count = len(ratings)
                average_rating = sum(r.rating for r in ratings) / rating_count if rating_count > 0 else 0
                
                # Create a movie object from TMDB data
                movie_data = {
                    'id': movie_id,
                    'tmdb_id': movie_id,
                    'title': tmdb_movie.get('title', ''),
                    'overview': tmdb_movie.get('overview', ''),
                    'poster_path': tmdb_movie.get('poster_path', ''),
                    'release_date': tmdb_movie.get('release_date', ''),
                    'vote_average': tmdb_movie.get('vote_average', 0),
                    'genres': tmdb_movie.get('genres', []),
                    'runtime': tmdb_movie.get('runtime', 0),
                    'status': tmdb_movie.get('status', ''),
                    'tagline': tmdb_movie.get('tagline', ''),
                    'budget': tmdb_movie.get('budget', 0),
                    'revenue': tmdb_movie.get('revenue', 0),
                    'production_companies': tmdb_movie.get('production_companies', []),
                    'spoken_languages': tmdb_movie.get('spoken_languages', []),
                    'cast': tmdb_movie.get('cast', []),
                    'crew': tmdb_movie.get('crew', []),
                    'similar_movies': tmdb_movie.get('similar_movies', []),
                    'rating_count': rating_count,
                    'average_rating': round(average_rating, 1),
                    'recent_ratings': []
                }
                return success_response(movie_data)
            else:
                return error_response("Movie not found", 404)
        
        # Get user ratings for this movie
        ratings = Rating.query.filter_by(movie_id=movie_id).limit(5).all()
        ratings_data = [rating.to_dict() for rating in ratings]
        
        # Get rating statistics
        all_ratings = Rating.query.filter_by(movie_id=movie_id).all()
        rating_count = len(all_ratings)
        average_rating = sum(r.rating for r in all_ratings) / rating_count if rating_count > 0 else 0
        
        movie_data = movie.to_dict()
        movie_data['recent_ratings'] = ratings_data
        movie_data['rating_count'] = rating_count
        movie_data['average_rating'] = round(average_rating, 1)
        
        return success_response(movie_data)
        
    except Exception as e:
        current_app.logger.error(f"Error fetching movie {movie_id}: {str(e)}")
        return error_response("Failed to fetch movie", 500)

@bp.route('/<int:movie_id>/trailers', methods=['GET'])
def get_movie_trailers(movie_id):
    """Get trailers for a specific movie"""
    try:
        # For now, return mock trailer data
        # In a real implementation, this would fetch from TMDB API
        mock_trailers = [
            {
                'id': '1',
                'key': 'dQw4w9WgXcQ',  # Rick Roll for demo
                'name': 'Official Trailer',
                'site': 'YouTube',
                'size': 1080,
                'type': 'Trailer',
                'official': True
            },
            {
                'id': '2',
                'key': 'jNQXAC9IVRw',  # Me at the zoo for demo
                'name': 'Teaser Trailer',
                'site': 'YouTube',
                'size': 720,
                'type': 'Trailer',
                'official': False
            }
        ]
        
        return success_response({'trailers': mock_trailers})
    except Exception as e:
        current_app.logger.error(f"Error fetching trailers for movie {movie_id}: {str(e)}")
        return error_response("Failed to fetch trailers", 500)

@bp.route('/analytics', methods=['GET'])
def get_analytics():
    """Get analytics data for the current user"""
    try:
        # Get query parameters
        time_range = request.args.get('timeRange', '30d')
        user_id = request.args.get('userId')
        
        if not user_id:
            return error_response("User ID required", 400)
        
        # Mock analytics data for demo
        analytics_data = {
            'userStats': {
                'totalMovies': 156,
                'totalRatings': 89,
                'averageRating': 7.8,
                'watchlistCount': 23,
                'favoriteGenres': ['Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller'],
                'mostRatedMovies': [
                    {'title': 'The Dark Knight', 'rating': 9.0, 'date': '2024-01-15'},
                    {'title': 'Inception', 'rating': 8.5, 'date': '2024-01-10'},
                    {'title': 'Interstellar', 'rating': 8.8, 'date': '2024-01-05'},
                    {'title': 'Pulp Fiction', 'rating': 8.9, 'date': '2023-12-28'},
                    {'title': 'Fight Club', 'rating': 8.7, 'date': '2023-12-20'}
                ]
            },
            'searchStats': {
                'totalSearches': 342,
                'popularSearches': [
                    {'term': 'action movies', 'count': 45},
                    {'term': 'sci-fi', 'count': 38},
                    {'term': 'comedy', 'count': 32},
                    {'term': 'drama', 'count': 28},
                    {'term': 'thriller', 'count': 25}
                ],
                'searchTrends': [
                    {'date': '2024-01-01', 'searches': 12},
                    {'date': '2024-01-02', 'searches': 15},
                    {'date': '2024-01-03', 'searches': 8},
                    {'date': '2024-01-04', 'searches': 20},
                    {'date': '2024-01-05', 'searches': 18}
                ]
            },
            'movieStats': {
                'topRatedMovies': [
                    {'title': 'The Shawshank Redemption', 'rating': 9.3, 'poster': '/api/posters/278'},
                    {'title': 'The Godfather', 'rating': 9.2, 'poster': '/api/posters/238'},
                    {'title': 'The Dark Knight', 'rating': 9.0, 'poster': '/api/posters/155'},
                    {'title': 'Pulp Fiction', 'rating': 8.9, 'poster': '/api/posters/680'},
                    {'title': 'Fight Club', 'rating': 8.8, 'poster': '/api/posters/550'}
                ],
                'genreDistribution': [
                    {'genre': 'Action', 'count': 45, 'percentage': 28.8},
                    {'genre': 'Drama', 'count': 38, 'percentage': 24.4},
                    {'genre': 'Comedy', 'count': 32, 'percentage': 20.5},
                    {'genre': 'Sci-Fi', 'count': 25, 'percentage': 16.0},
                    {'genre': 'Thriller', 'count': 16, 'percentage': 10.3}
                ],
                'ratingDistribution': [
                    {'rating': 5, 'count': 8},
                    {'rating': 6, 'count': 12},
                    {'rating': 7, 'count': 25},
                    {'rating': 8, 'count': 32},
                    {'rating': 9, 'count': 10},
                    {'rating': 10, 'count': 2}
                ]
            },
            'recommendations': {
                'accuracy': 87.5,
                'totalRecommendations': 156,
                'acceptedRecommendations': 137,
                'topRecommendationSources': [
                    {'source': 'Collaborative Filtering', 'count': 45},
                    {'source': 'Content-Based', 'count': 38},
                    {'source': 'Hybrid', 'count': 32},
                    {'source': 'Popular Movies', 'count': 25},
                    {'source': 'Genre-Based', 'count': 16}
                ]
            }
        }
        
        return success_response(analytics_data)
    except Exception as e:
        current_app.logger.error(f"Error fetching analytics: {str(e)}")
        return error_response("Failed to fetch analytics", 500)

@bp.route('/analytics/performance', methods=['POST'])
def log_performance_metrics():
    """Log performance metrics from frontend"""
    try:
        data = request.get_json()
        
        # Log performance metrics
        current_app.logger.info(f"Performance metrics: {data}")
        
        # In a real implementation, you would store these metrics in a database
        # For now, we'll just log them
        
        return success_response({'message': 'Performance metrics logged successfully'})
    except Exception as e:
        current_app.logger.error(f"Error logging performance metrics: {str(e)}")
        return error_response("Failed to log performance metrics", 500)

@bp.route('/<int:movie_id>/rate', methods=['POST'])
def rate_movie(movie_id):
    """Rate a movie"""
    try:
        data = request.get_json()
        if not data:
            return error_response("No data provided", 400)
        
        user_id = data.get('user_id')
        rating_value = data.get('rating')
        review = data.get('review', '')
        
        if not all([user_id, rating_value]):
            return error_response("Missing required fields: user_id, rating", 400)
        
        if not isinstance(rating_value, int) or rating_value < 1 or rating_value > 5:
            return error_response("Rating must be an integer between 1 and 5", 400)
        
        # Check if movie exists
        movie = Movie.query.get_or_404(movie_id)
        
        # Check if rating already exists
        existing_rating = Rating.query.filter_by(
            user_id=user_id, 
            movie_id=movie_id
        ).first()
        
        if existing_rating:
            existing_rating.rating = rating_value
            existing_rating.review = review
            message = "Rating updated successfully"
        else:
            new_rating = Rating(
                user_id=user_id,
                movie_id=movie_id,
                rating=rating_value,
                review=review
            )
            db.session.add(new_rating)
            message = "Rating submitted successfully"
        
        db.session.commit()
        
        return success_response({"message": message})
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error rating movie {movie_id}: {str(e)}")
        return error_response("Failed to submit rating", 500)

@bp.route('/search', methods=['GET'])
def search_movies():
    """Search movies using TMDB API"""
    try:
        query = request.args.get('query', '').strip()
        if not query:
            return error_response("Query parameter is required", 400)
        
        tmdb_service = TMDBService()
        results = tmdb_service.search_movies(query)
        
        return success_response({"results": results})
        
    except Exception as e:
        current_app.logger.error(f"Error searching movies: {str(e)}")
        return error_response("Failed to search movies", 500)

@bp.route('/popular', methods=['GET'])
def get_popular_movies():
    """Get popular movies from TMDB"""
    try:
        tmdb_service = TMDBService()
        results = tmdb_service.get_popular_movies()
        
        return success_response({"results": results})
        
    except Exception as e:
        current_app.logger.error(f"Error fetching popular movies: {str(e)}")
        return error_response("Failed to fetch popular movies", 500)
