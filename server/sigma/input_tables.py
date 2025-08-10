from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SigmaInputTables:
    """Sigma-compatible input tables system"""
    
    def __init__(self):
        self.tables = {}
        self.validation_rules = {}
        self.governance_config = {}
        self._setup_default_validation_rules()
    
    def _setup_default_validation_rules(self):
        """Setup default validation rules for common data types"""
        self.validation_rules = {
            'email': {
                'pattern': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                'message': 'Invalid email format'
            },
            'phone': {
                'pattern': r'^\+?1?\d{9,15}$',
                'message': 'Invalid phone number format'
            },
            'date': {
                'pattern': r'^\d{4}-\d{2}-\d{2}$',
                'message': 'Date must be in YYYY-MM-DD format'
            },
            'numeric': {
                'pattern': r'^\d+(\.\d+)?$',
                'message': 'Must be a valid number'
            }
        }
    
    def create_table(self, table_config: Dict) -> str:
        """Create new input table"""
        try:
            table_id = str(uuid.uuid4())
            
            # Validate table configuration
            if not self._validate_table_config(table_config):
                raise ValueError("Invalid table configuration")
            
            self.tables[table_id] = {
                'id': table_id,
                'name': table_config.get('name', f'table_{table_id[:8]}'),
                'type': table_config.get('type', 'empty'),
                'columns': table_config.get('columns', []),
                'validation_rules': table_config.get('validation_rules', {}),
                'governance_config': table_config.get('governance_config', {}),
                'metadata': table_config.get('metadata', {}),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'status': 'active'
            }
            
            logger.info(f"Created input table: {table_id}")
            return table_id
            
        except Exception as e:
            logger.error(f"Error creating input table: {str(e)}")
            raise
    
    def _validate_table_config(self, config: Dict) -> bool:
        """Validate table configuration"""
        required_fields = ['columns']
        
        for field in required_fields:
            if field not in config:
                logger.error(f"Missing required field: {field}")
                return False
        
        # Validate columns structure
        for column in config['columns']:
            if not isinstance(column, dict) or 'name' not in column or 'type' not in column:
                logger.error(f"Invalid column configuration: {column}")
                return False
        
        return True
    
    def insert_data(self, table_id: str, data: List[Dict]) -> Dict[str, Any]:
        """Insert data into input table"""
        try:
            if table_id not in self.tables:
                return {'success': False, 'error': 'Table not found'}
            
            table = self.tables[table_id]
            
            # Validate data against rules
            validation_result = self._validate_data(data, table['validation_rules'])
            
            if not validation_result['valid']:
                return {
                    'success': False, 
                    'error': 'Data validation failed',
                    'validation_errors': validation_result['errors']
                }
            
            # Store validated data
            stored_data = self._store_data(table_id, validation_result['validated_data'])
            
            # Update table metadata
            table['updated_at'] = datetime.utcnow()
            table['row_count'] = table.get('row_count', 0) + len(data)
            
            return {
                'success': True,
                'rows_inserted': len(data),
                'table_id': table_id,
                'stored_data': stored_data
            }
            
        except Exception as e:
            logger.error(f"Error inserting data: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def _validate_data(self, data: List[Dict], rules: Dict) -> Dict[str, Any]:
        """Validate data against validation rules"""
        import re
        
        validated_data = []
        errors = []
        
        for row_index, row in enumerate(data):
            row_errors = []
            validated_row = {}
            
            for column_name, value in row.items():
                # Apply validation rules if they exist
                if column_name in rules:
                    rule = rules[column_name]
                    
                    if 'pattern' in rule:
                        if not re.match(rule['pattern'], str(value)):
                            row_errors.append(f"Column '{column_name}': {rule['message']}")
                    
                    if 'required' in rule and rule['required'] and not value:
                        row_errors.append(f"Column '{column_name}': Required field")
                    
                    if 'min_length' in rule and len(str(value)) < rule['min_length']:
                        row_errors.append(f"Column '{column_name}': Minimum length {rule['min_length']}")
                    
                    if 'max_length' in rule and len(str(value)) > rule['max_length']:
                        row_errors.append(f"Column '{column_name}': Maximum length {rule['max_length']}")
                
                validated_row[column_name] = value
            
            if row_errors:
                errors.append({
                    'row_index': row_index,
                    'errors': row_errors
                })
            else:
                validated_data.append(validated_row)
        
        return {
            'valid': len(errors) == 0,
            'validated_data': validated_data,
            'errors': errors
        }
    
    def _store_data(self, table_id: str, data: List[Dict]) -> List[Dict]:
        """Store validated data (in this implementation, just return the data)"""
        # In a real implementation, this would store to the database
        # For now, we'll just return the data
        return data
    
    def get_table_info(self, table_id: str) -> Optional[Dict[str, Any]]:
        """Get table information"""
        if table_id not in self.tables:
            return None
        
        table = self.tables[table_id].copy()
        # Remove sensitive information
        table.pop('validation_rules', None)
        table.pop('governance_config', None)
        return table
    
    def list_tables(self) -> List[Dict[str, Any]]:
        """List all input tables"""
        return [
            {
                'id': table['id'],
                'name': table['name'],
                'type': table['type'],
                'column_count': len(table['columns']),
                'row_count': table.get('row_count', 0),
                'created_at': table['created_at'],
                'status': table['status']
            }
            for table in self.tables.values()
        ]
    
    def update_table(self, table_id: str, updates: Dict[str, Any]) -> bool:
        """Update table configuration"""
        try:
            if table_id not in self.tables:
                return False
            
            table = self.tables[table_id]
            
            # Update allowed fields
            allowed_updates = ['name', 'validation_rules', 'governance_config', 'metadata']
            for field in allowed_updates:
                if field in updates:
                    table[field] = updates[field]
            
            table['updated_at'] = datetime.utcnow()
            return True
            
        except Exception as e:
            logger.error(f"Error updating table: {str(e)}")
            return False
    
    def delete_table(self, table_id: str) -> bool:
        """Delete input table"""
        try:
            if table_id not in self.tables:
                return False
            
            # Soft delete - mark as inactive
            self.tables[table_id]['status'] = 'deleted'
            self.tables[table_id]['updated_at'] = datetime.utcnow()
            
            logger.info(f"Deleted input table: {table_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting table: {str(e)}")
            return False 