import React, { useState, useEffect } from 'react';
import { getDashboardSummary, generateStrategy } from '../services/api.js';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingStrategy, setGeneratingStrategy] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const summaryData = await getDashboardSummary();
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStrategy = async () => {
    setGeneratingStrategy(true);
    try {
      const strategyData = await generateStrategy();
      setStrategy(strategyData);
    } catch (error) {
      console.error('Error generating strategy:', error);
    } finally {
      setGeneratingStrategy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={handleGenerateStrategy}
          disabled={generatingStrategy}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {generatingStrategy ? 'Generating...' : 'Generate AI Strategy'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{summary?.total_platforms || 0}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Platforms</dt>
                  <dd className="text-lg font-medium text-gray-900">{summary?.total_platforms || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{summary?.total_content_items || 0}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Content</dt>
                  <dd className="text-lg font-medium text-gray-900">{summary?.total_content_items || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{summary?.published_content || 0}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Published Content</dt>
                  <dd className="text-lg font-medium text-gray-900">{summary?.published_content || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">{summary?.pending_tasks || 0}</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Tasks</dt>
                  <dd className="text-lg font-medium text-gray-900">{summary?.pending_tasks || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Weekly Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{summary?.total_views_week || 0}</div>
              <div className="text-sm text-gray-500">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{summary?.total_engagement_week || 0}</div>
              <div className="text-sm text-gray-500">Total Engagement</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Strategy */}
      {strategy && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">AI Strategy Recommendations</h2>
          </div>
          <div className="p-6">
            {strategy.error ? (
              <div className="text-red-600">
                <p>{strategy.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {strategy.strategy_recommendations && (
                  <div>
                    <h3 className="font-medium text-gray-900">Strategy Recommendations</h3>
                    <p className="text-gray-600">{strategy.strategy_recommendations}</p>
                  </div>
                )}
                {strategy.content_pillars && (
                  <div>
                    <h3 className="font-medium text-gray-900">Content Pillars</h3>
                    <p className="text-gray-600">{strategy.content_pillars}</p>
                  </div>
                )}
                {strategy.optimal_posting_times && (
                  <div>
                    <h3 className="font-medium text-gray-900">Optimal Posting Times</h3>
                    <p className="text-gray-600">{strategy.optimal_posting_times}</p>
                  </div>
                )}
                {strategy.hashtag_strategies && (
                  <div>
                    <h3 className="font-medium text-gray-900">Hashtag Strategies</h3>
                    <p className="text-gray-600">{strategy.hashtag_strategies}</p>
                  </div>
                )}
                {strategy.strategy_text && (
                  <div>
                    <h3 className="font-medium text-gray-900">Strategy</h3>
                    <pre className="whitespace-pre-wrap text-gray-600">{strategy.strategy_text}</pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Analytics */}
      {summary?.recent_analytics && summary.recent_analytics.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Analytics</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Likes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {summary.recent_analytics.map((analytic, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(analytic.date_recorded).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analytic.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analytic.likes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analytic.comments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(analytic.engagement_rate * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 