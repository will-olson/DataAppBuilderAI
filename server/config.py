import os
from typing import Dict, Any

class Config:
    """Base configuration class"""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # Unified Sigma Framework Configuration
    SIGMA_MODE = os.environ.get('SIGMA_MODE', 'standalone')  # standalone, mock_warehouse, sigma
    DATABASE_MODE = os.environ.get('DATABASE_MODE', 'sqlite')  # sqlite, mock_warehouse, real_warehouse
    
    # Sigma Framework Features
    SIGMA_FEATURES = {
        'input_tables': True,
        'layout_elements': True,
        'actions_framework': True,
        'data_governance': True,
        'real_time_sync': False
    }
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///app.db'
    
    # Mock Warehouse Configuration (for testing)
    MOCK_WAREHOUSE_CONFIG = {
        'enabled': SIGMA_MODE == 'mock_warehouse',
        'data_path': 'mock_warehouse/data',
        'schema_path': 'mock_warehouse/schemas',
        'auto_sync': True
    }
    
    # Real Warehouse Configuration (for production)
    WAREHOUSE_CONFIG = {
        'enabled': SIGMA_MODE == 'sigma',
        'type': os.environ.get('WAREHOUSE_TYPE', 'snowflake'),
        'account': os.environ.get('SNOWFLAKE_ACCOUNT'),
        'user': os.environ.get('SNOWFLAKE_USER'),
        'password': os.environ.get('SNOWFLAKE_PASSWORD'),
        'warehouse': os.environ.get('SNOWFLAKE_WAREHOUSE'),
        'database': os.environ.get('SNOWFLAKE_DATABASE'),
        'schema': os.environ.get('SNOWFLAKE_SCHEMA')
    }

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SIGMA_MODE = 'standalone'  # Default to standalone for development
    DATABASE_MODE = 'sqlite'

class TestingConfig(Config):
    """Testing configuration with mock warehouse"""
    DEBUG = True
    TESTING = True
    SIGMA_MODE = 'mock_warehouse'
    DATABASE_MODE = 'mock_warehouse'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    """Production configuration with real Sigma integration"""
    DEBUG = False
    SIGMA_MODE = 'sigma'
    DATABASE_MODE = 'real_warehouse'

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config(config_name: str = None) -> Config:
    """Get configuration by name or from environment"""
    if config_name:
        return config.get(config_name, config['default'])
    
    # Auto-detect based on environment
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default'])

def update_sigma_mode(mode: str) -> Dict[str, Any]:
    """Update Sigma mode dynamically (called from frontend)"""
    valid_modes = ['standalone', 'mock_warehouse', 'sigma']
    if mode not in valid_modes:
        raise ValueError(f"Invalid Sigma mode: {mode}. Must be one of {valid_modes}")
    
    # Update configuration
    Config.SIGMA_MODE = mode
    
    # Update database mode based on Sigma mode
    if mode == 'standalone':
        Config.DATABASE_MODE = 'sqlite'
    elif mode == 'mock_warehouse':
        Config.DATABASE_MODE = 'mock_warehouse'
    elif mode == 'sigma':
        Config.DATABASE_MODE = 'real_warehouse'
    
    # Update feature flags
    Config.SIGMA_FEATURES['real_time_sync'] = mode == 'sigma'
    
    return {
        'sigma_mode': Config.SIGMA_MODE,
        'database_mode': Config.DATABASE_MODE,
        'features': Config.SIGMA_FEATURES
    }