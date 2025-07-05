import React, { useState, useEffect } from 'react';
import { getContentPillars, createContentPillar, updateContentPillar, deleteContentPillar } from '../services/api.js';

const ContentPillars = () => {
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [editingPillar, setEditingPillar] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [formData, setFormData] = useState({
    pillar_name: '',
    description: '',
    keywords: '',
    target_audience: '',
    content_frequency: '',
    goals: '',
    color: '#3B82F6'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Predefined color palette for quick selection
  const colorPalette = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
    '#14B8A6', '#F43F5E', '#8B5A2B', '#64748B', '#1F2937'
  ];

  useEffect(() => {
    loadPillars();
  }, []);

  const loadPillars = async () => {
    try {
      const data = await getContentPillars();
      setPillars(data);
    } catch (error) {
      console.error('Error loading content pillars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (pillar) => {
    setSelectedPillar(pillar);
    setShowActionModal(true);
  };

  const handleCreate = () => {
    setEditingPillar(null);
    setShowColorPicker(false);
    setFormData({
      pillar_name: '',
      description: '',
      keywords: '',
      target_audience: '',
      content_frequency: '',
      goals: '',
      color: '#3B82F6'
    });
    setShowModal(true);
  };

  const handleEdit = (pillar) => {
    setEditingPillar(pillar);
    setShowColorPicker(false);
    setFormData({
      pillar_name: pillar.pillar_name || '',
      description: pillar.description || '',
      keywords: pillar.keywords || '',
      target_audience: pillar.target_audience || '',
      content_frequency: pillar.content_frequency || '',
      goals: pillar.goals || '',
      color: pillar.color || '#3B82F6'
    });
    setShowActionModal(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content pillar? This will affect all related content ideas.')) {
      try {
        await deleteContentPillar(id);
        await loadPillars();
        setShowActionModal(false);
        setSuccessMessage('Content pillar deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting content pillar:', error);
        alert('Error deleting content pillar');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingPillar) {
        await updateContentPillar(editingPillar.id, formData);
        setSuccessMessage('Content pillar updated successfully!');
      } else {
        await createContentPillar(formData);
        setSuccessMessage('Content pillar created successfully!');
      }
      
      setShowModal(false);
      setShowColorPicker(false);
      await loadPillars();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content pillar:', error);
      alert('Error saving content pillar');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleColorSelect = (color) => {
    setFormData({
      ...formData,
      color: color
    });
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Pillars</h1>
          <p className="text-gray-600 mt-2">Define the core themes, keywords, and strategies that guide your content creation</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Content Pillar
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Content Pillars Grid */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {pillars.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content pillars yet</h3>
            <p className="text-gray-600 mb-4">Create your first content pillar to define your content strategy themes</p>
            <button
              onClick={handleCreate}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create First Pillar
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {pillars.map((pillar) => (
              <div 
                key={pillar.id} 
                className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCardClick(pillar)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                        style={{ backgroundColor: pillar.color }}
                      ></div>
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{pillar.pillar_name}</h3>
                    </div>
                    <div className="text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {pillar.description || 'No description provided'}
                  </p>
                  
                  {pillar.keywords && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">Keywords:</p>
                      <div className="flex flex-wrap gap-1">
                        {pillar.keywords.split(',').map((keyword, index) => (
                          <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    {pillar.target_audience && (
                      <div>
                        <p className="font-medium text-gray-700">Audience:</p>
                        <p className="truncate">{pillar.target_audience}</p>
                      </div>
                    )}
                    {pillar.content_frequency && (
                      <div>
                        <p className="font-medium text-gray-700">Frequency:</p>
                        <p>{pillar.content_frequency}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Created {new Date(pillar.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedPillar && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center mb-4">
                <div 
                  className="w-6 h-6 rounded-full mr-3 flex-shrink-0"
                  style={{ backgroundColor: selectedPillar.color }}
                ></div>
                <h3 className="text-lg font-medium text-gray-900">{selectedPillar.pillar_name}</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">{selectedPillar.description}</p>
                
                {selectedPillar.keywords && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Keywords:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedPillar.keywords.split(',').map((keyword, index) => (
                        <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedPillar.target_audience && (
                    <div>
                      <p className="font-medium text-gray-700">Target Audience:</p>
                      <p className="text-gray-600">{selectedPillar.target_audience}</p>
                    </div>
                  )}
                  {selectedPillar.content_frequency && (
                    <div>
                      <p className="font-medium text-gray-700">Frequency:</p>
                      <p className="text-gray-600">{selectedPillar.content_frequency}</p>
                    </div>
                  )}
                </div>

                {selectedPillar.goals && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">Goals:</p>
                    <p className="text-gray-600 text-sm">{selectedPillar.goals}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEdit(selectedPillar)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedPillar.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPillar ? 'Edit Content Pillar' : 'Create New Content Pillar'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pillar Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pillar_name"
                      value={formData.pillar_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Fitness Tips, Business Strategy"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Frequency</label>
                    <select
                      name="content_frequency"
                      value={formData.content_frequency}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select frequency</option>
                      <option value="Daily">Daily</option>
                      <option value="3x per week">3x per week</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Bi-weekly">Bi-weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe what this content pillar covers and why it's important to your audience..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords <span className="text-gray-500">(separate with commas)</span>
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    placeholder="workout routines, nutrition tips, meal prep, fitness motivation"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Keywords help with SEO and content generation</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleChange}
                    placeholder="e.g., Busy professionals aged 25-40, fitness beginners"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goals & Objectives</label>
                  <textarea
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    rows={2}
                    placeholder="What do you want to achieve with this content pillar? e.g., Build community, educate audience, drive sales..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Color Theme</label>
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer flex items-center justify-center"
                      style={{ backgroundColor: formData.color }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">{formData.color}</span>
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      {showColorPicker ? 'Hide' : 'Change Color'}
                    </button>
                  </div>

                  {showColorPicker && (
                    <div className="mt-3 p-4 border border-gray-200 rounded-md bg-gray-50">
                      <div className="flex items-center space-x-3 mb-3">
                        <input
                          type="color"
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          name="color"
                          value={formData.color}
                          onChange={handleChange}
                          placeholder="#3B82F6"
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {colorPalette.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleColorSelect(color)}
                            className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-gray-800' : 'border-gray-300'} hover:border-gray-600 transition-colors`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setShowColorPicker(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : editingPillar ? 'Update Pillar' : 'Create Pillar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPillars; 