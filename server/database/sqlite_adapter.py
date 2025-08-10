from . import DatabaseAdapter
from sqlalchemy import text, inspect
from typing import Dict, List, Any
import logging

logger = logging.getLogger(__name__)

class SQLiteAdapter(DatabaseAdapter):
    """SQLite implementation for local development/testing"""
    
    def __init__(self, db_session):
        self.db_session = db_session
        self.features = ['basic_sql', 'json_support', 'local_storage', 'transactions']
        self._engine = db_session.bind if db_session.bind else None
    
    def execute_query(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute SQL query and return results"""
        try:
            result = self.db_session.execute(text(query), params or {})
            return [dict(row._mapping) for row in result]
        except Exception as e:
            logger.error(f"SQLite query execution error: {str(e)}")
            raise
    
    def create_table(self, table_name: str, schema: Dict) -> bool:
        """Create table with specified schema"""
        try:
            # For SQLite, we'll use raw SQL creation
            columns = []
            for col_name, col_config in schema.items():
                col_type = col_config.get('type', 'TEXT')
                nullable = 'NOT NULL' if col_config.get('required', False) else ''
                columns.append(f"{col_name} {col_type} {nullable}".strip())
            
            create_sql = f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(columns)})"
            self.db_session.execute(text(create_sql))
            self.db_session.commit()
            return True
        except Exception as e:
            logger.error(f"SQLite table creation error: {str(e)}")
            self.db_session.rollback()
            return False
    
    def insert_data(self, table_name: str, data: List[Dict]) -> bool:
        """Insert data into specified table"""
        try:
            if not data:
                return True
            
            # Get column names from first data item
            columns = list(data[0].keys())
            placeholders = ', '.join([':' + col for col in columns])
            column_list = ', '.join(columns)
            
            insert_sql = f"INSERT INTO {table_name} ({column_list}) VALUES ({placeholders})"
            
            for row in data:
                self.db_session.execute(text(insert_sql), row)
            
            self.db_session.commit()
            return True
        except Exception as e:
            logger.error(f"SQLite data insertion error: {str(e)}")
            self.db_session.rollback()
            return False
    
    def get_table_schema(self, table_name: str) -> Dict:
        """Get table schema information"""
        try:
            if not self._engine:
                return {}
            
            inspector = inspect(self._engine)
            columns = inspector.get_columns(table_name)
            
            schema = {}
            for column in columns:
                schema[column['name']] = {
                    'type': str(column['type']),
                    'nullable': column['nullable'],
                    'primary_key': column.get('primary_key', False),
                    'default': column.get('default')
                }
            
            return schema
        except Exception as e:
            logger.error(f"SQLite schema retrieval error: {str(e)}")
            return {}
    
    def supports_feature(self, feature: str) -> bool:
        """Check if adapter supports specific feature"""
        return feature in self.features
    
    def get_capabilities(self) -> Dict[str, bool]:
        """Return all supported features"""
        return {feature: True for feature in self.features}
    
    def health_check(self) -> Dict[str, Any]:
        """Check database health and status"""
        try:
            # Simple health check query
            result = self.execute_query("SELECT 1 as health_check")
            return {
                'status': 'healthy',
                'adapter': 'sqlite',
                'features': self.features,
                'connection': True,
                'timestamp': str(result[0]['health_check']) if result else None
            }
        except Exception as e:
            return {
                'status': 'unhealthy',
                'adapter': 'sqlite',
                'error': str(e),
                'connection': False
            } 