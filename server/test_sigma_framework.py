#!/usr/bin/env python3
"""
Test script for Sigma Framework Integration
This script tests the basic functionality of the Sigma framework components.
"""

import os
import sys
import logging

# Add the server directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_configuration():
    """Test configuration loading"""
    logger.info("Testing configuration...")
    
    try:
        from config import config, DevelopmentConfig, MockWarehouseConfig, SigmaConfig
        
        # Test default config
        default_config = config['default']
        logger.info(f"Default config: {default_config.__name__}")
        logger.info(f"Default SIGMA_MODE: {default_config.SIGMA_MODE}")
        logger.info(f"Default DATABASE_MODE: {default_config.DATABASE_MODE}")
        
        # Test mock warehouse config
        mock_config = config['mock_warehouse']
        logger.info(f"Mock warehouse config: {mock_config.__name__}")
        logger.info(f"Mock SIGMA_MODE: {mock_config.SIGMA_MODE}")
        logger.info(f"Mock DATABASE_MODE: {mock_config.DATABASE_MODE}")
        
        # Test sigma config
        sigma_config = config['sigma']
        logger.info(f"Sigma config: {sigma_config.__name__}")
        logger.info(f"Sigma SIGMA_MODE: {sigma_config.SIGMA_MODE}")
        logger.info(f"Sigma DATABASE_MODE: {sigma_config.DATABASE_MODE}")
        
        logger.info("✅ Configuration test passed")
        return True
        
    except Exception as e:
        logger.error(f"❌ Configuration test failed: {e}")
        return False

def test_database_adapters():
    """Test database adapter creation"""
    logger.info("Testing database adapters...")
    
    try:
        from database import create_database_adapter
        from config import DevelopmentConfig
        
        # Test SQLite adapter creation
        config = DevelopmentConfig()
        adapter = create_database_adapter(config)
        
        logger.info(f"Created adapter: {type(adapter).__name__}")
        logger.info(f"Adapter capabilities: {adapter.get_capabilities()}")
        
        # Test health check
        health = adapter.health_check()
        logger.info(f"Health check: {health}")
        
        logger.info("✅ Database adapters test passed")
        return True
        
    except Exception as e:
        logger.error(f"❌ Database adapters test failed: {e}")
        return False

def test_sigma_layer():
    """Test Sigma compatibility layer"""
    logger.info("Testing Sigma compatibility layer...")
    
    try:
        from sigma import create_sigma_layer, SigmaCompatibilityLayer
        from config import DevelopmentConfig, MockWarehouseConfig
        
        # Test standalone mode
        standalone_config = DevelopmentConfig()
        standalone_layer = create_sigma_layer(standalone_config)
        
        logger.info(f"Standalone layer: {type(standalone_layer).__name__}")
        logger.info(f"Standalone capabilities: {standalone_layer.get_capabilities()}")
        logger.info(f"Standalone mode info: {standalone_layer.get_mode_info()}")
        
        # Test mock warehouse mode
        mock_config = MockWarehouseConfig()
        mock_layer = create_sigma_layer(mock_config)
        
        logger.info(f"Mock warehouse layer: {type(mock_layer).__name__}")
        logger.info(f"Mock warehouse capabilities: {mock_layer.get_capabilities()}")
        logger.info(f"Mock warehouse mode info: {mock_layer.get_mode_info()}")
        
        # Test compatibility validation
        standalone_compat = standalone_layer.validate_compatibility()
        mock_compat = mock_layer.validate_compatibility()
        
        logger.info(f"Standalone compatibility: {standalone_compat}")
        logger.info(f"Mock warehouse compatibility: {mock_compat}")
        
        logger.info("✅ Sigma layer test passed")
        return True
        
    except Exception as e:
        logger.error(f"❌ Sigma layer test failed: {e}")
        return False

def test_application_factory():
    """Test application factory creation"""
    logger.info("Testing application factory...")
    
    try:
        from app import create_app
        from config import DevelopmentConfig, MockWarehouseConfig
        
        # Test standalone app creation
        standalone_app = create_app('development')
        logger.info(f"Standalone app created: {type(standalone_app).__name__}")
        logger.info(f"Standalone app config: {standalone_app.config['SIGMA_MODE']}")
        
        # Test mock warehouse app creation
        mock_app = create_app('mock_warehouse')
        logger.info(f"Mock warehouse app created: {type(mock_app).__name__}")
        logger.info(f"Mock warehouse app config: {mock_app.config['SIGMA_MODE']}")
        
        # Test app components
        logger.info(f"Standalone app has db_adapter: {hasattr(standalone_app, 'db_adapter')}")
        logger.info(f"Standalone app has sigma_layer: {hasattr(standalone_app, 'sigma_layer')}")
        logger.info(f"Mock warehouse app has db_adapter: {hasattr(mock_app, 'db_adapter')}")
        logger.info(f"Mock warehouse app has sigma_layer: {hasattr(mock_app, 'sigma_layer')}")
        
        logger.info("✅ Application factory test passed")
        return True
        
    except Exception as e:
        logger.error(f"❌ Application factory test failed: {e}")
        return False

def main():
    """Run all tests"""
    logger.info("Starting Sigma Framework Integration Tests")
    logger.info("=" * 50)
    
    tests = [
        test_configuration,
        test_database_adapters,
        test_sigma_layer,
        test_application_factory
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
        except Exception as e:
            logger.error(f"Test {test.__name__} crashed: {e}")
    
    logger.info("=" * 50)
    logger.info(f"Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        logger.info("🎉 All tests passed! Sigma framework integration is working.")
        return 0
    else:
        logger.error("❌ Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 