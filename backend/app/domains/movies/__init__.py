# Movies domain exports
from .controllers.movies import movies_bp
from .models.movie import Movie
from .models.rating import Rating
from .services.tmdb_service import TMDBService

__all__ = ['movies_bp', 'Movie', 'Rating', 'TMDBService']
