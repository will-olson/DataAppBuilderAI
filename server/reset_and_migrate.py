# reset_and_migrate.py
import os
import shutil
import sys

def reset_database():
    # Ensure we can import from the server directory
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    
    # Remove existing database and migrations
    if os.path.exists('app.db'):
        os.remove('app.db')
    
    # Remove migrations directory
    if os.path.exists('migrations'):
        shutil.rmtree('migrations')
    
    # Import after path is set
    from app import create_app, db
    from app.models import User

    app = create_app()
    
    with app.app_context():
        # Initialize migrations
        from flask_migrate import init, migrate, upgrade
        
        init()
        migrate(message="Initial migration")
        upgrade()
        
        # Verify table creation
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        print("Created tables:", tables)
        
        # Verify columns
        columns = inspector.get_columns('users')
        print("\nUsers Table Columns:")
        for column in columns:
            print(f"{column['name']}: {column['type']}")

if __name__ == '__main__':
    reset_database()