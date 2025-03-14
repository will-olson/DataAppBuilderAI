import os
from datetime import timedelta

class Config:
    # Base Directory
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(BASE_DIR, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Secret Key
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-hard-to-guess-secret-key'
    
    # Application Configurations
    DEBUG = False
    TESTING = False
    
    # Additional SQLAlchemy Options
    SQLALCHEMY_ECHO = False  # Set to True to log SQL statements
    
    # Metadata Naming Convention (optional, but recommended)
    SQLALCHEMY_METADATA = {
        "naming_convention": {
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "ix": "ix_%(column_0_label)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "ck": "ck_%(table_name)s_%(constraint_name)s",
            "pk": "pk_%(table_name)s"
        }
    }

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True  # Log SQL statements in development

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    DEBUG = False
    # Additional production-specific configurations

# Configuration selector
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}