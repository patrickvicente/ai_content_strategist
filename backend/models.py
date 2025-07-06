from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import Text, JSON
import json

db = SQLAlchemy()

class Platform(db.Model):
    __tablename__ = 'platforms'
    
    id = db.Column(db.Integer, primary_key=True)
    platform_name = db.Column(db.String(100), nullable=False, unique=True)
    current_followers = db.Column(db.Integer, default=0)
    goal_followers = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'platform_name': self.platform_name,
            'current_followers': self.current_followers,
            'goal_followers': self.goal_followers,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Profile(db.Model):
    __tablename__ = 'profile'
    
    id = db.Column(db.Integer, primary_key=True)
    mission = db.Column(Text)
    goals = db.Column(Text)
    vision = db.Column(Text)
    niche = db.Column(db.String(200))
    target_audience = db.Column(Text)
    stories = db.Column(Text)
    motivation = db.Column(Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'mission': self.mission,
            'goals': self.goals,
            'vision': self.vision,
            'niche': self.niche,
            'target_audience': self.target_audience,
            'stories': self.stories,
            'motivation': self.motivation,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ContentPillar(db.Model):
    __tablename__ = 'content_pillars'
    
    id = db.Column(db.Integer, primary_key=True)
    pillar_name = db.Column(db.String(100), nullable=False)
    description = db.Column(Text)
    keywords = db.Column(Text)  # Comma-separated keywords for this pillar
    target_audience = db.Column(Text)  # Specific audience for this pillar
    content_frequency = db.Column(db.String(50))  # How often to post this pillar content
    goals = db.Column(Text)  # Goals and objectives for this pillar
    color = db.Column(db.String(7), default='#3B82F6')  # hex color
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    content_ideas = db.relationship('ContentIdea', backref='pillar', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'pillar_name': self.pillar_name,
            'description': self.description,
            'keywords': self.keywords,
            'target_audience': self.target_audience,
            'content_frequency': self.content_frequency,
            'goals': self.goals,
            'color': self.color,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ContentIdea(db.Model):
    __tablename__ = 'content_ideas'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    content_pillar_id = db.Column(db.Integer, db.ForeignKey('content_pillars.id'), nullable=False)
    inspiration_link = db.Column(db.String(500))  # Original viral content link
    priority = db.Column(db.Enum('high', 'medium', 'low', name='priority_enum'), default='medium')
    status = db.Column(db.Enum('pending', 'approved', 'rejected', name='idea_status_enum'), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    content_items = db.relationship('ContentManager', backref='idea', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'content_pillar_id': self.content_pillar_id,
            'inspiration_link': self.inspiration_link,
            'priority': self.priority,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ContentManager(db.Model):
    __tablename__ = 'content_manager'
    
    id = db.Column(db.Integer, primary_key=True)
    content_title = db.Column(db.String(200), nullable=False)  # Content Title
    content_idea_id = db.Column(db.Integer, db.ForeignKey('content_ideas.id'), nullable=True)  # Original Idea (optional)
    content_pillar_id = db.Column(db.Integer, db.ForeignKey('content_pillars.id'), nullable=True)  # Direct pillar relation
    status = db.Column(db.Enum('planning', 'scripting', 'filming', 'editing', 'scheduled', 'published', name='content_status_enum'), default='planning')
    content_type = db.Column(db.Enum('short_form', 'carousel', 'story', 'long_form', 'post', name='content_type_enum'))
    content_format = db.Column(db.Enum('fitcheck', 'grwm', 'cinematic', 'trendy', 'pov', 'vlog', 'head_talk', name='content_format_enum'))
    publish_time = db.Column(db.DateTime)
    intention = db.Column(Text)  # Why would your audience watch, like and share
    hook = db.Column(Text)
    caption = db.Column(Text)
    script = db.Column(Text)
    tone = db.Column(Text)  # Content tone/style (e.g., casual, professional, humorous, inspirational)
    call_to_action = db.Column(Text)  # Specific call to action for engagement
    music = db.Column(Text)  # Music or audio details
    duration = db.Column(db.Integer)  # in seconds
    minutes_spent = db.Column(db.Float)  # Minutes spent on creating
    content_link = db.Column(db.String(500))  # Link to published content
    hashtags_used = db.Column(Text)
    notes = db.Column(Text)
    
    # Repurpose tracking
    original_content_id = db.Column(db.Integer, db.ForeignKey('content_manager.id'), nullable=True)  # Links to original content if repurposed
    is_repurposed = db.Column(db.Boolean, default=False)  # Flag to indicate if this is repurposed content
    
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    shares = db.Column(db.Integer, default=0)
    comments = db.Column(db.Integer, default=0)
    saves = db.Column(db.Integer, default=0)
    retention_rate = db.Column(db.Float, default=0.0)  # % who watched full video
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    platforms = db.relationship('Platform', secondary='content_platforms', backref='content_items')
    pillar = db.relationship('ContentPillar', backref='content_items', lazy=True)
    subtasks = db.relationship('ContentSubtask', backref='content', lazy=True)
    analytics = db.relationship('Analytics', backref='content', lazy=True)
    
    # Repurpose relationships
    original_content = db.relationship('ContentManager', remote_side=[id], backref='repurposed_content', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'content_title': self.content_title,
            'content_idea_id': self.content_idea_id,
            'content_pillar_id': self.content_pillar_id,
            'status': self.status,
            'content_type': self.content_type,
            'content_format': self.content_format,
            'publish_time': self.publish_time.isoformat() if self.publish_time else None,
            'intention': self.intention,
            'hook': self.hook,
            'caption': self.caption,
            'script': self.script,
            'tone': self.tone,
            'call_to_action': self.call_to_action,
            'music': self.music,
            'duration': self.duration,
            'minutes_spent': self.minutes_spent,
            'content_link': self.content_link,
            'hashtags_used': self.hashtags_used,
            'notes': self.notes,
            'original_content_id': self.original_content_id,
            'is_repurposed': self.is_repurposed,
            'views': self.views,
            'likes': self.likes,
            'shares': self.shares,
            'comments': self.comments,
            'saves': self.saves,
            'retention_rate': self.retention_rate,
            'platforms': [{'id': p.id, 'platform_name': p.platform_name} for p in self.platforms],
            'original_content': {'id': self.original_content.id, 'content_title': self.original_content.content_title} if self.original_content else None,
            'repurposed_count': len(self.repurposed_content) if hasattr(self, 'repurposed_content') else 0,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Junction table for many-to-many relationship between content and platforms
content_platforms = db.Table('content_platforms',
    db.Column('content_id', db.Integer, db.ForeignKey('content_manager.id'), primary_key=True),
    db.Column('platform_id', db.Integer, db.ForeignKey('platforms.id'), primary_key=True)
)

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    content_id = db.Column(db.Integer, db.ForeignKey('content_manager.id'), nullable=True)  # Optional relation to content
    due_date = db.Column(db.DateTime)
    status = db.Column(db.Enum('pending', 'completed', name='task_status_enum'), default='pending')
    priority = db.Column(db.Enum('high', 'medium', 'low', name='task_priority_enum'), default='medium')
    estimated_hours = db.Column(db.Float, nullable=True)  # Estimated time in hours
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    content = db.relationship('ContentManager', backref='tasks', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'content_id': self.content_id,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'status': self.status,
            'priority': self.priority,
            'estimated_hours': self.estimated_hours,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ContentSubtask(db.Model):
    __tablename__ = 'content_subtasks'
    
    id = db.Column(db.Integer, primary_key=True)
    content_id = db.Column(db.Integer, db.ForeignKey('content_manager.id'), nullable=False)
    task_title = db.Column(db.String(200), nullable=False)
    status = db.Column(db.Enum('pending', 'completed', name='subtask_status_enum'), default='pending')
    due_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'content_id': self.content_id,
            'task_title': self.task_title,
            'status': self.status,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Analytics(db.Model):
    __tablename__ = 'analytics'
    
    id = db.Column(db.Integer, primary_key=True)
    content_id = db.Column(db.Integer, db.ForeignKey('content_manager.id'), nullable=False)
    platform_id = db.Column(db.Integer, db.ForeignKey('platforms.id'), nullable=False)
    date_recorded = db.Column(db.Date, nullable=False)
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    shares = db.Column(db.Integer, default=0)
    comments = db.Column(db.Integer, default=0)
    saves = db.Column(db.Integer, default=0)
    retention_rate = db.Column(db.Float, default=0.0)
    engagement_rate = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'content_id': self.content_id,
            'platform_id': self.platform_id,
            'date_recorded': self.date_recorded.isoformat(),
            'views': self.views,
            'likes': self.likes,
            'shares': self.shares,
            'comments': self.comments,
            'saves': self.saves,
            'retention_rate': self.retention_rate,
            'engagement_rate': self.engagement_rate,
            'created_at': self.created_at.isoformat()
        }

# Trend Analytics Models
class TrendingTopic(db.Model):
    __tablename__ = 'trending_topics'
    
    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(200), nullable=False)
    hashtags = db.Column(Text)  # JSON string of related hashtags
    platforms = db.Column(Text)  # JSON string of platform data
    trend_score = db.Column(db.Float, default=0.0)  # 0-100 trending score
    niche_category = db.Column(db.String(100))
    volume_24h = db.Column(db.Integer, default=0)  # Posts in last 24h
    engagement_rate = db.Column(db.Float, default=0.0)
    growth_rate = db.Column(db.Float, default=0.0)  # % growth in last 24h
    peak_time = db.Column(db.DateTime)  # When trend peaked
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'topic': self.topic,
            'hashtags': json.loads(self.hashtags) if self.hashtags else [],
            'platforms': json.loads(self.platforms) if self.platforms else {},
            'trend_score': self.trend_score,
            'niche_category': self.niche_category,
            'volume_24h': self.volume_24h,
            'engagement_rate': self.engagement_rate,
            'growth_rate': self.growth_rate,
            'peak_time': self.peak_time.isoformat() if self.peak_time else None,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class ContentPerformanceAnalysis(db.Model):
    __tablename__ = 'content_performance_analysis'
    
    id = db.Column(db.Integer, primary_key=True)
    content_id = db.Column(db.Integer, db.ForeignKey('content_manager.id'), nullable=False)
    analysis_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Performance Metrics
    performance_score = db.Column(db.Float, default=0.0)  # 0-100 overall score
    engagement_score = db.Column(db.Float, default=0.0)
    viral_potential = db.Column(db.Float, default=0.0)
    trend_alignment = db.Column(db.Float, default=0.0)
    
    # Analysis Results
    best_performing_elements = db.Column(Text)  # JSON of what worked
    improvement_suggestions = db.Column(Text)  # JSON of suggestions
    similar_trending_content = db.Column(Text)  # JSON of similar trending posts
    optimal_post_time = db.Column(db.Time)
    predicted_reach = db.Column(db.Integer)
    
    # Relationships
    content = db.relationship('ContentManager', backref='performance_analyses')
    
    def to_dict(self):
        return {
            'id': self.id,
            'content_id': self.content_id,
            'analysis_date': self.analysis_date.isoformat(),
            'performance_score': self.performance_score,
            'engagement_score': self.engagement_score,
            'viral_potential': self.viral_potential,
            'trend_alignment': self.trend_alignment,
            'best_performing_elements': json.loads(self.best_performing_elements) if self.best_performing_elements else [],
            'improvement_suggestions': json.loads(self.improvement_suggestions) if self.improvement_suggestions else [],
            'similar_trending_content': json.loads(self.similar_trending_content) if self.similar_trending_content else [],
            'optimal_post_time': self.optimal_post_time.strftime('%H:%M') if self.optimal_post_time else None,
            'predicted_reach': self.predicted_reach
        }

class CompetitorAnalysis(db.Model):
    __tablename__ = 'competitor_analysis'
    
    id = db.Column(db.Integer, primary_key=True)
    competitor_name = db.Column(db.String(100), nullable=False)
    platform = db.Column(db.String(50), nullable=False)
    username = db.Column(db.String(100))
    niche_category = db.Column(db.String(100))
    
    # Metrics
    followers_count = db.Column(db.Integer, default=0)
    avg_engagement_rate = db.Column(db.Float, default=0.0)
    post_frequency = db.Column(db.Float, default=0.0)  # posts per day
    best_content_types = db.Column(Text)  # JSON array
    trending_hashtags = db.Column(Text)  # JSON array
    
    # Analysis
    content_strategy = db.Column(Text)  # What they're doing well
    posting_patterns = db.Column(Text)  # JSON of timing analysis
    growth_rate = db.Column(db.Float, default=0.0)
    
    last_analyzed = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'competitor_name': self.competitor_name,
            'platform': self.platform,
            'username': self.username,
            'niche_category': self.niche_category,
            'followers_count': self.followers_count,
            'avg_engagement_rate': self.avg_engagement_rate,
            'post_frequency': self.post_frequency,
            'best_content_types': json.loads(self.best_content_types) if self.best_content_types else [],
            'trending_hashtags': json.loads(self.trending_hashtags) if self.trending_hashtags else [],
            'content_strategy': self.content_strategy,
            'posting_patterns': json.loads(self.posting_patterns) if self.posting_patterns else {},
            'growth_rate': self.growth_rate,
            'last_analyzed': self.last_analyzed.isoformat(),
            'created_at': self.created_at.isoformat()
        }

class NicheInsights(db.Model):
    __tablename__ = 'niche_insights'
    
    id = db.Column(db.Integer, primary_key=True)
    niche_name = db.Column(db.String(100), nullable=False)
    insight_type = db.Column(db.String(50), nullable=False)  # trend, pattern, opportunity
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(Text)
    
    # Data
    supporting_data = db.Column(Text)  # JSON of metrics/evidence
    confidence_score = db.Column(db.Float, default=0.0)  # 0-100
    action_items = db.Column(Text)  # JSON array of suggested actions
    
    # Metadata
    priority = db.Column(db.String(20), default='medium')  # low, medium, high
    status = db.Column(db.String(20), default='active')  # active, archived
    expiry_date = db.Column(db.DateTime)  # When insight becomes stale
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'niche_name': self.niche_name,
            'insight_type': self.insight_type,
            'title': self.title,
            'description': self.description,
            'supporting_data': json.loads(self.supporting_data) if self.supporting_data else {},
            'confidence_score': self.confidence_score,
            'action_items': json.loads(self.action_items) if self.action_items else [],
            'priority': self.priority,
            'status': self.status,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 