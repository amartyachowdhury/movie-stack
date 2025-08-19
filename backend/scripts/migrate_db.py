#!/usr/bin/env python3
"""
Database Migration Script for Movie Stack
Handles database initialization and migration for the new structure
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import User, Movie, Rating

def migrate_database():
    """Migrate database to new structure"""
    
    print("🔄 Starting database migration...")
    
    app = create_app()
    
    with app.app_context():
        try:
            # Drop all existing tables
            print("🗑️  Dropping existing tables...")
            db.drop_all()
            
            # Create new tables with updated schema
            print("🏗️  Creating new tables...")
            db.create_all()
            
            print("✅ Database migration completed successfully!")
            
            # Optionally seed with sample data
            seed_choice = input("🌱 Would you like to seed the database with sample data? (y/N): ").strip().lower()
            if seed_choice == 'y':
                from scripts.seed_database import seed_database
                seed_database()
            
            return True
            
        except Exception as e:
            print(f"❌ Database migration failed: {str(e)}")
            return False

def check_database_connection():
    """Check if database connection is working"""
    
    print("🔍 Checking database connection...")
    
    app = create_app()
    
    with app.app_context():
        try:
            # Test database connection
            with db.engine.connect() as conn:
                conn.execute(db.text("SELECT 1"))
            print("✅ Database connection successful!")
            return True
        except Exception as e:
            print(f"❌ Database connection failed: {str(e)}")
            return False

def main():
    """Main migration function"""
    
    print("🎬 Movie Stack Database Migration")
    print("=" * 40)
    
    # Check database connection first
    if not check_database_connection():
        print("❌ Cannot proceed without database connection")
        sys.exit(1)
    
    # Perform migration
    if migrate_database():
        print("\n🎉 Migration completed successfully!")
        print("🚀 Your database is ready for the new structure!")
    else:
        print("\n❌ Migration failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
