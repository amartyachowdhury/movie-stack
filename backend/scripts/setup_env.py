#!/usr/bin/env python3
"""
Environment Setup Script for Movie Stack
Helps users create their .env file with proper configuration
"""

import os
import secrets

def generate_secret_key():
    """Generate a random secret key"""
    return secrets.token_hex(32)

def create_env_file():
    """Create .env file with user input"""
    
    print("🔧 Setting up environment variables for Movie Stack")
    print("=" * 50)
    
    # Get TMDB API key from user
    print("\n📺 TMDB API Key Setup:")
    print("1. Go to https://www.themoviedb.org/")
    print("2. Create an account or sign in")
    print("3. Go to Account Settings → API")
    print("4. Request an API key (it's free)")
    print("5. Copy your API key")
    
    tmdb_api_key = input("\nEnter your TMDB API key: ").strip()
    
    if not tmdb_api_key or tmdb_api_key == "your_tmdb_api_key_here":
        print("❌ Please provide a valid TMDB API key")
        return False
    
    # Generate secret key
    secret_key = generate_secret_key()
    
    # Create .env content
    env_content = f"""# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development

# Database Configuration
DATABASE_URL=mysql://movie_user:password@db:3306/movie_stack

# TMDB API Configuration
TMDB_API_KEY={tmdb_api_key}

# Flask Secret Key
SECRET_KEY={secret_key}

# Redis Configuration
REDIS_URL=redis://redis:6379/0
"""
    
    # Write to .env file
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        
        print("\n✅ .env file created successfully!")
        print(f"📁 Location: {os.path.abspath('.env')}")
        print("\n🔒 Your secret key has been generated automatically")
        print(f"🔑 TMDB API key: {tmdb_api_key[:8]}...{tmdb_api_key[-4:]}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def main():
    """Main function"""
    
    # Check if .env already exists
    if os.path.exists('.env'):
        print("⚠️  .env file already exists!")
        overwrite = input("Do you want to overwrite it? (y/N): ").strip().lower()
        if overwrite != 'y':
            print("Setup cancelled.")
            return
    
    success = create_env_file()
    
    if success:
        print("\n🚀 Next steps:")
        print("1. Start your Docker containers: docker-compose up --build")
        print("2. Seed the database: python scripts/seed_database.py")
        print("3. Access your app at http://localhost:3000")
    else:
        print("\n❌ Setup failed. Please try again.")

if __name__ == "__main__":
    main()
