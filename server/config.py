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
    
    # Sigma Compatibility Mode
    SIGMA_MODE = os.environ.get('SIGMA_MODE', 'standalone')  # 'standalone', 'mock_warehouse', 'sigma'
    
    # Database Mode
    DATABASE_MODE = os.environ.get('DATABASE_MODE', 'sqlite')  # 'sqlite', 'mock_warehouse', 'real_warehouse'
    
    # Mock Warehouse Configuration
    MOCK_WAREHOUSE_CONFIG = {
        'enabled': os.environ.get('MOCK_WAREHOUSE_ENABLED', 'false').lower() == 'true',
        'data_path': os.environ.get('MOCK_WAREHOUSE_DATA_PATH', 'server/mock_warehouse/data'),
        'schema_path': os.environ.get('MOCK_WAREHOUSE_SCHEMA_PATH', 'server/mock_warehouse/schemas'),
        'auto_sync': os.environ.get('MOCK_WAREHOUSE_AUTO_SYNC', 'true').lower() == 'true'
    }
    
    # Sigma Integration Configuration
    SIGMA_INTEGRATION_CONFIG = {
        'enabled': os.environ.get('SIGMA_INTEGRATION_ENABLED', 'false').lower() == 'true',
        'warehouse_type': os.environ.get('SIGMA_WAREHOUSE_TYPE', 'snowflake'),
        'warehouse_config': {
            'account': os.environ.get('SNOWFLAKE_ACCOUNT'),
            'user': os.environ.get('SNOWFLAKE_USER'),
            'password': os.environ.get('SNOWFLAKE_PASSWORD'),
            'warehouse': os.environ.get('SNOWFLAKE_WAREHOUSE'),
            'database': os.environ.get('SNOWFLAKE_DATABASE'),
            'schema': os.environ.get('SNOWFLAKE_SCHEMA')
        }
    }
    
    # Metadata Naming Convention (optional, but recommended)
    SQLALCHEMY_METADATA = {
        "naming_convention": {
            "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
            "ix": "ix_%(column_0_label)s",
            "uq": "uq_%(table_name)s_%(column_0_name)s",
            "pk": "pk_%(table_name)s"
        }
    }
    
    def __getitem__(self, key):
        """Make config objects subscriptable like dictionaries"""
        return getattr(self, key, None)

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True
    SIGMA_MODE = 'standalone'
    DATABASE_MODE = 'sqlite'

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SIGMA_MODE = 'standalone'
    DATABASE_MODE = 'sqlite'

class MockWarehouseConfig(Config):
    DEBUG = True
    SIGMA_MODE = 'mock_warehouse'
    DATABASE_MODE = 'mock_warehouse'
    MOCK_WAREHOUSE_CONFIG = {
        'enabled': True,
        'data_path': 'server/mock_warehouse/data',
        'schema_path': 'server/mock_warehouse/schemas',
        'auto_sync': True
    }

class SigmaConfig(Config):
    DEBUG = False
    SIGMA_MODE = 'sigma'
    DATABASE_MODE = 'real_warehouse'
    SIGMA_INTEGRATION_CONFIG = {
        'enabled': True,
        'warehouse_type': 'snowflake',
        'warehouse_config': {
            'account': os.environ.get('SNOWFLAKE_ACCOUNT'),
            'user': os.environ.get('SNOWFLAKE_USER'),
            'password': os.environ.get('SNOWFLAKE_PASSWORD'),
            'warehouse': os.environ.get('SNOWFLAKE_WAREHOUSE'),
            'database': os.environ.get('SNOWFLAKE_DATABASE'),
            'schema': os.environ.get('SNOWFLAKE_SCHEMA')
        }
    }

# Configuration dictionary for application factory
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'mock_warehouse': MockWarehouseConfig,
    'sigma': SigmaConfig,
    'default': DevelopmentConfig
}