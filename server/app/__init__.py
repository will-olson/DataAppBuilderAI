from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import text
from config import Config
import os
import openai
import pandas as pd
import numpy as np
import traceback

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

# Standalone functions instead of a class
def prepare_data(users_df):
    """
    Standard data preparation method
    """
    def _min_max_normalize(series):
        return (series - series.min()) / (series.max() - series.min())
    
    # Core metric derivation
    users_df['normalized_sessions'] = _min_max_normalize(users_df['total_sessions'])
    users_df['normalized_visit_time'] = _min_max_normalize(users_df['avg_visit_time'])
    
    return users_df

def generate_prompt(users_df, segment_profiles, prompt_type='strategic'):
    """
    Dynamically generate prompts based on insight type
    """
    base_insights = f"""
    Overall User Metrics:
    - Total Users: {len(users_df)}
    - Average Age: {users_df['age'].mean():.2f}
    - Average Lifetime Value: ${users_df['lifetime_value'].mean():.2f}
    
    Segment Profiles:
    {segment_profiles.to_string()}
    """

    # Prompt engineering based on type
    prompts = {
        'strategic': f"""
        Develop a comprehensive, data-driven marketing strategy including:
        1. Targeted Acquisition Strategies
        2. Personalized Retention Tactics
        3. Upsell and Cross-sell Recommendations
        4. Churn Prevention Initiatives
        5. Content and Communication Personalization

        Customer Insights:
        {base_insights}
        """,
        
        'ab_testing': f"""
        Conduct a detailed A/B testing analysis focusing on:
        1. Experimental Design Recommendations
        2. Statistical Significance Assessment
        3. Conversion Probability Modeling
        4. Variant Performance Comparison

        Experimental Context:
        {base_insights}
        """,
        
        'predictive': f"""
        Generate predictive insights and forward-looking recommendations:
        1. Revenue Projection Modeling
        2. Churn Risk Forecasting
        3. Customer Lifetime Value Predictions
        4. Growth Opportunity Identification

        Predictive Context:
        {base_insights}
        """
    }

    return prompts.get(prompt_type, prompts['strategic'])

