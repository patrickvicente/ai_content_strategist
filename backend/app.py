from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta
import os

from config import config
from models import db, Platform, Profile, ContentPillar, ContentIdea, ContentManager, Task, ContentSubtask, Analytics
from claude_service import ClaudeService

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(app)
    
    # Initialize Claude service
    app.claude_service = ClaudeService(app.config.get('CLAUDE_API_KEY')) if app.config.get('CLAUDE_API_KEY') else None
    
    # API Routes
    
    # Platforms
    @app.route('/api/platforms', methods=['GET'])
    def get_platforms():
        platforms = Platform.query.all()
        return jsonify([platform.to_dict() for platform in platforms])
    
    @app.route('/api/platforms', methods=['POST'])
    def create_platform():
        data = request.get_json()
        platform = Platform(
            platform_name=data['platform_name'],
            current_followers=data.get('current_followers', 0),
            goal_followers=data.get('goal_followers', 0)
        )
        db.session.add(platform)
        db.session.commit()
        return jsonify(platform.to_dict()), 201
    
    @app.route('/api/platforms/<int:platform_id>', methods=['PUT'])
    def update_platform(platform_id):
        platform = Platform.query.get_or_404(platform_id)
        data = request.get_json()
        
        platform.platform_name = data.get('platform_name', platform.platform_name)
        platform.current_followers = data.get('current_followers', platform.current_followers)
        platform.goal_followers = data.get('goal_followers', platform.goal_followers)
        platform.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(platform.to_dict())
    
    @app.route('/api/platforms/<int:platform_id>', methods=['DELETE'])
    def delete_platform(platform_id):
        platform = Platform.query.get_or_404(platform_id)
        db.session.delete(platform)
        db.session.commit()
        return '', 204
    
    # Profile
    @app.route('/api/profile', methods=['GET'])
    def get_profile():
        profile = Profile.query.first()
        if not profile:
            profile = Profile()
            db.session.add(profile)
            db.session.commit()
        return jsonify(profile.to_dict())
    
    @app.route('/api/profile', methods=['PUT'])
    def update_profile():
        profile = Profile.query.first()
        if not profile:
            profile = Profile()
            db.session.add(profile)
        
        data = request.get_json()
        profile.mission = data.get('mission', profile.mission)
        profile.goals = data.get('goals', profile.goals)
        profile.vision = data.get('vision', profile.vision)
        profile.niche = data.get('niche', profile.niche)
        profile.target_audience = data.get('target_audience', profile.target_audience)
        profile.stories = data.get('stories', profile.stories)
        profile.motivation = data.get('motivation', profile.motivation)
        profile.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(profile.to_dict())
    
    # Content Pillars
    @app.route('/api/content-pillars', methods=['GET'])
    def get_content_pillars():
        pillars = ContentPillar.query.all()
        return jsonify([pillar.to_dict() for pillar in pillars])
    
    @app.route('/api/content-pillars', methods=['POST'])
    def create_content_pillar():
        data = request.get_json()
        pillar = ContentPillar(
            pillar_name=data['pillar_name'],
            description=data.get('description', ''),
            keywords=data.get('keywords', ''),
            target_audience=data.get('target_audience', ''),
            content_frequency=data.get('content_frequency', ''),
            goals=data.get('goals', ''),
            color=data.get('color', '#3B82F6')
        )
        db.session.add(pillar)
        db.session.commit()
        return jsonify(pillar.to_dict()), 201
    
    @app.route('/api/content-pillars/<int:pillar_id>', methods=['PUT'])
    def update_content_pillar(pillar_id):
        pillar = ContentPillar.query.get_or_404(pillar_id)
        data = request.get_json()
        
        pillar.pillar_name = data.get('pillar_name', pillar.pillar_name)
        pillar.description = data.get('description', pillar.description)
        pillar.keywords = data.get('keywords', pillar.keywords)
        pillar.target_audience = data.get('target_audience', pillar.target_audience)
        pillar.content_frequency = data.get('content_frequency', pillar.content_frequency)
        pillar.goals = data.get('goals', pillar.goals)
        pillar.color = data.get('color', pillar.color)
        pillar.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(pillar.to_dict())
    
    @app.route('/api/content-pillars/<int:pillar_id>', methods=['DELETE'])
    def delete_content_pillar(pillar_id):
        pillar = ContentPillar.query.get_or_404(pillar_id)
        db.session.delete(pillar)
        db.session.commit()
        return '', 204
    
    # Content Ideas
    @app.route('/api/content-ideas', methods=['GET'])
    def get_content_ideas():
        ideas = ContentIdea.query.all()
        return jsonify([idea.to_dict() for idea in ideas])
    
    @app.route('/api/content-ideas', methods=['POST'])
    def create_content_idea():
        data = request.get_json()
        idea = ContentIdea(
            title=data['title'],
            description=data.get('description', ''),
            content_pillar_id=data['content_pillar_id'],
            inspiration_link=data.get('inspiration_link', ''),
            priority=data.get('priority', 'medium'),
            status=data.get('status', 'pending')
        )
        db.session.add(idea)
        db.session.commit()
        return jsonify(idea.to_dict()), 201
    
    @app.route('/api/content-ideas/<int:idea_id>', methods=['PUT'])
    def update_content_idea(idea_id):
        idea = ContentIdea.query.get_or_404(idea_id)
        data = request.get_json()
        
        idea.title = data.get('title', idea.title)
        idea.description = data.get('description', idea.description)
        idea.content_pillar_id = data.get('content_pillar_id', idea.content_pillar_id)
        idea.inspiration_link = data.get('inspiration_link', idea.inspiration_link)
        idea.priority = data.get('priority', idea.priority)
        idea.status = data.get('status', idea.status)
        idea.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(idea.to_dict())
    
    @app.route('/api/content-ideas/<int:idea_id>', methods=['DELETE'])
    def delete_content_idea(idea_id):
        idea = ContentIdea.query.get_or_404(idea_id)
        db.session.delete(idea)
        db.session.commit()
        return '', 204
    
    # Content Manager
    @app.route('/api/content-manager', methods=['GET'])
    def get_content_manager():
        content_items = ContentManager.query.all()
        return jsonify([item.to_dict() for item in content_items])
    
    @app.route('/api/content-manager', methods=['POST'])
    def create_content_item():
        data = request.get_json()
        
        # Parse publish_time if provided
        publish_time = None
        if data.get('publish_time'):
            publish_time = datetime.fromisoformat(data['publish_time'].replace('Z', '+00:00'))
        
        # Helper function to convert empty strings to None for numeric fields
        def parse_numeric(value, default=None):
            if value == '' or value is None:
                return default
            try:
                return float(value) if '.' in str(value) else int(value)
            except (ValueError, TypeError):
                return default
        
        content_item = ContentManager(
            content_title=data['content_title'],
            content_idea_id=parse_numeric(data.get('content_idea_id')),
            content_pillar_id=parse_numeric(data.get('content_pillar_id')),
            status=data.get('status', 'planning'),
            content_type=data.get('content_type') or None,
            content_format=data.get('content_format') or None,
            publish_time=publish_time,
            intention=data.get('intention', ''),
            hook=data.get('hook', ''),
            caption=data.get('caption', ''),
            script=data.get('script', ''),
            music=data.get('music', ''),
            duration=parse_numeric(data.get('duration')),
            minutes_spent=parse_numeric(data.get('minutes_spent')),
            content_link=data.get('content_link', ''),
            hashtags_used=data.get('hashtags_used', ''),
            notes=data.get('notes', ''),
            views=parse_numeric(data.get('views'), 0),
            likes=parse_numeric(data.get('likes'), 0),
            comments=parse_numeric(data.get('comments'), 0),
            shares=parse_numeric(data.get('shares'), 0),
            saves=parse_numeric(data.get('saves'), 0),
            retention_rate=parse_numeric(data.get('retention_rate'), 0.0)
        )
        db.session.add(content_item)
        db.session.flush()  # Flush to get the ID
        
        # Handle platform assignments if provided
        if 'platform_ids' in data and data['platform_ids']:
            platform_ids = [int(pid) for pid in data['platform_ids'] if pid]
            platforms = Platform.query.filter(Platform.id.in_(platform_ids)).all()
            content_item.platforms = platforms
        
        db.session.commit()
        return jsonify(content_item.to_dict()), 201
    
    @app.route('/api/content-manager/<int:content_id>', methods=['PUT'])
    def update_content_item(content_id):
        content_item = ContentManager.query.get_or_404(content_id)
        data = request.get_json()
        
        # Helper function to convert empty strings to None for numeric fields
        def parse_numeric(value, current_value):
            if value == '' or value is None:
                return None
            try:
                return float(value) if '.' in str(value) else int(value)
            except (ValueError, TypeError):
                return current_value
        
        # Parse publish_time if provided
        if data.get('publish_time'):
            content_item.publish_time = datetime.fromisoformat(data['publish_time'].replace('Z', '+00:00'))
        elif data.get('publish_time') == '':
            content_item.publish_time = None
        
        content_item.content_title = data.get('content_title', content_item.content_title)
        content_item.content_idea_id = parse_numeric(data.get('content_idea_id'), content_item.content_idea_id)
        content_item.content_pillar_id = parse_numeric(data.get('content_pillar_id'), content_item.content_pillar_id)
        content_item.status = data.get('status', content_item.status)
        content_item.content_type = data.get('content_type') or None
        content_item.content_format = data.get('content_format') or None
        content_item.intention = data.get('intention', content_item.intention)
        content_item.hook = data.get('hook', content_item.hook)
        content_item.caption = data.get('caption', content_item.caption)
        content_item.script = data.get('script', content_item.script)
        content_item.music = data.get('music', content_item.music)
        content_item.duration = parse_numeric(data.get('duration'), content_item.duration)
        content_item.minutes_spent = parse_numeric(data.get('minutes_spent'), content_item.minutes_spent)
        content_item.content_link = data.get('content_link', content_item.content_link)
        content_item.hashtags_used = data.get('hashtags_used', content_item.hashtags_used)
        content_item.notes = data.get('notes', content_item.notes)
        content_item.views = parse_numeric(data.get('views'), content_item.views)
        content_item.likes = parse_numeric(data.get('likes'), content_item.likes)
        content_item.shares = parse_numeric(data.get('shares'), content_item.shares)
        content_item.comments = parse_numeric(data.get('comments'), content_item.comments)
        content_item.saves = parse_numeric(data.get('saves'), content_item.saves)
        content_item.retention_rate = parse_numeric(data.get('retention_rate'), content_item.retention_rate)
        content_item.updated_at = datetime.utcnow()
        
        # Handle platform assignments if provided
        if 'platform_ids' in data:
            if data['platform_ids']:
                platform_ids = [int(pid) for pid in data['platform_ids'] if pid]
                platforms = Platform.query.filter(Platform.id.in_(platform_ids)).all()
                content_item.platforms = platforms
            else:
                content_item.platforms = []
        
        db.session.commit()
        return jsonify(content_item.to_dict())
    
    @app.route('/api/content-manager/<int:content_id>', methods=['DELETE'])
    def delete_content_item(content_id):
        content_item = ContentManager.query.get_or_404(content_id)
        db.session.delete(content_item)
        db.session.commit()
        return '', 204
    
    @app.route('/api/content-manager/<int:content_id>/publish', methods=['POST'])
    def publish_content_item(content_id):
        content_item = ContentManager.query.get_or_404(content_id)
        data = request.get_json()
        
        # Helper function to convert empty strings to None for numeric fields
        def parse_numeric(value):
            if value == '' or value is None:
                return None
            try:
                return float(value) if '.' in str(value) else int(value)
            except (ValueError, TypeError):
                return None
        
        # Parse publish_time
        if data.get('publish_time'):
            content_item.publish_time = datetime.fromisoformat(data['publish_time'].replace('Z', '+00:00'))
        
        # Update fields for publishing
        content_item.status = 'published'
        content_item.content_link = data.get('content_link', content_item.content_link)
        content_item.minutes_spent = parse_numeric(data.get('minutes_spent')) or content_item.minutes_spent
        content_item.notes = data.get('notes', content_item.notes)
        content_item.updated_at = datetime.utcnow()
        
        # Handle platform assignments if provided
        if 'platform_ids' in data:
            platform_ids = data['platform_ids']
            platforms = Platform.query.filter(Platform.id.in_(platform_ids)).all()
            content_item.platforms = platforms
        
        db.session.commit()
        return jsonify(content_item.to_dict()), 200
    
    # Tasks
    @app.route('/api/tasks', methods=['GET'])
    def get_tasks():
        tasks = Task.query.all()
        return jsonify([task.to_dict() for task in tasks])
    
    @app.route('/api/tasks', methods=['POST'])
    def create_task():
        data = request.get_json()
        
        due_date = None
        if data.get('due_date'):
            due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
        
        task = Task(
            title=data['title'],
            description=data.get('description', ''),
            content_id=data.get('content_id') if data.get('content_id') else None,
            due_date=due_date,
            status=data.get('status', 'pending'),
            priority=data.get('priority', 'medium'),
            estimated_hours=data.get('estimated_hours') if data.get('estimated_hours') else None
        )
        db.session.add(task)
        db.session.commit()
        return jsonify(task.to_dict()), 201
    
    @app.route('/api/tasks/<int:task_id>', methods=['PUT'])
    def update_task(task_id):
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        if data.get('due_date'):
            task.due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
        elif data.get('due_date') == '':
            task.due_date = None
        
        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.content_id = data.get('content_id') if data.get('content_id') else None
        task.status = data.get('status', task.status)
        task.priority = data.get('priority', task.priority)
        task.estimated_hours = data.get('estimated_hours') if data.get('estimated_hours') else None
        task.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(task.to_dict())
    
    @app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
    def delete_task(task_id):
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return '', 204
    
    # Analytics
    @app.route('/api/analytics', methods=['GET'])
    def get_analytics():
        # Get analytics for the past week by default
        days = request.args.get('days', 7, type=int)
        start_date = datetime.utcnow().date() - timedelta(days=days)
        
        analytics = Analytics.query.filter(Analytics.date_recorded >= start_date).all()
        return jsonify([analytic.to_dict() for analytic in analytics])
    
    @app.route('/api/analytics', methods=['POST'])
    def create_analytics():
        data = request.get_json()
        
        analytics = Analytics(
            content_id=data['content_id'],
            platform_id=data['platform_id'],
            date_recorded=datetime.fromisoformat(data['date_recorded']).date(),
            views=data.get('views', 0),
            likes=data.get('likes', 0),
            shares=data.get('shares', 0),
            comments=data.get('comments', 0),
            saves=data.get('saves', 0),
            retention_rate=data.get('retention_rate', 0.0),
            engagement_rate=data.get('engagement_rate', 0.0)
        )
        db.session.add(analytics)
        db.session.commit()
        return jsonify(analytics.to_dict()), 201
    
    # Claude AI Integration Routes
    @app.route('/api/ai/generate-strategy', methods=['POST'])
    def generate_strategy():
        if not current_app.claude_service:
            return jsonify({'error': 'Claude API key not configured'}), 500
        
        # Get profile data
        profile = Profile.query.first()
        if not profile:
            return jsonify({'error': 'Profile not found'}), 404
        
        # Get recent analytics
        analytics = Analytics.query.filter(
            Analytics.date_recorded >= datetime.utcnow().date() - timedelta(days=14)
        ).all()
        
        # Get platforms
        platforms = Platform.query.all()
        
        strategy = current_app.claude_service.generate_content_strategy(
            profile.to_dict(),
            [a.to_dict() for a in analytics],
            [p.to_dict() for p in platforms]
        )
        
        return jsonify(strategy)
    
    @app.route('/api/ai/generate-ideas', methods=['POST'])
    def generate_ideas():
        if not current_app.claude_service:
            return jsonify({'error': 'Claude API key not configured'}), 500
        
        data = request.get_json()
        pillar_id = data.get('pillar_id')
        
        pillar = ContentPillar.query.get_or_404(pillar_id)
        profile = Profile.query.first()
        
        # Get recent performance data for similar content
        recent_performance = Analytics.query.filter(
            Analytics.date_recorded >= datetime.utcnow().date() - timedelta(days=30)
        ).all()
        
        ideas = current_app.claude_service.generate_content_ideas(
            pillar.pillar_name,
            profile.target_audience if profile else "General audience",
            [p.to_dict() for p in recent_performance]
        )
        
        return jsonify(ideas)
    
    @app.route('/api/ai/optimize-content', methods=['POST'])
    def optimize_content():
        if not current_app.claude_service:
            return jsonify({'error': 'Claude API key not configured'}), 500
        
        data = request.get_json()
        content_id = data.get('content_id')
        platform = data.get('platform')
        
        content = ContentManager.query.get_or_404(content_id)
        
        # Get platform analytics
        platform_obj = Platform.query.filter_by(platform_name=platform).first()
        if not platform_obj:
            return jsonify({'error': 'Platform not found'}), 404
        
        analytics = Analytics.query.filter_by(platform_id=platform_obj.id).all()
        
        optimized = current_app.claude_service.optimize_content(
            content.to_dict(),
            platform,
            [a.to_dict() for a in analytics]
        )
        
        return jsonify(optimized)
    
    @app.route('/api/ai/analyze-performance', methods=['POST'])
    def analyze_performance():
        if not current_app.claude_service:
            return jsonify({'error': 'Claude API key not configured'}), 500
        
        # Get all content with analytics
        content_items = ContentManager.query.all()
        platforms = Platform.query.all()
        
        analysis = current_app.claude_service.analyze_performance(
            [c.to_dict() for c in content_items],
            [p.platform_name for p in platforms]
        )
        
        return jsonify(analysis)
    
    @app.route('/api/ai/weekly-plan', methods=['POST'])
    def generate_weekly_plan():
        if not current_app.claude_service:
            return jsonify({'error': 'Claude API key not configured'}), 500
        
        pillars = ContentPillar.query.all()
        platforms = Platform.query.all()
        profile = Profile.query.first()
        
        plan = current_app.claude_service.generate_weekly_content_plan(
            [p.to_dict() for p in pillars],
            [p.platform_name for p in platforms],
            profile.goals if profile else "Increase engagement and grow following"
        )
        
        return jsonify(plan)
    
    # Dashboard summary
    @app.route('/api/dashboard/summary', methods=['GET'])
    def get_dashboard_summary():
        # Get counts and recent data
        total_platforms = Platform.query.count()
        total_content_items = ContentManager.query.count()
        published_content = ContentManager.query.filter_by(status='published').count()
        pending_tasks = Task.query.filter_by(status='pending').count()
        
        # Get recent analytics
        recent_analytics = Analytics.query.filter(
            Analytics.date_recorded >= datetime.utcnow().date() - timedelta(days=7)
        ).all()
        
        total_views = sum(a.views for a in recent_analytics)
        total_engagement = sum(a.likes + a.shares + a.comments for a in recent_analytics)
        
        return jsonify({
            'total_platforms': total_platforms,
            'total_content_items': total_content_items,
            'published_content': published_content,
            'pending_tasks': pending_tasks,
            'total_views_week': total_views,
            'total_engagement_week': total_engagement,
            'recent_analytics': [a.to_dict() for a in recent_analytics[:10]]
        })
    
    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True) 