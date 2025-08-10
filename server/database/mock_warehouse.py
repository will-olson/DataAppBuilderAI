from . import DatabaseAdapter
from typing import Dict, List, Any
import json
import os
import uuid
from datetime import datetime
import logging
import re

logger = logging.getLogger(__name__)

class MockWarehouseAdapter(DatabaseAdapter):
    """Mock warehouse for testing Sigma compatibility"""
    
    def __init__(self, data_path: str = 'server/mock_warehouse/data'):
        self.data_path = data_path
        self.features = ['warehouse_sql', 'json_support', 'sigds_schema', 'real_time', 'ai_functions']
        self.tables = {}
        self._load_mock_data()
        self._setup_sigds_schema()
    
    def _load_mock_data(self):
        """Load mock data from files"""
        try:
            if not os.path.exists(self.data_path):
                os.makedirs(self.data_path, exist_ok=True)
            
            # Load existing mock data
            for filename in os.listdir(self.data_path):
                if filename.endswith('.json'):
                    table_name = filename[:-5]  # Remove .json extension
                    filepath = os.path.join(self.data_path, filename)
                    with open(filepath, 'r') as f:
                        self.tables[table_name] = json.load(f)
        except Exception as e:
            logger.warning(f"Could not load mock data: {str(e)}")
            self.tables = {}
    
    def _setup_sigds_schema(self):
        """Setup SIGDS schema tables for Sigma compatibility"""
        sigds_tables = {
            'sigma_input_tables': {
                'id': 'VARCHAR',
                'type': 'VARCHAR',
                'columns': 'JSON',
                'validation_rules': 'JSON',
                'governance_config': 'JSON',
                'metadata': 'JSON'
            },
            'sigma_layout_elements': {
                'id': 'VARCHAR',
                'type': 'VARCHAR',
                'config': 'JSON',
                'parent_id': 'VARCHAR',
                'nesting_level': 'INTEGER'
            },
            'sigma_actions': {
                'id': 'VARCHAR',
                'type': 'VARCHAR',
                'parameters': 'JSON',
                'conditions': 'JSON'
            },
            'sigma_action_sequences': {
                'id': 'VARCHAR',
                'name': 'VARCHAR',
                'trigger': 'JSON',
                'actions': 'JSON',
                'execution_config': 'JSON'
            }
        }
        
        for table_name, schema in sigds_tables.items():
            if table_name not in self.tables:
                self.tables[table_name] = []
    
    def _save_table_data(self, table_name: str):
        """Save table data to file"""
        try:
            filepath = os.path.join(self.data_path, f"{table_name}.json")
            with open(filepath, 'w') as f:
                json.dump(self.tables[table_name], f, indent=2, default=str)
        except Exception as e:
            logger.error(f"Error saving mock data: {str(e)}")
    
    def _mock_query_executor(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute mock queries against in-memory data"""
        try:
            # Simple SQL parsing for mock execution
            query = query.strip().upper()
            
            if query.startswith('SELECT'):
                return self._execute_select(query, params)
            elif query.startswith('INSERT'):
                return self._execute_insert(query, params)
            elif query.startswith('UPDATE'):
                return self._execute_update(query, params)
            elif query.startswith('DELETE'):
                return self._execute_delete(query, params)
            else:
                return []
        except Exception as e:
            logger.error(f"Mock query execution error: {str(e)}")
            return []
    
    def _execute_select(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute SELECT queries"""
        # Extract table name from query
        match = re.search(r'FROM\s+(\w+)', query, re.IGNORECASE)
        if not match:
            return []
        
        table_name = match.group(1).lower()
        if table_name not in self.tables:
            return []
        
        # For now, return all data (can be enhanced with WHERE clauses)
        return self.tables[table_name]
    
    def _execute_insert(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute INSERT queries"""
        # Extract table name from query
        match = re.search(r'INTO\s+(\w+)', query, re.IGNORECASE)
        if not match:
            return []
        
        table_name = match.group(1).lower()
        if table_name not in self.tables:
            self.tables[table_name] = []
        
        # Add mock data
        if params:
            new_row = params.copy()
            new_row['id'] = str(uuid.uuid4())
            new_row['created_at'] = datetime.utcnow().isoformat()
            self.tables[table_name].append(new_row)
            self._save_table_data(table_name)
        
        return [{'affected_rows': 1}]
    
    def _execute_update(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute UPDATE queries"""
        # Mock update - return success
        return [{'affected_rows': 1}]
    
    def _execute_delete(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute DELETE queries"""
        # Mock delete - return success
        return [{'affected_rows': 1}]
    
    def execute_query(self, query: str, params: Dict = None) -> List[Dict]:
        """Execute SQL query and return results"""
        return self._mock_query_executor(query, params)
    
    def create_table(self, table_name: str, schema: Dict) -> bool:
        """Create table with specified schema"""
        try:
            if table_name not in self.tables:
                self.tables[table_name] = []
                self._save_table_data(table_name)
            return True
        except Exception as e:
            logger.error(f"Mock warehouse table creation error: {str(e)}")
            return False
    
    def insert_data(self, table_name: str, data: List[Dict]) -> bool:
        """Insert data into specified table"""
        try:
            if table_name not in self.tables:
                self.tables[table_name] = []
            
            for row in data:
                new_row = row.copy()
                new_row['id'] = str(uuid.uuid4())
                new_row['created_at'] = datetime.utcnow().isoformat()
                self.tables[table_name].append(new_row)
            
            self._save_table_data(table_name)
            return True
        except Exception as e:
            logger.error(f"Mock warehouse data insertion error: {str(e)}")
            return False
    
    def get_table_schema(self, table_name: str) -> Dict:
        """Get table schema information"""
        try:
            if table_name not in self.tables or not self.tables[table_name]:
                return {}
            
            # Infer schema from first row
            first_row = self.tables[table_name][0]
            schema = {}
            
            for col_name, value in first_row.items():
                if isinstance(value, bool):
                    col_type = 'BOOLEAN'
                elif isinstance(value, int):
                    col_type = 'INTEGER'
                elif isinstance(value, float):
                    col_type = 'FLOAT'
                elif isinstance(value, dict) or isinstance(value, list):
                    col_type = 'JSON'
                else:
                    col_type = 'VARCHAR'
                
                schema[col_name] = {
                    'type': col_type,
                    'nullable': True,
                    'primary_key': col_name == 'id',
                    'default': None
                }
            
            return schema
        except Exception as e:
            logger.error(f"Mock warehouse schema retrieval error: {str(e)}")
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
            return {
                'status': 'healthy',
                'adapter': 'mock_warehouse',
                'features': self.features,
                'connection': True,
                'tables': list(self.tables.keys()),
                'data_path': self.data_path,
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                'status': 'unhealthy',
                'adapter': 'mock_warehouse',
                'error': str(e),
                'connection': False
            } 