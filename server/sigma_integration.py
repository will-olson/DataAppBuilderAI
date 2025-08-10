"""
Sigma Framework Integration Module
Integrates Sigma compatibility with the existing Flask application
"""

from typing import Dict, Any, Optional
import logging
from flask import current_app, request, jsonify

logger = logging.getLogger(__name__)

class SigmaIntegration:
    """Main Sigma integration class for the Flask application"""
    
    def __init__(self, app=None):
        self.app = app
        self.sigma_layer = None
        self.database_adapter = None
        
        if app is not None:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize Sigma integration with Flask app"""
        self.app = app
        
        # Initialize Sigma components based on configuration
        self._init_sigma_layer()
        self._init_database_adapter()
        
        # Register Sigma routes
        self._register_routes()
        
        logger.info(f"Sigma integration initialized in {app.config.get('SIGMA_MODE', 'standalone')} mode")
    
    def _init_sigma_layer(self):
        """Initialize Sigma compatibility layer"""
        try:
            from sigma import create_sigma_layer
            config_obj = self.app.config
            self.sigma_layer = create_sigma_layer(config_obj)
            logger.info("Sigma layer initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Sigma layer: {e}")
            self.sigma_layer = None
    
    def _init_database_adapter(self):
        """Initialize database adapter"""
        try:
            from database import create_database_adapter
            config_obj = self.app.config
            self.database_adapter = create_database_adapter(config_obj)
            logger.info("Database adapter initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database adapter: {e}")
            self.database_adapter = None
    
    def _register_routes(self):
        """Register Sigma-specific routes"""
        if not self.app:
            return
        
        # Sigma Framework Status
        @self.app.route('/api/sigma/status', methods=['GET'])
        def get_sigma_status():
            """Get Sigma framework status"""
            try:
                status = {
                    'sigma_mode': self.app.config.get('SIGMA_MODE', 'standalone'),
                    'database_mode': self.app.config.get('DATABASE_MODE', 'sqlite'),
                    'sigma_layer': self.sigma_layer.get_mode_info() if self.sigma_layer else None,
                    'database_adapter': self.database_adapter.get_capabilities() if self.database_adapter else None
                }
                return jsonify({'status': 'success', 'data': status})
            except Exception as e:
                logger.error(f"Error getting Sigma status: {e}")
                return jsonify({'status': 'error', 'message': str(e)}), 500
        
        # Sigma Framework Capabilities
        @self.app.route('/api/sigma/capabilities', methods=['GET'])
        def get_sigma_capabilities():
            """Get Sigma framework capabilities"""
            try:
                if self.sigma_layer:
                    capabilities = self.sigma_layer.get_capabilities()
                    return jsonify({'status': 'success', 'data': capabilities})
                else:
                    return jsonify({'status': 'error', 'message': 'Sigma layer not available'}), 404
            except Exception as e:
                logger.error(f"Error getting Sigma capabilities: {e}")
                return jsonify({'status': 'error', 'message': str(e)}), 500
        
        # Database Health Check
        @self.app.route('/api/database/health', methods=['GET'])
        def get_database_health():
            """Get database health status"""
            try:
                if self.database_adapter:
                    health = self.database_adapter.health_check()
                    return jsonify({'status': 'success', 'data': health})
                else:
                    return jsonify({'status': 'error', 'message': 'Database adapter not available'}), 404
            except Exception as e:
                logger.error(f"Error getting database health: {e}")
                return jsonify({'status': 'error', 'message': str(e)}), 500
        
        # Sigma Input Tables Management
        @self.app.route('/api/sigma/input-tables', methods=['GET', 'POST'])
        def manage_input_tables():
            """Manage Sigma input tables"""
            try:
                if not self.sigma_layer or not self.sigma_layer.input_tables:
                    return jsonify({'status': 'error', 'message': 'Input tables not available'}), 404
                
                if request.method == 'GET':
                    tables = self.sigma_layer.input_tables.list_tables()
                    return jsonify({'status': 'success', 'data': tables})
                else:
                    # POST - Create new table
                    table_config = request.get_json()
                    if not table_config:
                        return jsonify({'status': 'error', 'message': 'No table configuration provided'}), 400
                    
                    table_id = self.sigma_layer.input_tables.create_table(table_config)
                    return jsonify({'status': 'success', 'data': {'table_id': table_id}})
                    
            except Exception as e:
                logger.error(f"Error managing input tables: {e}")
                return jsonify({'status': 'error', 'message': str(e)}), 500
        
        # Sigma Layout Elements Management
        @self.app.route('/api/sigma/layout-elements', methods=['GET', 'POST'])
        def manage_layout_elements():
            """Manage Sigma layout elements"""
            try:
                if not self.sigma_layer or not self.sigma_layer.layout_elements:
                    return jsonify({'status': 'error', 'message': 'Layout elements not available'}), 404
                
                if request.method == 'GET':
                    element_type = request.args.get('type')
                    elements = self.sigma_layer.layout_elements.list_elements(element_type)
                    return jsonify({'status': 'success', 'data': elements})
                else:
                    # POST - Create new element
                    element_config = request.get_json()
                    if not element_config:
                        return jsonify({'status': 'error', 'message': 'No element configuration provided'}), 400
                    
                    element_type = element_config.get('type')
                    if element_type == 'container':
                        element_id = self.sigma_layer.layout_elements.create_container(element_config)
                    elif element_type == 'modal':
                        element_id = self.sigma_layer.layout_elements.create_modal(element_config)
                    elif element_type == 'tabs':
                        element_id = self.sigma_layer.layout_elements.create_tabs(element_config)
                    elif element_type == 'form':
                        element_id = self.sigma_layer.layout_elements.create_form(element_config)
                    elif element_type == 'chart':
                        element_id = self.sigma_layer.layout_elements.create_chart(element_config)
                    else:
                        return jsonify({'status': 'error', 'message': f'Unsupported element type: {element_type}'}), 400
                    
                    return jsonify({'status': 'success', 'data': {'element_id': element_id}})
                    
            except Exception as e:
                logger.error(f"Error managing layout elements: {e}")
                return jsonify({'status': 'error', 'message': str(e)}), 500
        
        # Sigma Actions Management
        @self.app.route('/api/sigma/actions', methods=['GET', 'POST'])
        def manage_actions():
            """Manage Sigma actions"""
            try:
                if not self.sigma_layer or not self.sigma_layer.actions:
                    return jsonify({'status': 'error', 'message': 'Actions not available'}), 404
                
                if request.method == 'GET':
                    actions = self.sigma_layer.actions.list_actions()
                    return jsonify({'status': 'success', 'data': actions})
                else:
                    # POST - Create new action
                    action_config = request.get_json()
                    if not action_config:
                        return jsonify({'status': 'error', 'message': 'No action configuration provided'}), 400
                    
                    action_id = self.sigma_layer.actions.create_action(action_config)
                    return jsonify({'status': 'success', 'data': {'action_id': action_id}})
                    
            except Exception as e:
                logger.error(f"Error managing actions: {e}")
                return jsonify({'status': 'error', 'message': str(e)}), 500
        
        # Execute Sigma Action
        @self.app.route('/api/sigma/actions/<action_id>/execute', methods=['POST'])
        def execute_action(action_id):
            """Execute a Sigma action"""
            try:
                if not self.sigma_layer or not self.sigma_layer.actions:
                    return jsonify({'status': 'error', 'message': 'Actions not available'}), 404
                
                context = request.get_json() or {}
                result = self.sigma_layer.actions.execute_action(action_id, context)
                return jsonify({'status': 'success', 'data': result})
                
            except Exception as e:
                logger.error(f"Error executing action {action_id}: {e}")
                return jsonify({'status': 'error', 'message': str(e)}), 500
        
        logger.info("Sigma routes registered successfully")
    
    def update_config(self, new_config):
        """Update configuration without re-registering routes"""
        try:
            # Update the Flask app configuration
            if hasattr(self.app, 'config'):
                self.app.config['SIGMA_MODE'] = new_config.get('sigma_mode', 'standalone')
                self.app.config['DATABASE_MODE'] = new_config.get('database_mode', 'sqlite')
                self.app.config['SIGMA_FEATURES'] = new_config.get('features', {})
            
            # Reinitialize components with new configuration
            # This is safe now since routes are already registered
            self._init_sigma_layer()
            self._init_database_adapter()
            
            logger.info(f"Sigma integration configuration updated successfully")
        except Exception as e:
            logger.error(f"Failed to update Sigma integration configuration: {e}")
            raise
    
    def get_sigma_status(self) -> Dict[str, Any]:
        """Get current Sigma integration status"""
        return {
            'enabled': self.sigma_layer is not None,
            'sigma_layer': self.sigma_layer.get_mode_info() if self.sigma_layer else None,
            'database_adapter': self.database_adapter.get_capabilities() if self.database_adapter else None
        }
    
    def validate_compatibility(self) -> Dict[str, Any]:
        """Validate Sigma compatibility"""
        if not self.sigma_layer:
            return {'compatible': False, 'issues': ['Sigma layer not initialized']}
        
        return self.sigma_layer.validate_compatibility()

# Global Sigma integration instance
sigma_integration = SigmaIntegration()

def init_sigma_integration(app):
    """Initialize Sigma integration with Flask app"""
    integration = SigmaIntegration(app)
    return integration 