import React, { useState, useEffect } from 'react';
import {
  getAnalyticsDashboard,
  getTrendingTopics,
  getCompetitorAnalysis,
  getNicheInsights,
  predictContentPerformance
} from '../services/api';

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    overview: {},
    trending: [],
    competitors: [],
    insights: []
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedNiche]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const [overview, trending, competitors, insights] = await Promise.all([
        getAnalyticsDashboard(selectedNiche),
        getTrendingTopics(selectedNiche),
        getCompetitorAnalysis(selectedNiche),
        getNicheInsights(selectedNiche)
      ]);

      setData({
        overview,
        trending,
        competitors,
        insights
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'trending', label: '🔥 Trending', icon: '🔥' },
    { id: 'competitors', label: '👥 Competitors', icon: '👥' },
    { id: 'insights', label: '💡 Insights', icon: '💡' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
          <p className="text-text-primary">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            📈 AI Trend Analytics Dashboard
          </h1>
          <p className="text-accent-gold">
            AI-powered insights for your content strategy across Philippines & Australia
          </p>
        </div>

        {/* Niche Selector */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Your Niche
              </label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full px-3 py-2 bg-dark-hover border border-dark-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
              >
                <option value="">All Niches</option>
                <option value="Men's Fashion">👔 Men's Fashion</option>
                <option value="Solo Lifestyle">🎯 Solo Lifestyle</option>
                <option value="Fitness">💪 Fitness</option>
                <option value="AI and Productivity">🤖 AI and Productivity</option>
                <option value="Emotional Storytelling">💭 Emotional Storytelling</option>
              </select>
            </div>
            <button
              onClick={loadAnalyticsData}
              className="px-6 py-2 bg-accent-green text-text-primary rounded-md hover:bg-accent-gold hover:text-dark-bg transition-colors font-medium"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-dark-border mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-accent-gold text-accent-gold'
                    : 'border-transparent text-text-primary hover:text-accent-gold hover:border-accent-gold'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label.split(' ').slice(1).join(' ')}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-green rounded-lg flex items-center justify-center">
                    <span className="text-text-primary">🔥</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {data.trending?.length || 0}
                    </h3>
                    <p className="text-accent-gold text-sm">Trending Topics</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
                    <span className="text-text-primary">👥</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {data.competitors?.length || 0}
                    </h3>
                    <p className="text-accent-gold text-sm">Competitors Tracked</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-gold rounded-lg flex items-center justify-center">
                    <span className="text-dark-bg">💡</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {data.insights?.length || 0}
                    </h3>
                    <p className="text-accent-gold text-sm">AI Insights</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-card border border-dark-border rounded-lg p-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-accent-brown rounded-lg flex items-center justify-center">
                    <span className="text-text-primary">🌏</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-text-primary">PH & AU</h3>
                    <p className="text-accent-gold text-sm">Market Focus</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              <h3 className="text-xl font-semibold text-text-primary mb-4">🚀 Quick Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.insights?.slice(0, 4).map((insight, index) => (
                  <div key={index} className="bg-dark-hover border border-dark-border rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-2">{insight.title}</h4>
                    <p className="text-accent-gold text-sm mb-2">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        insight.priority === 'high' ? 'bg-accent-red text-text-primary' :
                        insight.priority === 'medium' ? 'bg-accent-gold text-dark-bg' :
                        'bg-accent-green text-text-primary'
                      }`}>
                        {insight.priority} priority
                      </span>
                      <span className="text-accent-gold text-xs">
                        {insight.confidence_score}% confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.trending?.map((trend, index) => (
                <div key={index} className="bg-dark-card border border-dark-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">{trend.topic}</h3>
                    <span className="px-3 py-1 bg-accent-green text-text-primary rounded-full text-sm font-medium">
                      🔥 +{trend.growth_rate}%
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-accent-gold">Engagement Rate</span>
                      <span className="text-text-primary font-medium">{trend.engagement_rate}%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-accent-gold">24h Volume</span>
                      <span className="text-text-primary font-medium">{trend.volume_24h?.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-accent-gold">Peak Time</span>
                      <span className="text-text-primary font-medium">{trend.peak_time}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-accent-gold text-sm mb-2">Popular Hashtags:</p>
                    <div className="flex flex-wrap gap-2">
                      {trend.hashtags?.slice(0, 4).map((hashtag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-dark-hover text-accent-gold rounded text-xs">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {data.competitors?.map((competitor, index) => (
                <div key={index} className="bg-dark-card border border-dark-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{competitor.username}</h3>
                      <p className="text-accent-gold text-sm">{competitor.platform} • {competitor.location}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      competitor.niche_focus === 'Fitness' ? 'bg-accent-green text-text-primary' :
                      competitor.niche_focus === 'Mens Fashion' ? 'bg-accent-gold text-dark-bg' :
                      competitor.niche_focus === 'Solo Lifestyle' ? 'bg-accent-red text-text-primary' :
                      competitor.niche_focus === 'AI & Productivity' ? 'bg-accent-brown text-text-primary' :
                      'bg-dark-hover text-text-primary'
                    }`}>
                      {competitor.niche_focus}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-accent-gold">Followers</span>
                      <span className="text-text-primary font-medium">
                        {competitor.followers?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-accent-gold">Engagement</span>
                      <span className="text-text-primary font-medium">
                        {competitor.platform_performance?.avg_engagement_rate}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-accent-gold">Post Frequency</span>
                      <span className="text-text-primary font-medium">
                        {competitor.platform_performance?.post_frequency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <p className="text-accent-gold text-sm mb-2">Content Strategy:</p>
                    <p className="text-text-primary text-sm">{competitor.content_strategy}</p>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-accent-gold text-sm mb-2">Opportunities:</p>
                    <div className="space-y-1">
                      {competitor.opportunities?.slice(0, 2).map((opp, idx) => (
                        <p key={idx} className="text-text-primary text-xs">• {opp}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {data.insights?.map((insight, index) => (
                <div key={index} className="bg-dark-card border border-dark-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">{insight.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        insight.priority === 'high' ? 'bg-accent-red text-text-primary' :
                        insight.priority === 'medium' ? 'bg-accent-gold text-dark-bg' :
                        'bg-accent-green text-text-primary'
                      }`}>
                        {insight.priority}
                      </span>
                      <span className="text-accent-gold text-sm">
                        {insight.confidence_score}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-text-primary mb-4">{insight.description}</p>
                  
                  {insight.action_items && insight.action_items.length > 0 && (
                    <div>
                      <p className="text-accent-gold text-sm font-medium mb-2">Action Items:</p>
                      <div className="space-y-1">
                        {insight.action_items.map((action, idx) => (
                          <p key={idx} className="text-text-primary text-sm">• {action}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-accent-gold">Insight Type</span>
                      <span className="text-text-primary capitalize">{insight.insight_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 