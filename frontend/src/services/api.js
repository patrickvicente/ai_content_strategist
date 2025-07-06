import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Platforms
export const getPlatforms = async () => {
  const response = await api.get('/api/platforms');
  return response.data;
};

export const createPlatform = async (platform) => {
  const response = await api.post('/api/platforms', platform);
  return response.data;
};

export const updatePlatform = async (id, platform) => {
  const response = await api.put(`/api/platforms/${id}`, platform);
  return response.data;
};

export const deletePlatform = async (id) => {
  await api.delete(`/api/platforms/${id}`);
};

// Profile
export const getProfile = async () => {
  const response = await api.get('/api/profile');
  return response.data;
};

export const updateProfile = async (profile) => {
  const response = await api.put('/api/profile', profile);
  return response.data;
};

// Content Pillars
export const getContentPillars = async () => {
  const response = await api.get('/api/content-pillars');
  return response.data;
};

export const createContentPillar = async (pillar) => {
  const response = await api.post('/api/content-pillars', pillar);
  return response.data;
};

export const updateContentPillar = async (id, pillar) => {
  const response = await api.put(`/api/content-pillars/${id}`, pillar);
  return response.data;
};

export const deleteContentPillar = async (id) => {
  await api.delete(`/api/content-pillars/${id}`);
};

// Content Ideas
export const getContentIdeas = async () => {
  const response = await api.get('/api/content-ideas');
  return response.data;
};

export const createContentIdea = async (idea) => {
  const response = await api.post('/api/content-ideas', idea);
  return response.data;
};

export const updateContentIdea = async (id, idea) => {
  const response = await api.put(`/api/content-ideas/${id}`, idea);
  return response.data;
};

export const deleteContentIdea = async (id) => {
  await api.delete(`/api/content-ideas/${id}`);
};

// Content Manager
export const getContentManager = async () => {
  const response = await api.get('/api/content-manager');
  return response.data;
};

export const createContentItem = async (content) => {
  const response = await api.post('/api/content-manager', content);
  return response.data;
};

export const updateContentItem = async (id, content) => {
  const response = await api.put(`/api/content-manager/${id}`, content);
  return response.data;
};

export const deleteContentItem = async (id) => {
  await api.delete(`/api/content-manager/${id}`);
};

// Repurpose Content
export const repurposeContentItem = async (id) => {
  const response = await api.post(`/api/content-manager/${id}/repurpose`);
  return response.data;
};

// Tasks
export const getTasks = async () => {
  const response = await api.get('/api/tasks');
  return response.data;
};

export const createTask = async (task) => {
  const response = await api.post('/api/tasks', task);
  return response.data;
};

export const updateTask = async (id, task) => {
  const response = await api.put(`/api/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/api/tasks/${id}`);
};

// Analytics
export const getAnalytics = async (days) => {
  const params = days ? { days } : {};
  const response = await api.get('/api/analytics', { params });
  return response.data;
};

export const createAnalytics = async (analytics) => {
  const response = await api.post('/api/analytics', analytics);
  return response.data;
};

// Advanced Analytics Functions
export const getAnalyticsDashboard = async (niche) => {
  const params = niche ? { niche } : {};
  const response = await api.get('/api/analytics/dashboard', { params });
  return response.data;
};

export const getTrendingTopics = async (niche) => {
  const params = niche ? { niche } : {};
  const response = await api.get('/api/analytics/trending-topics', { params });
  return response.data;
};

export const getCompetitorAnalysis = async (niche) => {
  const params = niche ? { niche } : {};
  const response = await api.get('/api/analytics/competitor-analysis', { params });
  return response.data;
};

export const getNicheInsights = async (niche) => {
  const params = niche ? { niche } : {};
  const response = await api.get('/api/analytics/niche-insights', { params });
  return response.data;
};

export const predictContentPerformance = async (content) => {
  const response = await api.post('/api/analytics/performance-prediction', content);
  return response.data;
};

// Dashboard
export const getDashboardSummary = async () => {
  const response = await api.get('/api/dashboard/summary');
  return response.data;
};

// AI Services
export const generateStrategy = async () => {
  const response = await api.post('/api/ai/generate-strategy');
  return response.data;
};

export const generateContentIdeas = async (pillarId) => {
  const response = await api.post('/api/ai/generate-ideas', { pillar_id: pillarId });
  return response.data;
};

export const optimizeContent = async (contentId, platform) => {
  const response = await api.post('/api/ai/optimize-content', { content_id: contentId, platform });
  return response.data;
};

export const analyzePerformance = async () => {
  const response = await api.post('/api/ai/analyze-performance');
  return response.data;
};

export const generateWeeklyPlan = async () => {
  const response = await api.post('/api/ai/weekly-plan');
  return response.data;
};

// AI-powered content generation
export const generateContentField = async (fieldType, contentData) => {
  const response = await api.post('/api/ai/generate-content-field', {
    field_type: fieldType,
    content_data: contentData
  });
  return response.data;
};

export default api; 