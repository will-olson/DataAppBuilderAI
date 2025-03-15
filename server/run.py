# run.py
from app import create_app, db
from app.models import User  # Import your models

# Create the Flask app
app = create_app()

# Existing CLI Commands
@app.cli.command("create-users")
def create_users():
    """Create a batch of fake users"""
    with app.app_context():
        # Generate and add fake users
        fake_users = User.generate_fake_users(10)
        db.session.add_all(fake_users)
        db.session.commit()
        print(f"Created {len(fake_users)} fake users")

@app.cli.command("list-users")
def list_users():
    """List all users in the database"""
    with app.app_context():
        users = User.query.all()
        print(f"Total users: {len(users)}")
        for user in users:
            print(f"Username: {user.username}, Email: {user.email}")

# This allows running the app directly
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    
    # Print registered routes for debugging
    with app.app_context():
        print("Registered Routes:")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule.rule}")
    
    app.run(debug=True, host='0.0.0.0', port=5000)