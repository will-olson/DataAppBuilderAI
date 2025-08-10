#!/usr/bin/env python3
"""
Unified GrowthMarketer AI Server Runner
Supports all Sigma framework modes with clean configuration
"""

import os
import sys
from app import create_app, db
from app.models import User

def main():
    """Main application entry point"""
    
    # Set default environment if not specified
    if 'FLASK_ENV' not in os.environ:
        os.environ['FLASK_ENV'] = 'development'
    
    # Create the Flask app
    app = create_app()
    
    # Create database tables within app context
    with app.app_context():
        db.create_all()
        print(f"✅ Database initialized")
        print(f"✅ Sigma Mode: {app.config.get('SIGMA_MODE', 'standalone')}")
        print(f"✅ Database Mode: {app.config.get('DATABASE_MODE', 'sqlite')}")
    
    # CLI Commands
    @app.cli.command("create-users")
    def create_users():
        """Create a batch of fake users"""
        with app.app_context():
            # Generate and add fake users
            fake_users = User.generate_fake_users(10)
            db.session.add_all(fake_users)
            db.session.commit()
            print(f"✅ Created {len(fake_users)} fake users")
    
    @app.cli.command("list-users")
    def list_users():
        """List all users in the database"""
        with app.app_context():
            users = User.query.all()
            print(f"📊 Total users: {len(users)}")
            for user in users[:5]:  # Show first 5 users
                print(f"  - {user.username} ({user.email})")
            if len(users) > 5:
                print(f"  ... and {len(users) - 5} more users")
    
    @app.cli.command("toggle-sigma")
    def toggle_sigma():
        """Toggle Sigma framework mode"""
        with app.app_context():
            current_mode = app.config.get('SIGMA_MODE', 'standalone')
            print(f"🔄 Current Sigma mode: {current_mode}")
            
            # Cycle through modes
            modes = ['standalone', 'mock_warehouse', 'sigma']
            current_index = modes.index(current_mode)
            next_index = (current_index + 1) % len(modes)
            next_mode = modes[next_index]
            
            print(f"🔄 Switching to: {next_mode}")
            os.environ['SIGMA_MODE'] = next_mode
            print(f"✅ Sigma mode set to: {next_mode}")
            print("🔄 Restart the server to apply changes")
    
    @app.cli.command("sigma-status")
    def sigma_status():
        """Show Sigma framework status"""
        with app.app_context():
            print("🔍 Sigma Framework Status:")
            print(f"  Mode: {app.config.get('SIGMA_MODE', 'standalone')}")
            print(f"  Database: {app.config.get('DATABASE_MODE', 'sqlite')}")
            print(f"  Integration: {'✅ Enabled' if hasattr(app, 'sigma_integration') else '❌ Disabled'}")
            
            if hasattr(app, 'sigma_integration'):
                print(f"  Features: {', '.join(app.config.get('SIGMA_FEATURES', {}).keys())}")
    
    # Run the application
    if __name__ == '__main__':
        print("🚀 Starting GrowthMarketer AI Server...")
        print(f"🌍 Environment: {os.environ.get('FLASK_ENV', 'development')}")
        print(f"🔧 Sigma Mode: {os.environ.get('SIGMA_MODE', 'standalone')}")
        print(f"💾 Database: {os.environ.get('DATABASE_MODE', 'sqlite')}")
        print("📍 Server will be available at: http://localhost:5555")
        print("🔗 API endpoints: http://localhost:5555/api/*")
        print("📊 Sigma endpoints: http://localhost:5555/api/sigma/*")
        print("=" * 60)
        
        app.run(
            host='0.0.0.0',
            port=5555,
            debug=app.config.get('DEBUG', False)
        )

if __name__ == '__main__':
    main()