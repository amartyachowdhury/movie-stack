#!/usr/bin/env python3
"""
Development Commands and Information for Movie Stack
"""

def print_dev_info():
    """Print development information and useful commands"""
    
    print("🎬 Movie Stack - Development Environment")
    print("=" * 50)
    
    print("\n🚀 Access Points:")
    print("  Frontend: http://localhost:3000")
    print("  Backend API: http://localhost:5001")
    print("  Database: localhost:3308 (MySQL)")
    print("  Redis: localhost:6379")
    
    print("\n📊 Sample Data:")
    print("  Users: alice, bob, charlie, diana, eve")
    print("  Password: password123")
    print("  Movies: 10 popular movies with ratings")
    
    print("\n🔧 Useful Commands:")
    print("  # View all containers")
    print("  docker-compose ps")
    
    print("\n  # View logs")
    print("  docker-compose logs backend")
    print("  docker-compose logs frontend")
    print("  docker-compose logs db")
    
    print("\n  # Restart services")
    print("  docker-compose restart backend")
    print("  docker-compose restart frontend")
    
    print("\n  # Rebuild and restart")
    print("  docker-compose down")
    print("  docker-compose up -d --build")
    
    print("\n  # Access database")
    print("  docker-compose exec db mysql -u movie_user -ppassword movie_stack")
    
    print("\n  # Run seeding script")
    print("  docker-compose exec backend python /app/seed_database.py")
    
    print("\n🔗 API Endpoints:")
    print("  GET  /api/movies                    - List all movies")
    print("  GET  /api/movies/<id>               - Get movie details")
    print("  POST /api/movies/<id>/rate          - Rate a movie")
    print("  GET  /api/movies/search?query=<q>   - Search movies (TMDB)")
    print("  GET  /api/recommendations/collaborative/<user_id>")
    print("  GET  /api/recommendations/content/<movie_id>")
    
    print("\n🧪 Test Commands:")
    print("  # Test API endpoints")
    print("  curl http://localhost:5001/api/movies")
    print("  curl http://localhost:5001/api/movies/search?query=inception")
    print("  curl http://localhost:5001/api/recommendations/collaborative/1")
    
    print("\n📁 Project Structure:")
    print("  app/                    - Flask backend")
    print("  movie-stack-frontend/   - React frontend")
    print("  docker/                 - Docker configurations")
    print("  scripts/                - Development scripts")
    print("  .env                    - Environment variables")
    
    print("\n🎯 Next Steps:")
    print("  1. Open http://localhost:3000 in your browser")
    print("  2. Explore the API at http://localhost:5001/api/movies")
    print("  3. Test recommendations with different user IDs")
    print("  4. Add more movies via TMDB search")
    print("  5. Implement user authentication")
    print("  6. Add more recommendation algorithms")
    
    print("\n✅ Your development environment is ready!")
    print("   Happy coding! 🚀")

if __name__ == "__main__":
    print_dev_info()
