"""
Unified Flask Application Factory with Sigma Framework Integration
"""

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from sqlalchemy import text
import logging
from config import get_config, update_sigma_mode
from datetime import datetime

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

def create_app(config_class=None):
    """Create and configure the Flask application"""
    
    # Get configuration
    if config_class is None:
        config_class = get_config()
    
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Enable CORS for frontend integration
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Setup logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)
    
    # Initialize Sigma Framework if enabled
    sigma_integration = None
    try:
        from sigma_integration import init_sigma_integration
        # Always initialize Sigma integration to register routes, but it may be disabled
        sigma_integration = init_sigma_integration(app)
        app.sigma_integration = sigma_integration
        if app.config.get('SIGMA_MODE', 'standalone') != 'standalone':
            logger.info(f"Sigma framework integration initialized in {app.config.get('SIGMA_MODE')} mode")
        else:
            logger.info("Sigma framework integration initialized but disabled (standalone mode)")
    except Exception as e:
        logger.warning(f"Sigma framework integration failed: {e}")
        logger.info("Continuing in standalone mode")
    
    # Register Sigma mode toggle endpoint (frontend can call this)
    @app.route('/api/sigma/toggle-mode', methods=['POST'])
    def toggle_sigma_mode():
        """Toggle Sigma mode dynamically from frontend"""
        try:
            data = request.get_json()
            if not data or 'mode' not in data:
                return jsonify({'error': 'Mode parameter required'}), 400
            
            new_mode = data['mode']
            updated_config = update_sigma_mode(new_mode)
            
            # Update Flask app configuration to reflect the new mode
            app.config['SIGMA_MODE'] = updated_config['sigma_mode']
            app.config['DATABASE_MODE'] = updated_config['database_mode']
            app.config['SIGMA_FEATURES'] = updated_config['features']
            
            # Instead of reinitializing the entire integration, just update the existing one
            if hasattr(app, 'sigma_integration') and app.sigma_integration:
                # Update the existing integration's configuration
                app.sigma_integration.update_config(updated_config)
                logger.info(f"Sigma framework configuration updated to {new_mode} mode")
            elif new_mode != 'standalone':
                # Only initialize if it doesn't exist and we're not going to standalone
                try:
                    from sigma_integration import init_sigma_integration
                    sigma_integration = init_sigma_integration(app)
                    app.sigma_integration = sigma_integration
                    logger.info(f"Sigma framework initialized in {new_mode} mode")
                except Exception as e:
                    logger.error(f"Failed to initialize Sigma framework: {e}")
                    return jsonify({'error': f'Failed to initialize Sigma framework: {e}'}), 500
            else:
                # Remove Sigma integration
                if hasattr(app, 'sigma_integration'):
                    delattr(app, 'sigma_integration')
                logger.info("Sigma framework integration disabled")
            
            return jsonify({
                'status': 'success',
                'message': f'Sigma mode changed to {new_mode}',
                'config': updated_config
            })
            
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            logger.error(f"Error toggling Sigma mode: {e}")
            return jsonify({'error': str(e)}), 500
    
    # Get current Sigma configuration
    @app.route('/api/sigma/config', methods=['GET'])
    def get_sigma_config():
        """Get current Sigma framework configuration"""
        return jsonify({
            'sigma_mode': app.config.get('SIGMA_MODE', 'standalone'),
            'database_mode': app.config.get('DATABASE_MODE', 'sqlite'),
            'features': app.config.get('SIGMA_FEATURES', {}),
            'sigma_enabled': hasattr(app, 'sigma_integration')
        })
    
    # Note: All other Sigma endpoints (/api/sigma/status, /api/sigma/capabilities, etc.)
    # are now handled by the sigma_integration module to avoid route conflicts
    
    # API Routes
    @app.route('/api/segments', methods=['GET'])
    def get_user_segments():
        try:
            # Use SQLAlchemy to query segments
            segments_query = text("""
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
            """)
            
            # Execute the query
            result = db.session.execute(segments_query)
            
            # Convert to list of dictionaries
            segments = [
                {
                    'name': row.segment,
                    'userCount': row.user_count,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0,
                    'avgChurnRisk': float(row.avg_churn_risk) if row.avg_churn_risk is not None else 0
                }
                for row in result
            ]
            
            return jsonify(segments)
        except Exception as e:
            app.logger.error(f"Error in segments route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/user-journey', methods=['GET'])
    def get_user_journey():
        try:
            journey_query = text("""
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
            """)
            
            result = db.session.execute(journey_query)
            
            journey_data = [
                {
                    'stage': row.stage,
                    'userCount': row.user_count,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0,
                    'avgChurnRisk': float(row.avg_churn_risk) if row.avg_churn_risk is not None else 0
                }
                for row in result
            ]
            
            return jsonify(journey_data)
        except Exception as e:
            app.logger.error(f"Error in user journey route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/personalization', methods=['GET'])
    def get_personalization():
        try:
            content_pref_query = text("""
                SELECT 
                    preferred_content_type as type,
                    COUNT(*) as user_count,
                    AVG(engagement_score) as avg_engagement
                FROM users
                GROUP BY type
            """)
            
            comm_pref_query = text("""
                SELECT 
                    communication_preference as preference,
                    COUNT(*) as user_count,
                    AVG(engagement_score) as avg_engagement
                FROM users
                GROUP BY preference
            """)
            
            content_result = db.session.execute(content_pref_query)
            comm_result = db.session.execute(comm_pref_query)
            
            content_data = [
                {
                    'type': row.type,
                    'userCount': row.user_count,
                    'avgEngagement': float(row.avg_engagement) if row.avg_engagement is not None else 0
                }
                for row in content_result
            ]
            
            comm_data = [
                {
                    'preference': row.preference,
                    'userCount': row.user_count,
                    'avgEngagement': float(row.avg_engagement) if row.avg_engagement is not None else 0
                }
                for row in comm_result
            ]
            
            return jsonify({
                'contentPreferences': content_data,
                'communicationPreferences': comm_data
            })
        except Exception as e:
            app.logger.error(f"Error in personalization route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint with actual database connectivity testing"""
        try:
            # Test database connectivity
            db.session.execute(text('SELECT 1'))
            db_status = 'healthy'
            db_message = 'Database connection successful'
        except Exception as e:
            db_status = 'error'
            db_message = f'Database connection failed: {str(e)}'
            logger.error(f"Database health check failed: {e}")
        
        return jsonify({
            'status': db_status,
            'message': db_message,
            'sigma_mode': app.config.get('SIGMA_MODE', 'standalone'),
            'database_mode': app.config.get('DATABASE_MODE', 'sqlite'),
            'sigma_enabled': hasattr(app, 'sigma_integration'),
            'timestamp': datetime.utcnow().isoformat()
        })

    @app.route('/api/churn-prediction', methods=['GET'])
    def get_churn_prediction():
        try:
            churn_query = text("""
                SELECT 
                    churn_risk,
                    COUNT(*) as user_count,
                    AVG(lifetime_value) as avg_ltv,
                    AVG(account_age_days) as avg_account_age
                FROM users
                GROUP BY churn_risk
                ORDER BY churn_risk DESC
            """)
            
            result = db.session.execute(churn_query)
            
            churn_data = [
                {
                    'churnRisk': float(row.churn_risk) if row.churn_risk is not None else 0,
                    'userCount': row.user_count,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0,
                    'avgAccountAge': float(row.avg_account_age) if row.avg_account_age is not None else 0
                }
                for row in result
            ]
            
            return jsonify(churn_data)
        except Exception as e:
            app.logger.error(f"Error in churn prediction route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/referral-insights', methods=['GET'])
    def get_referral_insights():
        try:
            referral_query = text("""
                SELECT 
                    referral_source,
                    COUNT(*) as user_count,
                    AVG(lifetime_value) as avg_ltv,
                    AVG(engagement_score) as avg_engagement,
                    AVG(churn_risk) as avg_churn_risk
                FROM users
                WHERE referral_source IS NOT NULL
                GROUP BY referral_source
                ORDER BY user_count DESC
            """)
            
            result = db.session.execute(referral_query)
            
            referral_data = [
                {
                    'source': row.referral_source,
                    'userCount': row.user_count,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0,
                    'avgEngagement': float(row.avg_engagement) if row.avg_engagement is not None else 0,
                    'avgChurnRisk': float(row.avg_churn_risk) if row.avg_churn_risk is not None else 0
                }
                for row in result
            ]
            
            return jsonify(referral_data)
        except Exception as e:
            app.logger.error(f"Error in referral insights route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/raw-user-data', methods=['GET'])
    def get_raw_user_data():
        try:
            # Get query parameters for pagination and filtering
            limit = request.args.get('limit', 50, type=int)
            offset = request.args.get('offset', 0, type=int)
            search = request.args.get('search', '')
            
            # Build base query
            base_query = text("""
                SELECT 
                    id, uuid, username, email, account_age_days, total_sessions,
                    engagement_score, lifetime_value, churn_risk,
                    preferred_content_type, communication_preference,
                    referral_source, account_created, last_login,
                    age, gender, location, language, timezone,
                    avg_visit_time, session_frequency,
                    last_email_open, last_email_click, email_open_rate, email_click_rate,
                    last_app_login, last_app_click, last_completed_action,
                    plan, plan_start_date, total_purchases, average_purchase_value,
                    notification_settings, feature_usage_json, referral_count,
                    marketing_consent, last_consent_update
                FROM users
                WHERE 1=1
            """)
            
            # Add search filter if provided
            if search:
                search_filter = text("""
                    AND (username LIKE :search OR email LIKE :search)
                """)
                base_query = text(str(base_query) + str(search_filter))
            
            # Add pagination
            paginated_query = text(str(base_query) + " LIMIT :limit OFFSET :offset")
            
            # Execute query with parameters
            if search:
                result = db.session.execute(paginated_query, {
                    'search': f'%{search}%',
                    'limit': limit,
                    'offset': offset
                })
            else:
                result = db.session.execute(paginated_query, {
                    'limit': limit,
                    'offset': offset
                })
            
            # Convert to list of dictionaries
            users = []
            for row in result:
                # Safe datetime handling
                def safe_datetime_format(dt_value):
                    if dt_value is None:
                        return None
                    if isinstance(dt_value, str):
                        return dt_value
                    try:
                        return dt_value.isoformat()
                    except AttributeError:
                        return str(dt_value)
                
                user = {
                    'id': row.id,
                    'uuid': row.uuid,
                    'username': row.username,
                    'email': row.email,
                    'accountAgeDays': row.account_age_days,
                    'totalSessions': row.total_sessions,
                    'engagementScore': row.engagement_score,
                    'lifetimeValue': row.lifetime_value,
                    'churnRisk': row.churn_risk,
                    'preferredContentType': row.preferred_content_type,
                    'communicationPreference': row.communication_preference,
                    'referralSource': row.referral_source,
                    'accountCreated': safe_datetime_format(row.account_created),
                    'lastLogin': safe_datetime_format(row.last_login),
                    'age': row.age,
                    'gender': row.gender,
                    'location': row.location,
                    'language': row.language,
                    'timezone': row.timezone,
                    'avgVisitTime': row.avg_visit_time,
                    'sessionFrequency': row.session_frequency,
                    'lastEmailOpen': safe_datetime_format(row.last_email_open),
                    'lastEmailClick': safe_datetime_format(row.last_email_click),
                    'emailOpenRate': row.email_open_rate,
                    'emailClickRate': row.email_click_rate,
                    'lastAppLogin': safe_datetime_format(row.last_app_login),
                    'lastAppClick': safe_datetime_format(row.last_app_click),
                    'lastCompletedAction': row.last_completed_action,
                    'plan': row.plan,
                    'planStartDate': safe_datetime_format(row.plan_start_date),
                    'totalPurchases': row.total_purchases,
                    'averagePurchaseValue': row.average_purchase_value,
                    'notificationSettings': row.notification_settings,
                    'featureUsageJson': row.feature_usage_json,
                    'referralCount': row.referral_count,
                    'marketingConsent': row.marketing_consent,
                    'lastConsentUpdate': safe_datetime_format(row.last_consent_update)
                }
                users.append(user)
            
            return jsonify(users)
        except Exception as e:
            app.logger.error(f"Error in raw user data route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/user-count', methods=['GET'])
    def get_user_count():
        """Get the total count of users in the database"""
        try:
            from app.models import User
            user_count = User.query.count()
            return jsonify({
                'total_users': user_count,
                'status': 'success'
            })
        except Exception as e:
            app.logger.error(f"Error getting user count: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/ai-insights', methods=['GET'])
    def ai_insights():
        try:
            # Get insights type from query parameter
            insights_type = request.args.get('type', 'strategic')
            
            # This would typically call an AI service
            # For now, return mock insights based on the type
            if insights_type == 'strategic':
                insights = {
                    'type': 'strategic',
                    'title': 'Strategic Growth Opportunities',
                    'insights': [
                        'High-value users show 3x engagement with personalized content',
                        'Referral program drives 40% of new user acquisition',
                        'Churn risk correlates strongly with communication frequency'
                    ],
                    'recommendations': [
                        'Implement dynamic content personalization',
                        'Optimize referral incentives for high-LTV segments',
                        'Increase touchpoints for at-risk users'
                    ],
                    'revenue_projection': [
                        { 'period': 'Q1 2024', 'revenue': 100000 },
                        { 'period': 'Q2 2024', 'revenue': 120000 },
                        { 'period': 'Q3 2024', 'revenue': 150000 },
                        { 'period': 'Q4 2024', 'revenue': 200000 }
                    ],
                    'churn_risk_distribution': [
                        { 'name': 'Low Risk', 'value': 0.6 },
                        { 'name': 'Medium Risk', 'value': 0.3 },
                        { 'name': 'High Risk', 'value': 0.1 }
                    ]
                }
            elif insights_type == 'tactical':
                insights = {
                    'type': 'tactical',
                    'title': 'Tactical Optimization Opportunities',
                    'insights': [
                        'Email campaigns perform best on Tuesday mornings',
                        'Mobile users prefer video content over text',
                        'Onboarding completion rate drops after step 3'
                    ],
                    'recommendations': [
                        'Schedule emails for optimal timing',
                        'Increase video content production',
                        'Simplify onboarding flow'
                    ],
                    'revenue_projection': [
                        { 'period': 'Q1 2024', 'revenue': 95000 },
                        { 'period': 'Q2 2024', 'revenue': 110000 },
                        { 'period': 'Q3 2024', 'revenue': 130000 },
                        { 'period': 'Q4 2024', 'revenue': 160000 }
                    ],
                    'churn_risk_distribution': [
                        { 'name': 'Low Risk', 'value': 0.5 },
                        { 'name': 'Medium Risk', 'value': 0.4 },
                        { 'name': 'High Risk', 'value': 0.1 }
                    ]
                }
            else:
                insights = {
                    'type': 'general',
                    'title': 'General Performance Insights',
                    'insights': [
                        'Overall user engagement is trending upward',
                        'Lifetime value varies significantly by segment',
                        'Communication preferences are diverse'
                    ],
                    'recommendations': [
                        'Continue current engagement strategies',
                        'Focus on high-value segment development',
                        'Maintain multi-channel communication approach'
                    ],
                    'revenue_projection': [
                        { 'period': 'Q1 2024', 'revenue': 105000 },
                        { 'period': 'Q2 2024', 'revenue': 115000 },
                        { 'period': 'Q3 2024', 'revenue': 140000 },
                        { 'period': 'Q4 2024', 'revenue': 180000 }
                    ],
                    'churn_risk_distribution': [
                        { 'name': 'Low Risk', 'value': 0.55 },
                        { 'name': 'Medium Risk', 'value': 0.35 },
                        { 'name': 'High Risk', 'value': 0.1 }
                    ]
                }
            
            return jsonify(insights)
        except Exception as e:
            app.logger.error(f"Error in AI insights route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/ab-testing-analysis', methods=['GET'])
    def get_ab_testing_analysis():
        try:
            # Get A/B test data from users table
            # This would typically come from a dedicated A/B testing table
            # For now, we'll simulate A/B test results based on user behavior
            
            # Get test variant performance
            variant_query = text("""
                SELECT 
                    CASE 
                        WHEN engagement_score > 0.7 THEN 'Variant A (High Engagement)'
                        WHEN engagement_score BETWEEN 0.4 AND 0.7 THEN 'Variant B (Medium Engagement)'
                        ELSE 'Variant C (Low Engagement)'
                    END as variant,
                    COUNT(*) as userCount,
                    AVG(engagement_score) as avgEngagement,
                    AVG(lifetime_value) as avgLTV,
                    AVG(churn_risk) as avgChurnRisk,
                    AVG(account_age_days) as avgAccountAge
                FROM users
                GROUP BY variant
                ORDER BY avgEngagement DESC
            """)
            
            # Get conversion rates by variant
            conversion_query = text("""
                SELECT 
                    CASE 
                        WHEN engagement_score > 0.7 THEN 'Variant A'
                        WHEN engagement_score BETWEEN 0.4 AND 0.7 THEN 'Variant B'
                        ELSE 'Variant C'
                    END as variant,
                    COUNT(*) as totalUsers,
                    SUM(CASE WHEN lifetime_value > 100 THEN 1 ELSE 0 END) as convertedUsers,
                    SUM(CASE WHEN churn_risk < 0.3 THEN 1 ELSE 0 END) as retainedUsers
                FROM users
                GROUP BY variant
            """)
            
            # Get statistical significance data
            significance_query = text("""
                SELECT 
                    'engagement_score' as metric,
                    AVG(CASE WHEN engagement_score > 0.7 THEN engagement_score END) as variant_a_avg,
                    AVG(CASE WHEN engagement_score BETWEEN 0.4 AND 0.7 THEN engagement_score END) as variant_b_avg,
                    AVG(CASE WHEN engagement_score < 0.4 THEN engagement_score END) as variant_c_avg,
                    COUNT(CASE WHEN engagement_score > 0.7 THEN 1 END) as variant_a_count,
                    COUNT(CASE WHEN engagement_score BETWEEN 0.4 AND 0.7 THEN 1 END) as variant_b_count,
                    COUNT(CASE WHEN engagement_score < 0.4 THEN 1 END) as variant_c_count
                FROM users
            """)
            
            variant_result = db.session.execute(variant_query)
            conversion_result = db.session.execute(conversion_query)
            significance_result = db.session.execute(significance_query)
            
            variants = [
                {
                    'variant': row.variant,
                    'userCount': row.userCount,
                    'avgEngagement': float(row.avgEngagement) if row.avgEngagement is not None else 0,
                    'avgLTV': float(row.avgLTV) if row.avgLTV is not None else 0,
                    'avgChurnRisk': float(row.avgChurnRisk) if row.avgChurnRisk is not None else 0,
                    'avgAccountAge': float(row.avgAccountAge) if row.avgAccountAge is not None else 0
                }
                for row in variant_result
            ]
            
            conversions = [
                {
                    'variant': row.variant,
                    'totalUsers': row.totalUsers,
                    'convertedUsers': row.convertedUsers,
                    'retainedUsers': row.retainedUsers,
                    'conversionRate': (row.convertedUsers / row.totalUsers) if row.totalUsers > 0 else 0,
                    'retentionRate': (row.retainedUsers / row.totalUsers) if row.totalUsers > 0 else 0
                }
                for row in conversion_result
            ]
            
            significance_data = significance_result.fetchone()
            statistical_significance = {
                'metric': significance_data.metric if significance_data else 'engagement_score',
                'variantA': {
                    'average': float(significance_data.variant_a_avg) if significance_data and significance_data.variant_a_avg is not None else 0,
                    'count': significance_data.variant_a_count if significance_data else 0
                },
                'variantB': {
                    'average': float(significance_data.variant_b_avg) if significance_data and significance_data.variant_b_avg is not None else 0,
                    'count': significance_data.variant_b_count if significance_data else 0
                },
                'variantC': {
                    'average': float(significance_data.variant_c_avg) if significance_data and significance_data.variant_c_avg is not None else 0,
                    'count': significance_data.variant_c_count if significance_data else 0
                }
            }
            
            # Calculate winner and confidence
            best_variant = max(variants, key=lambda x: x['avgEngagement'])
            confidence_level = 0.85  # Mock confidence level
            
            response_data = {
                'insights': {
                    'winner': best_variant['variant'],
                    'confidenceLevel': confidence_level,
                    'recommendation': f"Implement {best_variant['variant']} as it shows the highest engagement rate",
                    'keyFindings': [
                        f"{best_variant['variant']} has {best_variant['avgEngagement']:.1%} higher engagement",
                        f"Conversion rates vary significantly between variants",
                        f"Statistical significance achieved with {confidence_level:.0%} confidence"
                    ]
                },
                'variants': variants,
                'conversions': conversions,
                'statisticalSignificance': statistical_significance,
                'testDuration': '30 days',
                'sampleSize': sum([v['userCount'] for v in variants])
            }
            
            return jsonify(response_data)
        except Exception as e:
            app.logger.error(f"Error in A/B testing analysis route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/feature-usage', methods=['GET'])
    def get_feature_usage():
        try:
            feature_query = text("""
                SELECT 
                    preferred_content_type as feature,
                    COUNT(*) as user_count,
                    AVG(engagement_score) as avg_engagement,
                    AVG(lifetime_value) as avg_ltv
                FROM users
                GROUP BY preferred_content_type
                ORDER BY user_count DESC
            """)
            
            result = db.session.execute(feature_query)
            
            feature_data = [
                {
                    'feature': row.feature,
                    'userCount': row.user_count,
                    'avgEngagement': float(row.avg_engagement) if row.avg_engagement is not None else 0,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0
                }
                for row in result
            ]
            
            return jsonify(feature_data)
        except Exception as e:
            app.logger.error(f"Error in feature usage route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/revenue-forecast', methods=['GET'])
    def predictive_revenue_forecast():
        try:
            # Get forecast period from query parameter
            period = request.args.get('period', '12')  # months
            
            # This would typically call a predictive model
            # For now, return mock forecast data
            forecast_data = {
                'period_months': int(period),
                'current_revenue': 125000,
                'projected_revenue': 187500,
                'growth_rate': 0.50,
                'confidence_interval': 0.85,
                'monthly_forecast': [
                    {'month': 'Jan', 'revenue': 125000, 'growth': 0.00},
                    {'month': 'Feb', 'revenue': 131250, 'growth': 0.05},
                    {'month': 'Mar', 'revenue': 137813, 'growth': 0.05},
                    {'month': 'Apr', 'revenue': 144703, 'growth': 0.05},
                    {'month': 'May', 'revenue': 151938, 'growth': 0.05},
                    {'month': 'Jun', 'revenue': 159534, 'growth': 0.05},
                    {'month': 'Jul', 'revenue': 167511, 'growth': 0.05},
                    {'month': 'Aug', 'revenue': 175887, 'growth': 0.05},
                    {'month': 'Sep', 'revenue': 184682, 'growth': 0.05},
                    {'month': 'Oct', 'revenue': 193916, 'growth': 0.05},
                    {'month': 'Nov', 'revenue': 203612, 'growth': 0.05},
                    {'month': 'Dec', 'revenue': 213792, 'growth': 0.05}
                ],
                'key_factors': [
                    'User acquisition growth rate',
                    'Average lifetime value increase',
                    'Churn rate reduction',
                    'Feature adoption improvement'
                ]
            }
            
            return jsonify(forecast_data)
        except Exception as e:
            app.logger.error(f"Error in revenue forecast route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    # Log registered routes
    logger.info("Registered Routes:")
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            logger.info(f"{rule.endpoint}: {rule.rule}")

    return app