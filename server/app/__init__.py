from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy import text
from config import Config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

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
    
    class AIInsightGenerator:
        def __init__(self, users_df, prompt_type='strategic'):
            """
            Flexible insight generator with customizable prompt engineering
            """
            self.users_df = users_df
            self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            self.prompt_type = prompt_type

        def _base_data_preparation(self):
            """
            Standard data preparation method
            """
            # Normalize key metrics
            def _min_max_normalize(series):
                return (series - series.min()) / (series.max() - series.min())
            
            # Core metric derivation
            self.users_df['normalized_sessions'] = _min_max_normalize(self.users_df['total_sessions'])
            self.users_df['normalized_visit_time'] = _min_max_normalize(self.users_df['avg_visit_time'])
            
            return self

        def _generate_prompt(self, segment_profiles):
            """
            Dynamically generate prompts based on insight type
            """
            base_insights = f"""
            Overall User Metrics:
            - Total Users: {len(self.users_df)}
            - Average Age: {self.users_df['age'].mean():.2f}
            - Average Lifetime Value: ${self.users_df['lifetime_value'].mean():.2f}
            
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

            return prompts.get(self.prompt_type, prompts['strategic'])

        def generate_insights(self):
            """
            Unified insight generation method
            """
            # Prepare data
            self._base_data_preparation()
            
            # Perform segmentation
            segment_profiles = self.users_df.groupby(
                pd.cut(self.users_df['lifetime_value'], bins=5)
            ).agg({
                'age': 'mean',
                'lifetime_value': 'mean',
                'total_sessions': 'mean',
                'plan': lambda x: x.value_counts().index[0]
            })
            
            # Generate GPT prompt
            prompt = self._generate_prompt(segment_profiles)
            
            # Generate insights via GPT
            try:
                response = self.openai_client.chat.completions.create(
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
                    'segment_profiles': segment_profiles.to_dict(),
                    'total_users': len(self.users_df)
                }
            
            except Exception as e:
                return {'error': str(e)}

    # Flask Route Implementations
    def generate_ai_insights():
        """
        Flexible AI Insights Generation Route
        """
        try:
            # Get insight type from request
            insight_type = request.args.get('type', 'strategic')
            
            # Load user data
            users_df = pd.read_sql(text("SELECT * FROM users"), db.engine)
            
            # Initialize Insight Generator
            insight_generator = AIInsightGenerator(
                users_df, 
                prompt_type=insight_type
            )
            
            # Generate insights
            insights = insight_generator.generate_insights()
            
            return jsonify(insights)
        
        except Exception as e:
            return jsonify({
                'error': str(e),
                'traceback': traceback.format_exc()
            }), 500

    # Additional Specialized Routes
    def generate_segment_details():
        """
        Detailed Segment Analysis
        """
        try:
            users_df = pd.read_sql(text("SELECT * FROM users"), db.engine)
            
            # Advanced Segmentation
            segment_details = users_df.groupby('customer_segment').agg({
                'lifetime_value': ['mean', 'median'],
                'total_sessions': ['mean', 'max'],
                'churn_risk': 'mean',
                'plan': lambda x: x.value_counts().index[0]
            })
            
            return jsonify(segment_details.to_dict())
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def predictive_revenue_forecast():
        """
        Revenue Forecasting with Probabilistic Modeling
        """
        try:
            users_df = pd.read_sql(text("SELECT * FROM users"), db.engine)
            
            # Simple predictive revenue model
            revenue_projection = {
                'current_mrr': users_df['lifetime_value'].sum(),
                'projected_growth_scenarios': {
                    'conservative': users_df['lifetime_value'].sum() * 1.1,
                    'moderate': users_df['lifetime_value'].sum() * 1.25,
                    'aggressive': users_df['lifetime_value'].sum() * 1.5
                },
                'churn_impact_analysis': {
                    'current_churn_rate': users_df['churn_risk'].mean(),
                    'potential_revenue_loss': users_df['lifetime_value'][users_df['churn_risk'] > 0.7].sum()
                }
            }
            
            return jsonify(revenue_projection)
        
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Route Registration
    def register_ai_routes(app):
        app.add_url_rule('/api/ai-insights', 'generate_ai_insights', generate_ai_insights, methods=['GET'])
        app.add_url_rule('/api/segment-details', 'generate_segment_details', generate_segment_details, methods=['GET'])
        app.add_url_rule('/api/revenue-forecast', 'predictive_revenue_forecast', predictive_revenue_forecast, methods=['GET'])

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

    # Optional: Log registered routes for debugging
    with app.app_context():
        print("Registered Routes:")
        for rule in app.url_map.iter_rules():
            print(f"{rule.endpoint}: {rule.rule}")
    
    return app