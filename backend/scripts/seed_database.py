#!/usr/bin/env python3
"""
Database Seeding Script for Movie Stack
Adds sample movies, users, and ratings for development
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.domains.users.models.user import User
from app.domains.movies.models.movie import Movie
from app.domains.movies.models.rating import Rating
from datetime import datetime

def seed_database():
    """Seed the database with sample data"""
    
    app = create_app()
    with app.app_context():
        print("🌱 Seeding database with sample data...")
        
        # Clear existing data
        print("🗑️  Clearing existing data...")
        Rating.query.delete()
        User.query.delete()
        Movie.query.delete()
        db.session.commit()
        
        # Create sample users
        print("👥 Creating sample users...")
        users = [
            User(username="alice", password="password123"),
            User(username="bob", password="password123"),
            User(username="charlie", password="password123"),
            User(username="diana", password="password123"),
            User(username="eve", password="password123")
        ]
        
        for user in users:
            db.session.add(user)
        db.session.commit()
        print(f"✅ Created {len(users)} users")
        
        # Create sample movies
        print("🎬 Creating sample movies...")
        movies = [
            Movie(
                tmdb_id=550,
                title="Fight Club",
                overview="A nameless first person narrator attends support groups in attempt to subdue his emotional state and relieve his insomniac state.",
                genres="Drama,Thriller",
                release_date=datetime(1999, 10, 15),
                poster_path="/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
                vote_average=8.8,
                popularity=85.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=13,
                title="Forrest Gump",
                overview="A man with a low IQ has accomplished great things in his life and been present during significant historic events.",
                genres="Drama,Romance",
                release_date=datetime(1994, 7, 6),
                poster_path="/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
                vote_average=8.8,
                popularity=82.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=238,
                title="The Godfather",
                overview="Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family.",
                genres="Drama,Crime",
                release_date=datetime(1972, 3, 14),
                poster_path="/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
                vote_average=9.2,
                popularity=90.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=278,
                title="The Shawshank Redemption",
                overview="Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                genres="Drama,Crime",
                release_date=datetime(1994, 9, 22),
                poster_path="/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                vote_average=9.3,
                popularity=88.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=680,
                title="Pulp Fiction",
                overview="A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge.",
                genres="Thriller,Crime",
                release_date=datetime(1994, 10, 14),
                poster_path="/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
                vote_average=8.9,
                popularity=86.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=155,
                title="The Dark Knight",
                overview="Batman raises the stakes in his war on crime.",
                genres="Action,Crime,Drama",
                release_date=datetime(2008, 7, 18),
                poster_path="/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                vote_average=9.0,
                popularity=92.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=122,
                title="The Lord of the Rings: The Return of the King",
                overview="Aragorn is revealed as the heir to the ancient kings as he, Gandalf and the other members of the broken fellowship.",
                genres="Adventure,Drama,Fantasy",
                release_date=datetime(2003, 12, 1),
                poster_path="/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
                vote_average=8.9,
                popularity=89.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=497,
                title="The Green Mile",
                overview="A tale set on death row in a Southern jail, where gentle giant John possesses the mysterious power to heal people's ailments.",
                genres="Crime,Drama,Fantasy",
                release_date=datetime(1999, 12, 10),
                poster_path="/o0lO84i7wQ5Q27F4xglaEgK1P1S.jpg",
                vote_average=8.6,
                popularity=78.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=637,
                title="Life Is Beautiful",
                overview="A Jewish father has a wonderful romance with the help of his humor, but must use that same quality to protect his son.",
                genres="Comedy,Drama,Romance",
                release_date=datetime(1997, 12, 20),
                poster_path="/mfnkSeeVOBVheuyn2lo4tfmOPQb.jpg",
                vote_average=8.6,
                popularity=75.0,
                created_at=datetime.now()
            ),
            Movie(
                tmdb_id=389,
                title="12 Angry Men",
                overview="The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young man is guilty.",
                genres="Drama",
                release_date=datetime(1957, 4, 10),
                poster_path="/ow3wq89wM8qd5X7hWKxRrFfAfUP.jpg",
                vote_average=8.9,
                popularity=72.0,
                created_at=datetime.now()
            )
        ]
        
        for movie in movies:
            db.session.add(movie)
        db.session.commit()
        print(f"✅ Created {len(movies)} movies")
        
        # Create sample ratings
        print("⭐ Creating sample ratings...")
        ratings_data = [
            # Alice's ratings
            ("alice", "Fight Club", 5, "Mind-blowing plot twist!"),
            ("alice", "Forrest Gump", 4, "Heartwarming story"),
            ("alice", "The Godfather", 5, "Classic masterpiece"),
            ("alice", "Pulp Fiction", 4, "Quirky and entertaining"),
            
            # Bob's ratings
            ("bob", "Fight Club", 4, "Great movie"),
            ("bob", "The Shawshank Redemption", 5, "Inspiring story"),
            ("bob", "The Dark Knight", 5, "Best Batman movie"),
            ("bob", "12 Angry Men", 4, "Thought-provoking"),
            
            # Charlie's ratings
            ("charlie", "Forrest Gump", 5, "Tom Hanks at his best"),
            ("charlie", "The Lord of the Rings: The Return of the King", 5, "Epic conclusion"),
            ("charlie", "The Green Mile", 4, "Emotional journey"),
            ("charlie", "Life Is Beautiful", 5, "Beautiful and tragic"),
            
            # Diana's ratings
            ("diana", "The Godfather", 5, "Timeless classic"),
            ("diana", "Pulp Fiction", 5, "Revolutionary filmmaking"),
            ("diana", "The Dark Knight", 4, "Heath Ledger was amazing"),
            ("diana", "12 Angry Men", 5, "Perfect courtroom drama"),
            
            # Eve's ratings
            ("eve", "Fight Club", 3, "Interesting but confusing"),
            ("eve", "The Shawshank Redemption", 5, "One of my favorites"),
            ("eve", "Life Is Beautiful", 4, "Touching story"),
            ("eve", "The Green Mile", 5, "Powerful performance")
        ]
        
        for username, movie_title, rating_value, review in ratings_data:
            user = User.query.filter_by(username=username).first()
            movie = Movie.query.filter_by(title=movie_title).first()
            
            if user and movie:
                rating = Rating(
                    user_id=user.id,
                    movie_id=movie.id,
                    rating=rating_value,
                    review=review,
                    created_at=datetime.now()
                )
                db.session.add(rating)
        
        db.session.commit()
        print(f"✅ Created {len(ratings_data)} ratings")
        
        # Display summary
        print("\n📊 Database Summary:")
        print(f"Users: {User.query.count()}")
        print(f"Movies: {Movie.query.count()}")
        print(f"Ratings: {Rating.query.count()}")
        
        print("\n🎯 Sample Users (password: password123):")
        for user in User.query.all():
            print(f"  - {user.username}")
        
        print("\n🎬 Sample Movies:")
        for movie in Movie.query.limit(5).all():
            print(f"  - {movie.title} ({movie.vote_average}/10)")
        
        print("\n✅ Database seeded successfully!")
        print("🚀 Ready for development!")

if __name__ == "__main__":
    seed_database()
