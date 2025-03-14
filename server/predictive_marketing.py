import os
import openai
import pandas as pd
import numpy as np
from app import create_app, db
from app.models import User
import json
import random
from sqlalchemy import text
import traceback
from dotenv import load_dotenv

load_dotenv()

class UserInsightGenerator:
    def __init__(self, users_df):
        # Get API key from environment variable
        api_key = os.getenv('OPENAI_API_KEY')
        
        # Validate API key
        if not api_key:
            raise ValueError("OpenAI API key is not set. Please set the OPENAI_API_KEY environment variable.")
        
        self.users_df = users_df
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
    
    def _min_max_normalize(self, series):
        """
        Perform min-max normalization on a pandas Series
        """
        return (series - series.min()) / (series.max() - series.min())
    
    def derive_advanced_metrics(self):
        """
        Generate advanced derived metrics for deeper insights
        """
        # Normalize key metrics
        normalized_total_sessions = self._min_max_normalize(self.users_df['total_sessions'])
        normalized_avg_visit_time = self._min_max_normalize(self.users_df['avg_visit_time'])
        
        # 1. Engagement Composite Score
        self.users_df['engagement_composite'] = (
            self.users_df['engagement_score'] * 0.3 +
            normalized_total_sessions * 0.3 +
            normalized_avg_visit_time * 0.2 +
            (1 - self.users_df['churn_risk']) * 0.2
        )
        
        # 2. Customer Lifetime Value Potential
        self.users_df['ltv_potential'] = (
            self.users_df['lifetime_value'] * 
            (1 + self.users_df['referral_count'] / 10) * 
            (1 - self.users_df['churn_risk'])
        )
        
        # 3. Communication Effectiveness Index
        self.users_df['comm_effectiveness'] = (
            self.users_df['email_open_rate'] * 0.4 +
            self.users_df['email_click_rate'] * 0.6
        )
        
        return self
    
    def perform_custom_segmentation(self):
        """
        Custom segmentation using clustering-like approach
        """
        # Select features for segmentation
        segmentation_features = [
            'age', 'total_sessions', 'lifetime_value', 
            'engagement_composite', 'ltv_potential', 
            'comm_effectiveness'
        ]
        
        # Normalize features
        normalized_df = self.users_df[segmentation_features].apply(self._min_max_normalize)
        
        # Custom clustering-like segmentation
        def assign_segment(row):
            # Create a scoring mechanism for segmentation
            segment_score = (
                row['age'] * 0.2 +
                row['total_sessions'] * 0.2 +
                row['lifetime_value'] * 0.2 +
                row['engagement_composite'] * 0.15 +
                row['ltv_potential'] * 0.15 +
                row['comm_effectiveness'] * 0.1
            )
            
            # Divide into 5 segments based on the score
            if segment_score < 0.2:
                return 0
            elif segment_score < 0.4:
                return 1
            elif segment_score < 0.6:
                return 2
            elif segment_score < 0.8:
                return 3
            else:
                return 4
        
        # Assign segments
        self.users_df['customer_segment'] = normalized_df.apply(assign_segment, axis=1)
        
        # Analyze segment characteristics
        segment_profiles = self.users_df.groupby('customer_segment').agg({
            'age': 'mean',
            'lifetime_value': 'mean',
            'total_sessions': 'mean',
            'engagement_composite': 'mean',
            'plan': lambda x: x.value_counts().index[0],
            'preferred_content_type': lambda x: x.value_counts().index[0],
            'communication_preference': lambda x: x.value_counts().index[0]
        })
        
        return segment_profiles
    
    def generate_gpt_marketing_strategy(self, segment_profiles):
        """
        Use GPT to generate marketing strategies based on customer segments
        """
        # Prepare insights for GPT prompt
        insights_summary = f"""
        Customer Segmentation Analysis:
        
        Segment Profiles:
        {segment_profiles.to_string()}
        
        Overall User Metrics:
        - Total Users: {len(self.users_df)}
        - Average Age: {self.users_df['age'].mean():.2f}
        - Average Lifetime Value: ${self.users_df['lifetime_value'].mean():.2f}
        - Churn Risk Distribution: 
          Low Risk: {(self.users_df['churn_risk'] < 0.3).mean():.2%}
          Medium Risk: {((self.users_df['churn_risk'] >= 0.3) & (self.users_df['churn_risk'] < 0.7)).mean():.2%}
          High Risk: {(self.users_df['churn_risk'] >= 0.7).mean():.2%}
        
        Subscription Plan Distribution:
        {self.users_df['plan'].value_counts(normalize=True)}
        
        Content Preference Distribution:
        {self.users_df['preferred_content_type'].value_counts(normalize=True)}
        
        Communication Preference Distribution:
        {self.users_df['communication_preference'].value_counts(normalize=True)}
        """
        
        # GPT Prompt Engineering
        prompt = f"""
        Based on the following customer segmentation and user behavior insights, 
        develop a comprehensive, data-driven marketing strategy that includes:

        1. Targeted Acquisition Strategies
        2. Personalized Retention Tactics
        3. Upsell and Cross-sell Recommendations
        4. Churn Prevention Initiatives
        5. Content and Communication Personalization

        Provide specific, actionable recommendations for each customer segment.

        Customer Insights:
        {insights_summary}
        """
        
        # Generate marketing strategy using GPT
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4-turbo",
                messages=[
                    {"role": "system", "content": "You are a strategic marketing consultant analyzing customer data."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            return {
                'marketing_strategy': response.choices[0].message.content,
                'segment_profiles': segment_profiles.to_dict()
            }
        
        except Exception as e:
            print(f"Error generating marketing strategy: {e}")
            return None
    
    def generate_predictive_insights(self):
        """
        Generate predictive insights and recommendations
        """
        # Derive advanced metrics
        self.derive_advanced_metrics()
        
        # Perform custom segmentation
        segment_profiles = self.perform_custom_segmentation()
        
        # Generate marketing strategy via GPT
        marketing_strategy = self.generate_gpt_marketing_strategy(segment_profiles)
        
        return marketing_strategy

def main():
    # Load user data
    app = create_app()
    with app.app_context():
        # Use SQLAlchemy text to create a SQL query string
        query = text("SELECT * FROM users")
        
        # Convert SQLAlchemy query to DataFrame
        users_df = pd.read_sql(query, db.engine)
    
    # Initialize Insight Generator
    insight_generator = UserInsightGenerator(users_df)
    
    # Generate Predictive Insights
    marketing_insights = insight_generator.generate_predictive_insights()
    
    # Save insights to JSON
    with open('predictive_marketing_insights.json', 'w') as f:
        json.dump(marketing_insights, f, indent=4)
    
    # Print key highlights
    print("Predictive Marketing Insights Generated!")
    print("\nCustomer Segments:")
    print(marketing_insights['segment_profiles'])
    
    print("\nMarketing Strategy Highlights:")
    print(marketing_insights['marketing_strategy'][:500] + "...")  # Print first 500 chars

if __name__ == '__main__':
    main()