"""
Movie model for Movie Stack
"""
from datetime import datetime
from app import db

# Association table for user favorites
user_favorites = db.Table('user_favorites',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('movie_id', db.Integer, db.ForeignKey('movies.id'), primary_key=True)
)

class Movie(db.Model):
    """Movie model for storing movie information"""
    __tablename__ = 'movies'
    
    id = db.Column(db.Integer, primary_key=True)
    tmdb_id = db.Column(db.Integer, unique=True, nullable=True)
    title = db.Column(db.String(255), nullable=False)
    overview = db.Column(db.Text, nullable=True)
    genres = db.Column(db.String(255), nullable=True)
    release_date = db.Column(db.Date, nullable=True)
    poster_path = db.Column(db.String(255), nullable=True)
    vote_average = db.Column(db.Float, default=0.0)
    popularity = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ratings = db.relationship('Rating', back_populates='movie', cascade='all, delete-orphan')
    favorited_by = db.relationship('User', secondary=user_favorites, back_populates='favorite_movies')
    
    def __repr__(self):
        return f'<Movie {self.title}>'
    
    def to_dict(self):
        """Convert movie to dictionary"""
        return {
            'id': self.id,
            'tmdb_id': self.tmdb_id,
            'title': self.title,
            'overview': self.overview,
            'genres': self.genres,
            'release_date': self.release_date.isoformat() if self.release_date else None,
            'poster_path': self.poster_path,
            'vote_average': self.vote_average,
            'popularity': self.popularity,
            'rating_count': len(self.ratings),
            'average_rating': self.average_rating
        }
    
    @property
    def average_rating(self):
        """Calculate average rating from user ratings"""
        if not self.ratings:
            return 0.0
        return sum(r.rating for r in self.ratings) / len(self.ratings)
    
    @property
    def genre_list(self):
        """Get list of genres"""
        if not self.genres:
            return []
        return [genre.strip() for genre in self.genres.split(',')]
    
    def get_similar_movies(self, limit=10):
        """Get similar movies based on genres"""
        if not self.genres:
            return []
        
        genre_conditions = []
        for genre in self.genre_list:
            genre_conditions.append(Movie.genres.contains(genre))
        
        return Movie.query.filter(
            db.or_(*genre_conditions),
            Movie.id != self.id
        ).order_by(Movie.vote_average.desc()).limit(limit).all()
