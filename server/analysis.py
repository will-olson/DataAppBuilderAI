# analysis.py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sqlalchemy import create_engine, text
from app import create_app, db
from app.models import User
import json

def convert_to_serializable(obj):
        """
        Recursively convert NumPy and Pandas types to standard Python types
        """
        if isinstance(obj, (np.int64, np.float64)):
            return int(obj) if isinstance(obj, np.int64) else float(obj)
        
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        
        if isinstance(obj, pd.Series):
            return obj.tolist()
        
        if isinstance(obj, dict):
            return {k: convert_to_serializable(v) for k, v in obj.items()}
        
        if isinstance(obj, list):
            return [convert_to_serializable(item) for item in obj]
        
        return obj

class UserAnalytics:
    def __init__(self):
        # Create Flask app context
        app = create_app()
        
        with app.app_context():
            # Use a SQL query string instead of the SQLAlchemy query object
            query = text("SELECT * FROM users")
            self.users_df = pd.read_sql(query, db.engine)
            
            # Convert JSON columns 
            self.users_df['notification_settings'] = self.users_df['notification_settings'].apply(self._parse_json)
            self.users_df['feature_usage_json'] = self.users_df['feature_usage_json'].apply(self._parse_json)
    
    def _parse_json(self, json_str):
        """
        Safely parse JSON strings
        """
        try:
            # Handle both string and dictionary inputs
            if isinstance(json_str, str):
                return json.loads(json_str.replace("'", '"'))
            elif isinstance(json_str, dict):
                return json_str
            else:
                return {}
        except (json.JSONDecodeError, TypeError):
            return {}
    
    def demographic_analysis(self):
        """Comprehensive Demographic Insights"""
        demo_insights = {
            'age_distribution': {
                'mean': self.users_df['age'].mean(),
                'median': self.users_df['age'].median(),
                'std': self.users_df['age'].std(),
            },
            'gender_breakdown': self.users_df['gender'].value_counts(normalize=True),
            'location_top_10': self.users_df['location'].value_counts().head(10),
            'language_distribution': self.users_df['language'].value_counts(normalize=True).head(10)
        }
        
        # Visualize Age Distribution
        plt.figure(figsize=(10, 6))
        sns.histplot(self.users_df['age'], kde=True)
        plt.title('Age Distribution')
        plt.xlabel('Age')
        plt.ylabel('Count')
        plt.savefig('age_distribution.png')
        plt.close()
        
        return demo_insights
    
    def engagement_analysis(self):
        """Deep Dive into User Engagement"""
        engagement_insights = {
            'avg_visit_time': {
                'mean': self.users_df['avg_visit_time'].mean(),
                'median': self.users_df['avg_visit_time'].median(),
                'std': self.users_df['avg_visit_time'].std(),
            },
            'total_sessions_stats': {
                'mean': self.users_df['total_sessions'].mean(),
                'median': self.users_df['total_sessions'].median(),
                'max': self.users_df['total_sessions'].max(),
            },
            'session_frequency_stats': {
                'mean': self.users_df['session_frequency'].mean(),
                'median': self.users_df['session_frequency'].median(),
            }
        }
        
        # Engagement Score Distribution
        plt.figure(figsize=(10, 6))
        sns.histplot(self.users_df['engagement_score'], kde=True)
        plt.title('Engagement Score Distribution')
        plt.xlabel('Engagement Score')
        plt.ylabel('Count')
        plt.savefig('engagement_score_distribution.png')
        plt.close()
        
        return engagement_insights
    
    def revenue_and_conversion_analysis(self):
        """Revenue and Conversion Metrics"""
        # Plan Conversion Analysis
        plan_conversion = self.users_df['plan'].value_counts(normalize=True)
        
        # Lifetime Value Analysis
        ltv_insights = {
            'plan_ltv': self.users_df.groupby('plan')['lifetime_value'].agg(['mean', 'median', 'max']),
            'total_ltv': {
                'mean': self.users_df['lifetime_value'].mean(),
                'median': self.users_df['lifetime_value'].median(),
                'total': self.users_df['lifetime_value'].sum()
            },
            'purchases_analysis': {
                'avg_purchases': self.users_df['total_purchases'].mean(),
                'median_purchases': self.users_df['total_purchases'].median(),
                'max_purchases': self.users_df['total_purchases'].max(),
            }
        }
        
        # LTV by Plan Visualization
        plt.figure(figsize=(10, 6))
        sns.boxplot(x='plan', y='lifetime_value', data=self.users_df)
        plt.title('Lifetime Value by Plan')
        plt.savefig('ltv_by_plan.png')
        plt.close()
        
        return {
            'plan_conversion': plan_conversion,
            'ltv_insights': ltv_insights
        }
    
    def churn_prediction_analysis(self):
        """Churn Risk and Predictive Insights"""
        # Churn Risk Segmentation
        churn_segments = pd.cut(
            self.users_df['churn_risk'], 
            bins=[0, 0.2, 0.4, 0.6, 0.8, 1], 
            labels=['Very Low', 'Low', 'Medium', 'High', 'Very High']
        )
        
        churn_insights = {
            'churn_risk_distribution': churn_segments.value_counts(normalize=True),
            'churn_by_plan': self.users_df.groupby('plan')['churn_risk'].mean(),
            'churn_correlations': {
                'engagement_correlation': np.corrcoef(
                    self.users_df['churn_risk'], 
                    self.users_df['engagement_score']
                )[0, 1],
                'ltv_correlation': np.corrcoef(
                    self.users_df['churn_risk'], 
                    self.users_df['lifetime_value']
                )[0, 1]
            }
        }
        
        # Churn Risk Visualization
        plt.figure(figsize=(10, 6))
        sns.boxplot(x='plan', y='churn_risk', data=self.users_df)
        plt.title('Churn Risk by Plan')
        plt.savefig('churn_risk_by_plan.png')
        plt.close()
        
        return churn_insights
    
    def personalization_analysis(self):
        """Personalization and Content Preference Insights"""
        content_preferences = self.users_df['preferred_content_type'].value_counts(normalize=True)
        communication_preferences = self.users_df['communication_preference'].value_counts(normalize=True)
        
        # Feature Usage Analysis
        def extract_feature_usage(feature_json):
            try:
                features = json.loads(feature_json.replace("'", '"'))
                return pd.Series(features)
            except:
                return pd.Series({'feature1': np.nan, 'feature2': np.nan, 'feature3': np.nan})
        
        feature_usage_df = self.users_df['feature_usage_json'].apply(extract_feature_usage)
        
        feature_insights = {
            'feature_usage_mean': feature_usage_df.mean(),
            'feature_usage_correlation': feature_usage_df.corr()
        }
        
        # Content Preference Visualization
        plt.figure(figsize=(10, 6))
        content_preferences.plot(kind='bar')
        plt.title('Content Type Preferences')
        plt.xlabel('Content Type')
        plt.ylabel('Proportion')
        plt.tight_layout()
        plt.savefig('content_preferences.png')
        plt.close()
        
        return {
            'content_preferences': content_preferences,
            'communication_preferences': communication_preferences,
            'feature_insights': feature_insights
        }
    
    def referral_and_growth_analysis(self):
        """Referral Source and Growth Metrics"""
        referral_sources = self.users_df['referral_source'].value_counts(normalize=True)
        
        referral_insights = {
            'referral_source_distribution': referral_sources,
            'avg_referral_count': self.users_df['referral_count'].mean(),
            'referral_ltv_correlation': np.corrcoef(
                self.users_df['referral_count'], 
                self.users_df['lifetime_value']
            )[0, 1]
        }
        
        # Referral Source Visualization
        plt.figure(figsize=(10, 6))
        referral_sources.plot(kind='pie', autopct='%1.1f%%')
        plt.title('Referral Source Distribution')
        plt.savefig('referral_sources.png')
        plt.close()
        
        return referral_insights
    
    def generate_comprehensive_report(self):
        """Generate a comprehensive marketing insights report"""
        report = {
            'demographic_insights': self._serialize_demographic_insights(),
            'engagement_insights': self._serialize_engagement_insights(),
            'revenue_insights': self._serialize_revenue_insights(),
            'churn_prediction': self._serialize_churn_insights(),
            'personalization_insights': self._serialize_personalization_insights(),
            'referral_growth_insights': self._serialize_referral_insights()
        }
        
        # Convert to fully serializable format
        serializable_report = convert_to_serializable(report)
        
        # Save report to JSON
        with open('marketing_insights_report.json', 'w') as f:
            json.dump(serializable_report, f, indent=4)
        
        return serializable_report

    # Modify other methods to use standard Python types
    def _serialize_demographic_insights(self):
        """Convert demographic insights to JSON-serializable format"""
        demo_insights = {
            'age_distribution': {
                'mean': self.users_df['age'].mean(),
                'median': self.users_df['age'].median(),
                'std': self.users_df['age'].std(),
            },
            'gender_breakdown': self.users_df['gender'].value_counts(normalize=True).to_dict(),
            'location_top_10': self.users_df['location'].value_counts().head(10).to_dict(),
            'language_distribution': self.users_df['language'].value_counts(normalize=True).head(10).to_dict()
        }
        return demo_insights

    # Similar modifications for other serialization methods
    def _serialize_engagement_insights(self):
        """Convert engagement insights to JSON-serializable format"""
        engagement_insights = {
            'avg_visit_time': {
                'mean': self.users_df['avg_visit_time'].mean(),
                'median': self.users_df['avg_visit_time'].median(),
                'std': self.users_df['avg_visit_time'].std(),
            },
            'total_sessions_stats': {
                'mean': self.users_df['total_sessions'].mean(),
                'median': self.users_df['total_sessions'].median(),
                'max': self.users_df['total_sessions'].max(),
            },
            'session_frequency_stats': {
                'mean': self.users_df['session_frequency'].mean(),
                'median': self.users_df['session_frequency'].median(),
            }
        }
        return engagement_insights
    
    def _serialize_revenue_insights(self):
        """Convert revenue insights to JSON-serializable format"""
        # Plan Conversion Analysis
        plan_conversion = self.users_df['plan'].value_counts(normalize=True).to_dict()
        
        # Lifetime Value Analysis by Plan
        ltv_by_plan = self.users_df.groupby('plan')['lifetime_value'].agg(['mean', 'median', 'max'])
        
        # Convert LTV by Plan to dictionary with float values
        plan_ltv = {}
        for plan, stats in ltv_by_plan.iterrows():
            plan_ltv[plan] = {
                'mean': float(stats['mean']),
                'median': float(stats['median']),
                'max': float(stats['max'])
            }
        
        # Total LTV Insights
        ltv_insights = {
            'plan_ltv': plan_ltv,
            'total_ltv': {
                'mean': float(self.users_df['lifetime_value'].mean()),
                'median': float(self.users_df['lifetime_value'].median()),
                'total': float(self.users_df['lifetime_value'].sum())
            },
            'purchases_analysis': {
                'avg_purchases': float(self.users_df['total_purchases'].mean()),
                'median_purchases': float(self.users_df['total_purchases'].median()),
                'max_purchases': float(self.users_df['total_purchases'].max()),
            }
        }
        
        return {
            'plan_conversion': plan_conversion,
            'ltv_insights': ltv_insights
        }

    def _serialize_churn_insights(self):
        """Convert churn insights to JSON-serializable format"""
        # Churn Risk Segmentation
        churn_segments = pd.cut(
            self.users_df['churn_risk'], 
            bins=[0, 0.2, 0.4, 0.6, 0.8, 1], 
            labels=['Very Low', 'Low', 'Medium', 'High', 'Very High']
        )
        
        churn_insights = {
            'churn_risk_distribution': dict(churn_segments.value_counts(normalize=True)),
            'churn_by_plan': dict(self.users_df.groupby('plan')['churn_risk'].mean()),
            'churn_correlations': {
                'engagement_correlation': float(np.corrcoef(
                    self.users_df['churn_risk'], 
                    self.users_df['engagement_score']
                )[0, 1]),
                'ltv_correlation': float(np.corrcoef(
                    self.users_df['churn_risk'], 
                    self.users_df['lifetime_value']
                )[0, 1])
            }
        }
        
        return churn_insights

    def _serialize_personalization_insights(self):
        """Convert personalization insights to JSON-serializable format"""
        # Content Preferences
        content_preferences = dict(self.users_df['preferred_content_type'].value_counts(normalize=True))
        
        # Communication Preferences
        communication_preferences = dict(self.users_df['communication_preference'].value_counts(normalize=True))
        
        # Feature Usage Analysis
        # Safely handle feature usage JSON
        def safe_feature_usage_extraction(feature_json):
            try:
                # Ensure it's a dictionary
                if isinstance(feature_json, str):
                    feature_json = json.loads(feature_json.replace("'", '"'))
                return feature_json if isinstance(feature_json, dict) else {}
            except:
                return {}
        
        # Extract feature usage
        feature_usage_data = self.users_df['feature_usage_json'].apply(safe_feature_usage_extraction)
        feature_usage_df = pd.DataFrame(feature_usage_data.tolist())
        
        # Feature Insights
        feature_insights = {
            'feature_usage_mean': {
                col: float(feature_usage_df[col].mean()) 
                for col in feature_usage_df.columns 
                if col in feature_usage_df.columns
            },
            'feature_usage_correlation': {
                f"{col1}_{col2}": float(feature_usage_df[col1].corr(feature_usage_df[col2]))
                for col1 in feature_usage_df.columns 
                for col2 in feature_usage_df.columns 
                if col1 != col2
            }
        }
        
        return {
            'content_preferences': content_preferences,
            'communication_preferences': communication_preferences,
            'feature_insights': feature_insights
        }

    def _serialize_referral_insights(self):
        """Convert referral insights to JSON-serializable format"""
        # Referral Source Distribution
        referral_sources = dict(self.users_df['referral_source'].value_counts(normalize=True))
        
        # Referral Insights
        referral_insights = {
            'referral_source_distribution': referral_sources,
            'avg_referral_count': float(self.users_df['referral_count'].mean()),
            'referral_count_distribution': dict(self.users_df['referral_count'].value_counts(normalize=True)),
            'referral_ltv_correlation': float(np.corrcoef(
                self.users_df['referral_count'], 
                self.users_df['lifetime_value']
            )[0, 1]),
            'referral_insights_by_plan': {
                plan: {
                    'avg_referral_count': float(self.users_df[self.users_df['plan'] == plan]['referral_count'].mean()),
                    'avg_lifetime_value': float(self.users_df[self.users_df['plan'] == plan]['lifetime_value'].mean())
                }
                for plan in self.users_df['plan'].unique()
            }
        }
        
        return referral_insights
    
    def create_advanced_visualizations(self):
        """
        Create advanced visualizations that go beyond the existing charts
        """
        # 1. Correlation Heatmap of Key Metrics
        plt.figure(figsize=(12, 10))
        correlation_columns = [
            'age', 'avg_visit_time', 'total_sessions', 
            'lifetime_value', 'total_purchases', 
            'churn_risk', 'engagement_score'
        ]
        correlation_matrix = self.users_df[correlation_columns].corr()
        sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
        plt.title('Correlation Heatmap of Key User Metrics')
        plt.tight_layout()
        plt.savefig('correlation_heatmap.png')
        plt.close()

        # 2. Scatter Plot: Lifetime Value vs Total Sessions by Plan
        plt.figure(figsize=(12, 8))
        sns.scatterplot(
            data=self.users_df, 
            x='total_sessions', 
            y='lifetime_value', 
            hue='plan', 
            palette='deep'
        )
        plt.title('Lifetime Value vs Total Sessions by Subscription Plan')
        plt.xlabel('Total Sessions')
        plt.ylabel('Lifetime Value')
        plt.savefig('ltv_vs_sessions_scatter.png')
        plt.close()

        # 3. Violin Plot: Engagement Score Distribution by Plan
        plt.figure(figsize=(12, 8))
        sns.violinplot(
            data=self.users_df, 
            x='plan', 
            y='engagement_score', 
            palette='Set3'
        )
        plt.title('Engagement Score Distribution by Subscription Plan')
        plt.xlabel('Subscription Plan')
        plt.ylabel('Engagement Score')
        plt.savefig('engagement_score_violin.png')
        plt.close()

        # 4. Stacked Bar Chart: Communication Preferences by Plan
        # Prepare data
        comm_pref_by_plan = self.users_df.groupby(['plan', 'communication_preference']).size().unstack(fill_value=0)
        comm_pref_by_plan_pct = comm_pref_by_plan.div(comm_pref_by_plan.sum(axis=1), axis=0)

        plt.figure(figsize=(12, 8))
        comm_pref_by_plan_pct.plot(kind='bar', stacked=True)
        plt.title('Communication Preferences by Subscription Plan')
        plt.xlabel('Subscription Plan')
        plt.ylabel('Proportion of Communication Preferences')
        plt.legend(title='Communication Preference', bbox_to_anchor=(1.05, 1), loc='upper left')
        plt.tight_layout()
        plt.savefig('communication_preferences_by_plan.png')
        plt.close()

        # 5. Box Plot: Churn Risk vs Referral Count
        plt.figure(figsize=(12, 8))
        sns.boxplot(
            x=pd.cut(self.users_df['referral_count'], 
                    bins=[0, 1, 3, 5, np.inf], 
                    labels=['0', '1-2', '3-4', '5+']), 
            y=self.users_df['churn_risk']
        )
        plt.title('Churn Risk by Referral Count')
        plt.xlabel('Number of Referrals')
        plt.ylabel('Churn Risk')
        plt.savefig('churn_risk_by_referrals.png')
        plt.close()

        # 6. Feature Usage Radar Chart
        def create_radar_chart(feature_usage):
            # Prepare feature usage data
            feature_means = feature_usage.mean()
            
            # Number of variables
            categories = list(feature_means.index)
            N = len(categories)
            
            # Repeat the first value to close the polygon
            values = feature_means.tolist()
            values += values[:1]
            
            # Compute angle for each axis
            angles = [n / float(N) * 2 * np.pi for n in range(N)]
            angles += angles[:1]
            
            # Plot
            plt.figure(figsize=(8, 8))
            ax = plt.subplot(111, polar=True)
            plt.xticks(angles[:-1], categories)
            ax.plot(angles, values)
            ax.fill(angles, values, alpha=0.25)
            plt.title('Feature Usage Radar Chart')
            plt.savefig('feature_usage_radar.png')
            plt.close()

        # Extract feature usage
        feature_usage_data = pd.DataFrame(
            self.users_df['feature_usage_json'].apply(
                lambda x: json.loads(x.replace("'", '"')) if isinstance(x, str) else x
            ).tolist()
        )
        create_radar_chart(feature_usage_data)

        return {
            'charts_generated': [
                'correlation_heatmap.png',
                'ltv_vs_sessions_scatter.png',
                'engagement_score_violin.png',
                'communication_preferences_by_plan.png',
                'churn_risk_by_referrals.png',
                'feature_usage_radar.png'
            ]
        }
    
    def generate_additional_charts(self, marketing_insights):
        """
        Generate additional charts based on marketing insights
        
        Args:
            marketing_insights (dict): Comprehensive marketing insights dictionary
        
        Returns:
            dict: List of generated chart filenames
        """

        # 1. Subscription Plan Comparison
        plt.figure(figsize=(12, 6))
        plans = marketing_insights['revenue_insights']['plan_conversion']
        plt.bar(plans.keys(), plans.values())
        plt.title('Subscription Plan Distribution')
        plt.xlabel('Plan Type')
        plt.ylabel('Proportion of Users')
        plt.savefig('subscription_plan_distribution.png')
        plt.close()

        # 2. Churn Risk Distribution Pie Chart
        plt.figure(figsize=(10, 10))
        churn_risks = marketing_insights['churn_prediction']['churn_risk_distribution']
        plt.pie(churn_risks.values(), labels=churn_risks.keys(), autopct='%1.1f%%')
        plt.title('Churn Risk Segmentation')
        plt.savefig('churn_risk_pie.png')
        plt.close()

        # 3. Content Preference Radar Chart
        content_prefs = marketing_insights['personalization_insights']['content_preferences']
        categories = list(content_prefs.keys())
        values = list(content_prefs.values())

        angles = np.linspace(0, 2*np.pi, len(categories), endpoint=False)
        values += values[:1]
        angles = np.concatenate((angles, [angles[0]]))

        plt.figure(figsize=(8, 8))
        ax = plt.subplot(111, polar=True)
        plt.xticks(angles[:-1], categories)
        ax.plot(angles, values)
        ax.fill(angles, values, alpha=0.25)
        plt.title('Content Type Preferences')
        plt.savefig('content_preference_radar.png')
        plt.close()

        # 4. Communication Preferences Horizontal Bar
        plt.figure(figsize=(10, 6))
        comm_prefs = marketing_insights['personalization_insights']['communication_preferences']
        plt.barh(list(comm_prefs.keys()), list(comm_prefs.values()))
        plt.title('Communication Channel Preferences')
        plt.xlabel('Proportion of Users')
        plt.tight_layout()
        plt.savefig('communication_preferences.png')
        plt.close()

        # 5. Lifetime Value by Plan Boxplot
        plt.figure(figsize=(10, 6))
        ltv_by_plan = marketing_insights['revenue_insights']['ltv_insights']['plan_ltv']
        plan_data = [
            [ltv_by_plan[plan]['mean'], ltv_by_plan[plan]['median'], ltv_by_plan[plan]['max']] 
            for plan in ltv_by_plan.keys()
        ]
        plt.boxplot(plan_data, labels=list(ltv_by_plan.keys()))
        plt.title('Lifetime Value Distribution by Plan')
        plt.ylabel('Lifetime Value')
        plt.savefig('ltv_by_plan_boxplot.png')
        plt.close()

        # 6. Referral Source Distribution
        plt.figure(figsize=(10, 6))
        referral_sources = marketing_insights['referral_growth_insights']['referral_source_distribution']
        plt.pie(referral_sources.values(), labels=referral_sources.keys(), autopct='%1.1f%%')
        plt.title('User Acquisition Channels')
        plt.savefig('referral_sources_pie.png')
        plt.close()

        # 7. Feature Usage Heatmap
        feature_correlations = marketing_insights['personalization_insights']['feature_insights']['feature_usage_correlation']
        feature_names = ['feature1', 'feature2', 'feature3']
        
        # Reconstruct correlation matrix
        corr_matrix = np.zeros((3, 3))
        for i, name1 in enumerate(feature_names):
            for j, name2 in enumerate(feature_names):
                corr_matrix[i, j] = feature_correlations.get(f"{name1}_{name2}", 0)
        
        plt.figure(figsize=(8, 6))
        sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', xticklabels=feature_names, yticklabels=feature_names)
        plt.title('Feature Usage Correlation')
        plt.savefig('feature_usage_correlation.png')
        plt.close()

        return {
            'charts_generated': [
                'subscription_plan_distribution.png',
                'churn_risk_pie.png',
                'content_preference_radar.png',
                'communication_preferences.png',
                'ltv_by_plan_boxplot.png',
                'referral_sources_pie.png',
                'feature_usage_correlation.png'
            ]
        }

