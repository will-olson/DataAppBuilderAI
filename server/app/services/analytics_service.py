from typing import Dict, List, Any
from sqlalchemy import text
from database.models import db, User
import pandas as pd
import numpy as np

class AnalyticsService:
    """Unified analytics service for all business intelligence operations"""
    
    def __init__(self):
        self.db = db
    
    def get_user_segments(self) -> List[Dict[str, Any]]:
        """Get user segments based on engagement scores"""
        try:
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
            
            result = self.db.session.execute(segments_query)
            
            segments = [
                {
                    'name': row.segment,
                    'userCount': row.user_count,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0,
                    'avgChurnRisk': float(row.avg_churn_risk) if row.avg_churn_risk is not None else 0
                }
                for row in result
            ]
            
            return segments
        except Exception as e:
            raise Exception(f"Error getting user segments: {str(e)}")
    
    def get_user_journey(self) -> List[Dict[str, Any]]:
        """Get user journey stages"""
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
            
            result = self.db.session.execute(journey_query)
            
            journey_data = [
                {
                    'stage': row.stage,
                    'userCount': row.user_count,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0,
                    'avgChurnRisk': float(row.avg_churn_risk) if row.avg_churn_risk is not None else 0
                }
                for row in result
            ]
            
            return journey_data
        except Exception as e:
            raise Exception(f"Error getting user journey: {str(e)}")
    
    def get_personalization_data(self) -> Dict[str, List[Dict[str, Any]]]:
        """Get personalization preferences data"""
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
            
            content_result = self.db.session.execute(content_pref_query)
            comm_result = self.db.session.execute(comm_pref_query)
            
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
            
            return {
                'content_preferences': content_data,
                'communication_preferences': comm_data
            }
        except Exception as e:
            raise Exception(f"Error getting personalization data: {str(e)}")
    
    def get_churn_prediction(self) -> Dict[str, Any]:
        """Get churn prediction analytics"""
        try:
            churn_query = text("""
                SELECT 
                    plan,
                    COUNT(*) as total_users,
                    AVG(churn_risk) as avg_churn_risk,
                    SUM(CASE WHEN churn_risk > 0.7 THEN 1 ELSE 0 END) as high_risk_users
                FROM users
                GROUP BY plan
            """)
            
            result = self.db.session.execute(churn_query)
            
            churn_data = [
                {
                    'plan': row.plan,
                    'totalUsers': row.total_users,
                    'avgChurnRisk': float(row.avg_churn_risk) if row.avg_churn_risk is not None else 0,
                    'highRiskUsers': row.high_risk_users,
                    'highRiskPercentage': (row.high_risk_users / row.total_users * 100) if row.total_users > 0 else 0
                }
                for row in result
            ]
            
            return {
                'churn_by_plan': churn_data,
                'total_high_risk': sum(item['highRiskUsers'] for item in churn_data)
            }
        except Exception as e:
            raise Exception(f"Error getting churn prediction: {str(e)}")
    
    def get_referral_insights(self) -> Dict[str, Any]:
        """Get referral program insights"""
        try:
            referral_query = text("""
                SELECT 
                    referral_source,
                    COUNT(*) as user_count,
                    AVG(lifetime_value) as avg_ltv,
                    AVG(referral_count) as avg_referrals
                FROM users
                GROUP BY referral_source
            """)
            
            result = self.db.session.execute(referral_query)
            
            referral_data = [
                {
                    'source': row.referral_source,
                    'userCount': row.user_count,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0,
                    'avgReferrals': float(row.avg_referrals) if row.avg_referrals is not None else 0
                }
                for row in result
            ]
            
            return {
                'referral_sources': referral_data,
                'total_referral_users': sum(item['userCount'] for item in referral_data)
            }
        except Exception as e:
            raise Exception(f"Error getting referral insights: {str(e)}")
    
    def get_feature_usage(self) -> Dict[str, Any]:
        """Get feature usage analytics"""
        try:
            # This would need to be implemented based on your feature_usage_json structure
            # For now, returning mock data
            return {
                'feature_usage': [
                    {'feature': 'feature1', 'usage_rate': 0.75, 'user_count': 15000},
                    {'feature': 'feature2', 'usage_rate': 0.60, 'user_count': 12000},
                    {'feature': 'feature3', 'usage_rate': 0.45, 'user_count': 9000}
                ],
                'total_features': 3,
                'avg_usage_rate': 0.60
            }
        except Exception as e:
            raise Exception(f"Error getting feature usage: {str(e)}")
    
    def get_revenue_forecast(self) -> Dict[str, Any]:
        """Get revenue forecasting data"""
        try:
            revenue_query = text("""
                SELECT 
                    plan,
                    COUNT(*) as user_count,
                    AVG(lifetime_value) as avg_ltv,
                    SUM(lifetime_value) as total_ltv
                FROM users
                GROUP BY plan
            """)
            
            result = self.db.session.execute(revenue_query)
            
            revenue_data = [
                {
                    'plan': row.plan,
                    'userCount': row.user_count,
                    'avgLTV': float(row.avg_ltv) if row.avg_ltv is not None else 0,
                    'totalLTV': float(row.total_ltv) if row.total_ltv is not None else 0
                }
                for row in result
            ]
            
            total_revenue = sum(item['totalLTV'] for item in revenue_data)
            
            return {
                'revenue_by_plan': revenue_data,
                'total_revenue': total_revenue,
                'forecast_3months': total_revenue * 1.15,  # 15% growth assumption
                'forecast_6months': total_revenue * 1.32   # 32% growth assumption
            }
        except Exception as e:
            raise Exception(f"Error getting revenue forecast: {str(e)}")
    
    def get_raw_user_data(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """Get raw user data for exploration"""
        try:
            users = User.query.limit(limit).offset(offset).all()
            
            return [
                {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'plan': user.plan,
                    'engagement_score': user.engagement_score,
                    'lifetime_value': user.lifetime_value,
                    'churn_risk': user.churn_risk,
                    'total_sessions': user.total_sessions,
                    'account_age_days': user.account_age_days
                }
                for user in users
            ]
        except Exception as e:
            raise Exception(f"Error getting raw user data: {str(e)}") 