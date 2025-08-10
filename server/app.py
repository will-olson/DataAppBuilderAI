# server/app.py - Updated with Sigma Framework Integration
from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import text
from app.models import User
from config import config
from database import create_database_adapter
from sigma import create_sigma_layer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app(config_name='default'):
    """Application factory with Sigma compatibility"""
    
    # Load configuration
    config_class = config.get(config_name, config['default'])
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize CORS
    CORS(app)
    
    # Initialize database abstraction layer
    db_adapter = create_database_adapter(config_class())
    
    # Initialize Sigma compatibility layer
    sigma_layer = create_sigma_layer(config_class())
    
    # Register database adapter and sigma layer with app context
    app.db_adapter = db_adapter
    app.sigma_layer = sigma_layer
    
    # Log initialization
    logger.info(f"Application initialized in {app.config['SIGMA_MODE']} mode")
    logger.info(f"Database mode: {app.config['DATABASE_MODE']}")
    
    # Register blueprints and routes
    register_routes(app)
    
    return app

def create_database_adapter(config_obj):
    """Create appropriate database adapter based on configuration"""
    
    try:
        if config_obj.DATABASE_MODE == 'sqlite':
            from database.sqlite_adapter import SQLiteAdapter
            from app import db  # Import existing db instance
            return SQLiteAdapter(db.session)
        
        elif config_obj.DATABASE_MODE == 'mock_warehouse':
            from database.mock_warehouse import MockWarehouseAdapter
            return MockWarehouseAdapter(config_obj.MOCK_WAREHOUSE_CONFIG['data_path'])
        
        elif config_obj.DATABASE_MODE == 'real_warehouse':
            from database.sigma_adapter import SigmaWarehouseAdapter
            return SigmaWarehouseAdapter(config_obj.SIGMA_INTEGRATION_CONFIG['warehouse_config'])
        
        else:
            raise ValueError(f"Unsupported database mode: {config_obj.DATABASE_MODE}")
    
    except Exception as e:
        logger.error(f"Failed to create database adapter: {e}")
        # Fallback to SQLite
        from database.sqlite_adapter import SQLiteAdapter
        from app import db
        return SQLiteAdapter(db.session)

def create_sigma_layer(config_obj):
    """Create Sigma compatibility layer based on configuration"""
    
    try:
        if config_obj.SIGMA_MODE == 'standalone':
            from sigma import SigmaCompatibilityLayer
            return SigmaCompatibilityLayer(enabled=False, mode='standalone')
        
        elif config_obj.SIGMA_MODE == 'mock_warehouse':
            from sigma import SigmaCompatibilityLayer
            return SigmaCompatibilityLayer(enabled=True, mode='mock_warehouse')
        
        elif config_obj.SIGMA_MODE == 'sigma':
            from sigma import SigmaCompatibilityLayer
            return SigmaCompatibilityLayer(enabled=True, mode='sigma')
        
        else:
            raise ValueError(f"Unsupported Sigma mode: {config_obj.SIGMA_MODE}")
    
    except Exception as e:
        logger.error(f"Failed to create Sigma layer: {e}")
        # Fallback to standalone mode
        from sigma import SigmaCompatibilityLayer
        return SigmaCompatibilityLayer(enabled=False, mode='standalone')

