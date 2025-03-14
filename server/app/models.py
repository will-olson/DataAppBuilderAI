from . import db
from datetime import datetime
from faker import Faker
import random
import uuid

class User(db.Model):
    __tablename__ = 'users'

    # Core Identifiers
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    # Account Metadata
    account_created = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime, nullable=True)
    account_age_days = db.Column(db.Integer, default=0)
    
    # Demographic & Psychographic Insights
    age = db.Column(db.Integer, nullable=True)
    gender = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    language = db.Column(db.String(50), default='en')
    timezone = db.Column(db.String(50), nullable=True)
    
    # Engagement Metrics
    avg_visit_time = db.Column(db.Float, default=0.0, nullable=False)  # in minutes
    total_sessions = db.Column(db.Integer, default=0)
    session_frequency = db.Column(db.Float, default=0.0)  # sessions per week
    
    # Communication Engagement
    last_email_open = db.Column(db.DateTime, nullable=True)
    last_email_click = db.Column(db.DateTime, nullable=True)
    email_open_rate = db.Column(db.Float, default=0.0)
    email_click_rate = db.Column(db.Float, default=0.0)
    
    # Product Interaction
    last_app_login = db.Column(db.DateTime, nullable=True)
    last_app_click = db.Column(db.DateTime, nullable=True)
    last_completed_action = db.Column(db.String(100), nullable=True)
    
    # Conversion & Revenue Metrics
    plan = db.Column(db.String(20), default='basic', nullable=False)
    plan_start_date = db.Column(db.DateTime, nullable=True)
    lifetime_value = db.Column(db.Float, default=0.0)
    total_purchases = db.Column(db.Integer, default=0)
    average_purchase_value = db.Column(db.Float, default=0.0)
    
    # Retention Indicators
    churn_risk = db.Column(db.Float, default=0.0)  # 0-1 probability of churn
    engagement_score = db.Column(db.Float, default=0.0)  # composite engagement metric
    
    # Personalization Attributes
    preferred_content_type = db.Column(db.String(50), nullable=True)
    communication_preference = db.Column(db.String(50), default='email')
    notification_settings = db.Column(db.JSON, nullable=True)
    
    # Feature Usage
    feature_usage_json = db.Column(db.JSON, nullable=True)
    
    # Referral & Growth
    referral_source = db.Column(db.String(100), nullable=True)
    referral_count = db.Column(db.Integer, default=0)
    
    # Compliance & Privacy
    marketing_consent = db.Column(db.Boolean, default=False)
    last_consent_update = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f'<User {self.username}>'

    @classmethod
    def generate_fake_users(cls, count=100, start_index=0):
        fake = Faker()
        users = []
        used_usernames = set()
        used_emails = set()
        
        plans = ['basic', 'plus', 'premium']
        content_types = ['video', 'text', 'audio', 'interactive']
        communication_prefs = ['email', 'sms', 'push_notification', 'none']
        
        for i in range(start_index, start_index + count):
            # Generate a unique username with index
            base_username = fake.user_name()
            username = f"{base_username}_{i}"
            
            # Ensure username is unique
            while username in used_usernames:
                username = f"{base_username}_{i}_{uuid.uuid4().hex[:4]}"
            
            # Generate a unique email
            base_email = fake.email()
            email = f"{i}_{base_email}"
            
            # Ensure email is unique
            while email in used_emails:
                email = f"{i}_{uuid.uuid4().hex[:4]}_{base_email}"
            
            # Generate randomized timestamps
            account_created = fake.date_time_between(start_date='-2y', end_date='now')
            
            # Calculate account age
            account_age = (datetime.utcnow() - account_created).days
            
            # Randomize plan and metrics
            user_plan = random.choice(plans)
            total_sessions = random.randint(1, 500)
            
            # Generate engagement score (composite metric)
            engagement_score = round(random.uniform(0, 1), 2)
            
            # Lifetime value calculation
            lifetime_value = round(random.uniform(0, 1000), 2)
            
            # Total purchases calculation
            total_purchases = random.randint(0, 20)
            
            # Average purchase value calculation
            average_purchase_value = round(lifetime_value / max(1, total_purchases), 2)
            
            user = cls(
                username=username,
                email=email,
                uuid=str(uuid.uuid4()),
                account_created=account_created,
                account_age_days=account_age,
                
                # Demographic data
                age=random.randint(18, 65),
                gender=random.choice(['male', 'female', 'non-binary', 'prefer_not_to_say']),
                location=fake.country(),
                language=fake.language_code(),
                timezone=fake.timezone(),
                
                # Engagement metrics
                last_login=fake.date_time_between(start_date=account_created, end_date='now'),
                avg_visit_time=round(random.uniform(1, 60), 2),
                total_sessions=total_sessions,
                session_frequency=round(total_sessions / 52, 2),  # sessions per week
                
                # Communication metrics
                last_email_open=fake.date_time_between(start_date=account_created, end_date='now'),
                last_email_click=fake.date_time_between(start_date=account_created, end_date='now'),
                email_open_rate=round(random.uniform(0, 1), 2),
                email_click_rate=round(random.uniform(0, 1), 2),
                
                # Product interaction
                last_app_login=fake.date_time_between(start_date=account_created, end_date='now'),
                last_app_click=fake.date_time_between(start_date=account_created, end_date='now'),
                last_completed_action=random.choice(['profile_update', 'purchase', 'subscription_change', 'content_create']),
                
                # Subscription details
                plan=user_plan,
                plan_start_date=account_created,
                lifetime_value=lifetime_value,
                total_purchases=total_purchases,
                average_purchase_value=average_purchase_value,
                
                # Retention & engagement
                churn_risk=round(random.uniform(0, 1), 2),
                engagement_score=engagement_score,
                
                # Personalization
                preferred_content_type=random.choice(content_types),
                communication_preference=random.choice(communication_prefs),
                notification_settings={
                    'email': random.choice([True, False]),
                    'sms': random.choice([True, False]),
                    'push': random.choice([True, False])
                },
                
                # Feature usage (example)
                feature_usage_json={
                    'feature1': round(random.uniform(0, 1), 2),
                    'feature2': round(random.uniform(0, 1), 2),
                    'feature3': round(random.uniform(0, 1), 2)
                },
                
                # Referral
                referral_source=random.choice(['organic', 'paid_ad', 'referral', 'social_media']),
                referral_count=random.randint(0, 10),
                
                # Compliance
                marketing_consent=random.choice([True, False]),
                last_consent_update=fake.date_time_between(start_date=account_created, end_date='now')
            )
            
            # Track used usernames and emails
            used_usernames.add(username)
            used_emails.add(email)
            users.append(user)
        
        return users