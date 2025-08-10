"""
SQLite Database Adapter for GrowthMarketer AI
Wraps existing SQLAlchemy functionality for backward compatibility
"""

from typing import Dict, List, Any, Optional
from sqlalchemy import text
from . import DatabaseAdapter
import logging

logger = logging.getLogger(__name__)

class SQLiteAdapter(DatabaseAdapter):
    """SQLite implementation for local development/testing"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.features = ['basic_sql', 'json_support', 'local_storage', 'sqlalchemy_orm']
        self.db_session = None
        self._init_database()
    
    def _init_database(self):
        """Initialize database connection"""
        try:
            from app import db
            self.db_session = db.session
            logger.info("SQLite adapter initialized with existing SQLAlchemy session")
        except Exception as e:
            logger.error(f"Failed to initialize SQLite adapter: {e}")
            self.db_session = None
    
    def execute_query(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute SQL query and return results"""
        if not self.db_session:
            logger.error("Database session not available")
            return []
        
        try:
            result = self.db_session.execute(text(query), params or {})
            return [dict(row) for row in result]
        except Exception as e:
            logger.error(f"Error executing query: {e}")
            return []
    
    def create_table(self, table_name: str, schema: Dict) -> bool:
        """Create table with specified schema"""
        if not self.db_session:
            return False
        
        try:
            # Use existing SQLAlchemy models for table creation
            from app.models import db
            db.create_all()
            logger.info(f"Table {table_name} created successfully")
            return True
        except Exception as e:
            logger.error(f"Error creating table {table_name}: {e}")
            return False
    
    def insert_data(self, table_name: str, data: List[Dict]) -> bool:
        """Insert data into specified table"""
        if not self.db_session:
            return False
        
        try:
            # Use existing SQLAlchemy models for data insertion
            from app.models import User
            if table_name == 'users':
                for user_data in data:
                    user = User(**user_data)
                    self.db_session.add(user)
                self.db_session.commit()
                logger.info(f"Inserted {len(data)} records into {table_name}")
                return True
            else:
                logger.warning(f"Table {table_name} not supported for direct insertion")
                return False
        except Exception as e:
            logger.error(f"Error inserting data into {table_name}: {e}")
            self.db_session.rollback()
            return False
    
    def get_table_schema(self, table_name: str) -> Dict:
        """Get table schema information"""
        if not self.db_session:
            return {}
        
        try:
            # Use existing SQLAlchemy models for schema information
            from app.models import User
            if table_name == 'users':
                return {
                    'name': 'users',
                    'columns': [
                        {'name': 'id', 'type': 'INTEGER', 'primary_key': True},
                        {'name': 'username', 'type': 'VARCHAR', 'nullable': False},
                        {'name': 'email', 'type': 'VARCHAR', 'nullable': False},
                        {'name': 'age', 'type': 'INTEGER', 'nullable': True},
                        {'name': 'plan', 'type': 'VARCHAR', 'nullable': True},
                        {'name': 'lifetime_value', 'type': 'DECIMAL', 'nullable': True},
                        {'name': 'total_sessions', 'type': 'INTEGER', 'nullable': True},
                        {'name': 'created_at', 'type': 'DATETIME', 'nullable': True}
                    ],
                    'row_count': User.query.count()
                }
            else:
                return {'name': table_name, 'columns': [], 'row_count': 0}
        except Exception as e:
            logger.error(f"Error getting schema for {table_name}: {e}")
            return {}
    
    def supports_feature(self, feature: str) -> bool:
        """Check if adapter supports specific feature"""
        return feature in self.features
    
    def get_capabilities(self) -> Dict[str, Any]:
        """Get database capabilities and features"""
        return {
            'type': 'sqlite',
            'features': self.features,
            'supports_warehouse': False,
            'supports_real_time': False,
            'supports_ai_functions': False,
            'max_connections': 1,
            'storage_type': 'local_file'
        }
    
    def health_check(self) -> Dict[str, Any]:
        """Check database health and status"""
        try:
            if self.db_session:
                # Test basic query
                result = self.execute_query("SELECT 1 as test")
                return {
                    'status': 'healthy',
                    'type': 'sqlite',
                    'connection': 'active',
                    'test_query': 'successful' if result else 'failed'
                }
            else:
                return {
                    'status': 'unhealthy',
                    'type': 'sqlite',
                    'connection': 'inactive',
                    'error': 'No database session'
                }
        except Exception as e:
            return {
                'status': 'unhealthy',
                'type': 'sqlite',
                'connection': 'error',
                'error': str(e)
            } 