# verify_database.py
import sys
import os

# Ensure we can import from the server directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import User
from sqlalchemy import inspect

def verify_database():
    app = create_app()
    
    with app.app_context():
        # Ensure tables are created
        db.create_all()
        
        # Inspect database
        inspector = inspect(db.engine)
        
        # Check tables
        tables = inspector.get_table_names()
        print("Existing tables:", tables)
        
        # Check users table columns
        try:
            columns = inspector.get_columns('users')
            print("\nUsers Table Columns:")
            for column in columns:
                print(f"{column['name']}: {column['type']}")
        except Exception as e:
            print(f"Error inspecting users table: {e}")
        
        # Attempt to create and query users
        try:
            # Create a test user
            test_user = User(
                username='testuser', 
                email='test@example.com',
                plan='basic'
            )
            db.session.add(test_user)
            db.session.commit()
            
            # Query users
            users = User.query.all()
            print(f"\nTotal users: {len(users)}")
            
            # Print user details
            for user in users:
                print("\nUser Details:")
                print(f"Username: {user.username}")
                print(f"Email: {user.email}")
                print(f"Plan: {user.plan}")
        except Exception as e:
            print(f"Error creating or querying users: {e}")

if __name__ == '__main__':
    verify_database()