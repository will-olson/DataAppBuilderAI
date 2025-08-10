#!/usr/bin/env python3
"""
Sigma Framework Demo Script
Demonstrates all capabilities of the Sigma-compatible framework
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

def demo_sigma_standalone_mode():
    """Demonstrate standalone mode capabilities"""
    logger.info("=" * 60)
    logger.info("DEMO: Sigma Framework - Standalone Mode")
    logger.info("=" * 60)
    
    try:
        from sigma import SigmaCompatibilityLayer
        
        # Create standalone layer
        layer = SigmaCompatibilityLayer(enabled=False, mode='standalone')
        
        # Show capabilities
        capabilities = layer.get_capabilities()
        logger.info("Capabilities:")
        for feature, enabled in capabilities.items():
            status = "✅" if enabled else "❌"
            logger.info(f"  {status} {feature}")
        
        # Show mode info
        mode_info = layer.get_mode_info()
        logger.info(f"\nMode Information:")
        logger.info(f"  Status: {mode_info['status']}")
        logger.info(f"  Mode: {mode_info['mode']}")
        
        # Validate compatibility
        compatibility = layer.validate_compatibility()
        logger.info(f"\nCompatibility: {'✅ Compatible' if compatibility['compatible'] else '❌ Issues Found'}")
        if compatibility['issues']:
            for issue in compatibility['issues']:
                logger.info(f"  - {issue}")
        
        return True
        
    except Exception as e:
        logger.error(f"Standalone mode demo failed: {e}")
        return False

def demo_sigma_mock_warehouse_mode():
    """Demonstrate mock warehouse mode capabilities"""
    logger.info("\n" + "=" * 60)
    logger.info("DEMO: Sigma Framework - Mock Warehouse Mode")
    logger.info("=" * 60)
    
    try:
        from sigma import SigmaCompatibilityLayer
        
        # Create mock warehouse layer
        layer = SigmaCompatibilityLayer(enabled=True, mode='mock_warehouse')
        
        # Show capabilities
        capabilities = layer.get_capabilities()
        logger.info("Capabilities:")
        for feature, enabled in capabilities.items():
            status = "✅" if enabled else "❌"
            logger.info(f"  {status} {feature}")
        
        # Test input tables
        if layer.input_tables:
            logger.info("\n--- Input Tables Demo ---")
            
            # Create a sample table
            table_config = {
                'name': 'demo_users',
                'type': 'csv',
                'columns': [
                    {'name': 'id', 'type': 'INTEGER', 'primary_key': True},
                    {'name': 'name', 'type': 'VARCHAR', 'length': 100},
                    {'name': 'email', 'type': 'VARCHAR', 'length': 255},
                    {'name': 'age', 'type': 'INTEGER'},
                    {'name': 'created_at', 'type': 'TIMESTAMP'}
                ],
                'validation_rules': {
                    'email': {'pattern': r'^[^@]+@[^@]+\.[^@]+$', 'message': 'Invalid email format'},
                    'age': {'min': 0, 'max': 120, 'message': 'Age must be between 0 and 120'}
                }
            }
            
            table_id = layer.input_tables.create_table(table_config)
            logger.info(f"✅ Created input table: {table_id}")
            
            # Insert sample data
            sample_data = [
                {'id': 1, 'name': 'John Doe', 'email': 'john@example.com', 'age': 30, 'created_at': '2024-01-01'},
                {'id': 2, 'name': 'Jane Smith', 'email': 'jane@example.com', 'age': 25, 'created_at': '2024-01-02'},
                {'id': 3, 'name': 'Bob Johnson', 'email': 'bob@example.com', 'age': 35, 'created_at': '2024-01-03'}
            ]
            
            result = layer.input_tables.insert_data(table_id, sample_data)
            if result['success']:
                logger.info(f"✅ Inserted {len(sample_data)} records")
            else:
                logger.warning(f"⚠️ Data insertion failed: {result['error']}")
            
            # List tables
            tables = layer.input_tables.list_tables()
            logger.info(f"📋 Available tables: {len(tables)}")
            for table in tables:
                logger.info(f"  - {table['name']} ({table['type']})")
        
        # Test layout elements
        if layer.layout_elements:
            logger.info("\n--- Layout Elements Demo ---")
            
            # Create a container
            container_config = {
                'name': 'main_dashboard',
                'type': 'container',
                'grid_density': 12,
                'spacing': 'medium',
                'padding': 'large',
                'background': 'white',
                'responsive': True
            }
            
            container_id = layer.layout_elements.create_container(container_config)
            logger.info(f"✅ Created container: {container_id}")
            
            # Create a chart element
            chart_config = {
                'name': 'user_metrics_chart',
                'type': 'chart',
                'chart_type': 'bar',
                'data_source': 'demo_users',
                'x_axis': 'age',
                'y_axis': 'count',
                'title': 'User Age Distribution'
            }
            
            chart_id = layer.layout_elements.create_chart(chart_config)
            logger.info(f"✅ Created chart: {chart_id}")
            
            # List elements
            elements = layer.layout_elements.list_elements()
            logger.info(f"📋 Available elements: {len(elements)}")
            for element in elements:
                logger.info(f"  - {element['name']} ({element['type']})")
        
        # Test actions
        if layer.actions:
            logger.info("\n--- Actions Demo ---")
            
            # Create a navigation action
            nav_action_config = {
                'name': 'go_to_dashboard',
                'type': 'navigation',
                'parameters': {
                    'target': '/dashboard',
                    'method': 'GET'
                },
                'conditions': {
                    'user_authenticated': True,
                    'user_role': ['admin', 'user']
                }
            }
            
            nav_action_id = layer.actions.create_action(nav_action_config)
            logger.info(f"✅ Created navigation action: {nav_action_id}")
            
            # Create a data operation action
            data_action_config = {
                'name': 'refresh_user_data',
                'type': 'data_operation',
                'parameters': {
                    'operation': 'refresh',
                    'table': 'demo_users',
                    'source': 'csv'
                },
                'conditions': {
                    'last_refresh': '>1h'
                }
            }
            
            data_action_id = layer.actions.create_action(data_action_config)
            logger.info(f"✅ Created data action: {data_action_id}")
            
            # List actions
            actions = layer.actions.list_actions()
            logger.info(f"📋 Available actions: {len(actions)}")
            for action in actions:
                logger.info(f"  - {action['name']} ({action['type']})")
            
            # Execute an action
            context = {'user_authenticated': True, 'user_role': 'admin'}
            result = layer.actions.execute_action(nav_action_id, context)
            logger.info(f"✅ Executed action result: {result}")
        
        return True
        
    except Exception as e:
        logger.error(f"Mock warehouse mode demo failed: {e}")
        return False

def demo_database_adapters():
    """Demonstrate database adapter capabilities"""
    logger.info("\n" + "=" * 60)
    logger.info("DEMO: Database Adapters")
    logger.info("=" * 60)
    
    try:
        from database import create_database_adapter
        from config import config
        
        # Test mock warehouse adapter
        mock_config = config['MockWarehouseConfig']()
        adapter = create_database_adapter(mock_config)
        
        logger.info(f"✅ Created adapter: {adapter.__class__.__name__}")
        
        # Show capabilities
        capabilities = adapter.get_capabilities()
        logger.info("Capabilities:")
        for feature, enabled in capabilities.items():
            status = "✅" if enabled else "❌"
            logger.info(f"  {status} {feature}")
        
        # Test health check
        health = adapter.health_check()
        logger.info(f"\nHealth Status:")
        for key, value in health.items():
            logger.info(f"  {key}: {value}")
        
        # Test table creation
        schema = {
            'columns': [
                {'name': 'id', 'type': 'INTEGER', 'primary_key': True},
                {'name': 'name', 'type': 'VARCHAR', 'length': 100},
                {'name': 'value', 'type': 'DECIMAL', 'precision': 10, 'scale': 2}
            ]
        }
        
        success = adapter.create_table('demo_table', schema)
        logger.info(f"✅ Table creation: {'Success' if success else 'Failed'}")
        
        # Test data insertion
        data = [
            {'id': 1, 'name': 'Item 1', 'value': 10.50},
            {'id': 2, 'name': 'Item 2', 'value': 25.75},
            {'id': 3, 'name': 'Item 3', 'value': 100.00}
        ]
        
        success = adapter.insert_data('demo_table', data)
        logger.info(f"✅ Data insertion: {'Success' if success else 'Failed'}")
        
        # Test query execution
        query = "SELECT * FROM demo_table WHERE value > 20"
        results = adapter.execute_query(query)
        logger.info(f"✅ Query execution: {len(results)} results")
        for row in results:
            logger.info(f"  - {row}")
        
        return True
        
    except Exception as e:
        logger.error(f"Database adapters demo failed: {e}")
        return False

def demo_flask_integration():
    """Demonstrate Flask app integration"""
    logger.info("\n" + "=" * 60)
    logger.info("DEMO: Flask App Integration")
    logger.info("=" * 60)
    
    try:
        from app import create_app
        from config import config
        
        # Test standalone app
        standalone_app = create_app(config['default'])
        logger.info(f"✅ Standalone app created: {standalone_app.__class__.__name__}")
        logger.info(f"  SIGMA_MODE: {standalone_app.config.get('SIGMA_MODE')}")
        logger.info(f"  DATABASE_MODE: {standalone_app.config.get('DATABASE_MODE')}")
        
        # Test mock warehouse app
        mock_app = create_app(config['MockWarehouseConfig'])
        logger.info(f"✅ Mock warehouse app created: {mock_app.__class__.__name__}")
        logger.info(f"  SIGMA_MODE: {mock_app.config.get('SIGMA_MODE')}")
        logger.info(f"  DATABASE_MODE: {mock_app.config.get('DATABASE_MODE')}")
        
        # Check Sigma integration
        if hasattr(mock_app, 'sigma_integration'):
            logger.info(f"✅ Sigma integration found: {mock_app.sigma_integration}")
            status = mock_app.sigma_integration.get_sigma_status()
            logger.info(f"  Integration status: {status}")
        else:
            logger.warning("⚠️ Sigma integration not found")
        
        # Check routes
        routes = []
        for rule in mock_app.url_map.iter_rules():
            if rule.endpoint != 'static':
                routes.append(f"{rule.rule} [{', '.join(rule.methods)}]")
        
        logger.info(f"📋 Available routes: {len(routes)}")
        for route in routes[:10]:  # Show first 10 routes
            logger.info(f"  - {route}")
        if len(routes) > 10:
            logger.info(f"  ... and {len(routes) - 10} more routes")
        
        return True
        
    except Exception as e:
        logger.error(f"Flask integration demo failed: {e}")
        return False

def run_complete_demo():
    """Run the complete Sigma framework demo"""
    logger.info("🚀 Starting Sigma Framework Complete Demo")
    logger.info("This demo showcases all capabilities of the Sigma-compatible framework")
    
    demos = [
        ("Standalone Mode", demo_sigma_standalone_mode),
        ("Mock Warehouse Mode", demo_sigma_mock_warehouse_mode),
        ("Database Adapters", demo_database_adapters),
        ("Flask Integration", demo_flask_integration)
    ]
    
    results = []
    
    for demo_name, demo_func in demos:
        try:
            success = demo_func()
            results.append((demo_name, success))
            if success:
                logger.info(f"✅ {demo_name} demo completed successfully")
            else:
                logger.error(f"❌ {demo_name} demo failed")
        except Exception as e:
            logger.error(f"❌ {demo_name} demo failed with exception: {e}")
            results.append((demo_name, False))
    
    # Summary
    logger.info("\n" + "=" * 60)
    logger.info("Demo Results Summary")
    logger.info("=" * 60)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for demo_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        logger.info(f"{status} {demo_name}")
    
    logger.info(f"\nOverall: {passed}/{total} demos completed successfully")
    
    if passed == total:
        logger.info("🎉 All demos completed successfully!")
        logger.info("The Sigma framework is fully functional and ready for use.")
    else:
        logger.warning(f"⚠️ {total - passed} demos failed. Please check the errors above.")
    
    return passed == total

if __name__ == "__main__":
    success = run_complete_demo()
    sys.exit(0 if success else 1) 