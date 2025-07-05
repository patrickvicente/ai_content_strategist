import React, { useState, useEffect } from 'react';
import { getContentIdeas, createContentIdea, updateContentIdea, deleteContentIdea, getContentPillars, generateContentIdeas } from '../services/api.js';

const ContentIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [editingIdea, setEditingIdea] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content_pillar_id: '',
    inspiration_link: '',
    status: 'pending',
    priority: 'medium'
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ideasData, pillarsData] = await Promise.all([
        getContentIdeas(),
        getContentPillars()
      ]);
      setIdeas(ideasData);
      setPillars(pillarsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (idea) => {
    setSelectedIdea(idea);
    setShowActionModal(true);
  };

  const handleCreate = () => {
    setEditingIdea(null);
    setFormData({
      title: '',
      description: '',
      content_pillar_id: '',
      inspiration_link: '',
      status: 'pending',
      priority: 'medium'
    });
    setShowModal(true);
  };

  const handleEdit = (idea) => {
    setEditingIdea(idea);
    setFormData({
      title: idea.title || '',
      description: idea.description || '',
      content_pillar_id: idea.content_pillar_id || '',
      inspiration_link: idea.inspiration_link || '',
      status: idea.status || 'pending',
      priority: idea.priority || 'medium'
    });
    setShowActionModal(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content idea?')) {
      try {
        await deleteContentIdea(id);
        await loadData();
        setShowActionModal(false);
        setSuccessMessage('Content idea deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting content idea:', error);
        alert('Error deleting content idea');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingIdea) {
        await updateContentIdea(editingIdea.id, formData);
        setSuccessMessage('Content idea updated successfully!');
      } else {
        await createContentIdea(formData);
        setSuccessMessage('Content idea created successfully!');
      }
      
      setShowModal(false);
      await loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content idea:', error);
      alert('Error saving content idea');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAI = async (pillarId) => {
    if (!pillarId) {
      alert('Please select a content pillar first');
      return;
    }
    
    setGeneratingAI(true);
    try {
      const aiIdeas = await generateContentIdeas(pillarId);
      
      // Create ideas from AI suggestions
      const promises = aiIdeas.map(aiIdea => 
        createContentIdea({
          title: aiIdea.title,
          description: aiIdea.description,
          content_pillar_id: pillarId,
          status: 'pending',
          priority: 'medium'
        })
      );
      
      await Promise.all(promises);
      await loadData();
      setSuccessMessage(`Generated ${aiIdeas.length} AI content ideas!`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error generating AI ideas:', error);
      alert('Error generating AI ideas');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getPillarById = (pillarId) => {
    return pillars.find(p => p.id === pillarId);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Content Ideas</h1>
          <p className="text-gray-600 mt-2">Generate, organize and track your content ideas</p>
        </div>
        <div className="flex space-x-3">
          <select
            onChange={(e) => handleGenerateAI(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            disabled={generatingAI}
          >
            <option value="">Generate AI Ideas...</option>
            {pillars.map(pillar => (
              <option key={pillar.id} value={pillar.id}>
                {pillar.pillar_name}
              </option>
            ))}
          </select>
          {generatingAI && (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500 mr-2"></div>
              <span className="text-sm text-gray-600">Generating...</span>
            </div>
          )}
          <button
            onClick={handleCreate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Content Idea
          </button>
        </div>
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

      {/* Content Ideas Grid */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {ideas.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No content ideas yet</h3>
            <p className="text-gray-600 mb-4">Start brainstorming content ideas for your pillars</p>
            <button
              onClick={handleCreate}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add First Idea
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {ideas.map((idea) => {
              const pillar = getPillarById(idea.content_pillar_id);
              return (
                <div 
                  key={idea.id} 
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCardClick(idea)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(idea.priority)}`}>
                          {idea.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(idea.status)}`}>
                          {idea.status}
                        </span>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{idea.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{idea.description}</p>
                    
                    {pillar && (
                      <div className="flex items-center mb-4">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: pillar.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{pillar.pillar_name}</span>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center text-xs text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Created {new Date(idea.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedIdea && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{selectedIdea.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedIdea.priority)}`}>
                    {selectedIdea.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedIdea.status)}`}>
                    {selectedIdea.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">{selectedIdea.description}</p>
                
                {selectedIdea.inspiration_link && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Inspiration Link:</p>
                    <a 
                      href={selectedIdea.inspiration_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                      {selectedIdea.inspiration_link}
                    </a>
                  </div>
                )}
                
                {getPillarById(selectedIdea.content_pillar_id) && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Content Pillar:</p>
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2"
                        style={{ backgroundColor: getPillarById(selectedIdea.content_pillar_id).color }}
                      ></div>
                      <span className="text-sm text-gray-600">{getPillarById(selectedIdea.content_pillar_id).pillar_name}</span>
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500">
                  <p>Created: {new Date(selectedIdea.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(selectedIdea.updated_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleEdit(selectedIdea)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(selectedIdea.id)}
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
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingIdea ? 'Edit Content Idea' : 'Create New Content Idea'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter content idea title"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Describe your content idea..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inspiration Link</label>
                  <input
                    type="url"
                    name="inspiration_link"
                    value={formData.inspiration_link}
                    onChange={handleChange}
                    placeholder="https://example.com/viral-content"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Pillar <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="content_pillar_id"
                    value={formData.content_pillar_id}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a content pillar</option>
                    {pillars.map(pillar => (
                      <option key={pillar.id} value={pillar.id}>{pillar.pillar_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : editingIdea ? 'Update Idea' : 'Create Idea'}
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

export default ContentIdeas; 