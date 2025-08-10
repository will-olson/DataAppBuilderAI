"""
Database Abstraction Layer for GrowthMarketer AI
Supports multiple database backends: SQLite, Mock Warehouse, and Sigma Warehouse
"""

from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

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
    def get_capabilities(self) -> Dict[str, Any]:
        """Get database capabilities and features"""
        pass
    
    @abstractmethod
    def health_check(self) -> Dict[str, Any]:
        """Check database health and status"""
        pass

def create_database_adapter(config: Dict) -> DatabaseAdapter:
    """Factory function to create appropriate database adapter"""
    
    database_mode = config.get('DATABASE_MODE', 'sqlite')
    
    if database_mode == 'sqlite':
        from .sqlite_adapter import SQLiteAdapter
        return SQLiteAdapter(config)
    
    elif database_mode == 'mock_warehouse':
        from .mock_warehouse_adapter import MockWarehouseAdapter
        return MockWarehouseAdapter(config)
    
    elif database_mode == 'real_warehouse':
        from .sigma_adapter import SigmaWarehouseAdapter
        return SigmaWarehouseAdapter(config)
    
    else:
        raise ValueError(f"Unsupported database mode: {database_mode}") 