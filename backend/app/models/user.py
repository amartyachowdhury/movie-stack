"""
User model for Movie Stack
"""
from datetime import datetime
from app import db

class User(db.Model):
    """User model for storing user information"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ratings = db.relationship('Rating', back_populates='user', cascade='all, delete-orphan')
    favorite_movies = db.relationship('Movie', secondary='user_favorites', back_populates='favorited_by')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    def to_dict(self):
        """Convert user to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'rating_count': len(self.ratings)
        }
    
    @property
    def password(self):
        """Password property - not stored directly"""
        raise AttributeError('password is not a readable attribute')
    
    @password.setter
    def password(self, password):
        """Hash password before storing"""
        from werkzeug.security import generate_password_hash
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        """Verify password against hash"""
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)
