#!/usr/bin/env python3
"""
Complete Sigma Framework Integration Test
Tests all components of the Sigma-compatible framework
"""

import os
import sys
import json
import logging
from datetime import datetime

# Add server directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_configuration():
    """Test configuration loading and validation"""
    logger.info("Testing configuration...")
    
    try:
        from config import config
        
        # Test default config
        default_config = config['default']()
        logger.info(f"✅ Default config loaded: {default_config.__class__.__name__}")
        logger.info(f"   SIGMA_MODE: {default_config.SIGMA_MODE}")
        logger.info(f"   DATABASE_MODE: {default_config.DATABASE_MODE}")
        
        # Test mock warehouse config
        mock_config = config['MockWarehouseConfig']()
        logger.info(f"✅ Mock warehouse config loaded: {mock_config.__class__.__name__}")
        logger.info(f"   SIGMA_MODE: {mock_config.SIGMA_MODE}")
        logger.info(f"   DATABASE_MODE: {mock_config.DATABASE_MODE}")
        
        # Test Sigma config
        sigma_config = config['SigmaConfig']()
        logger.info(f"✅ Sigma config loaded: {sigma_config.__class__.__name__}")
        logger.info(f"   SIGMA_MODE: {sigma_config.SIGMA_MODE}")
        logger.info(f"   DATABASE_MODE: {sigma_config.DATABASE_MODE}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Configuration test failed: {e}")
        return False

def test_sigma_components():
    """Test individual Sigma framework components"""
    logger.info("Testing Sigma framework components...")
    
    try:
        # Test Sigma compatibility layer
        from sigma import SigmaCompatibilityLayer
        
        # Test standalone mode
        standalone_layer = SigmaCompatibilityLayer(enabled=False, mode='standalone')
        logger.info(f"✅ Standalone layer created: {standalone_layer.__class__.__name__}")
        logger.info(f"   Enabled: {standalone_layer.enabled}")
        logger.info(f"   Mode: {standalone_layer.mode}")
        
        # Test mock warehouse mode
        mock_layer = SigmaCompatibilityLayer(enabled=True, mode='mock_warehouse')
        logger.info(f"✅ Mock warehouse layer created: {mock_layer.__class__.__name__}")
        logger.info(f"   Enabled: {mock_layer.enabled}")
        logger.info(f"   Mode: {mock_layer.mode}")
        
        # Test capabilities
        standalone_caps = standalone_layer.get_capabilities()
        mock_caps = mock_layer.get_capabilities()
        
        logger.info(f"   Standalone capabilities: {standalone_caps}")
        logger.info(f"   Mock warehouse capabilities: {mock_caps}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Sigma components test failed: {e}")
        return False

def test_database_adapters():
    """Test database adapter creation and functionality"""
    logger.info("Testing database adapters...")
    
    try:
        from database import create_database_adapter
        from config import config
        
        # Test mock warehouse adapter
        mock_config = config['MockWarehouseConfig']()
        mock_adapter = create_database_adapter(mock_config)
        logger.info(f"✅ Mock warehouse adapter created: {mock_adapter.__class__.__name__}")
        
        # Test capabilities
        capabilities = mock_adapter.get_capabilities()
        logger.info(f"   Capabilities: {capabilities}")
        
        # Test health check
        health = mock_adapter.health_check()
        logger.info(f"   Health: {health}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Database adapters test failed: {e}")
        return False

def test_sigma_integration():
    """Test Sigma integration module"""
    logger.info("Testing Sigma integration module...")
    
    try:
        from sigma_integration import SigmaIntegration
        
        # Create integration instance
        integration = SigmaIntegration()
        logger.info(f"✅ Sigma integration created: {integration.__class__.__name__}")
        
        # Test status
        status = integration.get_sigma_status()
        logger.info(f"   Status: {status}")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Sigma integration test failed: {e}")
        return False

def test_mock_warehouse_data():
    """Test mock warehouse data and schema"""
    logger.info("Testing mock warehouse data...")
    
    try:
        # Check data directory
        data_path = "mock_warehouse/data"
        if os.path.exists(data_path):
            files = os.listdir(data_path)
            logger.info(f"✅ Mock data directory found: {len(files)} files")
            for file in files:
                logger.info(f"   - {file}")
        else:
            logger.warning("⚠️ Mock data directory not found")
        
        # Check schema directory
        schema_path = "mock_warehouse/schemas"
        if os.path.exists(schema_path):
            files = os.listdir(schema_path)
            logger.info(f"✅ Schema directory found: {len(files)} files")
            for file in files:
                logger.info(f"   - {file}")
        else:
            logger.warning("⚠️ Schema directory not found")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Mock warehouse data test failed: {e}")
        return False

def test_flask_integration():
    """Test Flask app integration with Sigma framework"""
    logger.info("Testing Flask app integration...")
    
    try:
        from app import create_app
        from config import config
        
        # Test standalone app creation
        standalone_app = create_app(config['default'])
        logger.info(f"✅ Standalone app created: {standalone_app.__class__.__name__}")
        logger.info(f"   SIGMA_MODE: {standalone_app.config.get('SIGMA_MODE')}")
        
        # Test mock warehouse app creation
        mock_app = create_app(config['MockWarehouseConfig'])
        logger.info(f"✅ Mock warehouse app created: {mock_app.__class__.__name__}")
        logger.info(f"   SIGMA_MODE: {mock_app.config.get('SIGMA_MODE')}")
        
        # Check if Sigma integration was initialized
        if hasattr(mock_app, 'sigma_integration'):
            logger.info(f"   Sigma integration: {mock_app.sigma_integration}")
        else:
            logger.warning("   Sigma integration not found")
        
        return True
        
    except Exception as e:
        logger.error(f"❌ Flask integration test failed: {e}")
        return False

def run_comprehensive_test():
    """Run all tests and provide summary"""
    logger.info("=" * 60)
    logger.info("Starting Comprehensive Sigma Framework Test")
    logger.info("=" * 60)
    
    tests = [
        ("Configuration", test_configuration),
        ("Sigma Components", test_sigma_components),
        ("Database Adapters", test_database_adapters),
        ("Sigma Integration", test_sigma_integration),
        ("Mock Warehouse Data", test_mock_warehouse_data),
        ("Flask Integration", test_flask_integration)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        logger.info(f"\n--- Testing {test_name} ---")
        try:
            success = test_func()
            results.append((test_name, success))
            if success:
                logger.info(f"✅ {test_name} test passed")
            else:
                logger.error(f"❌ {test_name} test failed")
        except Exception as e:
            logger.error(f"❌ {test_name} test failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("Test Results Summary")
    logger.info("=" * 60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        logger.info(f"{status} {test_name}")
    
    logger.info(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        logger.info("🎉 All tests passed! Sigma framework is fully functional.")
    else:
        logger.warning(f"⚠️ {total - passed} tests failed. Please check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = run_comprehensive_test()
    sys.exit(0 if success else 1) 