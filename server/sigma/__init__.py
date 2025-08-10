from typing import Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class SigmaCompatibilityLayer:
    """Optional layer that enables Sigma platform integration"""
    
    def __init__(self, enabled: bool = False, mode: str = 'standalone'):
        self.enabled = enabled
        self.mode = mode
        
        # Initialize Sigma components based on mode
        if enabled:
            from .input_tables import SigmaInputTables
            from .layout_elements import SigmaLayoutElements
            from .actions import SigmaActions
            
            self.input_tables = SigmaInputTables()
            self.layout_elements = SigmaLayoutElements()
            self.actions = SigmaActions()
            logger.info(f"Sigma compatibility layer enabled in {mode} mode")
        else:
            self.input_tables = None
            self.layout_elements = None
            self.actions = None
            logger.info("Sigma compatibility layer disabled (standalone mode)")
    
    def is_sigma_mode(self) -> bool:
        """Check if running in Sigma compatibility mode"""
        return self.enabled and self.mode in ['mock_warehouse', 'sigma']
    
    def get_capabilities(self) -> Dict[str, bool]:
        """Return available Sigma capabilities"""
        return {
            'input_tables': self.input_tables is not None,
            'layout_elements': self.layout_elements is not None,
            'actions': self.actions is not None,
            'real_time_sync': self.is_sigma_mode(),
            'warehouse_ai': self.mode == 'sigma',
            'mock_warehouse': self.mode == 'mock_warehouse'
        }
    
    def get_mode_info(self) -> Dict[str, Any]:
        """Return detailed information about current mode"""
        return {
            'enabled': self.enabled,
            'mode': self.mode,
            'capabilities': self.get_capabilities(),
            'status': 'active' if self.enabled else 'disabled'
        }
    
    def validate_compatibility(self) -> Dict[str, Any]:
        """Validate Sigma compatibility requirements"""
        if not self.enabled:
            return {'compatible': True, 'mode': 'standalone', 'issues': []}
        
        issues = []
        
        # Check if all required components are available
        if not self.input_tables:
            issues.append("Input tables component not available")
        if not self.layout_elements:
            issues.append("Layout elements component not available")
        if not self.actions:
            issues.append("Actions component not available")
        
        return {
            'compatible': len(issues) == 0,
            'mode': self.mode,
            'issues': issues,
            'capabilities': self.get_capabilities()
        }

def create_sigma_layer(config):
    """Create Sigma compatibility layer based on configuration"""
    
    try:
        # Handle different config object types
        if hasattr(config, 'get'):
            # Flask config object or dict-like object
            sigma_mode = config.get('SIGMA_MODE', 'standalone')
        elif hasattr(config, 'SIGMA_MODE'):
            # Config class object
            sigma_mode = config.SIGMA_MODE
        else:
            # Fallback to standalone mode
            logger.warning(f"Unknown config object type: {type(config)}, falling back to standalone mode")
            return SigmaCompatibilityLayer(enabled=False, mode='standalone')
        
        if sigma_mode == 'standalone':
            return SigmaCompatibilityLayer(enabled=False, mode='standalone')
        
        elif sigma_mode == 'mock_warehouse':
            return SigmaCompatibilityLayer(enabled=True, mode='mock_warehouse')
        
        elif sigma_mode == 'sigma':
            return SigmaCompatibilityLayer(enabled=True, mode='sigma')
        
        else:
            logger.warning(f"Unsupported Sigma mode: {sigma_mode}, falling back to standalone mode")
            return SigmaCompatibilityLayer(enabled=False, mode='standalone')
    
    except Exception as e:
        logger.error(f"Failed to create Sigma layer: {e}")
        # Fallback to standalone mode
        return SigmaCompatibilityLayer(enabled=False, mode='standalone') 