#!/usr/bin/env python3
"""
Sigma Framework Application Runner
This script allows you to run the application in different Sigma framework modes.
"""

import os
import sys
import argparse
import logging
from pathlib import Path

# Add the server directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def setup_environment(mode):
    """Set up environment variables for the specified mode"""
    
    if mode == 'standalone':
        os.environ['SIGMA_MODE'] = 'standalone'
        os.environ['DATABASE_MODE'] = 'sqlite'
        print("🌐 Running in STANDALONE mode (SQLite)")
        
    elif mode == 'mock':
        os.environ['SIGMA_MODE'] = 'mock_warehouse'
        os.environ['DATABASE_MODE'] = 'mock_warehouse'
        os.environ['MOCK_WAREHOUSE_ENABLED'] = 'true'
        os.environ['MOCK_WAREHOUSE_DATA_PATH'] = 'server/mock_warehouse/data'
        os.environ['MOCK_WAREHOUSE_SCHEMA_PATH'] = 'server/mock_warehouse/schemas'
        os.environ['MOCK_WAREHOUSE_AUTO_SYNC'] = 'true'
        print("🧪 Running in MOCK WAREHOUSE mode (Local Sigma Testing)")
        
    elif mode == 'sigma':
        os.environ['SIGMA_MODE'] = 'sigma'
        os.environ['DATABASE_MODE'] = 'real_warehouse'
        os.environ['SIGMA_INTEGRATION_ENABLED'] = 'true'
        print("🚀 Running in SIGMA INTEGRATION mode (Production)")
        
        # Check for required Sigma environment variables
        required_vars = [
            'SNOWFLAKE_ACCOUNT', 'SNOWFLAKE_USER', 'SNOWFLAKE_PASSWORD',
            'SNOWFLAKE_WAREHOUSE', 'SNOWFLAKE_DATABASE', 'SNOWFLAKE_SCHEMA'
        ]
        
        missing_vars = [var for var in required_vars if not os.environ.get(var)]
        if missing_vars:
            print(f"⚠️  Warning: Missing required environment variables: {', '.join(missing_vars)}")
            print("   Please set these variables before running in Sigma mode")
    
    # Set common environment variables
    os.environ['DEBUG'] = 'true'
    os.environ['FLASK_ENV'] = 'development'

def run_application(mode, port=5000, host='0.0.0.0'):
    """Run the Flask application in the specified mode"""
    
    try:
        setup_environment(mode)
        
        # Import and create the application
        from app import create_app
        
        # Create app with appropriate configuration
        if mode == 'standalone':
            app = create_app('development')
        elif mode == 'mock':
            app = create_app('mock_warehouse')
        elif mode == 'sigma':
            app = create_app('sigma')
        else:
            app = create_app('default')
        
        print(f"✅ Application created successfully in {mode} mode")
        print(f"🌐 Starting server on {host}:{port}")
        print(f"📊 Sigma Mode: {app.config['SIGMA_MODE']}")
        print(f"🗄️  Database Mode: {app.config['DATABASE_MODE']}")
        
        # Display Sigma capabilities
        if hasattr(app, 'sigma_layer'):
            capabilities = app.sigma_layer.get_capabilities()
            print(f"🔧 Sigma Capabilities: {capabilities}")
        
        # Display database capabilities
        if hasattr(app, 'db_adapter'):
            db_capabilities = app.db_adapter.get_capabilities()
            print(f"💾 Database Capabilities: {db_capabilities}")
        
        print("\n" + "="*60)
        print("🚀 Application is running!")
        print(f"📱 Frontend: http://localhost:{port}")
        print(f"🔌 API Status: http://localhost:{port}/api/sigma/status")
        print(f"💾 Database Health: http://localhost:{port}/api/database/health")
        print("="*60)
        print("Press Ctrl+C to stop the server")
        
        # Run the application
        app.run(host=host, port=port, debug=True)
        
    except Exception as e:
        print(f"❌ Error starting application: {e}")
        print("Please check your configuration and try again.")
        sys.exit(1)

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(description='Run GrowthMarketer AI in different Sigma framework modes')
    parser.add_argument('mode', choices=['standalone', 'mock', 'sigma'], 
                       help='Mode to run the application in')
    parser.add_argument('--port', '-p', type=int, default=5000,
                       help='Port to run the server on (default: 5000)')
    parser.add_argument('--host', '-H', default='0.0.0.0',
                       help='Host to bind the server to (default: 0.0.0.0)')
    
    args = parser.parse_args()
    
    print("🚀 GrowthMarketer AI - Sigma Framework Runner")
    print("=" * 60)
    
    run_application(args.mode, args.port, args.host)

if __name__ == "__main__":
    main() 