def main():
    
    with open('marketing_insights_report.json', 'r') as f:
        marketing_insights = json.load(f)
    
    # Initialize and run analysis
    analytics = UserAnalytics()
    comprehensive_report = analytics.generate_comprehensive_report()
    advanced_charts = analytics.create_advanced_visualizations()
    additional_charts = analytics.generate_additional_charts(marketing_insights)
    
    # Print key highlights
    print("Marketing Insights Report Generated!")
    print("\nKey Highlights:")
    print(f"Total Users Analyzed: {len(analytics.users_df)}")
    print(f"Average Lifetime Value: ${analytics.users_df['lifetime_value'].mean():.2f}")
    print(f"Churn Risk Distribution:")
    churn_segments = pd.cut(
        analytics.users_df['churn_risk'], 
        bins=[0, 0.2, 0.4, 0.6, 0.8, 1], 
        labels=['Very Low', 'Low', 'Medium', 'High', 'Very High']
    )
    print(churn_segments.value_counts(normalize=True))

    print("\nAdvanced Charts Generated:")
    for chart in advanced_charts['charts_generated']:
        print(f"- {chart}")

    print("Additional Charts Generated:")
    for chart in additional_charts['charts_generated']:
        print(f"- {chart}")

if __name__ == '__main__':
    main()