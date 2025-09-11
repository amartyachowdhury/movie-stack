#!/usr/bin/env python3
"""
Simple Database Initialization Script
Creates database tables without complex imports
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db

def init_database():
    """Initialize database tables"""
    
    print("🔄 Initializing database...")
    
    app = create_app()
    
    with app.app_context():
        try:
            # Create all tables
            print("🏗️  Creating database tables...")
            db.create_all()
            
            print("✅ Database initialization completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Database initialization failed: {str(e)}")
            return False

def main():
    """Main initialization function"""
    
    print("🎬 Movie Stack Database Initialization")
    print("=" * 40)
    
    if init_database():
        print("\n🎉 Database initialization completed successfully!")
        print("🚀 Your database is ready!")
    else:
        print("\n❌ Database initialization failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
