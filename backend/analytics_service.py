import json
import random
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import re
from collections import Counter
import statistics

class AnalyticsService:
    """
    Simplified analytics service for trend analysis and performance prediction
    """
    
    def __init__(self, claude_service=None):
        self.claude_service = claude_service
        
    # === TREND ANALYSIS ===
    
    def analyze_trending_topics(self, niche: str, platforms: List[str] = None) -> List[Dict]:
        """
        Analyze trending topics in a specific niche
        """
        if platforms is None:
            platforms = ['instagram', 'tiktok', 'youtube']
        
        # Sample trending data based on niche
        sample_trends = self._get_sample_trends(niche)
        
        trending_data = []
        for trend in sample_trends:
            trend_analysis = {
                'topic': trend['topic'],
                'hashtags': trend['hashtags'],
                'platforms': self._generate_platform_data(trend, platforms),
                'trend_score': self._calculate_trend_score(trend),
                'engagement_rate': trend['engagement_rate'],
                'growth_rate': trend['growth_rate'],
                'volume_24h': trend['volume_24h'],
                'peak_time': trend.get('peak_time')
            }
            trending_data.append(trend_analysis)
        
        return sorted(trending_data, key=lambda x: x['trend_score'], reverse=True)
    
    def _get_sample_trends(self, niche: str) -> List[Dict]:
        """Get sample trending data for the niche"""
        mens_fashion_trends = [
            {
                'topic': 'Minimalist Wardrobe Essentials',
                'hashtags': ['#minimalistfashion', '#mensstyle', '#capsulewardrobe', '#mensfashion'],
                'engagement_rate': 9.2,
                'growth_rate': 156.7,
                'volume_24h': 18420,
                'peak_time': '19:00'
            },
            {
                'topic': 'Thrift Fashion Finds',
                'hashtags': ['#thriftfashion', '#secondhand', '#sustainablefashion', '#mensstyle'],
                'engagement_rate': 7.8,
                'growth_rate': 134.5,
                'volume_24h': 12890,
                'peak_time': '16:00'
            },
            {
                'topic': 'Smart Casual Office Looks',
                'hashtags': ['#smartcasual', '#officestyle', '#workwear', '#mensfashion'],
                'engagement_rate': 6.9,
                'growth_rate': 89.3,
                'volume_24h': 9650,
                'peak_time': '08:00'
            }
        ]
        
        solo_lifestyle_trends = [
            {
                'topic': 'Solo Travel Adventures',
                'hashtags': ['#solotravel', '#independence', '#soloadventure', '#selfcare'],
                'engagement_rate': 8.7,
                'growth_rate': 142.1,
                'volume_24h': 16750,
                'peak_time': '20:00'
            },
            {
                'topic': 'Living Alone Hacks',
                'hashtags': ['#livingalone', '#sololife', '#independence', '#selfsufficient'],
                'engagement_rate': 9.5,
                'growth_rate': 178.9,
                'volume_24h': 21340,
                'peak_time': '18:30'
            },
            {
                'topic': 'Solo Dining Experiences',
                'hashtags': ['#solodining', '#eatalone', '#sololife', '#selfcare'],
                'engagement_rate': 7.3,
                'growth_rate': 98.7,
                'volume_24h': 11250,
                'peak_time': '12:00'
            }
        ]
        
        fitness_trends = [
            {
                'topic': '30-Day Transformation Challenge',
                'hashtags': ['#30daychallenge', '#fitness', '#transformation', '#menshealth'],
                'engagement_rate': 8.5,
                'growth_rate': 145.2,
                'volume_24h': 15420,
                'peak_time': '18:00'
            },
            {
                'topic': 'Calisthenics for Beginners',
                'hashtags': ['#calisthenics', '#bodyweight', '#fitness', '#noequipment'],
                'engagement_rate': 9.8,
                'growth_rate': 189.4,
                'volume_24h': 23580,
                'peak_time': '07:00'
            },
            {
                'topic': 'Meal Prep for Busy Men',
                'hashtags': ['#mealprep', '#nutrition', '#healthyeating', '#fitness'],
                'engagement_rate': 7.6,
                'growth_rate': 112.3,
                'volume_24h': 13890,
                'peak_time': '11:00'
            }
        ]
        
        ai_productivity_trends = [
            {
                'topic': 'AI Tools for Content Creation',
                'hashtags': ['#aitools', '#productivity', '#contentcreator', '#chatgpt'],
                'engagement_rate': 10.1,
                'growth_rate': 234.7,
                'volume_24h': 28670,
                'peak_time': '14:00'
            },
            {
                'topic': 'Automation Workflows',
                'hashtags': ['#automation', '#productivity', '#workflow', '#efficiency'],
                'engagement_rate': 8.9,
                'growth_rate': 167.8,
                'volume_24h': 19450,
                'peak_time': '10:00'
            },
            {
                'topic': 'AI-Powered Side Hustles',
                'hashtags': ['#sidehustle', '#aitools', '#entrepreneurship', '#passiveincome'],
                'engagement_rate': 9.4,
                'growth_rate': 201.5,
                'volume_24h': 24130,
                'peak_time': '16:00'
            }
        ]
        
        emotional_storytelling_trends = [
            {
                'topic': 'Vulnerability in Masculinity',
                'hashtags': ['#mentalhealth', '#vulnerability', '#masculinity', '#storytelling'],
                'engagement_rate': 11.2,
                'growth_rate': 198.6,
                'volume_24h': 22890,
                'peak_time': '21:00'
            },
            {
                'topic': 'Father-Son Stories',
                'hashtags': ['#fatherhood', '#family', '#storytelling', '#emotionalhealth'],
                'engagement_rate': 9.7,
                'growth_rate': 156.4,
                'volume_24h': 17650,
                'peak_time': '19:30'
            },
            {
                'topic': 'Overcoming Depression',
                'hashtags': ['#mentalhealth', '#depression', '#healing', '#mentalwellness'],
                'engagement_rate': 10.8,
                'growth_rate': 187.3,
                'volume_24h': 20540,
                'peak_time': '22:00'
            }
        ]
        
        # Return trends based on niche
        niche_lower = niche.lower()
        if any(keyword in niche_lower for keyword in ['men', 'fashion', 'style']):
            return mens_fashion_trends
        elif any(keyword in niche_lower for keyword in ['solo', 'lifestyle', 'alone', 'independence']):
            return solo_lifestyle_trends
        elif any(keyword in niche_lower for keyword in ['fitness', 'health', 'workout']):
            return fitness_trends
        elif any(keyword in niche_lower for keyword in ['ai', 'productivity', 'automation', 'tech']):
            return ai_productivity_trends
        elif any(keyword in niche_lower for keyword in ['emotional', 'storytelling', 'mental', 'vulnerability']):
            return emotional_storytelling_trends
        else:
            # Return a mix of all trends
            return (mens_fashion_trends[:1] + solo_lifestyle_trends[:1] + 
                   fitness_trends[:1] + ai_productivity_trends[:1] + 
                   emotional_storytelling_trends[:1])
    
    def _generate_platform_data(self, trend: Dict, platforms: List[str]) -> Dict:
        """
        Generate platform performance data
        """
        platform_data = {}
        base_engagement = trend['engagement_rate']
        
        for platform in platforms:
            multipliers = {
                'instagram': 1.2,
                'tiktok': 1.5,
                'youtube': 0.8,
                'twitter': 1.1
            }
            
            platform_data[platform] = {
                'engagement_rate': round(base_engagement * multipliers.get(platform, 1.0), 1),
                'volume': int(trend['volume_24h'] * multipliers.get(platform, 1.0) * 0.3),
                'growth_potential': 'high' if multipliers.get(platform, 1.0) > 1.2 else 'medium'
            }
        
        return platform_data
    
    def _calculate_trend_score(self, trend: Dict) -> float:
        """
        Calculate trend score (0-100)
        """
        engagement_score = min(trend['engagement_rate'] * 10, 100)
        growth_score = min(trend['growth_rate'], 100)
        volume_score = min(trend['volume_24h'] / 500, 100)
        
        trend_score = (engagement_score * 0.3 + growth_score * 0.4 + volume_score * 0.3)
        return round(trend_score, 1)
    
    # === PERFORMANCE PREDICTION ===
    
    def predict_content_performance(self, content_data: Dict, historical_data: List[Dict] = None) -> Dict:
        """
        Predict content performance
        """
        performance_score = self._calculate_performance_score(content_data)
        
        prediction = {
            'performance_score': performance_score,
            'engagement_prediction': {
                'likes': max(int(performance_score * 10), 50),
                'comments': max(int(performance_score * 2), 10),
                'shares': max(int(performance_score * 1), 5),
                'confidence': min(performance_score + 25, 95)
            },
            'viral_potential': self._assess_viral_potential(content_data),
            'trend_alignment': self._check_trend_alignment(content_data),
            'optimal_posting_time': self._suggest_optimal_time(content_data),
            'improvement_suggestions': self._generate_suggestions(content_data),
            'similar_successful_content': []
        }
        
        return prediction
    
    def _calculate_performance_score(self, content_data: Dict) -> float:
        """
        Calculate predicted performance score
        """
        score = 30  # Base score
        
        if content_data.get('hook'):
            score += 15
        if content_data.get('hashtags_used'):
            score += 10
        if content_data.get('content_type') == 'short_form':
            score += 20
        if content_data.get('caption') and len(content_data.get('caption', '')) > 50:
            score += 15
        
        return min(score, 100)
    
    def _assess_viral_potential(self, content_data: Dict) -> float:
        """
        Assess viral potential (0-100)
        """
        viral_score = 20  # Base score
        
        if content_data.get('hook'):
            viral_score += 25
        if content_data.get('content_type') == 'short_form':
            viral_score += 20
        if 'challenge' in str(content_data.get('content_title', '')).lower():
            viral_score += 15
        if content_data.get('hashtags_used'):
            viral_score += 10
        
        return min(viral_score, 100)
    
    def _check_trend_alignment(self, content_data: Dict) -> float:
        """
        Check trend alignment (0-100)
        """
        alignment_score = 30  # Base score
        
        trending_keywords = ['challenge', 'trend', 'viral', 'hack', '2024']
        content_text = ' '.join([
            str(content_data.get('content_title', '')),
            str(content_data.get('caption', '')),
            str(content_data.get('hashtags_used', ''))
        ]).lower()
        
        for keyword in trending_keywords:
            if keyword in content_text:
                alignment_score += 15
        
        return min(alignment_score, 100)
    
    def _suggest_optimal_time(self, content_data: Dict) -> str:
        """
        Suggest optimal posting time
        """
        time_suggestions = {
            'short_form': '18:00-20:00',
            'carousel': '12:00-14:00',
            'story': '09:00-11:00',
            'long_form': '14:00-16:00'
        }
        
        content_type = content_data.get('content_type', 'post')
        return time_suggestions.get(content_type, '18:00-20:00')
    
    def _generate_suggestions(self, content_data: Dict) -> List[str]:
        """
        Generate improvement suggestions
        """
        suggestions = []
        
        if not content_data.get('hook'):
            suggestions.append("Add a compelling hook to grab attention")
        if not content_data.get('hashtags_used'):
            suggestions.append("Include trending hashtags for better reach")
        if not content_data.get('caption') or len(content_data.get('caption', '')) < 50:
            suggestions.append("Write a more detailed caption with call-to-action")
        
        return suggestions[:3]
    
    # === COMPETITIVE ANALYSIS ===
    
    def analyze_competitors(self, niche: str, competitor_usernames: List[str] = None) -> List[Dict]:
        """
        Analyze competitor performance
        """
        if competitor_usernames is None:
            competitors = self._get_sample_competitors(niche)
        else:
            # For backward compatibility, convert usernames to simple objects
            competitors = [{'name': username, 'platform': 'unknown'} for username in competitor_usernames]
        
        competitor_data = []
        for competitor in competitors:
            # Handle both dictionary objects and simple usernames
            if isinstance(competitor, dict):
                username = competitor.get('name', 'Unknown')
                platform = competitor.get('platform', 'Unknown')
                followers = competitor.get('followers', 0)
                engagement = competitor.get('avg_engagement', 0)
                frequency = competitor.get('content_frequency', 'Unknown')
                content_type = competitor.get('top_content_type', 'Unknown')
                location = competitor.get('location', 'Unknown')
                niche_focus = competitor.get('niche_focus', niche)
            else:
                username = str(competitor)
                platform = 'Unknown'
                followers = random.randint(10000, 1000000)
                engagement = round(random.uniform(5.0, 12.0), 1)
                frequency = 'Daily'
                content_type = 'Mixed Content'
                location = 'Unknown'
                niche_focus = niche
            
            analysis = {
                'username': username,
                'platform': platform,
                'followers': followers,
                'location': location,
                'niche_focus': niche_focus,
                'platform_performance': {
                    'avg_engagement_rate': engagement,
                    'post_frequency': frequency,
                    'follower_growth': round(random.uniform(5.0, 25.0), 1),
                    'content_type': content_type
                },
                'content_strategy': f"Focuses on {niche_focus} with {content_type.lower()}",
                'posting_patterns': {
                    'best_times': ['18:00-20:00', '12:00-14:00'],
                    'best_days': ['Monday', 'Wednesday', 'Friday']
                },
                'trending_hashtags': self._get_trending_hashtags(niche),
                'opportunities': [
                    f"Underutilized: beginner {niche_focus.lower()} content",
                    "Opportunity: interactive polls and Q&A",
                    "Gap: behind-the-scenes content"
                ]
            }
            competitor_data.append(analysis)
        
        return competitor_data
    
    def _get_sample_competitors(self, niche: str) -> List[Dict]:
        """Get sample competitor data for the niche from Philippines and Australia"""
        philippines_australia_competitors = [
            # Philippines Influencers
            {
                'name': 'Alex Gonzaga (PH)',
                'platform': 'TikTok',
                'followers': 12500000,
                'avg_engagement': 8.9,
                'content_frequency': 'Daily',
                'top_content_type': 'Lifestyle & Comedy',
                'location': 'Philippines',
                'niche_focus': 'Solo Lifestyle'
            },
            {
                'name': 'Cong TV (PH)',
                'platform': 'YouTube',
                'followers': 8700000,
                'avg_engagement': 12.3,
                'content_frequency': '3x/week',
                'top_content_type': 'Vlogs & Lifestyle',
                'location': 'Philippines',
                'niche_focus': 'Solo Lifestyle'
            },
            {
                'name': 'David Guison (PH)',
                'platform': 'Instagram',
                'followers': 890000,
                'avg_engagement': 6.7,
                'content_frequency': '5x/week',
                'top_content_type': 'Mens Fashion',
                'location': 'Philippines',
                'niche_focus': 'Mens Fashion'
            },
            {
                'name': 'Miggy Cruz (PH)',
                'platform': 'TikTok',
                'followers': 2100000,
                'avg_engagement': 9.8,
                'content_frequency': 'Daily',
                'top_content_type': 'Fitness & Motivation',
                'location': 'Philippines',
                'niche_focus': 'Fitness'
            },
            {
                'name': 'Paolo Contis (PH)',
                'platform': 'Instagram',
                'followers': 3400000,
                'avg_engagement': 7.2,
                'content_frequency': '4x/week',
                'top_content_type': 'Personal Stories',
                'location': 'Philippines',
                'niche_focus': 'Emotional Storytelling'
            },
            
            # Australia Influencers  
            {
                'name': 'Cody Ko (AU)',
                'platform': 'YouTube',
                'followers': 5600000,
                'avg_engagement': 11.4,
                'content_frequency': '2x/week',
                'top_content_type': 'Comedy & Commentary',
                'location': 'Australia',
                'niche_focus': 'Solo Lifestyle'
            },
            {
                'name': 'Jordan Watson (AU)',
                'platform': 'TikTok',
                'followers': 1800000,
                'avg_engagement': 8.5,
                'content_frequency': 'Daily',
                'top_content_type': 'Dad Life & Parenting',
                'location': 'Australia',
                'niche_focus': 'Emotional Storytelling'
            },
            {
                'name': 'Daniel Mac (AU)',
                'platform': 'Instagram',
                'followers': 950000,
                'avg_engagement': 7.8,
                'content_frequency': '6x/week',
                'top_content_type': 'Luxury Lifestyle',
                'location': 'Australia',
                'niche_focus': 'Mens Fashion'
            },
            {
                'name': 'Bradley Martyn (AU)',
                'platform': 'YouTube',
                'followers': 3200000,
                'avg_engagement': 9.1,
                'content_frequency': '4x/week',
                'top_content_type': 'Fitness & Gym',
                'location': 'Australia',
                'niche_focus': 'Fitness'
            },
            {
                'name': 'Tech Lead (AU)',
                'platform': 'YouTube',
                'followers': 1100000,
                'avg_engagement': 6.9,
                'content_frequency': '3x/week',
                'top_content_type': 'Tech & Productivity',
                'location': 'Australia',
                'niche_focus': 'AI & Productivity'
            }
        ]
        
        # Filter by niche if specified
        niche_lower = niche.lower()
        if any(keyword in niche_lower for keyword in ['men', 'fashion', 'style']):
            return [c for c in philippines_australia_competitors if c['niche_focus'] == 'Mens Fashion']
        elif any(keyword in niche_lower for keyword in ['solo', 'lifestyle', 'alone']):
            return [c for c in philippines_australia_competitors if c['niche_focus'] == 'Solo Lifestyle']
        elif any(keyword in niche_lower for keyword in ['fitness', 'health', 'workout']):
            return [c for c in philippines_australia_competitors if c['niche_focus'] == 'Fitness']
        elif any(keyword in niche_lower for keyword in ['ai', 'productivity', 'tech']):
            return [c for c in philippines_australia_competitors if c['niche_focus'] == 'AI & Productivity']
        elif any(keyword in niche_lower for keyword in ['emotional', 'storytelling', 'mental']):
            return [c for c in philippines_australia_competitors if c['niche_focus'] == 'Emotional Storytelling']
        else:
            return philippines_australia_competitors[:5]  # Return top 5 if no specific niche
    
    def _get_trending_hashtags(self, niche: str) -> List[str]:
        """
        Get trending hashtags for the niche
        """
        hashtag_sets = {
            'fitness': ['#fitness', '#workout', '#health', '#motivation', '#fitlife'],
            'tech': ['#tech', '#ai', '#productivity', '#innovation', '#startup'],
            'lifestyle': ['#lifestyle', '#wellness', '#selfcare', '#mindfulness', '#inspiration']
        }
        
        for key in hashtag_sets:
            if key in niche.lower():
                return hashtag_sets[key]
        
        return hashtag_sets['fitness']
    
    # === AI-POWERED INSIGHTS ===
    
    def generate_niche_insights(self, niche: str, user_content_data: List[Dict] = None) -> List[Dict]:
        """
        Generate AI-powered niche insights
        """
        insights = []
        
        # Trending opportunities
        trending_topics = self.analyze_trending_topics(niche)
        for topic in trending_topics[:2]:
            insights.append({
                'type': 'trend_opportunity',
                'title': f"Trending: {topic['topic']}",
                'description': f"High growth potential with {topic['growth_rate']:.1f}% growth rate",
                'action_items': [
                    f"Create content around {topic['topic']}",
                    f"Use hashtags: {', '.join(topic['hashtags'][:3])}",
                    "Post during peak engagement hours"
                ],
                'confidence_score': topic['trend_score'],
                'priority': 'high' if topic['trend_score'] > 80 else 'medium'
            })
        
        # Content strategy insights
        insights.append({
            'type': 'content_strategy',
            'title': f'{niche.title()} Content Strategy',
            'description': f'Optimize your {niche} content for better engagement',
            'action_items': [
                'Focus on short-form content (60% higher engagement)',
                'Include trending music and sounds',
                'Use storytelling format for better retention'
            ],
            'confidence_score': 85,
            'priority': 'medium'
        })
        
        return insights
    
    # === HELPER METHODS ===
    
    def _check_trending_hashtags(self, hashtags: str) -> float:
        """Check if hashtags contain trending elements"""
        if not hashtags:
            return 0
        
        trending_keywords = ['challenge', 'trending', 'viral', '2024', 'new', 'tips']
        hashtag_list = re.findall(r'#\w+', hashtags.lower())
        
        score = 0
        for hashtag in hashtag_list:
            for keyword in trending_keywords:
                if keyword in hashtag:
                    score += 5
                    
        return min(score, 20)
    
    def _get_content_type_score(self, content_type: str) -> float:
        """Get popularity score for content type"""
        type_scores = {
            'short_form': 25,
            'carousel': 20,
            'story': 15,
            'long_form': 10,
            'post': 15
        }
        return type_scores.get(content_type, 10)
    
    def _analyze_caption_quality(self, caption: str) -> float:
        """Analyze caption quality and engagement potential"""
        if not caption:
            return 0
            
        quality_factors = {
            'has_question': 5 if '?' in caption else 0,
            'has_call_to_action': 5 if any(cta in caption.lower() for cta in ['comment', 'share', 'save', 'follow']) else 0,
            'optimal_length': 10 if 50 <= len(caption) <= 300 else 0,
            'has_emojis': 3 if any(ord(char) > 127 for char in caption) else 0,
            'storytelling': 7 if len(caption.split('.')) > 2 else 0
        }
        
        return sum(quality_factors.values())
    
    def _contains_trending_elements(self, content_data: Dict) -> bool:
        """Check if content contains trending elements"""
        trending_keywords = ['challenge', 'trend', 'viral', 'hack', 'secret', 'tips']
        
        text_to_check = ' '.join([
            content_data.get('content_title', ''),
            content_data.get('caption', ''),
            content_data.get('hashtags_used', '')
        ]).lower()
        
        return any(keyword in text_to_check for keyword in trending_keywords)
    
    def _get_recommended_action(self, trend: Dict) -> str:
        """Get recommended action for a trend"""
        if trend['growth_rate'] > 150:
            return "Act immediately - high growth trend"
        elif trend['growth_rate'] > 100:
            return "Create content soon - good opportunity"
        else:
            return "Monitor trend - potential future opportunity"
    
    def _get_content_suggestions(self, trend: Dict, niche: str) -> List[str]:
        """Generate content suggestions based on trend"""
        suggestions = [
            f"Create a tutorial about {trend['topic']}",
            f"Share your experience with {trend['topic']}",
            f"Make a comparison post featuring {trend['topic']}",
            f"Do a {trend['topic']} challenge",
            f"Share tips related to {trend['topic']}"
        ]
        return suggestions[:3]  # Return top 3
    
    def _get_timing_advice(self, trend: Dict) -> str:
        """Get timing advice for the trend"""
        peak_time = trend.get('peak_time', '18:00')
        return f"Optimal posting time: {peak_time} when trend peaks"
    
    def _optimize_hashtags(self, hashtags: List[str]) -> List[str]:
        """Optimize hashtag strategy"""
        if len(hashtags) > 5:
            return hashtags[:5]  # Use top 5 for best reach
        return hashtags
    
    def _find_similar_successful_content(self, content_data: Dict, historical_data: List[Dict]) -> List[Dict]:
        """Find similar successful content from historical data"""
        if not historical_data:
            return []
            
        similar_content = []
        content_type = content_data.get('content_type')
        
        for item in historical_data:
            if (item.get('content_type') == content_type and 
                item.get('likes', 0) > 100):  # Consider successful if > 100 likes
                similar_content.append({
                    'title': item.get('content_title', 'Untitled'),
                    'performance': {
                        'likes': item.get('likes', 0),
                        'engagement_rate': item.get('engagement_rate', 0)
                    },
                    'what_worked': self._analyze_what_worked(item)
                })
                
        return similar_content[:3]  # Top 3 similar successful posts
    
    def _analyze_what_worked(self, content_item: Dict) -> List[str]:
        """Analyze what made content successful"""
        success_factors = []
        
        if content_item.get('hook'):
            success_factors.append("Strong hook")
            
        if content_item.get('hashtags_used'):
            success_factors.append("Good hashtag strategy")
            
        if content_item.get('content_type') == 'short_form':
            success_factors.append("Short-form format")
            
        return success_factors
    
    # Additional helper methods for competitive analysis...
    
    def _analyze_competitor_performance(self, username: str) -> Dict:
        """Analyze competitor's performance metrics"""
        # This would integrate with social media APIs
        return {
            'avg_engagement_rate': 7.5,
            'follower_growth': 12.3,
            'post_frequency': 1.2,
            'best_performing_content_type': 'short_form'
        }
    
    def _analyze_content_strategy(self, username: str) -> Dict:
        """Analyze competitor's content strategy"""
        return {
            'content_themes': ['fitness tips', 'motivation', 'workouts'],
            'posting_style': 'educational with personal touch',
            'unique_angles': ['scientific approach', 'beginner-friendly']
        }
    
    def _analyze_posting_patterns(self, username: str) -> Dict:
        """Analyze when competitors post"""
        return {
            'best_days': ['Monday', 'Wednesday', 'Friday'],
            'best_times': ['07:00-09:00', '18:00-20:00'],
            'frequency': 'daily'
        }
    
    def _get_engagement_insights(self, username: str) -> Dict:
        """Get insights about competitor engagement"""
        return {
            'engagement_rate': 8.2,
            'comment_rate': 1.5,
            'share_rate': 0.8,
            'audience_interaction': 'high'
        }
    
    def _identify_content_opportunities(self, username: str, niche: str) -> List[str]:
        """Identify content gaps and opportunities"""
        return [
            "Underutilized: beginner-friendly content",
            "Opportunity: interactive content (polls, Q&A)",
            "Gap: behind-the-scenes content"
        ]
    
    def _identify_content_gaps(self, user_content: List[Dict], niche: str) -> List[Dict]:
        """Identify gaps in user's content strategy"""
        content_types = [item.get('content_type') for item in user_content]
        type_counter = Counter(content_types)
        
        gaps = []
        if type_counter.get('short_form', 0) < 3:
            gaps.append({
                'type': 'content_gap',
                'title': 'Under-utilizing Short-form Content',
                'description': 'Short-form content has 40% higher engagement rates',
                'action_items': ['Create more short-form videos', 'Focus on trending challenges'],
                'confidence_score': 85,
                'priority': 'high'
            })
            
        return gaps
    
    def _identify_performance_patterns(self, user_content: List[Dict]) -> List[Dict]:
        """Identify patterns in user's content performance"""
        patterns = []
        
        if user_content:
            # Analyze posting times
            patterns.append({
                'type': 'performance_pattern',
                'title': 'Optimal Posting Schedule',
                'description': 'Your content performs better on weekdays',
                'action_items': ['Post Monday-Friday for best engagement'],
                'confidence_score': 75,
                'priority': 'medium'
            })
            
        return patterns 