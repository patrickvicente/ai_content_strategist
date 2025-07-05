import React, { useState, useEffect } from 'react';
import { getContentManager, createContentItem, updateContentItem, deleteContentItem, getContentIdeas, getPlatforms, getContentPillars } from '../services/api.js';

const ContentManager = () => {
  const [content, setContent] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [pillars, setPillars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    content_title: '',
    content_idea_id: '',
    content_pillar_id: '',
    status: 'planning',
    content_type: '',
    content_format: '',
    publish_time: '',
    intention: '',
    hook: '',
    caption: '',
    script: '',
    music: '',
    duration: '',
    minutes_spent: '',
    content_link: '',
    hashtags_used: '',
    notes: '',
    views: '',
    likes: '',
    comments: '',
    shares: '',
    saves: '',
    retention_rate: '',
    platform_ids: []
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishFormData, setPublishFormData] = useState({
    publish_time: '',
    content_link: '',
    minutes_spent: '',
    notes: '',
    platform_ids: []
  });
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contentData, ideasData, platformsData, pillarsData] = await Promise.all([
        getContentManager(),
        getContentIdeas(),
        getPlatforms(),
        getContentPillars()
      ]);
      setContent(contentData);
      setIdeas(ideasData);
      setPlatforms(platformsData);
      setPillars(pillarsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (contentItem) => {
    setSelectedContent(contentItem);
    setShowActionModal(true);
  };

  const handleCreate = () => {
    setEditingContent(null);
    setFormData({
      content_title: '',
      content_idea_id: '',
      content_pillar_id: '',
      status: 'planning',
      content_type: '',
      content_format: '',
      publish_time: '',
      intention: '',
      hook: '',
      caption: '',
      script: '',
      music: '',
      duration: '',
      minutes_spent: '',
      content_link: '',
      hashtags_used: '',
      notes: '',
      views: '',
      likes: '',
      comments: '',
      shares: '',
      saves: '',
      retention_rate: '',
      platform_ids: []
    });
    setShowModal(true);
  };

  const handleEdit = (contentItem) => {
    setEditingContent(contentItem);
    setFormData({
      content_title: contentItem.content_title || '',
      content_idea_id: contentItem.content_idea_id || '',
      content_pillar_id: contentItem.content_pillar_id || '',
      status: contentItem.status || 'planning',
      content_type: contentItem.content_type || '',
      content_format: contentItem.content_format || '',
      publish_time: contentItem.publish_time ? contentItem.publish_time.slice(0, 16) : '',
      intention: contentItem.intention || '',
      hook: contentItem.hook || '',
      caption: contentItem.caption || '',
      script: contentItem.script || '',
      music: contentItem.music || '',
      duration: contentItem.duration || '',
      minutes_spent: contentItem.minutes_spent || '',
      content_link: contentItem.content_link || '',
      hashtags_used: contentItem.hashtags_used || '',
      notes: contentItem.notes || '',
      views: contentItem.views || '',
      likes: contentItem.likes || '',
      comments: contentItem.comments || '',
      shares: contentItem.shares || '',
      saves: contentItem.saves || '',
      retention_rate: contentItem.retention_rate || '',
      platform_ids: contentItem.platforms ? contentItem.platforms.map(p => p.id.toString()) : []
    });
    setShowActionModal(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this content item?')) {
      try {
        await deleteContentItem(id);
        await loadData();
        setShowActionModal(false);
        setSuccessMessage('Content item deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting content item:', error);
        alert('Error deleting content item');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingContent) {
        await updateContentItem(editingContent.id, formData);
        setSuccessMessage('Content item updated successfully!');
      } else {
        await createContentItem(formData);
        setSuccessMessage('Content item created successfully!');
      }
      
      setShowModal(false);
      await loadData();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content item:', error);
      alert('Error saving content item');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const values = Array.from(e.target.selectedOptions, option => option.value);
      setFormData({
        ...formData,
        [name]: values,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePublish = (contentItem) => {
    setSelectedContent(contentItem);
    setPublishFormData({
      publish_time: '',
      content_link: '',
      minutes_spent: '',
      notes: '',
      platform_ids: []
    });
    setShowActionModal(false);
    setShowPublishModal(true);
  };

  const handlePublishChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const values = Array.from(e.target.selectedOptions, option => option.value);
      setPublishFormData({
        ...publishFormData,
        [name]: values,
      });
    } else {
      setPublishFormData({
        ...publishFormData,
        [name]: value,
      });
    }
  };

  const handlePublishSubmit = async (e) => {
    e.preventDefault();
    setPublishing(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/content-manager/${selectedContent.id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishFormData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish content');
      }
      
      setShowPublishModal(false);
      await loadData();
      setSuccessMessage('Content published successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error publishing content:', error);
      alert('Error publishing content');
    } finally {
      setPublishing(false);
    }
  };

  const getIdeaById = (ideaId) => {
    return ideas.find(idea => idea.id === ideaId);
  };

  const getPillarById = (pillarId) => {
    return pillars.find(pillar => pillar.id === pillarId);
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'bg-purple-100 text-purple-800',
      scripting: 'bg-blue-100 text-blue-800',
      filming: 'bg-orange-100 text-orange-800',
      editing: 'bg-yellow-100 text-yellow-800',
      scheduled: 'bg-cyan-100 text-cyan-800',
      published: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      short_form: 'bg-pink-100 text-pink-800',
      carousel: 'bg-indigo-100 text-indigo-800',
      story: 'bg-green-100 text-green-800',
      long_form: 'bg-red-100 text-red-800',
      post: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Not scheduled';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
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
          <h1 className="text-3xl font-bold text-gray-900">Content Manager</h1>
          <p className="text-gray-600 mt-2">Manage your content creation and publishing schedule</p>
        </div>
        <button
          onClick={handleCreate}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Content
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

      {/* Content Grid */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {content.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No content yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating your first content item.</p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Content
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {content.map((item) => {
              const idea = getIdeaById(item.content_idea_id);
              const pillar = getPillarById(item.content_pillar_id);
              
              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCardClick(item)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {item.content_title || 'Untitled Content'}
                    </h3>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      {item.content_type && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(item.content_type)}`}>
                          {item.content_type?.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    {item.content_format && (
                      <p className="text-sm text-gray-600">
                        <strong>Format:</strong> {item.content_format?.replace('_', ' ').toUpperCase()}
                      </p>
                    )}

                    {pillar && (
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: pillar.color }}
                        ></div>
                        <span className="text-sm text-gray-600">{pillar.pillar_name}</span>
                      </div>
                    )}

                    {idea && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {idea.title}
                      </div>
                    )}

                    {item.publish_time && (
                      <p className="text-sm text-gray-500">
                        <strong>Publish:</strong> {formatDateTime(item.publish_time)}
                      </p>
                    )}

                    {item.minutes_spent && (
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.minutes_spent}m spent
                      </div>
                    )}
                  </div>

                  <div className="text-xs text-gray-400 border-t pt-2">
                    Created {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedContent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedContent.content_title || 'Untitled Content'}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedContent.status)}`}>
                    {selectedContent.status}
                  </span>
                  {selectedContent.content_type && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(selectedContent.content_type)}`}>
                      {selectedContent.content_type?.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mb-6 space-y-4">
                {selectedContent.intention && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Intention/Goal:</p>
                    <p className="text-gray-600 text-sm">{selectedContent.intention}</p>
                  </div>
                )}

                {selectedContent.hook && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Hook:</p>
                    <p className="text-gray-600 text-sm">{selectedContent.hook}</p>
                  </div>
                )}

                {selectedContent.caption && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Caption:</p>
                    <p className="text-gray-600 text-sm">{selectedContent.caption}</p>
                  </div>
                )}

                {selectedContent.script && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Script:</p>
                    <p className="text-gray-600 text-sm">{selectedContent.script}</p>
                  </div>
                )}

                {selectedContent.music && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Music:</p>
                    <p className="text-gray-600 text-sm">{selectedContent.music}</p>
                  </div>
                )}

                {selectedContent.hashtags_used && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Hashtags:</p>
                    <p className="text-gray-600 text-sm">{selectedContent.hashtags_used}</p>
                  </div>
                )}

                {selectedContent.platforms && selectedContent.platforms.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Platforms:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedContent.platforms.map(platform => (
                        <span 
                          key={platform.id} 
                          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                        >
                          {platform.platform_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedContent.publish_time && (
                    <div>
                      <p className="font-medium text-gray-700">Publish Time:</p>
                      <p className="text-gray-600">{formatDateTime(selectedContent.publish_time)}</p>
                    </div>
                  )}

                  {selectedContent.duration && (
                    <div>
                      <p className="font-medium text-gray-700">Duration:</p>
                      <p className="text-gray-600">{selectedContent.duration}s</p>
                    </div>
                  )}

                  {selectedContent.minutes_spent && (
                    <div>
                      <p className="font-medium text-gray-700">Time Spent:</p>
                      <p className="text-gray-600">{selectedContent.minutes_spent} minutes</p>
                    </div>
                  )}

                  {selectedContent.content_link && (
                    <div>
                      <p className="font-medium text-gray-700">Content Link:</p>
                      <a 
                        href={selectedContent.content_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        View Content
                      </a>
                    </div>
                  )}
                </div>

                {/* Analytics */}
                {(selectedContent.views || selectedContent.likes || selectedContent.comments || selectedContent.shares || selectedContent.saves) && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Analytics:</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {selectedContent.views > 0 && (
                        <div>
                          <p className="font-medium text-gray-600">Views:</p>
                          <p className="text-gray-900">{selectedContent.views?.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedContent.likes > 0 && (
                        <div>
                          <p className="font-medium text-gray-600">Likes:</p>
                          <p className="text-gray-900">{selectedContent.likes?.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedContent.comments > 0 && (
                        <div>
                          <p className="font-medium text-gray-600">Comments:</p>
                          <p className="text-gray-900">{selectedContent.comments?.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedContent.shares > 0 && (
                        <div>
                          <p className="font-medium text-gray-600">Shares:</p>
                          <p className="text-gray-900">{selectedContent.shares?.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedContent.saves > 0 && (
                        <div>
                          <p className="font-medium text-gray-600">Saves:</p>
                          <p className="text-gray-900">{selectedContent.saves?.toLocaleString()}</p>
                        </div>
                      )}
                      {selectedContent.retention_rate > 0 && (
                        <div>
                          <p className="font-medium text-gray-600">Retention:</p>
                          <p className="text-gray-900">{selectedContent.retention_rate}%</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-sm text-gray-500 border-t pt-4">
                  <p>Created: {new Date(selectedContent.created_at).toLocaleDateString()}</p>
                  <p>Updated: {new Date(selectedContent.updated_at).toLocaleDateString()}</p>
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
                  onClick={() => handleEdit(selectedContent)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handlePublish(selectedContent)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                >
                  Publish
                </button>
                <button
                  onClick={() => handleDelete(selectedContent.id)}
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
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingContent ? 'Edit Content Item' : 'Create New Content Item'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Content Title */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="content_title"
                      value={formData.content_title}
                      onChange={handleChange}
                      required
                      placeholder="Enter content title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Content Idea (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Idea</label>
                    <select
                      name="content_idea_id"
                      value={formData.content_idea_id}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select original idea (optional)</option>
                      {ideas.map(idea => (
                        <option key={idea.id} value={idea.id}>{idea.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Content Pillar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Pillar</label>
                    <select
                      name="content_pillar_id"
                      value={formData.content_pillar_id}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select content pillar (optional)</option>
                      {pillars.map(pillar => (
                        <option key={pillar.id} value={pillar.id}>{pillar.pillar_name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="planning">Planning</option>
                      <option value="scripting">Scripting</option>
                      <option value="filming">Filming</option>
                      <option value="editing">Editing</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                    <select
                      name="content_type"
                      value={formData.content_type}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select content type</option>
                      <option value="short_form">Short-Form</option>
                      <option value="carousel">Carousel</option>
                      <option value="story">Story</option>
                      <option value="long_form">Long-Form</option>
                      <option value="post">Post</option>
                    </select>
                  </div>

                  {/* Content Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Format</label>
                    <select
                      name="content_format"
                      value={formData.content_format}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select content format</option>
                      <option value="fitcheck">Fitcheck</option>
                      <option value="grwm">GRWM</option>
                      <option value="cinematic">Cinematic</option>
                      <option value="trendy">Trendy</option>
                      <option value="pov">POV</option>
                      <option value="vlog">Vlog</option>
                      <option value="head_talk">Head Talk</option>
                    </select>
                  </div>

                  {/* Publish Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Publish Time</label>
                    <input
                      type="datetime-local"
                      name="publish_time"
                      value={formData.publish_time}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (seconds)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      placeholder="60"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Minutes Spent */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minutes Spent Creating</label>
                    <input
                      type="number"
                      name="minutes_spent"
                      value={formData.minutes_spent}
                      onChange={handleChange}
                      step="0.5"
                      placeholder="120"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Content Link */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Content Link</label>
                    <input
                      type="url"
                      name="content_link"
                      value={formData.content_link}
                      onChange={handleChange}
                      placeholder="https://example.com/published-content"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Intention/Goal */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Intention/Goal</label>
                    <textarea
                      name="intention"
                      value={formData.intention}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Why would your audience watch, like and share this content?"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Hook */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hook</label>
                    <textarea
                      name="hook"
                      value={formData.hook}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Opening hook to grab attention..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Caption */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                    <textarea
                      name="caption"
                      value={formData.caption}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Content caption..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Script */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Script</label>
                    <textarea
                      name="script"
                      value={formData.script}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Full script or talking points..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Music */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Music</label>
                    <input
                      type="text"
                      name="music"
                      value={formData.music}
                      onChange={handleChange}
                      placeholder="Background music, sound effects, or audio details..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Platforms */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platforms</label>
                    <select
                      name="platform_ids"
                      value={formData.platform_ids}
                      onChange={handleChange}
                      multiple
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      style={{ minHeight: '80px' }}
                    >
                      {platforms.map(platform => (
                        <option key={platform.id} value={platform.id}>
                          {platform.platform_name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple platforms</p>
                  </div>

                  {/* Hashtags */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags Used</label>
                    <input
                      type="text"
                      name="hashtags_used"
                      value={formData.hashtags_used}
                      onChange={handleChange}
                      placeholder="#content #creator #inspiration"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Analytics Section */}
                  <div className="md:col-span-2">
                    <h4 className="text-md font-medium text-gray-900 mb-3 border-t pt-4">Analytics</h4>
                  </div>

                  {/* Views */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Views</label>
                    <input
                      type="number"
                      name="views"
                      value={formData.views}
                      onChange={handleChange}
                      placeholder="1000"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Likes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Likes</label>
                    <input
                      type="number"
                      name="likes"
                      value={formData.likes}
                      onChange={handleChange}
                      placeholder="100"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Comments */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                    <input
                      type="number"
                      name="comments"
                      value={formData.comments}
                      onChange={handleChange}
                      placeholder="25"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Shares */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shares</label>
                    <input
                      type="number"
                      name="shares"
                      value={formData.shares}
                      onChange={handleChange}
                      placeholder="10"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Saves */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saves</label>
                    <input
                      type="number"
                      name="saves"
                      value={formData.saves}
                      onChange={handleChange}
                      placeholder="50"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Retention Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Retention Rate (%)</label>
                    <input
                      type="number"
                      name="retention_rate"
                      value={formData.retention_rate}
                      onChange={handleChange}
                      step="0.1"
                      min="0"
                      max="100"
                      placeholder="85.5"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Additional notes and observations..."
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
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
                    {saving ? 'Saving...' : editingContent ? 'Update Content' : 'Create Content'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && selectedContent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Publish Content: {selectedContent.content_title || 'Untitled'}
              </h3>
              <form onSubmit={handlePublishSubmit} className="space-y-4">
                {/* Publish Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publish Time
                  </label>
                  <input
                    type="datetime-local"
                    name="publish_time"
                    value={publishFormData.publish_time}
                    onChange={handlePublishChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Content Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Link
                  </label>
                  <input
                    type="url"
                    name="content_link"
                    value={publishFormData.content_link}
                    onChange={handlePublishChange}
                    placeholder="https://example.com/published-content"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Minutes Spent Creating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minutes Spent Creating
                  </label>
                  <input
                    type="number"
                    name="minutes_spent"
                    value={publishFormData.minutes_spent}
                    onChange={handlePublishChange}
                    placeholder="120"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Platforms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platforms
                  </label>
                  <select
                    name="platform_ids"
                    value={publishFormData.platform_ids}
                    onChange={handlePublishChange}
                    multiple
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ minHeight: '80px' }}
                  >
                    {platforms.map(platform => (
                      <option key={platform.id} value={platform.id}>
                        {platform.platform_name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple platforms</p>
                </div>

                {/* Notes with Questions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={publishFormData.notes}
                    onChange={handlePublishChange}
                    rows={6}
                    placeholder="Please answer these questions:

1. If you are the target audience, why would you watch the video?

2. Would you share the video?

Additional notes..."
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowPublishModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={publishing}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {publishing ? 'Publishing...' : 'Publish Content'}
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

export default ContentManager; 