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
    
    # Sigma API Configuration
    SIGMA_API_ENABLED = os.environ.get('SIGMA_API_ENABLED', 'false').lower() == 'true'
    SIGMA_API_CLIENT_ID = os.environ.get('SIGMA_API_CLIENT_ID')
    SIGMA_API_CLIENT_SECRET = os.environ.get('SIGMA_API_CLIENT_SECRET')
    SIGMA_API_BASE_URL = os.environ.get('SIGMA_API_BASE_URL')
    SIGMA_API_CLOUD_PROVIDER = os.environ.get('SIGMA_API_CLOUD_PROVIDER', 'AWS-US (West)')
    
    # Sigma API Cloud Provider Mapping
    SIGMA_API_URLS = {
        'AWS-US (West)': 'https://aws-api.sigmacomputing.com',
        'AWS-US (East)': 'https://api.us-a.aws.sigmacomputing.com',
        'AWS-CA': 'https://api.ca.aws.sigmacomputing.com',
        'AWS-EU': 'https://api.eu.aws.sigmacomputing.com',
        'AWS-UK': 'https://api.uk.aws.sigmacomputing.com',
        'AWS-AU': 'https://api.au.aws.sigmacomputing.com',
        'Azure-US': 'https://api.us.azure.sigmacomputing.com',
        'Azure-EU': 'https://api.eu.azure.sigmacomputing.com',
        'Azure-CA': 'https://api.ca.azure.sigmacomputing.com',
        'Azure-UK': 'https://api.uk.azure.sigmacomputing.com',
        'GCP': 'https://api.sigmacomputing.com'
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
    
    @property
    def sigma_api_base_url(self):
        """Get Sigma API base URL based on cloud provider"""
        if self.SIGMA_API_BASE_URL:
            return self.SIGMA_API_BASE_URL
        return self.SIGMA_API_URLS.get(self.SIGMA_API_CLOUD_PROVIDER)

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