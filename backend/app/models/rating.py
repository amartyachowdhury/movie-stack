"""
Rating model for Movie Stack
"""
from datetime import datetime
from app import db

class Rating(db.Model):
    """Rating model for storing user movie ratings"""
    __tablename__ = 'ratings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='ratings')
    movie = db.relationship('Movie', back_populates='ratings')
    
    # Constraints
    __table_args__ = (
        db.CheckConstraint('rating >= 1 AND rating <= 5', name='valid_rating_range'),
        db.UniqueConstraint('user_id', 'movie_id', name='unique_user_movie_rating'),
    )
    
    def __repr__(self):
        return f'<Rating {self.user_id}:{self.movie_id}:{self.rating}>'
    
    def to_dict(self):
        """Convert rating to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'movie_id': self.movie_id,
            'rating': self.rating,
            'review': self.review,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'movie_title': self.movie.title if self.movie else None,
            'username': self.user.username if self.user else None
        }
    
    @property
    def rating_stars(self):
        """Get rating as stars string"""
        return '★' * self.rating + '☆' * (5 - self.rating)