def register_routes(app):
    """Register all application routes"""
    
    # Sigma Framework Status Endpoint
    @app.route('/api/sigma/status', methods=['GET'])
    def get_sigma_status():
        """Get Sigma framework status"""
        try:
            status = {
                'sigma_mode': app.config['SIGMA_MODE'],
                'database_mode': app.config['DATABASE_MODE'],
                'sigma_layer': app.sigma_layer.get_mode_info() if app.sigma_layer else None,
                'database_adapter': app.db_adapter.get_capabilities() if app.db_adapter else None
            }
            return jsonify(status)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Sigma Framework Capabilities Endpoint
    @app.route('/api/sigma/capabilities', methods=['GET'])
    def get_sigma_capabilities():
        """Get Sigma framework capabilities"""
        try:
            if app.sigma_layer:
                capabilities = app.sigma_layer.get_capabilities()
                return jsonify(capabilities)
            else:
                return jsonify({'error': 'Sigma layer not available'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Database Health Check Endpoint
    @app.route('/api/database/health', methods=['GET'])
    def get_database_health():
        """Get database health status"""
        try:
            if app.db_adapter:
                health = app.db_adapter.health_check()
                return jsonify(health)
            else:
                return jsonify({'error': 'Database adapter not available'}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Existing API Routes (Updated to use database abstraction)
    @app.route('/api/segments', methods=['GET'])
    def get_user_segments():
        try:
            # Use database abstraction layer
            query = """
                SELECT 
                    CASE 
                        WHEN engagement_score >= 0.7 THEN 'High Engagement'
                        WHEN engagement_score >= 0.4 THEN 'Medium Engagement'
                        ELSE 'Low Engagement'
                    END AS segment,
                    COUNT(*) as user_count,
                    AVG(lifetime_value) as avg_ltv,
                    AVG(churn_risk) as avg_churn_risk
                FROM users
                GROUP BY segment
            """
            
            segments = app.db_adapter.execute_query(query)
            
            # Format response
            formatted_segments = [
                {
                    'name': row['segment'],
                    'userCount': row['user_count'],
                    'avgLTV': float(row['avg_ltv']),
                    'avgChurnRisk': float(row['avg_churn_risk'])
                }
                for row in segments
            ]
            
            return jsonify(formatted_segments)
        except Exception as e:
            logger.error(f"Error in get_user_segments: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/user-journey', methods=['GET'])
    def get_user_journey():
        try:
            journey_query = """
                SELECT 
                    CASE 
                        WHEN account_age_days <= 30 THEN 'Onboarding'
                        WHEN total_sessions > 100 THEN 'Power User'
                        WHEN total_sessions > 50 THEN 'Active User'
                        ELSE 'Casual User'
                    END AS stage,
                    COUNT(*) as user_count,
                    AVG(lifetime_value) as avg_ltv,
                    AVG(churn_risk) as avg_churn_risk
                FROM users
                GROUP BY stage
            """
            
            journey_data = app.db_adapter.execute_query(journey_query)
            
            formatted_journey = [
                {
                    'stage': row['stage'],
                    'userCount': row['user_count'],
                    'avgLTV': float(row['avg_ltv']),
                    'avgChurnRisk': float(row['avg_churn_risk'])
                }
                for row in journey_data
            ]
            
            return jsonify(formatted_journey)
        except Exception as e:
            logger.error(f"Error in get_user_journey: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/personalization', methods=['GET'])
    def get_personalization():
        try:
            content_pref_query = """
                SELECT 
                    preferred_content_type as type,
                    COUNT(*) as user_count,
                    AVG(engagement_score) as avg_engagement
                FROM users
                GROUP BY type
            """
            
            comm_pref_query = """
                SELECT 
                    communication_preference as channel,
                    COUNT(*) as user_count,
                    AVG(email_open_rate) as avg_open_rate
                FROM users
                GROUP BY channel
            """
            
            content_prefs = app.db_adapter.execute_query(content_pref_query)
            comm_prefs = app.db_adapter.execute_query(comm_pref_query)
            
            return jsonify({
                'contentPreferences': [
                    {
                        'type': row['type'],
                        'userCount': row['user_count'],
                        'avgEngagement': float(row['avg_engagement'])
                    }
                    for row in content_prefs
                ],
                'communicationPreferences': [
                    {
                        'channel': row['channel'],
                        'userCount': row['user_count'],
                        'avgOpenRate': float(row['avg_open_rate'])
                    }
                    for row in comm_prefs
                ]
            })
        except Exception as e:
            logger.error(f"Error in get_personalization: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/feature-usage', methods=['GET'])
    def get_feature_usage():
        try:
            feature_usage_query = """
                SELECT 
                    CASE 
                        WHEN engagement_score >= 0.7 THEN 'High Engagement'
                        WHEN engagement_score >= 0.4 THEN 'Medium Engagement'
                        ELSE 'Low Engagement'
                    END AS segment,
                    AVG(feature1_usage) as feature1_usage,
                    AVG(feature2_usage) as feature2_usage,
                    AVG(feature3_usage) as feature3_usage
                FROM users
                GROUP BY segment
            """
            
            top_features_query = """
                SELECT 
                    'Feature 1' as feature_name,
                    AVG(feature1_usage) as avg_usage
                FROM users
                UNION ALL
                SELECT 
                    'Feature 2' as feature_name,
                    AVG(feature2_usage) as avg_usage
                FROM users
                UNION ALL
                SELECT 
                    'Feature 3' as feature_name,
                    AVG(feature3_usage) as avg_usage
                FROM users
                ORDER BY avg_usage DESC
                LIMIT 3
            """
            
            feature_results = app.db_adapter.execute_query(feature_usage_query)
            top_features_results = app.db_adapter.execute_query(top_features_query)
            
            feature_usage_by_segment = [
                {
                    'segment': row['segment'],
                    'features': [
                        {
                            'name': 'Feature 1',
                            'usagePercentage': float(row['feature1_usage'])
                        },
                        {
                            'name': 'Feature 2',
                            'usagePercentage': float(row['feature2_usage'])
                        },
                        {
                            'name': 'Feature 3',
                            'usagePercentage': float(row['feature3_usage'])
                        }
                    ]
                }
                for row in feature_results
            ]
            
            top_features = [
                {
                    'name': row['feature_name'],
                    'usagePercentage': float(row['avg_usage'])
                }
                for row in top_features_results
            ]
            
            return jsonify({
                'featureUsageBySegment': feature_usage_by_segment,
                'topFeatures': top_features
            })
        except Exception as e:
            logger.error(f"Error in get_feature_usage: {e}")
            return jsonify({'error': str(e)}), 500

# Create default app instance for backward compatibility
app = create_app()