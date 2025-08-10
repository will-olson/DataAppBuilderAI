from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional

class DatabaseAdapter(ABC):
    """Abstract base class for database operations"""
    
    @abstractmethod
    def execute_query(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute SQL query and return results"""
        pass
    
    @abstractmethod
    def create_table(self, table_name: str, schema: Dict) -> bool:
        """Create table with specified schema"""
        pass
    
    @abstractmethod
    def insert_data(self, table_name: str, data: List[Dict]) -> bool:
        """Insert data into specified table"""
        pass
    
    @abstractmethod
    def get_table_schema(self, table_name: str) -> Dict:
        """Get table schema information"""
        pass
    
    @abstractmethod
    def supports_feature(self, feature: str) -> bool:
        """Check if adapter supports specific feature"""
        pass
    
    @abstractmethod
    def get_capabilities(self) -> Dict[str, bool]:
        """Return all supported features"""
        pass
    
    @abstractmethod
    def health_check(self) -> Dict[str, Any]:
        """Check database health and status"""
        pass

def create_database_adapter(config):
    """Create appropriate database adapter based on configuration"""
    
    try:
        if config['DATABASE_MODE'] == 'sqlite':
            from .sqlite_adapter import SQLiteAdapter
            from app import db  # Import existing db instance
            return SQLiteAdapter(db.session)
        
        elif config['DATABASE_MODE'] == 'mock_warehouse':
            from .mock_warehouse import MockWarehouseAdapter
            return MockWarehouseAdapter(config['MOCK_WAREHOUSE_CONFIG']['data_path'])
        
        elif config['DATABASE_MODE'] == 'real_warehouse':
            from .sigma_adapter import SigmaWarehouseAdapter
            return SigmaWarehouseAdapter(config['SIGMA_INTEGRATION_CONFIG']['warehouse_config'])
        
        else:
            raise ValueError(f"Unsupported database mode: {config['DATABASE_MODE']}")
    
    except Exception as e:
        # Fallback to SQLite
        from .sqlite_adapter import SQLiteAdapter
        from app import db
        return SQLiteAdapter(db.session) 