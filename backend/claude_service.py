import os
from anthropic import Anthropic
from typing import Dict, List, Optional
import json

class ClaudeService:
    def __init__(self, api_key: str):
        self.client = Anthropic(api_key=api_key)
    
    def generate_content_strategy(self, profile_data: Dict, analytics_data: List[Dict], platforms: List[Dict]) -> Dict:
        """Generate content strategy based on profile and analytics data"""
        
        prompt = f"""
        You are an AI Content Strategist. Based on the following information, provide strategic content recommendations:

        PROFILE INFORMATION:
        - Mission: {profile_data.get('mission', 'Not specified')}
        - Goals: {profile_data.get('goals', 'Not specified')}
        - Vision: {profile_data.get('vision', 'Not specified')}
        - Niche: {profile_data.get('niche', 'Not specified')}
        - Target Audience: {profile_data.get('target_audience', 'Not specified')}

        PLATFORMS:
        {json.dumps(platforms, indent=2)}

        RECENT ANALYTICS DATA:
        {json.dumps(analytics_data, indent=2)}

        Please provide:
        1. Content strategy recommendations based on what's working
        2. Suggested content pillars
        3. Optimal posting times for each platform
        4. Content type recommendations
        5. Hashtag strategies
        6. Areas for improvement

        Format your response as a JSON object with these keys:
        - strategy_recommendations
        - content_pillars
        - optimal_posting_times
        - content_types
        - hashtag_strategies
        - improvements
        """
        
        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Try to parse as JSON, fallback to text if parsing fails
            try:
                return json.loads(response.content[0].text)
            except json.JSONDecodeError:
                return {"strategy_text": response.content[0].text}
                
        except Exception as e:
            return {"error": f"Failed to generate strategy: {str(e)}"}
    
    def generate_content_ideas(self, pillar_name: str, target_audience: str, recent_performance: List[Dict]) -> List[Dict]:
        """Generate content ideas based on pillar and performance data"""
        
        prompt = f"""
        Generate 10 creative content ideas for the content pillar "{pillar_name}" 
        targeting this audience: {target_audience}

        Recent performance data to consider:
        {json.dumps(recent_performance, indent=2)}

        For each idea, provide:
        - title: catchy title for the content
        - description: brief description
        - content_type: (post, story, reel, video, carousel)
        - hook: engaging opening line
        - priority: (high, medium, low)
        - estimated_engagement: prediction based on similar content performance

        Format as JSON array with these objects.
        """
        
        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1500,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            try:
                return json.loads(response.content[0].text)
            except json.JSONDecodeError:
                # If JSON parsing fails, return a simple structure
                return [{"title": "AI Generated Ideas", "description": response.content[0].text, "content_type": "post"}]
                
        except Exception as e:
            return [{"error": f"Failed to generate ideas: {str(e)}"}]
    
    def optimize_content(self, content_data: Dict, platform: str, analytics: List[Dict]) -> Dict:
        """Optimize existing content based on platform and analytics"""
        
        prompt = f"""
        Optimize this content for {platform} based on performance data:

        CURRENT CONTENT:
        - Type: {content_data.get('content_type', 'Not specified')}
        - Hook: {content_data.get('hook', 'Not specified')}
        - Caption: {content_data.get('caption', 'Not specified')}
        - Hashtags: {content_data.get('hashtags_used', 'Not specified')}

        PLATFORM PERFORMANCE DATA:
        {json.dumps(analytics, indent=2)}

        Provide optimized versions of:
        1. Hook (first line to grab attention)
        2. Caption (engaging description)
        3. Hashtags (relevant and trending)
        4. Best posting time recommendation
        5. Content format suggestions

        Format as JSON object with these keys: hook, caption, hashtags, posting_time, format_suggestions
        """
        
        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            try:
                return json.loads(response.content[0].text)
            except json.JSONDecodeError:
                return {"optimized_content": response.content[0].text}
                
        except Exception as e:
            return {"error": f"Failed to optimize content: {str(e)}"}
    
    def analyze_performance(self, content_data: List[Dict], platforms: List[str]) -> Dict:
        """Analyze content performance and provide insights"""
        
        prompt = f"""
        Analyze this content performance data and provide insights:

        CONTENT DATA:
        {json.dumps(content_data, indent=2)}

        PLATFORMS: {', '.join(platforms)}

        Provide analysis on:
        1. Top performing content types
        2. Best performing times/days
        3. Engagement patterns
        4. Hashtag effectiveness
        5. Content pillar performance
        6. Platform-specific insights
        7. Recommendations for improvement

        Format as JSON object with these analysis points.
        """
        
        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1500,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            try:
                return json.loads(response.content[0].text)
            except json.JSONDecodeError:
                return {"analysis": response.content[0].text}
                
        except Exception as e:
            return {"error": f"Failed to analyze performance: {str(e)}"}
    
    def generate_weekly_content_plan(self, pillars: List[Dict], platforms: List[str], goals: str) -> Dict:
        """Generate a weekly content plan"""
        
        prompt = f"""
        Create a weekly content plan (7 days) based on:

        CONTENT PILLARS:
        {json.dumps(pillars, indent=2)}

        PLATFORMS: {', '.join(platforms)}

        GOALS: {goals}

        For each day, provide:
        - day_name
        - content_suggestions (2-3 per day)
        - Each suggestion should have: title, pillar, platform, content_type, optimal_time

        Format as JSON object with days as keys.
        """
        
        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=2000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            try:
                return json.loads(response.content[0].text)
            except json.JSONDecodeError:
                return {"plan": response.content[0].text}
                
        except Exception as e:
            return {"error": f"Failed to generate weekly plan: {str(e)}"} 