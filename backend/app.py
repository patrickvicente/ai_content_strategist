from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from flask_migrate import Migrate
from datetime import datetime, timedelta
import os

from config import config
from models import db, Platform, Profile, ContentPillar, ContentIdea, ContentManager, Task, ContentSubtask, Analytics, TrendingTopic, ContentPerformanceAnalysis, CompetitorAnalysis, NicheInsights
from claude_service import ClaudeService
from analytics_service import AnalyticsService
import json

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
        content = ContentManager.query.get_or_404(content_id)
        data = request.get_json()
        
        def parse_numeric(value):
            if value == '' or value is None:
                return None
            try:
                return float(value)
            except (ValueError, TypeError):
                return None

        # Update with publish data
        if data.get('publish_time'):
            content.publish_time = datetime.fromisoformat(data['publish_time'].replace('Z', '+00:00'))
        content.content_link = data.get('content_link', content.content_link)
        content.minutes_spent = parse_numeric(data.get('minutes_spent')) or content.minutes_spent
        content.notes = data.get('notes', content.notes)
        content.status = 'published'
        
        # Update platforms if provided
        if 'platform_ids' in data and data['platform_ids']:
            platform_ids = [int(pid) for pid in data['platform_ids'] if pid]
            platforms = Platform.query.filter(Platform.id.in_(platform_ids)).all()
            content.platforms = platforms
        
        content.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(content.to_dict())
    
    # Repurpose Content
    @app.route('/api/content-manager/<int:content_id>/repurpose', methods=['POST'])
    def repurpose_content_item(content_id):
        original_content = ContentManager.query.get_or_404(content_id)
        
        # Only allow repurposing of published content
        if original_content.status != 'published':
            return jsonify({'error': 'Can only repurpose published content'}), 400
        
        try:
            # Create new content item based on original
            repurposed_content = ContentManager(
                content_title=f"Repurposed: {original_content.content_title}",
                content_idea_id=original_content.content_idea_id,
                content_pillar_id=original_content.content_pillar_id,
                status='planning',  # Reset to planning
                content_type=None,  # User should choose new type
                content_format=None,  # User should choose new format
                publish_time=None,  # Reset publish time
                intention=original_content.intention,  # Keep intention
                hook=original_content.hook,  # Copy as starting point
                caption=original_content.caption,  # Copy as starting point
                script=original_content.script,  # Copy as starting point
                tone=original_content.tone,  # Keep tone
                call_to_action=original_content.call_to_action,  # Copy as starting point
                music=original_content.music,  # Keep music
                duration=None,  # Reset duration
                minutes_spent=0,  # Reset to 0 since it's repurposed
                content_link=None,  # Reset content link
                hashtags_used=original_content.hashtags_used,  # Copy as starting point
                notes=f"Repurposed from: {original_content.content_title}",
                original_content_id=original_content.id,  # Link to original
                is_repurposed=True,  # Mark as repurposed
                views=0,  # Reset analytics
                likes=0,
                shares=0,
                comments=0,
                saves=0,
                retention_rate=0.0
            )
            
            db.session.add(repurposed_content)
            db.session.commit()
            
            return jsonify(repurposed_content.to_dict()), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    
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
            return jsonify({'error': 'Claude service not available'}), 503
        
        data = request.get_json()
        
        try:
            # Get pillars data
            pillars = ContentPillar.query.all()
            pillars_data = [pillar.to_dict() for pillar in pillars]
            
            # Get platforms
            platforms = data.get('platforms', [])
            goals = data.get('goals', '')
            
            result = current_app.claude_service.generate_weekly_content_plan(
                pillars_data, platforms, goals
            )
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # AI Content Field Generation
    @app.route('/api/ai/generate-content-field', methods=['POST'])
    def generate_content_field():
        if not current_app.claude_service:
            return jsonify({'error': 'Claude service not available'}), 503
        
        data = request.get_json()
        field_type = data.get('field_type')  # 'caption', 'hook', 'script', 'tone', 'call_to_action', or 'hashtags'
        content_data = data.get('content_data', {})
        
        if not field_type or field_type not in ['caption', 'hook', 'script', 'tone', 'call_to_action', 'hashtags']:
            return jsonify({'error': 'Invalid field_type. Must be caption, hook, script, tone, call_to_action, or hashtags'}), 400
        
        try:
            # Get profile data
            profile = Profile.query.first()
            profile_data = profile.to_dict() if profile else {}
            
            # Get pillar data if specified
            pillar_data = None
            if content_data.get('content_pillar_id'):
                pillar = ContentPillar.query.get(content_data['content_pillar_id'])
                pillar_data = pillar.to_dict() if pillar else None
            
            result = current_app.claude_service.generate_content_field(
                field_type, content_data, profile_data, pillar_data
            )
            
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Dashboard summary
    @app.route('/api/dashboard/summary', methods=['GET'])
    def get_dashboard_summary():
        # Get counts
        platforms_count = Platform.query.count()
        content_pillars_count = ContentPillar.query.count()
        content_ideas_count = ContentIdea.query.count()
        content_items_count = ContentManager.query.count()
        tasks_count = Task.query.filter_by(status='pending').count()
        
        # Get recent content (last 5 items)
        recent_content = ContentManager.query.order_by(
            ContentManager.created_at.desc()
        ).limit(5).all()
        
        # Get recent tasks (last 5 items)
        recent_tasks = Task.query.order_by(
            Task.created_at.desc()
        ).limit(5).all()
        
        return jsonify({
            'platforms': platforms_count,
            'contentPillars': content_pillars_count,
            'contentIdeas': content_ideas_count,
            'contentItems': content_items_count,
            'tasks': tasks_count,
            'recentContent': [content.to_dict() for content in recent_content],
            'recentTasks': [task.to_dict() for task in recent_tasks]
        })
    
    # Advanced Analytics Endpoints
    @app.route('/api/analytics/trending-topics', methods=['GET'])
    def get_trending_topics():
        """Get trending topics for the user's niche"""
        niche = request.args.get('niche', 'general')
        platforms = request.args.getlist('platforms') or ['instagram', 'tiktok', 'youtube']
        
        analytics_service = AnalyticsService(current_app.claude_service)
        trending_data = analytics_service.analyze_trending_topics(niche, platforms)
        
        # Store in database for future reference
        for trend in trending_data[:5]:  # Store top 5 trends
            existing = TrendingTopic.query.filter_by(topic=trend['topic']).first()
            if existing:
                existing.trend_score = trend['trend_score']
                existing.volume_24h = trend['volume_24h']
                existing.engagement_rate = trend['engagement_rate']
                existing.growth_rate = trend['growth_rate']
                existing.updated_at = datetime.utcnow()
            else:
                trending_topic = TrendingTopic(
                    topic=trend['topic'],
                    hashtags=json.dumps(trend['hashtags']),
                    platforms=json.dumps(trend['platforms']),
                    trend_score=trend['trend_score'],
                    niche_category=niche,
                    volume_24h=trend['volume_24h'],
                    engagement_rate=trend['engagement_rate'],
                    growth_rate=trend['growth_rate']
                )
                db.session.add(trending_topic)
        
        db.session.commit()
        return jsonify(trending_data)
    
    @app.route('/api/analytics/performance-prediction', methods=['POST'])
    def predict_content_performance():
        """Predict how well content will perform"""
        data = request.get_json()
        content_id = data.get('content_id')
        
        if content_id:
            content = ContentManager.query.get_or_404(content_id)
            content_data = content.to_dict()
        else:
            content_data = data.get('content_data', {})
        
        # Get historical data for better predictions
        historical_content = ContentManager.query.filter_by(status='published').all()
        historical_data = [c.to_dict() for c in historical_content]
        
        analytics_service = AnalyticsService(current_app.claude_service)
        prediction = analytics_service.predict_content_performance(content_data, historical_data)
        
        # Store analysis if content_id provided
        if content_id:
            analysis = ContentPerformanceAnalysis(
                content_id=content_id,
                performance_score=prediction['performance_score'],
                engagement_score=prediction['engagement_prediction'].get('confidence', 0),
                viral_potential=prediction['viral_potential'],
                trend_alignment=prediction['trend_alignment'],
                best_performing_elements=json.dumps(prediction.get('improvement_suggestions', [])),
                improvement_suggestions=json.dumps(prediction.get('improvement_suggestions', [])),
                similar_trending_content=json.dumps(prediction.get('similar_successful_content', [])),
                predicted_reach=prediction['engagement_prediction'].get('likes', 0)
            )
            db.session.add(analysis)
            db.session.commit()
        
        return jsonify(prediction)
    
    @app.route('/api/analytics/competitor-analysis', methods=['GET'])
    def get_competitor_analysis():
        """Get competitor analysis for the specified niche"""
        niche = request.args.get('niche', 'general')
        competitors = request.args.getlist('competitors')
        
        def convert_frequency_to_posts_per_day(frequency_text):
            """Convert text frequency to numeric posts per day"""
            if not frequency_text or not isinstance(frequency_text, str):
                return 0.0
            
            frequency_lower = frequency_text.lower()
            
            if 'daily' in frequency_lower:
                return 1.0
            elif '2x/week' in frequency_lower:
                return 2.0 / 7.0  # 2 posts per 7 days
            elif '3x/week' in frequency_lower:
                return 3.0 / 7.0
            elif '4x/week' in frequency_lower:
                return 4.0 / 7.0
            elif '5x/week' in frequency_lower:
                return 5.0 / 7.0
            elif '6x/week' in frequency_lower:
                return 6.0 / 7.0
            elif 'weekly' in frequency_lower or '1x/week' in frequency_lower:
                return 1.0 / 7.0
            elif 'monthly' in frequency_lower:
                return 1.0 / 30.0
            else:
                # Try to extract numbers for patterns like "3 times a week"
                import re
                numbers = re.findall(r'\d+', frequency_lower)
                if numbers:
                    if 'week' in frequency_lower:
                        return float(numbers[0]) / 7.0
                    elif 'month' in frequency_lower:
                        return float(numbers[0]) / 30.0
                    elif 'day' in frequency_lower:
                        return float(numbers[0])
                return 0.5  # Default fallback
        
        analytics_service = AnalyticsService(current_app.claude_service)
        competitor_data = analytics_service.analyze_competitors(niche, competitors if competitors else None)
        
        # Store competitor data
        for comp_data in competitor_data:
            # Convert text frequency to numeric value
            frequency_text = comp_data['platform_performance'].get('post_frequency', '0')
            numeric_frequency = convert_frequency_to_posts_per_day(frequency_text)
            
            existing = CompetitorAnalysis.query.filter_by(
                username=comp_data['username'],
                platform=comp_data.get('platform', 'instagram').lower()
            ).first()
            
            if existing:
                existing.avg_engagement_rate = comp_data['platform_performance'].get('avg_engagement_rate', 0)
                existing.post_frequency = numeric_frequency
                existing.trending_hashtags = json.dumps(comp_data.get('trending_hashtags', []))
                existing.content_strategy = str(comp_data.get('content_strategy', ''))
                existing.posting_patterns = json.dumps(comp_data.get('posting_patterns', {}))
                existing.followers_count = comp_data.get('followers', 0)
                existing.last_analyzed = datetime.utcnow()
            else:
                competitor = CompetitorAnalysis(
                    competitor_name=comp_data['username'],
                    platform=comp_data.get('platform', 'instagram').lower(),
                    username=comp_data['username'],
                    niche_category=niche,
                    followers_count=comp_data.get('followers', 0),
                    avg_engagement_rate=comp_data['platform_performance'].get('avg_engagement_rate', 0),
                    post_frequency=numeric_frequency,
                    trending_hashtags=json.dumps(comp_data.get('trending_hashtags', [])),
                    content_strategy=str(comp_data.get('content_strategy', '')),
                    posting_patterns=json.dumps(comp_data.get('posting_patterns', {}))
                )
                db.session.add(competitor)
        
        db.session.commit()
        return jsonify(competitor_data)
    
    @app.route('/api/analytics/niche-insights', methods=['GET'])
    def get_niche_insights():
        """Get AI-powered insights about the user's niche"""
        niche = request.args.get('niche', 'general')
        
        # Get user's content for analysis
        user_content = ContentManager.query.all()
        user_content_data = [c.to_dict() for c in user_content]
        
        analytics_service = AnalyticsService(current_app.claude_service)
        insights = analytics_service.generate_niche_insights(niche, user_content_data)
        
        # Store insights
        for insight in insights:
            existing = NicheInsights.query.filter_by(
                title=insight['title'],
                niche_name=niche
            ).first()
            
            if not existing:
                niche_insight = NicheInsights(
                    niche_name=niche,
                    insight_type=insight['type'],
                    title=insight['title'],
                    description=insight['description'],
                    supporting_data=json.dumps(insight.get('supporting_data', {})),
                    confidence_score=insight.get('confidence_score', 0),
                    action_items=json.dumps(insight.get('action_items', [])),
                    priority=insight.get('priority', 'medium')
                )
                db.session.add(niche_insight)
        
        db.session.commit()
        return jsonify(insights)
    
    @app.route('/api/analytics/content-analysis/<int:content_id>', methods=['GET'])
    def get_content_analysis(content_id):
        """Get detailed analysis for a specific content item"""
        content = ContentManager.query.get_or_404(content_id)
        
        # Get existing analysis
        analysis = ContentPerformanceAnalysis.query.filter_by(content_id=content_id).first()
        if analysis:
            return jsonify(analysis.to_dict())
        
        # Generate new analysis
        analytics_service = AnalyticsService(current_app.claude_service)
        historical_content = ContentManager.query.filter_by(status='published').all()
        historical_data = [c.to_dict() for c in historical_content]
        
        prediction = analytics_service.predict_content_performance(content.to_dict(), historical_data)
        
        # Store the analysis
        analysis = ContentPerformanceAnalysis(
            content_id=content_id,
            performance_score=prediction['performance_score'],
            engagement_score=prediction['engagement_prediction'].get('confidence', 0),
            viral_potential=prediction['viral_potential'],
            trend_alignment=prediction['trend_alignment'],
            best_performing_elements=json.dumps(prediction.get('improvement_suggestions', [])),
            improvement_suggestions=json.dumps(prediction.get('improvement_suggestions', [])),
            similar_trending_content=json.dumps(prediction.get('similar_successful_content', [])),
            predicted_reach=prediction['engagement_prediction'].get('likes', 0)
        )
        db.session.add(analysis)
        db.session.commit()
        
        return jsonify(analysis.to_dict())
    
    @app.route('/api/analytics/dashboard', methods=['GET'])
    def get_analytics_dashboard():
        """Get comprehensive analytics dashboard data"""
        niche = request.args.get('niche', 'general')
        
        # Get trending topics
        trending_topics = TrendingTopic.query.filter_by(
            niche_category=niche,
            is_active=True
        ).order_by(TrendingTopic.trend_score.desc()).limit(5).all()
        
        # Get recent insights
        recent_insights = NicheInsights.query.filter_by(
            niche_name=niche,
            status='active'
        ).order_by(NicheInsights.created_at.desc()).limit(10).all()
        
        # Get performance analyses
        performance_analyses = ContentPerformanceAnalysis.query.join(
            ContentManager
        ).order_by(ContentPerformanceAnalysis.analysis_date.desc()).limit(10).all()
        
        # Get competitor data
        competitors = CompetitorAnalysis.query.filter_by(
            niche_category=niche
        ).order_by(CompetitorAnalysis.last_analyzed.desc()).limit(5).all()
        
        return jsonify({
            'trending_topics': [t.to_dict() for t in trending_topics],
            'insights': [i.to_dict() for i in recent_insights],
            'performance_analyses': [p.to_dict() for p in performance_analyses],
            'competitors': [c.to_dict() for c in competitors]
        })
    
    @app.route('/api/analytics/hashtag-analysis', methods=['POST'])
    def analyze_hashtags():
        """Analyze hashtag performance and suggest optimal hashtags"""
        data = request.get_json()
        hashtags = data.get('hashtags', [])
        niche = data.get('niche', 'general')
        
        analytics_service = AnalyticsService(current_app.claude_service)
        
        # Get trending topics to find related hashtags
        trending_topics = TrendingTopic.query.filter_by(
            niche_category=niche,
            is_active=True
        ).all()
        
        hashtag_analysis = {
            'input_hashtags': hashtags,
            'trending_hashtags': [],
            'suggested_hashtags': [],
            'hashtag_scores': {},
            'optimization_tips': []
        }
        
        # Extract trending hashtags
        for topic in trending_topics:
            if topic.hashtags:
                trending_hashtags = json.loads(topic.hashtags)
                hashtag_analysis['trending_hashtags'].extend(trending_hashtags)
        
        # Remove duplicates and limit
        hashtag_analysis['trending_hashtags'] = list(set(hashtag_analysis['trending_hashtags']))[:10]
        
        # Generate suggestions based on niche and trends
        hashtag_analysis['suggested_hashtags'] = [
            f'#{niche}tips',
            f'#{niche}inspiration',
            f'#{niche}community',
            '#trending2024',
            '#viral'
        ]
        
        # Score input hashtags
        for hashtag in hashtags:
            score = 50  # Base score
            if hashtag in hashtag_analysis['trending_hashtags']:
                score += 30
            if any(keyword in hashtag.lower() for keyword in ['trending', 'viral', '2024']):
                score += 20
            hashtag_analysis['hashtag_scores'][hashtag] = min(score, 100)
        
        hashtag_analysis['optimization_tips'] = [
            "Use a mix of popular and niche-specific hashtags",
            "Include trending hashtags for better discoverability",
            "Limit to 5-10 hashtags for optimal performance",
            "Create branded hashtags for community building"
        ]
        
        return jsonify(hashtag_analysis)

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000) 