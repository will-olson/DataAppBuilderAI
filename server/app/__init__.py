from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions BEFORE importing models
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Import models AFTER initializing extensions
    from .models import User
    
    # Create tables within app context
    with app.app_context():
        db.create_all()
    
    return app