"""
TMDB API Service
"""
import requests
import os
from flask import current_app
from typing import List, Dict, Optional

class TMDBService:
    """Service for interacting with The Movie Database API"""
    
    def __init__(self):
        self.api_key = current_app.config.get('TMDB_API_KEY')
        self.base_url = current_app.config.get('TMDB_BASE_URL', 'https://api.themoviedb.org/3')
        
        if not self.api_key:
            raise ValueError("TMDB_API_KEY not configured")
    
    def _make_request(self, endpoint: str, params: Dict = None) -> Dict:
        """Make a request to TMDB API"""
        url = f"{self.base_url}/{endpoint}"
        
        default_params = {
            'api_key': self.api_key,
            'language': 'en-US'
        }
        
        if params:
            default_params.update(params)
        
        try:
            response = requests.get(url, params=default_params, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            current_app.logger.error(f"TMDB API request failed: {str(e)}")
            raise
    
    def search_movies(self, query: str, page: int = 1) -> List[Dict]:
        """Search for movies by title"""
        try:
            data = self._make_request('search/movie', {
                'query': query,
                'page': page,
                'include_adult': False
            })
            
            results = []
            for movie in data.get('results', []):
                results.append({
                    'tmdb_id': movie.get('id'),
                    'title': movie.get('title'),
                    'overview': movie.get('overview'),
                    'poster_path': movie.get('poster_path'),
                    'release_date': movie.get('release_date'),
                    'vote_average': movie.get('vote_average', 0),
                    'popularity': movie.get('popularity', 0)
                })
            
            return results
            
        except Exception as e:
            current_app.logger.error(f"Error searching movies: {str(e)}")
            return []
    
    def get_popular_movies(self, page: int = 1) -> List[Dict]:
        """Get popular movies"""
        try:
            data = self._make_request('movie/popular', {'page': page})
            
            results = []
            for movie in data.get('results', []):
                results.append({
                    'tmdb_id': movie.get('id'),
                    'title': movie.get('title'),
                    'overview': movie.get('overview'),
                    'poster_path': movie.get('poster_path'),
                    'release_date': movie.get('release_date'),
                    'vote_average': movie.get('vote_average', 0),
                    'popularity': movie.get('popularity', 0)
                })
            
            return results
            
        except Exception as e:
            current_app.logger.error(f"Error fetching popular movies: {str(e)}")
            return []
    
    def get_movie_details(self, tmdb_id: int) -> Optional[Dict]:
        """Get detailed information about a movie"""
        try:
            data = self._make_request(f'movie/{tmdb_id}', {
                'append_to_response': 'credits,genres,recommendations'
            })
            
            # Extract genres
            genres = [{'id': genre['id'], 'name': genre['name']} for genre in data.get('genres', [])]
            
            # Extract cast (top 10)
            cast = []
            for person in data.get('credits', {}).get('cast', [])[:10]:
                cast.append({
                    'id': person.get('id'),
                    'name': person.get('name'),
                    'character': person.get('character'),
                    'profile_path': person.get('profile_path')
                })
            
            # Extract crew (directors, producers, writers)
            crew = []
            for person in data.get('credits', {}).get('crew', []):
                if person.get('job') in ['Director', 'Producer', 'Writer']:
                    crew.append({
                        'id': person.get('id'),
                        'name': person.get('name'),
                        'job': person.get('job'),
                        'department': person.get('department')
                    })
            
            # Extract similar movies (recommendations)
            similar_movies = []
            for movie in data.get('recommendations', {}).get('results', [])[:6]:
                similar_movies.append({
                    'tmdb_id': movie.get('id'),
                    'title': movie.get('title'),
                    'overview': movie.get('overview'),
                    'poster_path': movie.get('poster_path'),
                    'release_date': movie.get('release_date'),
                    'vote_average': movie.get('vote_average', 0),
                    'popularity': movie.get('popularity', 0)
                })
            
            return {
                'tmdb_id': data.get('id'),
                'title': data.get('title'),
                'overview': data.get('overview'),
                'poster_path': data.get('poster_path'),
                'release_date': data.get('release_date'),
                'vote_average': data.get('vote_average', 0),
                'popularity': data.get('popularity', 0),
                'genres': genres,
                'runtime': data.get('runtime'),
                'budget': data.get('budget'),
                'revenue': data.get('revenue'),
                'status': data.get('status'),
                'tagline': data.get('tagline'),
                'production_companies': data.get('production_companies', []),
                'spoken_languages': data.get('spoken_languages', []),
                'cast': cast,
                'crew': crew,
                'similar_movies': similar_movies
            }
            
        except Exception as e:
            current_app.logger.error(f"Error fetching movie details for {tmdb_id}: {str(e)}")
            return None
    
    def get_movie_recommendations(self, tmdb_id: int, page: int = 1) -> List[Dict]:
        """Get movie recommendations from TMDB"""
        try:
            data = self._make_request(f'movie/{tmdb_id}/recommendations', {'page': page})
            
            results = []
            for movie in data.get('results', []):
                results.append({
                    'tmdb_id': movie.get('id'),
                    'title': movie.get('title'),
                    'overview': movie.get('overview'),
                    'poster_path': movie.get('poster_path'),
                    'release_date': movie.get('release_date'),
                    'vote_average': movie.get('vote_average', 0),
                    'popularity': movie.get('popularity', 0)
                })
            
            return results
            
        except Exception as e:
            current_app.logger.error(f"Error fetching recommendations for {tmdb_id}: {str(e)}")
            return []
    
    def get_genres(self) -> List[Dict]:
        """Get list of available genres"""
        try:
            data = self._make_request('genre/movie/list')
            return data.get('genres', [])
            
        except Exception as e:
            current_app.logger.error(f"Error fetching genres: {str(e)}")
            return []
