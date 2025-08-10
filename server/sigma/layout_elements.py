from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SigmaLayoutElements:
    """Sigma-compatible layout elements system"""
    
    def __init__(self):
        self.containers = {}
        self.modals = {}
        self.tabs = {}
        self.forms = {}
        self.charts = {}
        self._setup_default_layouts()
    
    def _setup_default_layouts(self):
        """Setup default layout configurations"""
        # Default container configurations
        self.default_containers = {
            'full_width': {
                'grid_density': 12,
                'spacing': 'medium',
                'padding': 'medium',
                'background': 'transparent'
            },
            'sidebar': {
                'grid_density': 3,
                'spacing': 'small',
                'padding': 'small',
                'background': 'light'
            },
            'main_content': {
                'grid_density': 9,
                'spacing': 'medium',
                'padding': 'medium',
                'background': 'white'
            }
        }
    
    def create_container(self, config: Dict) -> str:
        """Create new container element"""
        try:
            container_id = str(uuid.uuid4())
            
            # Validate container configuration
            if not self._validate_container_config(config):
                raise ValueError("Invalid container configuration")
            
            self.containers[container_id] = {
                'id': container_id,
                'type': 'container',
                'name': config.get('name', f'container_{container_id[:8]}'),
                'grid_density': config.get('grid_density', 12),
                'spacing': config.get('spacing', 'medium'),
                'padding': config.get('padding', 'medium'),
                'background': config.get('background', 'transparent'),
                'children': config.get('children', []),
                'nesting_level': config.get('nesting_level', 0),
                'responsive': config.get('responsive', True),
                'metadata': config.get('metadata', {}),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'status': 'active'
            }
            
            logger.info(f"Created container: {container_id}")
            return container_id
            
        except Exception as e:
            logger.error(f"Error creating container: {str(e)}")
            raise
    
    def _validate_container_config(self, config: Dict) -> bool:
        """Validate container configuration"""
        # Grid density must be between 1 and 12
        if 'grid_density' in config:
            if not isinstance(config['grid_density'], int) or config['grid_density'] < 1 or config['grid_density'] > 12:
                logger.error("Grid density must be between 1 and 12")
                return False
        
        # Spacing must be valid
        valid_spacings = ['none', 'small', 'medium', 'large']
        if 'spacing' in config and config['spacing'] not in valid_spacings:
            logger.error(f"Invalid spacing value. Must be one of: {valid_spacings}")
            return False
        
        return True
    
    def create_modal(self, config: Dict) -> str:
        """Create new modal element"""
        try:
            modal_id = str(uuid.uuid4())
            
            # Validate modal configuration
            if not self._validate_modal_config(config):
                raise ValueError("Invalid modal configuration")
            
            self.modals[modal_id] = {
                'id': modal_id,
                'type': 'modal',
                'name': config.get('name', f'modal_{modal_id[:8]}'),
                'title': config.get('title', ''),
                'width': config.get('width', 'md'),
                'height': config.get('height', 'auto'),
                'content': config.get('content', ''),
                'actions': config.get('actions', []),
                'closable': config.get('closable', True),
                'backdrop': config.get('backdrop', True),
                'metadata': config.get('metadata', {}),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'status': 'active'
            }
            
            logger.info(f"Created modal: {modal_id}")
            return modal_id
            
        except Exception as e:
            logger.error(f"Error creating modal: {str(e)}")
            raise
    
    def _validate_modal_config(self, config: Dict) -> bool:
        """Validate modal configuration"""
        # Width must be valid
        valid_widths = ['xs', 'sm', 'md', 'lg', 'xl', 'full']
        if 'width' in config and config['width'] not in valid_widths:
            logger.error(f"Invalid width value. Must be one of: {valid_widths}")
            return False
        
        # Height must be valid
        valid_heights = ['auto', 'xs', 'sm', 'md', 'lg', 'xl', 'full']
        if 'height' in config and config['height'] not in valid_heights:
            logger.error(f"Invalid height value. Must be one of: {valid_heights}")
            return False
        
        return True
    
    def create_tabs(self, config: Dict) -> str:
        """Create new tabs element"""
        try:
            tabs_id = str(uuid.uuid4())
            
            # Validate tabs configuration
            if not self._validate_tabs_config(config):
                raise ValueError("Invalid tabs configuration")
            
            self.tabs[tabs_id] = {
                'id': tabs_id,
                'type': 'tabs',
                'name': config.get('name', f'tabs_{tabs_id[:8]}'),
                'tabs': config.get('tabs', []),
                'active_tab': config.get('active_tab', 0),
                'orientation': config.get('orientation', 'horizontal'),
                'variant': config.get('variant', 'standard'),
                'metadata': config.get('metadata', {}),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'status': 'active'
            }
            
            logger.info(f"Created tabs: {tabs_id}")
            return tabs_id
            
        except Exception as e:
            logger.error(f"Error creating tabs: {str(e)}")
            raise
    
    def _validate_tabs_config(self, config: Dict) -> bool:
        """Validate tabs configuration"""
        # Must have at least one tab
        if 'tabs' not in config or not config['tabs']:
            logger.error("Tabs must have at least one tab")
            return False
        
        # Each tab must have a name and content
        for tab in config['tabs']:
            if not isinstance(tab, dict) or 'name' not in tab or 'content' not in tab:
                logger.error("Each tab must have a name and content")
                return False
        
        # Orientation must be valid
        valid_orientations = ['horizontal', 'vertical']
        if 'orientation' in config and config['orientation'] not in valid_orientations:
            logger.error(f"Invalid orientation. Must be one of: {valid_orientations}")
            return False
        
        return True
    
    def create_form(self, config: Dict) -> str:
        """Create new form element"""
        try:
            form_id = str(uuid.uuid4())
            
            # Validate form configuration
            if not self._validate_form_config(config):
                raise ValueError("Invalid form configuration")
            
            self.forms[form_id] = {
                'id': form_id,
                'type': 'form',
                'name': config.get('name', f'form_{form_id[:8]}'),
                'fields': config.get('fields', []),
                'validation_rules': config.get('validation_rules', {}),
                'submit_action': config.get('submit_action', ''),
                'reset_enabled': config.get('reset_enabled', True),
                'metadata': config.get('metadata', {}),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'status': 'active'
            }
            
            logger.info(f"Created form: {form_id}")
            return form_id
            
        except Exception as e:
            logger.error(f"Error creating form: {str(e)}")
            raise
    
    def _validate_form_config(self, config: Dict) -> bool:
        """Validate form configuration"""
        # Must have at least one field
        if 'fields' not in config or not config['fields']:
            logger.error("Form must have at least one field")
            return False
        
        # Each field must have required properties
        for field in config['fields']:
            if not isinstance(field, dict) or 'name' not in field or 'type' not in field:
                logger.error("Each form field must have a name and type")
                return False
        
        return True
    
    def create_chart(self, config: Dict) -> str:
        """Create new chart element"""
        try:
            chart_id = str(uuid.uuid4())
            
            # Validate chart configuration
            if not self._validate_chart_config(config):
                raise ValueError("Invalid chart configuration")
            
            self.charts[chart_id] = {
                'id': chart_id,
                'type': 'chart',
                'name': config.get('name', f'chart_{chart_id[:8]}'),
                'chart_type': config.get('chart_type', 'bar'),
                'data_source': config.get('data_source', ''),
                'config': config.get('config', {}),
                'responsive': config.get('responsive', True),
                'metadata': config.get('metadata', {}),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'status': 'active'
            }
            
            logger.info(f"Created chart: {chart_id}")
            return chart_id
            
        except Exception as e:
            logger.error(f"Error creating chart: {str(e)}")
            raise
    
    def _validate_chart_config(self, config: Dict) -> bool:
        """Validate chart configuration"""
        # Chart type must be valid
        valid_chart_types = ['bar', 'line', 'pie', 'scatter', 'area', 'doughnut', 'radar']
        if 'chart_type' in config and config['chart_type'] not in valid_chart_types:
            logger.error(f"Invalid chart type. Must be one of: {valid_chart_types}")
            return False
        
        return True
    
    def get_element_info(self, element_id: str, element_type: str) -> Optional[Dict[str, Any]]:
        """Get element information by type and ID"""
        try:
            if element_type == 'container':
                return self.containers.get(element_id)
            elif element_type == 'modal':
                return self.modals.get(element_id)
            elif element_type == 'tabs':
                return self.tabs.get(element_id)
            elif element_type == 'form':
                return self.forms.get(element_id)
            elif element_type == 'chart':
                return self.charts.get(element_id)
            else:
                logger.error(f"Unknown element type: {element_type}")
                return None
        except Exception as e:
            logger.error(f"Error getting element info: {str(e)}")
            return None
    
    def list_elements(self, element_type: str = None) -> List[Dict[str, Any]]:
        """List all elements of a specific type or all elements"""
        try:
            if element_type == 'container':
                return self._list_containers()
            elif element_type == 'modal':
                return self._list_modals()
            elif element_type == 'tabs':
                return self._list_tabs()
            elif element_type == 'form':
                return self._list_forms()
            elif element_type == 'chart':
                return self._list_charts()
            else:
                # Return all elements
                all_elements = []
                all_elements.extend(self._list_containers())
                all_elements.extend(self._list_modals())
                all_elements.extend(self._list_tabs())
                all_elements.extend(self._list_forms())
                all_elements.extend(self._list_charts())
                return all_elements
        except Exception as e:
            logger.error(f"Error listing elements: {str(e)}")
            return []
    
    def _list_containers(self) -> List[Dict[str, Any]]:
        """List container elements"""
        return [
            {
                'id': container['id'],
                'type': 'container',
                'name': container['name'],
                'grid_density': container['grid_density'],
                'children_count': len(container['children']),
                'created_at': container['created_at'],
                'status': container['status']
            }
            for container in self.containers.values()
        ]
    
    def _list_modals(self) -> List[Dict[str, Any]]:
        """List modal elements"""
        return [
            {
                'id': modal['id'],
                'type': 'modal',
                'name': modal['name'],
                'title': modal['title'],
                'width': modal['width'],
                'created_at': modal['created_at'],
                'status': modal['status']
            }
            for modal in self.modals.values()
        ]
    
    def _list_tabs(self) -> List[Dict[str, Any]]:
        """List tabs elements"""
        return [
            {
                'id': tabs['id'],
                'type': 'tabs',
                'name': tabs['name'],
                'tab_count': len(tabs['tabs']),
                'orientation': tabs['orientation'],
                'created_at': tabs['created_at'],
                'status': tabs['status']
            }
            for tabs in self.tabs.values()
        ]
    
    def _list_forms(self) -> List[Dict[str, Any]]:
        """List form elements"""
        return [
            {
                'id': form['id'],
                'type': 'form',
                'name': form['name'],
                'field_count': len(form['fields']),
                'created_at': form['created_at'],
                'status': form['status']
            }
            for form in self.forms.values()
        ]
    
    def _list_charts(self) -> List[Dict[str, Any]]:
        """List chart elements"""
        return [
            {
                'id': chart['id'],
                'type': 'chart',
                'name': chart['name'],
                'chart_type': chart['chart_type'],
                'created_at': chart['created_at'],
                'status': chart['status']
            }
            for chart in self.charts.values()
        ]
    
    def update_element(self, element_id: str, element_type: str, updates: Dict[str, Any]) -> bool:
        """Update element configuration"""
        try:
            element = self.get_element_info(element_id, element_type)
            if not element:
                return False
            
            # Update allowed fields
            allowed_updates = ['name', 'metadata', 'status']
            for field in allowed_updates:
                if field in updates:
                    element[field] = updates[field]
            
            element['updated_at'] = datetime.utcnow()
            return True
            
        except Exception as e:
            logger.error(f"Error updating element: {str(e)}")
            return False
    
    def delete_element(self, element_id: str, element_type: str) -> bool:
        """Delete element"""
        try:
            element = self.get_element_info(element_id, element_type)
            if not element:
                return False
            
            # Soft delete - mark as inactive
            element['status'] = 'deleted'
            element['updated_at'] = datetime.utcnow()
            
            logger.info(f"Deleted {element_type}: {element_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting element: {str(e)}")
            return False 