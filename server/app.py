# server/app.py or server/app/__init__.py
from flask import Flask, jsonify
from flask_cors import CORS
from sqlalchemy import text
from app.models import User

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes

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
                    'avgLTV': float(row.avg_ltv),
                    'avgChurnRisk': float(row.avg_churn_risk)
                }
                for row in result
            ]
            
            return jsonify(segments)
        except Exception as e:
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
                    'avgLTV': float(row.avg_ltv),
                    'avgChurnRisk': float(row.avg_churn_risk)
                }
                for row in result
            ]
            
            return jsonify(journey_data)
        except Exception as e:
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
                    'avgEngagement': float(row.avg_engagement)
                }
                for row in content_results
            ]
            
            communication_preferences = [
                {
                    'channel': row.channel,
                    'userCount': row.user_count,
                    'avgOpenRate': float(row.avg_open_rate)
                }
                for row in comm_results
            ]
            
            return jsonify({
                'contentPreferences': content_preferences,
                'communicationPreferences': communication_preferences
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # @app.route('/api/churn-prediction', methods=['GET'])
    # def get_churn_prediction():
    #     try:
    #         # SQLite-compatible column inspection
    #         column_query = text("""
    #             PRAGMA table_info(users)
    #         """)
            
    #         # Execute column inspection
    #         column_results = db.session.execute(column_query)
            
    #         # Log all column names
    #         columns = [row[1] for row in column_results]
    #         app.logger.info(f"All columns in users table: {columns}")
            
    #         # Check for churn-related columns
    #         churn_columns = [col for col in columns if 'churn' in col.lower()]
    #         app.logger.info(f"Churn-related columns: {churn_columns}")
            
    #         # Flexible churn risk column selection
    #         churn_risk_column = next((col for col in columns if col.lower() in ['churn_risk', 'churnrisk']), None)
            
    #         if not churn_risk_column:
    #             app.logger.warning("No churn risk column found")
    #             return jsonify({
    #                 'error': 'No churn risk column found',
    #                 'availableColumns': columns
    #             }), 400
            
    #         # Dynamic query using the found column
    #         churn_query = text(f"""
    #             SELECT 
    #                 CASE 
    #                     WHEN {churn_risk_column} > 0.7 THEN 'High Risk'
    #                     WHEN {churn_risk_column} > 0.4 THEN 'Medium Risk'
    #                     ELSE 'Low Risk'
    #                 END AS risk_segment,
    #                 COUNT(*) as user_count,
    #                 AVG({churn_risk_column}) as avg_churn_risk,
    #                 AVG(lifetime_value) as avg_lifetime_value
    #             FROM users
    #             GROUP BY risk_segment
    #         """)
            
    #         # Execute and log the query
    #         try:
    #             churn_results = db.session.execute(churn_query)
                
    #             # Convert results to list and log
    #             results_list = list(churn_results)
    #             app.logger.info(f"Churn query results: {results_list}")
                
    #             # Process results
    #             high_risk_segments = [
    #                 {
    #                     'name': row.risk_segment,
    #                     'userCount': row.user_count,
    #                     'churnRisk': float(row.avg_churn_risk),
    #                     'avgLifetimeValue': float(row.avg_lifetime_value)
    #                 }
    #                 for row in results_list
    #             ]
                
    #             # Calculate overall churn risk
    #             overall_churn_risk = sum(segment['churnRisk'] for segment in high_risk_segments) / len(high_risk_segments) if high_risk_segments else 0
                
    #             return jsonify({
    #                 'overallChurnRisk': overall_churn_risk,
    #                 'highRiskSegments': high_risk_segments,
    #                 'churnFactors': [
    #                     {
    #                         'name': 'Potential Churn Factors',
    #                         'impact': 0.5,
    #                         'userCount': sum(segment['userCount'] for segment in high_risk_segments)
    #                     }
    #                 ]
    #             })
            
    #         except Exception as query_error:
    #             app.logger.error(f"Query execution error: {str(query_error)}")
    #             return jsonify({
    #                 'error': 'Query execution failed',
    #                 'details': str(query_error)
    #             }), 500
        
    #     except Exception as e:
    #         app.logger.error(f"Unexpected error in churn prediction: {str(e)}")
    #         return jsonify({
    #             'error': 'Unexpected server error',
    #             'details': str(e)
    #         }), 500

    @app.route('/api/feature-usage', methods=['GET'])
    def get_feature_usage():
        try:
            # Feature usage by user segment
            feature_usage_query = text("""
                SELECT 
                    CASE 
                        WHEN total_sessions > 100 THEN 'Power User'
                        WHEN total_sessions > 50 THEN 'Active User'
                        ELSE 'Casual User'
                    END AS user_segment,
                    AVG(CAST(feature_usage_json->>'$.feature1' AS FLOAT)) as feature1_usage,
                    AVG(CAST(feature_usage_json->>'$.feature2' AS FLOAT)) as feature2_usage,
                    AVG(CAST(feature_usage_json->>'$.feature3' AS FLOAT)) as feature3_usage,
                    COUNT(*) as segment_count
                FROM users
                GROUP BY user_segment
            """)
            
            # Top features overall
            top_features_query = text("""
                SELECT 
                    'Feature 1' as feature_name,
                    AVG(CAST(feature_usage_json->>'$.feature1' AS FLOAT)) as avg_usage
                FROM users
                UNION
                SELECT 
                    'Feature 2' as feature_name,
                    AVG(CAST(feature_usage_json->>'$.feature2' AS FLOAT)) as avg_usage
                FROM users
                UNION
                SELECT 
                    'Feature 3' as feature_name,
                    AVG(CAST(feature_usage_json->>'$.feature3' AS FLOAT)) as avg_usage
                FROM users
                ORDER BY avg_usage DESC
            """)
            
            # Execute queries
            feature_results = db.session.execute(feature_usage_query)
            top_features_results = db.session.execute(top_features_query)
            
            # Process feature usage by segment
            feature_usage_by_segment = [
                {
                    'segment': row.user_segment,
                    'segmentCount': row.segment_count,
                    'features': [
                        {
                            'name': 'Feature 1',
                            'usagePercentage': float(row.feature1_usage)
                        },
                        {
                            'name': 'Feature 2',
                            'usagePercentage': float(row.feature2_usage)
                        },
                        {
                            'name': 'Feature 3',
                            'usagePercentage': float(row.feature3_usage)
                        }
                    ]
                }
                for row in feature_results
            ]
            
            # Process top features
            top_features = [
                {
                    'name': row.feature_name,
                    'usagePercentage': float(row.avg_usage)
                }
                for row in top_features_results
            ]
            
            return jsonify({
                'featureUsageBySegment': feature_usage_by_segment,
                'topFeatures': top_features
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return app