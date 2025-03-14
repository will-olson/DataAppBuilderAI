from app import create_app, db
from app.models import User

def test_database():
    app = create_app()
    
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Generate fake users
        fake_users = User.generate_fake_users(10)
        db.session.add_all(fake_users)
        db.session.commit()
        
        # Query and verify
        users = User.query.all()
        print(f"Total users created: {len(users)}")
        
        for user in users[:5]:
            print(f"User: {user.username}, Email: {user.email}, Plan: {user.plan}")

if __name__ == '__main__':
    test_database()