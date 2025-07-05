import React, { useState, useEffect } from 'react';
import { getPlatforms, createPlatform, updatePlatform, deletePlatform } from '../services/api.js';

const Platforms = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [formData, setFormData] = useState({
    platform_name: '',
    current_followers: 0,
    goal_followers: 0,
  });

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      const data = await getPlatforms();
      setPlatforms(data);
    } catch (error) {
      console.error('Error loading platforms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlatform) {
        await updatePlatform(editingPlatform.id, formData);
      } else {
        await createPlatform(formData);
      }
      setShowForm(false);
      setEditingPlatform(null);
      setFormData({ platform_name: '', current_followers: 0, goal_followers: 0 });
      loadPlatforms();
    } catch (error) {
      console.error('Error saving platform:', error);
    }
  };

  const handleEdit = (platform) => {
    setEditingPlatform(platform);
    setFormData({
      platform_name: platform.platform_name,
      current_followers: platform.current_followers,
      goal_followers: platform.goal_followers,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this platform?')) {
      try {
        await deletePlatform(id);
        loadPlatforms();
      } catch (error) {
        console.error('Error deleting platform:', error);
      }
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
        <h1 className="text-3xl font-bold text-gray-900">Platforms</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add Platform
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">
            {editingPlatform ? 'Edit Platform' : 'Add New Platform'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Platform Name</label>
              <input
                type="text"
                value={formData.platform_name}
                onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Followers</label>
              <input
                type="number"
                value={formData.current_followers}
                onChange={(e) => setFormData({ ...formData, current_followers: parseInt(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Goal Followers</label>
              <input
                type="number"
                value={formData.goal_followers}
                onChange={(e) => setFormData({ ...formData, goal_followers: parseInt(e.target.value) })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPlatform(null);
                  setFormData({ platform_name: '', current_followers: 0, goal_followers: 0 });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                {editingPlatform ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <div key={platform.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{platform.platform_name}</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Current Followers: <span className="font-medium">{platform.current_followers.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600">
                Goal: <span className="font-medium">{platform.goal_followers.toLocaleString()}</span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min((platform.current_followers / platform.goal_followers) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {platform.goal_followers > 0
                  ? `${Math.round((platform.current_followers / platform.goal_followers) * 100)}% of goal`
                  : 'No goal set'}
              </p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleEdit(platform)}
                className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(platform.id)}
                className="text-red-600 hover:text-red-900 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Platforms; 