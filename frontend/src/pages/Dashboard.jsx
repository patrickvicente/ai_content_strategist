import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    platforms: 0,
    contentPillars: 0,
    contentIdeas: 0,
    contentItems: 0,
    tasks: 0,
    recentContent: [],
    recentTasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardSummary();
      // Ensure arrays are always defined
      setSummary({
        platforms: data.platforms || 0,
        contentPillars: data.contentPillars || 0,
        contentIdeas: data.contentIdeas || 0,
        contentItems: data.contentItems || 0,
        tasks: data.tasks || 0,
        recentContent: data.recentContent || [],
        recentTasks: data.recentTasks || []
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-text-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold mx-auto mb-4"></div>
          <p className="text-text-primary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-text-primary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            🎯 AI Content Strategy Dashboard
          </h1>
          <p className="text-accent-gold">
            Manage your content strategy with AI-powered insights
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent-green rounded-lg flex items-center justify-center">
                  <span className="text-text-primary">📱</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-text-primary">{summary.platforms}</h3>
                <p className="text-accent-gold text-sm">Platforms</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent-brown rounded-lg flex items-center justify-center">
                  <span className="text-text-primary">🏛️</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-text-primary">{summary.contentPillars}</h3>
                <p className="text-accent-gold text-sm">Content Pillars</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent-gold rounded-lg flex items-center justify-center">
                  <span className="text-dark-bg">💡</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-text-primary">{summary.contentIdeas}</h3>
                <p className="text-accent-gold text-sm">Content Ideas</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent-red rounded-lg flex items-center justify-center">
                  <span className="text-text-primary">📋</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-text-primary">{summary.contentItems}</h3>
                <p className="text-accent-gold text-sm">Content Items</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-accent-green rounded-lg flex items-center justify-center">
                  <span className="text-text-primary">✅</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-text-primary">{summary.tasks}</h3>
                <p className="text-accent-gold text-sm">Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/content-ideas"
            className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover hover:border-accent-gold transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-gold rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-dark-bg text-xl">💡</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Generate Ideas</h3>
              <p className="text-accent-gold text-sm">AI-powered content ideas</p>
            </div>
          </Link>

          <Link
            to="/content-manager"
            className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover hover:border-accent-green transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-green rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-text-primary text-xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Manage Content</h3>
              <p className="text-accent-gold text-sm">Track and organize content</p>
            </div>
          </Link>

          <Link
            to="/trend-analytics"
            className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover hover:border-accent-red transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-red rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-text-primary text-xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Trend Analytics</h3>
              <p className="text-accent-gold text-sm">AI insights & trends</p>
            </div>
          </Link>

          <Link
            to="/ai-strategy"
            className="bg-dark-card border border-dark-border rounded-lg p-6 hover:bg-dark-hover hover:border-accent-brown transition-all transform hover:scale-105"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-brown rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-text-primary text-xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">AI Strategy</h3>
              <p className="text-accent-gold text-sm">Generate content strategy</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Content */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">📋 Recent Content</h2>
              <Link 
                to="/content-manager" 
                className="text-accent-gold hover:text-accent-red text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {(summary.recentContent && summary.recentContent.length > 0) ? (
                summary.recentContent.map((content) => (
                  <div key={content.id} className="bg-dark-hover rounded-lg p-3 border border-dark-border">
                    <h3 className="font-medium text-text-primary">{content.content_title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        content.status === 'published' ? 'bg-accent-green text-text-primary' :
                        content.status === 'scheduled' ? 'bg-accent-gold text-dark-bg' :
                        'bg-accent-brown text-text-primary'
                      }`}>
                        {content.status}
                      </span>
                      <span className="text-accent-gold text-xs">
                        {new Date(content.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-accent-gold text-center py-8">
                  No content items yet. <Link to="/content-manager" className="text-accent-red hover:underline">Create your first content</Link>
                </p>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text-primary">✅ Recent Tasks</h2>
              <Link 
                to="/tasks" 
                className="text-accent-gold hover:text-accent-red text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {(summary.recentTasks && summary.recentTasks.length > 0) ? (
                summary.recentTasks.map((task) => (
                  <div key={task.id} className="bg-dark-hover rounded-lg p-3 border border-dark-border">
                    <h3 className="font-medium text-text-primary">{task.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        task.status === 'completed' ? 'bg-accent-green text-text-primary' : 'bg-accent-red text-text-primary'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-accent-gold text-xs">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-accent-gold text-center py-8">
                  No tasks yet. <Link to="/tasks" className="text-accent-red hover:underline">Create your first task</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 