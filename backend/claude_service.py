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
        - recommended_pillar
        - content_type
        - optimal_posting_time

        Format as JSON object with 'weekly_plan' array.
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
                return {"weekly_plan": response.content[0].text}
                
        except Exception as e:
            return {"error": f"Failed to generate weekly plan: {str(e)}"}

    def generate_content_field(self, field_type: str, content_data: Dict, profile_data: Dict, pillar_data: Optional[Dict] = None) -> Dict:
        """Generate specific content fields (caption, hook, script, hashtags) based on existing content and profile data"""
        
        # Build context from existing content data
        context_info = []
        if content_data.get('content_title'):
            context_info.append(f"Title: {content_data['content_title']}")
        if content_data.get('intention'):
            context_info.append(f"Intention/Goal: {content_data['intention']}")
        if content_data.get('content_type'):
            context_info.append(f"Content Type: {content_data['content_type']}")
        if content_data.get('content_format'):
            context_info.append(f"Content Format: {content_data['content_format']}")
        if content_data.get('music'):
            context_info.append(f"Music/Audio: {content_data['music']}")
        
        # Add existing content fields for context
        if field_type != 'hook' and content_data.get('hook'):
            context_info.append(f"Hook: {content_data['hook']}")
        if field_type != 'caption' and content_data.get('caption'):
            context_info.append(f"Caption: {content_data['caption']}")
        if field_type != 'script' and content_data.get('script'):
            context_info.append(f"Script: {content_data['script']}")
        if field_type != 'tone' and content_data.get('tone'):
            context_info.append(f"Tone: {content_data['tone']}")
        if field_type != 'call_to_action' and content_data.get('call_to_action'):
            context_info.append(f"Call to Action: {content_data['call_to_action']}")
        if field_type != 'hashtags' and content_data.get('hashtags_used'):
            context_info.append(f"Hashtags: {content_data['hashtags_used']}")

        context_str = "\n".join(context_info)
        
        # Build pillar context
        pillar_context = ""
        if pillar_data:
            pillar_context = f"""
CONTENT PILLAR:
- Name: {pillar_data.get('pillar_name', 'Not specified')}
- Description: {pillar_data.get('description', 'Not specified')}
- Keywords: {pillar_data.get('keywords', 'Not specified')}
- Target Audience: {pillar_data.get('target_audience', 'Not specified')}
- Goals: {pillar_data.get('goals', 'Not specified')}
"""

        # Build profile context
        profile_context = f"""
CREATOR PROFILE:
- Mission: {profile_data.get('mission', 'Not specified')}
- Goals: {profile_data.get('goals', 'Not specified')}
- Vision: {profile_data.get('vision', 'Not specified')}
- Niche: {profile_data.get('niche', 'Not specified')}
- Target Audience: {profile_data.get('target_audience', 'Not specified')}
- Stories: {profile_data.get('stories', 'Not specified')}
- Motivation: {profile_data.get('motivation', 'Not specified')}
"""

        # Generate field-specific prompts
        if field_type == 'hook':
            prompt = f"""
Create an engaging hook for this content that grabs attention within the first 3 seconds.

{profile_context}
{pillar_context}
CONTENT CONTEXT:
{context_str}

The hook should:
- Be attention-grabbing and make people stop scrolling
- Align with the creator's mission and target audience
- Be appropriate for the content type and format
- Create curiosity or promise value
- Be concise (1-2 sentences maximum)

Provide just the hook text, no additional formatting or explanation.
"""
        
        elif field_type == 'caption':
            prompt = f"""
Create an engaging caption for this content that encourages interaction and engagement.

{profile_context}
{pillar_context}
CONTENT CONTEXT:
{context_str}

The caption should:
- Reflect the creator's voice and mission
- Connect with the target audience
- Include a call-to-action for engagement
- Tell a story or provide value
- Be appropriate length for the platform(s)
- Align with the content pillar goals

Provide just the caption text, no additional formatting or explanation.
"""
        
        elif field_type == 'script':
            prompt = f"""
Create a detailed script or talking points for this content.

{profile_context}
{pillar_context}
CONTENT CONTEXT:
{context_str}

The script should:
- Follow the hook if one exists
- Deliver on the content's intention/goal
- Be authentic to the creator's voice
- Include natural transitions and flow
- Provide clear value to the audience
- End with a strong call-to-action
- Be structured for the content format

Provide the script with clear sections or bullet points for easy filming.
"""
        
        elif field_type == 'hashtags':
            prompt = f"""
Generate relevant hashtags for this content that will maximize reach and engagement.

{profile_context}
{pillar_context}
CONTENT CONTEXT:
{context_str}

Generate hashtags that:
- Include a mix of popular, moderately popular, and niche hashtags
- Are relevant to the content, creator's niche, and target audience
- Follow current trends in the space
- Include branded/personal hashtags if appropriate
- Aim for 15-25 hashtags total
- Balance broad reach with targeted audience

Provide hashtags in a single line, separated by spaces, starting with #.
"""
        
        elif field_type == 'tone':
            prompt = f"""
Determine the ideal tone and style for this content based on the creator's brand and content context.

{profile_context}
{pillar_context}
CONTENT CONTEXT:
{context_str}

The tone should:
- Align with the creator's mission and target audience
- Match the content type and format
- Be appropriate for the platforms
- Reflect the content pillar's goals
- Consider the intention/goal of the content

Choose from tones like: casual, professional, humorous, inspirational, educational, conversational, authoritative, playful, serious, motivational, relatable, authentic, confident, or suggest a combination.

Provide the tone description in 1-2 sentences explaining the recommended style and why it fits.
"""
        
        elif field_type == 'call_to_action':
            prompt = f"""
Create a compelling call-to-action for this content that drives engagement and aligns with the creator's goals.

{profile_context}
{pillar_context}
CONTENT CONTEXT:
{context_str}

The call-to-action should:
- Drive specific engagement (like, comment, share, save, follow)
- Align with the content's intention and goals
- Be appropriate for the platforms
- Match the creator's brand voice
- Encourage community interaction
- Be clear and actionable

Consider CTAs like asking questions, requesting opinions, encouraging shares, prompting saves, building community, or driving traffic.

Provide a clear, engaging call-to-action that fits naturally with the content.
"""

        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1000,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            generated_content = response.content[0].text.strip()
            
            return {
                "success": True,
                "content": generated_content,
                "field_type": field_type
            }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Failed to generate {field_type}: {str(e)}",
                "field_type": field_type
            } 