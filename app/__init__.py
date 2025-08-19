from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Database configuration
DATABASE_URL = os.environ.get('DATABASE_URL', 'mysql://movie_user:password@db:3306/movie_stack')
if DATABASE_URL.startswith('mysql://'):
    # MySQL URL
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
elif DATABASE_URL.startswith('postgresql://'):
    # Heroku style PostgreSQL URL
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
else:
    # SQLite for development
    app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

# Initialize database
db = SQLAlchemy(app)

# Import routes after db initialization
from . import routes
