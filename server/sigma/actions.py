from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ActionExecutionEngine:
    """Engine for executing Sigma actions"""
    
    def __init__(self):
        self.execution_history = []
        self.max_history_size = 100
    
    def execute(self, action: Dict, context: Dict = None) -> Dict[str, Any]:
        """Execute a specific action"""
        try:
            execution_id = str(uuid.uuid4())
            start_time = datetime.utcnow()
            
            # Log execution start
            logger.info(f"Executing action {action['id']}: {action['type']}")
            
            # Execute based on action type
            result = self._execute_action_by_type(action, context or {})
            
            # Record execution
            execution_record = {
                'execution_id': execution_id,
                'action_id': action['id'],
                'action_type': action['type'],
                'start_time': start_time,
                'end_time': datetime.utcnow(),
                'context': context,
                'result': result,
                'status': 'success' if result.get('success') else 'failed'
            }
            
            self._add_to_history(execution_record)
            
            return result
            
        except Exception as e:
            logger.error(f"Action execution error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'execution_id': execution_id if 'execution_id' in locals() else None
            }
    
    def _execute_action_by_type(self, action: Dict, context: Dict) -> Dict[str, Any]:
        """Execute action based on its type"""
        action_type = action.get('type', 'unknown')
        
        if action_type == 'navigation':
            return self._execute_navigation(action, context)
        elif action_type == 'data_operation':
            return self._execute_data_operation(action, context)
        elif action_type == 'ui_interaction':
            return self._execute_ui_interaction(action, context)
        elif action_type == 'api_call':
            return self._execute_api_call(action, context)
        elif action_type == 'custom':
            return self._execute_custom_action(action, context)
        else:
            return {
                'success': False,
                'error': f"Unknown action type: {action_type}"
            }
    
    def _execute_navigation(self, action: Dict, context: Dict) -> Dict[str, Any]:
        """Execute navigation action"""
        try:
            target = action.get('parameters', {}).get('target')
            if not target:
                return {'success': False, 'error': 'No target specified for navigation'}
            
            # In a real implementation, this would handle actual navigation
            # For now, we'll return success with navigation details
            return {
                'success': True,
                'action_type': 'navigation',
                'target': target,
                'context': context,
                'message': f"Navigation to {target} initiated"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _execute_data_operation(self, action: Dict, context: Dict) -> Dict[str, Any]:
        """Execute data operation action"""
        try:
            operation = action.get('parameters', {}).get('operation')
            if not operation:
                return {'success': False, 'error': 'No operation specified for data action'}
            
            # In a real implementation, this would perform actual data operations
            # For now, we'll return success with operation details
            return {
                'success': True,
                'action_type': 'data_operation',
                'operation': operation,
                'context': context,
                'message': f"Data operation {operation} completed"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _execute_ui_interaction(self, action: Dict, context: Dict) -> Dict[str, Any]:
        """Execute UI interaction action"""
        try:
            interaction = action.get('parameters', {}).get('interaction')
            if not interaction:
                return {'success': False, 'error': 'No interaction specified for UI action'}
            
            # In a real implementation, this would handle actual UI interactions
            # For now, we'll return success with interaction details
            return {
                'success': True,
                'action_type': 'ui_interaction',
                'interaction': interaction,
                'context': context,
                'message': f"UI interaction {interaction} completed"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _execute_api_call(self, action: Dict, context: Dict) -> Dict[str, Any]:
        """Execute API call action"""
        try:
            api_config = action.get('parameters', {}).get('api_config')
            if not api_config:
                return {'success': False, 'error': 'No API configuration specified'}
            
            # In a real implementation, this would make actual API calls
            # For now, we'll return success with API call details
            return {
                'success': True,
                'action_type': 'api_call',
                'api_config': api_config,
                'context': context,
                'message': f"API call to {api_config.get('endpoint', 'unknown')} completed"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _execute_custom_action(self, action: Dict, context: Dict) -> Dict[str, Any]:
        """Execute custom action"""
        try:
            custom_logic = action.get('parameters', {}).get('custom_logic')
            if not custom_logic:
                return {'success': False, 'error': 'No custom logic specified'}
            
            # In a real implementation, this would execute custom logic
            # For now, we'll return success with custom action details
            return {
                'success': True,
                'action_type': 'custom',
                'custom_logic': custom_logic,
                'context': context,
                'message': f"Custom action {custom_logic} completed"
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _add_to_history(self, execution_record: Dict):
        """Add execution record to history"""
        self.execution_history.append(execution_record)
        
        # Maintain history size limit
        if len(self.execution_history) > self.max_history_size:
            self.execution_history.pop(0)
    
    def get_execution_history(self, limit: int = None) -> List[Dict]:
        """Get execution history"""
        if limit:
            return self.execution_history[-limit:]
        return self.execution_history.copy()

class SigmaActions:
    """Sigma-compatible actions system"""
    
    def __init__(self):
        self.actions = {}
        self.sequences = {}
        self.execution_engine = ActionExecutionEngine()
        self._setup_default_actions()
    
    def _setup_default_actions(self):
        """Setup default actions for common operations"""
        default_actions = {
            'navigate_home': {
                'type': 'navigation',
                'parameters': {'target': 'home'},
                'conditions': {},
                'description': 'Navigate to home page'
            },
            'refresh_data': {
                'type': 'data_operation',
                'parameters': {'operation': 'refresh'},
                'conditions': {},
                'description': 'Refresh current data'
            },
            'export_data': {
                'type': 'data_operation',
                'parameters': {'operation': 'export', 'format': 'csv'},
                'conditions': {},
                'description': 'Export data to CSV'
            },
            'show_modal': {
                'type': 'ui_interaction',
                'parameters': {'interaction': 'show_modal', 'modal_id': ''},
                'conditions': {},
                'description': 'Show modal dialog'
            }
        }
        
        for action_name, action_config in default_actions.items():
            self.create_action(action_config)
    
    def create_action(self, action_config: Dict) -> str:
        """Create new action"""
        try:
            action_id = str(uuid.uuid4())
            
            # Validate action configuration
            if not self._validate_action_config(action_config):
                raise ValueError("Invalid action configuration")
            
            self.actions[action_id] = {
                'id': action_id,
                'type': action_config.get('type', 'navigation'),
                'parameters': action_config.get('parameters', {}),
                'conditions': action_config.get('conditions', {}),
                'description': action_config.get('description', ''),
                'metadata': action_config.get('metadata', {}),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'status': 'active'
            }
            
            logger.info(f"Created action: {action_id}")
            return action_id
            
        except Exception as e:
            logger.error(f"Error creating action: {str(e)}")
            raise
    
    def _validate_action_config(self, config: Dict) -> bool:
        """Validate action configuration"""
        # Must have a type
        if 'type' not in config:
            logger.error("Action must have a type")
            return False
        
        # Type must be valid
        valid_types = ['navigation', 'data_operation', 'ui_interaction', 'api_call', 'custom']
        if config['type'] not in valid_types:
            logger.error(f"Invalid action type. Must be one of: {valid_types}")
            return False
        
        # Must have parameters
        if 'parameters' not in config:
            logger.error("Action must have parameters")
            return False
        
        return True
    
    def execute_action(self, action_id: str, context: Dict = None) -> Dict[str, Any]:
        """Execute specific action"""
        try:
            if action_id not in self.actions:
                return {'success': False, 'error': 'Action not found'}
            
            action = self.actions[action_id]
            
            # Check if action is active
            if action['status'] != 'active':
                return {'success': False, 'error': 'Action is not active'}
            
            # Check conditions if they exist
            if action['conditions'] and not self._check_conditions(action['conditions'], context or {}):
                return {'success': False, 'error': 'Action conditions not met'}
            
            # Execute the action
            result = self.execution_engine.execute(action, context)
            
            # Update action metadata
            action['updated_at'] = datetime.utcnow()
            action['last_executed'] = datetime.utcnow()
            action['execution_count'] = action.get('execution_count', 0) + 1
            
            return result
            
        except Exception as e:
            logger.error(f"Error executing action: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def _check_conditions(self, conditions: Dict, context: Dict) -> bool:
        """Check if action conditions are met"""
        try:
            # Simple condition checking - can be extended for complex logic
            for condition_key, condition_value in conditions.items():
                if condition_key in context:
                    if context[condition_key] != condition_value:
                        return False
                else:
                    return False
            return True
        except Exception as e:
            logger.error(f"Error checking conditions: {str(e)}")
            return False
    
    def create_action_sequence(self, sequence_config: Dict) -> str:
        """Create new action sequence"""
        try:
            sequence_id = str(uuid.uuid4())
            
            # Validate sequence configuration
            if not self._validate_sequence_config(sequence_config):
                raise ValueError("Invalid sequence configuration")
            
            self.sequences[sequence_id] = {
                'id': sequence_id,
                'name': sequence_config.get('name', f'sequence_{sequence_id[:8]}'),
                'trigger': sequence_config.get('trigger', {}),
                'actions': sequence_config.get('actions', []),
                'execution_config': sequence_config.get('execution_config', {}),
                'metadata': sequence_config.get('metadata', {}),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'status': 'active'
            }
            
            logger.info(f"Created action sequence: {sequence_id}")
            return sequence_id
            
        except Exception as e:
            logger.error(f"Error creating action sequence: {str(e)}")
            raise
    
    def _validate_sequence_config(self, config: Dict) -> bool:
        """Validate sequence configuration"""
        # Must have actions
        if 'actions' not in config or not config['actions']:
            logger.error("Sequence must have at least one action")
            return False
        
        # Each action must exist
        for action_id in config['actions']:
            if action_id not in self.actions:
                logger.error(f"Action {action_id} not found")
                return False
        
        return True
    
    def execute_sequence(self, sequence_id: str, context: Dict = None) -> Dict[str, Any]:
        """Execute action sequence"""
        try:
            if sequence_id not in self.sequences:
                return {'success': False, 'error': 'Sequence not found'}
            
            sequence = self.sequences[sequence_id]
            
            # Check if sequence is active
            if sequence['status'] != 'active':
                return {'success': False, 'error': 'Sequence is not active'}
            
            # Execute actions in sequence
            results = []
            for action_id in sequence['actions']:
                result = self.execute_action(action_id, context)
                results.append({
                    'action_id': action_id,
                    'result': result
                })
                
                # Check if we should continue on failure
                if not result.get('success') and not sequence['execution_config'].get('continue_on_failure', False):
                    break
            
            # Update sequence metadata
            sequence['updated_at'] = datetime.utcnow()
            sequence['last_executed'] = datetime.utcnow()
            sequence['execution_count'] = sequence.get('execution_count', 0) + 1
            
            return {
                'success': True,
                'sequence_id': sequence_id,
                'results': results,
                'total_actions': len(sequence['actions']),
                'executed_actions': len(results)
            }
            
        except Exception as e:
            logger.error(f"Error executing sequence: {str(e)}")
            return {'success': False, 'error': str(e)}
    
    def get_action_info(self, action_id: str) -> Optional[Dict[str, Any]]:
        """Get action information"""
        if action_id not in self.actions:
            return None
        
        action = self.actions[action_id].copy()
        # Remove sensitive information
        action.pop('parameters', None)
        action.pop('conditions', None)
        return action
    
    def list_actions(self) -> List[Dict[str, Any]]:
        """List all actions"""
        return [
            {
                'id': action['id'],
                'type': action['type'],
                'description': action['description'],
                'status': action['status'],
                'execution_count': action.get('execution_count', 0),
                'created_at': action['created_at']
            }
            for action in self.actions.values()
        ]
    
    def update_action(self, action_id: str, updates: Dict[str, Any]) -> bool:
        """Update action configuration"""
        try:
            if action_id not in self.actions:
                return False
            
            action = self.actions[action_id]
            
            # Update allowed fields
            allowed_updates = ['parameters', 'conditions', 'description', 'metadata', 'status']
            for field in allowed_updates:
                if field in updates:
                    action[field] = updates[field]
            
            action['updated_at'] = datetime.utcnow()
            return True
            
        except Exception as e:
            logger.error(f"Error updating action: {str(e)}")
            return False
    
    def delete_action(self, action_id: str) -> bool:
        """Delete action"""
        try:
            if action_id not in self.actions:
                return False
            
            # Soft delete - mark as inactive
            self.actions[action_id]['status'] = 'deleted'
            self.actions[action_id]['updated_at'] = datetime.utcnow()
            
            logger.info(f"Deleted action: {action_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting action: {str(e)}")
            return False
    
    def get_execution_history(self, limit: int = None) -> List[Dict]:
        """Get action execution history"""
        return self.execution_engine.get_execution_history(limit) 