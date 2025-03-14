import sys
import os
import traceback
from tqdm import tqdm
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, text
from sqlalchemy.exc import IntegrityError
from app import create_app, db
from app.models import User

def chunk_generator(total_count, chunk_size=1000):
    """Generate chunks for parallel processing"""
    for i in range(0, total_count, chunk_size):
        yield (i, min(i + chunk_size, total_count))

def generate_user_chunk(start, end):
    """Generate a chunk of users"""
    return User.generate_fake_users(count=end-start, start_index=start)

def seed_database(total_users=10000, chunk_size=1000):
    """
    Seed database with fake users
    
    Args:
        total_users (int): Total number of users to generate
        chunk_size (int): Number of users to insert in each batch
    """
    # Create Flask application context
    app = create_app()
    
    with app.app_context():
        # Create SQLAlchemy engine
        engine = create_engine(db.engine.url)
        Session = sessionmaker(bind=engine)
        session = Session()

        try:
            # Disable foreign key checks for SQLite using text()
            session.execute(text('PRAGMA foreign_keys=OFF'))
            
            # Progress bar
            progress_bar = tqdm(total=total_users, desc="Generating and Inserting Users")
            
            # Track total inserted users
            total_inserted = 0
            
            # Generate and insert users in chunks
            for i in range(0, total_users, chunk_size):
                # Determine chunk size for last iteration
                current_chunk_size = min(chunk_size, total_users - total_inserted)
                
                try:
                    # Generate fake users
                    chunk_users = generate_user_chunk(total_inserted, total_inserted + current_chunk_size)
                    
                    # Bulk insert with error handling
                    successful_users = 0
                    for user in chunk_users:
                        try:
                            session.add(user)
                            successful_users += 1
                        except IntegrityError:
                            # If a unique constraint is violated, skip the user
                            session.rollback()
                            continue
                    
                    # Commit the chunk
                    session.commit()
                    
                    # Update progress
                    total_inserted += successful_users
                    progress_bar.update(successful_users)
                
                except Exception as chunk_error:
                    # Rollback the current chunk if insertion fails
                    session.rollback()
                    print(f"\nError inserting chunk: {chunk_error}")
                    traceback.print_exc()
                    break
            
            # Close progress bar
            progress_bar.close()
            
            print(f"\nSuccessfully added {total_inserted} users to the database.")
        
        except Exception as e:
            # Catch and print any unexpected errors
            session.rollback()
            print(f"Unexpected error during seeding: {e}")
            traceback.print_exc()
        
        finally:
            # Always close the session
            session.close()

def verify_seed():
    """
    Verify the seeding process by checking the number of users
    and displaying some sample data
    """
    app = create_app()
    
    with app.app_context():
        try:
            # Count total users
            user_count = db.session.query(User).count()
            print(f"\nTotal users in database: {user_count}")
            
            # Sample and display some users
            print("\nSample Users:")
            sample_users = db.session.query(User).limit(5).all()
            
            for user in sample_users:
                print(f"Username: {user.username}")
                print(f"Email: {user.email}")
                print(f"Plan: {user.plan}")
                print(f"Total Purchases: {user.total_purchases}")
                print(f"Lifetime Value: ${user.lifetime_value:.2f}")
                print("---")
        
        except Exception as e:
            print(f"Error verifying seed: {e}")

def main():
    # Seed users
    seed_database(total_users=10000)
    
    # Verify the seeding
    verify_seed()

if __name__ == '__main__':
    main()