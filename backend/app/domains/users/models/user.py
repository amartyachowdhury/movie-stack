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
    avatar_url = db.Column(db.String(255), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    favorite_genres = db.Column(db.JSON, nullable=True)  # Store as JSON array
    preferences = db.Column(db.JSON, nullable=True)  # Store user preferences as JSON
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
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
            'avatar_url': self.avatar_url,
            'bio': self.bio,
            'favorite_genres': self.favorite_genres or [],
            'preferences': self.preferences or {},
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'rating_count': len(self.ratings),
            'favorite_count': len(self.favorite_movies)
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