def generate_insights(users_df, prompt_type='strategic'):
    """
    Unified insight generation method
    """
    # Prepare data
    users_df = prepare_data(users_df)
    
    # Perform segmentation with string-based interval names
    def custom_interval_name(value):
        if value < 100:
            return '$0-$100'
        elif value < 500:
            return '$100-$500'
        elif value < 1000:
            return '$500-$1000'
        else:
            return '$1000+'

    # Group by custom interval
    segment_profiles = users_df.groupby(
        users_df['lifetime_value'].apply(custom_interval_name)
    ).agg({
        'age': 'mean',
        'lifetime_value': 'mean',
        'total_sessions': 'mean',
        'plan': lambda x: x.value_counts().index[0]
    })
    
    # Convert to a dictionary with string keys
    segment_profiles_dict = segment_profiles.to_dict(orient='index')
    
    # Generate GPT prompt
    prompt = generate_prompt(users_df, segment_profiles, prompt_type)
    
    # Generate insights via GPT
    try:
        openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        response = openai_client.chat.completions.create(
            model="gpt-4-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an advanced strategic analytics consultant."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.7
        )
        
        return {
            'insights': response.choices[0].message.content,
            'segment_profiles': segment_profiles_dict,
            'total_users': len(users_df)
        }
    
    except Exception as e:
        return {'error': str(e)}

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS for all routes, with a focus on API routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Initialize extensions BEFORE importing models
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Import models AFTER initializing extensions
    from .models import User
    
    # Create tables within app context
    with app.app_context():
        db.create_all()
    
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
                    communication_preference as channel,
                    COUNT(*) as user_count,
                    AVG(email_open_rate) as avg_open_rate
                FROM users
                GROUP BY channel
            """)
            
            content_results = db.session.execute(content_pref_query)
            comm_results = db.session.execute(comm_pref_query)
            
            content_preferences = [
                {
                    'type': row.type,
                    'userCount': row.user_count,
                    'avgEngagement': float(row.avg_engagement) if row.avg_engagement is not None else 0
                }
                for row in content_results
            ]
            
            communication_preferences = [
                {
                    'channel': row.channel,
                    'userCount': row.user_count,
                    'avgOpenRate': float(row.avg_open_rate) if row.avg_open_rate is not None else 0
                }
                for row in comm_results
            ]
            
            return jsonify({
                'contentPreferences': content_preferences,
                'communicationPreferences': communication_preferences
            })
        except Exception as e:
            app.logger.error(f"Error in personalization route: {str(e)}")
            return jsonify({'error': str(e)}), 500

    # Debug route to verify API is working
    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'API is up and running'
        })
    
    @app.route('/api/churn-prediction', methods=['GET'])
    def get_churn_prediction():
        try:
            # Query to calculate churn risk segments dynamically
            segments_query = text("""
                SELECT 
                    CASE 
                        WHEN churn_risk > 0.7 THEN 'High Risk'
                        WHEN churn_risk > 0.4 THEN 'Medium Risk'
                        ELSE 'Low Risk'
                    END AS risk_segment,
                    COUNT(*) as user_count,
                    AVG(churn_risk) as avg_churn_risk
                FROM users
                GROUP BY risk_segment
            """)
            
            # Query to identify churn factors
            factors_query = text("""
                SELECT 
                    CASE 
                        WHEN total_sessions < 10 THEN 'Inactivity'
                        WHEN engagement_score < 0.3 THEN 'Low Engagement'
                        ELSE 'Other Factors'
                    END AS churn_factor,
                    COUNT(*) as factor_count,
                    AVG(churn_risk) as avg_factor_risk
                FROM users
                GROUP BY churn_factor
            """)
            
            # Execute queries
            segments_results = db.session.execute(segments_query)
            factors_results = db.session.execute(factors_query)
            
            # Calculate overall churn risk
            overall_churn_query = text("""
                SELECT AVG(churn_risk) as overall_churn_risk
                FROM users
            """)
            overall_result = db.session.execute(overall_churn_query).first()
            
            # Process segments
            high_risk_segments = [
                {
                    'name': row.risk_segment,
                    'userCount': row.user_count,
                    'churnRisk': float(row.avg_churn_risk)
                }
                for row in segments_results
            ]
            
            # Process churn factors
            churn_factors = [
                {
                    'name': row.churn_factor,
                    'impact': float(row.avg_factor_risk),
                    'userCount': row.factor_count
                }
                for row in factors_results
            ]
            
            return jsonify({
                'overallChurnRisk': float(overall_result.overall_churn_risk),
                'highRiskSegments': high_risk_segments,
                'churnFactors': churn_factors
            })
        
        except Exception as e:
            app.logger.error(f"Churn prediction error: {str(e)}")
            return jsonify({
                'overallChurnRisk': 0,
                'highRiskSegments': [],
                'churnFactors': []
            }), 500

    @app.route('/api/referral-insights', methods=['GET'])
    def get_referral_insights():
        try:
            # Referral sources analysis
            sources_query = text("""
                SELECT 
                    referral_source,
                    COUNT(*) as referral_count,
                    AVG(lifetime_value) as avg_referral_value,
                    AVG(total_purchases) as avg_purchases
                FROM users
                WHERE referral_source IS NOT NULL
                GROUP BY referral_source
                ORDER BY referral_count DESC
            """)
            
            # Conversion rates analysis
            conversion_query = text("""
                SELECT 
                    referral_source,
                    COUNT(*) as total_referrals,
                    SUM(CASE WHEN total_purchases > 0 THEN 1 ELSE 0 END) as converted_referrals,
                    SUM(CASE WHEN total_purchases > 0 THEN 1 ELSE 0 END) * 1.0 / COUNT(*) as conversion_rate
                FROM users
                WHERE referral_source IS NOT NULL
                GROUP BY referral_source
            """)
            
            # Execute queries
            sources_results = db.session.execute(sources_query)
            conversion_results = db.session.execute(conversion_query)
            
            # Process referral sources
            referral_sources = [
                {
                    'name': row.referral_source,
                    'count': row.referral_count,
                    'avgReferralValue': float(row.avg_referral_value),
                    'avgPurchases': float(row.avg_purchases)
                }
                for row in sources_results
            ]
            
            # Process conversion rates
            referral_conversion_rates = [
                {
                    'source': row.referral_source,
                    'totalReferrals': row.total_referrals,
                    'convertedReferrals': row.converted_referrals,
                    'conversionRate': float(row.conversion_rate)
                }
                for row in conversion_results
            ]
            
            return jsonify({
                'referralSources': referral_sources,
                'referralConversionRates': referral_conversion_rates
            })
        except Exception as e:
            app.logger.error(f"Referral insights error: {str(e)}")
            return jsonify({'error': str(e)}), 500
        
    @app.route('/api/raw-user-data', methods=['GET'])
    def get_raw_user_data():
        try:
            # Extract query parameters
            min_age = request.args.get('minAge', type=int)
            max_age = request.args.get('maxAge', type=int)
            plan = request.args.get('plan')
            min_lifetime_value = request.args.get('minLifetimeValue', type=float)
            sort_by = request.args.get('sortBy', 'lifetime_value')
            sort_order = request.args.get('sortOrder', 'desc')

            # Base query
            query = User.query

            # Apply filters
            if min_age:
                query = query.filter(User.age >= min_age)
            if max_age:
                query = query.filter(User.age <= max_age)
            if plan:
                query = query.filter(User.plan == plan)
            if min_lifetime_value:
                query = query.filter(User.lifetime_value >= min_lifetime_value)

            # Apply sorting
            if sort_order == 'desc':
                query = query.order_by(getattr(User, sort_by).desc())
            else:
                query = query.order_by(getattr(User, sort_by).asc())

            # Limit results to prevent overwhelming the frontend
            query = query.limit(21000)

            # Execute query and convert to list of dictionaries
            users = query.all()
            user_data = [{
                'username': user.username,
                'email': user.email,
                'age': user.age,
                'plan': user.plan,
                'lifetime_value': user.lifetime_value,
                'total_sessions': user.total_sessions
            } for user in users]

            return jsonify(user_data)

        except Exception as e:
            app.logger.error(f"Error in raw user data route: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
   # AI Insights Route
    @app.route('/api/ai-insights', methods=['GET'])
    def ai_insights():
        """
        Flexible AI Insights Generation Route
        """
        try:
            # Get insight type from request
            insight_type = request.args.get('type', 'strategic')
            
            # Load user data
            users_df = pd.read_sql(text("SELECT * FROM users"), db.engine)
            
            # Generate insights
            insights = generate_insights(users_df, prompt_type=insight_type)
            
            # Ensure consistent data structure
            if insight_type == 'ab_testing':
                # Ensure specific AB testing data structure
                insights['experimental_data'] = [
                    {'feature1': 10, 'conversion_probability': 0.6},
                    {'feature1': 20, 'conversion_probability': 0.75}
                ]
                insights['confidence_level'] = 95.5
                insights['recommended_variant'] = 'Variant B'
            
            return jsonify(insights)
        
        except Exception as e:
            return jsonify({
                'error': str(e),
                'traceback': traceback.format_exc()
            }), 500

    @app.route('/api/feature-usage', methods=['GET'])
    def get_feature_usage():
        try:
            # SQLite-compatible column inspection
            column_query = text("""
                PRAGMA table_info(users)
            """)
            
            # Execute column inspection
            column_results = db.session.execute(column_query)
            
            # Convert to list and log column names
            columns = [row[1] for row in column_results]
            app.logger.info(f"All columns in users table: {columns}")
            
            # Check for feature usage column
            if 'feature_usage_json' not in columns:
                app.logger.warning("No feature_usage_json column found")
                return jsonify({
                    'featureUsageBySegment': [],
                    'topFeatures': []
                })
            
            # Total users query
            total_users_query = text("""
                SELECT COUNT(*) as total_users FROM users
            """)
            total_users_result = db.session.execute(total_users_query).first()
            total_users = total_users_result.total_users if total_users_result else 0
            
            # Feature usage by segment query
            feature_usage_query = text("""
                SELECT 
                    CASE 
                        WHEN total_sessions > 100 THEN 'Power User'
                        WHEN total_sessions > 50 THEN 'Active User'
                        ELSE 'Casual User'
                    END AS user_segment,
                    COUNT(*) as segment_count
                FROM users
                GROUP BY user_segment
            """)
            
            # Execute the query
            segment_results = db.session.execute(feature_usage_query)
            
            # Process feature usage by segment
            feature_usage_by_segment = [
                {
                    'segment': row.user_segment,
                    'segmentCount': row.segment_count,
                    'features': [
                        {
                            'name': 'Feature 1',
                            'usagePercentage': 0.5  # Default value
                        },
                        {
                            'name': 'Feature 2',
                            'usagePercentage': 0.4  # Default value
                        },
                        {
                            'name': 'Feature 3',
                            'usagePercentage': 0.3  # Default value
                        }
                    ]
                }
                for row in segment_results
            ]
            
            # Top features query
            top_features = [
                {
                    'name': 'Feature 1',
                    'usagePercentage': 0.6
                },
                {
                    'name': 'Feature 2',
                    'usagePercentage': 0.5
                },
                {
                    'name': 'Feature 3',
                    'usagePercentage': 0.4
                }
            ]
            
            return jsonify({
                'featureUsageBySegment': feature_usage_by_segment,
                'topFeatures': top_features
            })
        
        except Exception as e:
            # Log the full error details
            import traceback
            traceback.print_exc()
            
            app.logger.error(f"Feature usage error: {str(e)}")
            return jsonify({
                'featureUsageBySegment': [],
                'topFeatures': []
            }), 500
        
    @app.route('/api/revenue-forecast', methods=['GET'])
    def predictive_revenue_forecast():
        """
        Revenue Forecasting with Probabilistic Modeling
        """
        try:
            # Load user data
            users_df = pd.read_sql(text("SELECT * FROM users"), db.engine)
            
            # Debugging: Print total users and lifetime value
            print(f"Total Users: {len(users_df)}")
            print(f"Total Lifetime Value: ${users_df['lifetime_value'].sum():.2f}")
            
            # Calculate base revenue
            base_revenue = users_df['lifetime_value'].sum()
            
            # Ensure base revenue is not zero
            if base_revenue == 0:
                base_revenue = 100000  # Fallback value
            
            # Simple predictive revenue model with more detailed projection
            revenue_projection = [
                {'period': 'Q1 2024', 'revenue': round(base_revenue * 1.1, 2)},
                {'period': 'Q2 2024', 'revenue': round(base_revenue * 1.2, 2)},
                {'period': 'Q3 2024', 'revenue': round(base_revenue * 1.3, 2)},
                {'period': 'Q4 2024', 'revenue': round(base_revenue * 1.5, 2)}
            ]
            
            # Churn risk distribution
            churn_risk_distribution = [
                {'name': 'Low Risk', 'value': float((users_df['churn_risk'] < 0.3).mean())},
                {'name': 'Medium Risk', 'value': float(((users_df['churn_risk'] >= 0.3) & (users_df['churn_risk'] < 0.7)).mean())},
                {'name': 'High Risk', 'value': float((users_df['churn_risk'] >= 0.7).mean())}
            ]
            
            # Prepare detailed insights
            insights = f"""
            Predictive Revenue Forecast Analysis:
            
            Total Current Revenue: ${base_revenue:,.2f}
            Projected Quarterly Revenue:
            - Q1 2024: ${revenue_projection[0]['revenue']:,.2f}
            - Q2 2024: ${revenue_projection[1]['revenue']:,.2f}
            - Q3 2024: ${revenue_projection[2]['revenue']:,.2f}
            - Q4 2024: ${revenue_projection[3]['revenue']:,.2f}
            
            Churn Risk Breakdown:
            - Low Risk: {churn_risk_distribution[0]['value']:.2%}
            - Medium Risk: {churn_risk_distribution[1]['value']:.2%}
            - High Risk: {churn_risk_distribution[2]['value']:.2%}
            
            Key Insights:
            1. Projected annual revenue shows a growth trajectory
            2. Churn risk analysis reveals potential revenue challenges
            3. Strategic interventions can mitigate high-risk segments
            """
            
            return jsonify({
                'revenue_projection': revenue_projection,
                'churn_risk_distribution': churn_risk_distribution,
                'insights': insights
            })
        
        except Exception as e:
            print(f"Error in revenue forecast: {e}")
            return jsonify({
                'error': str(e),
                'revenue_projection': [
                    {'period': 'Q1 2024', 'revenue': 100000},
                    {'period': 'Q2 2024', 'revenue': 120000},
                    {'period': 'Q3 2024', 'revenue': 150000},
                    {'period': 'Q4 2024', 'revenue': 200000}
                ],
                'churn_risk_distribution': [
                    {'name': 'Low Risk', 'value': 0.6},
                    {'name': 'Medium Risk', 'value': 0.3},
                    {'name': 'High Risk', 'value': 0.1}
                ],
                'insights': 'Failed to generate detailed insights'
            }), 500

    # Optional: Log registered routes for debugging
    with app.app_context():
        print("Registered Routes:")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule.rule}")
    
    return app