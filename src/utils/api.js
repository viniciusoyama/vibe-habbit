const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API request wrapper
const apiRequest = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Character API
export const characterAPI = {
  get: () => apiRequest('/character'),

  update: (updates) =>
    apiRequest('/character', {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),
};

// Skills API
export const skillsAPI = {
  getAll: () => apiRequest('/skills'),

  create: (name) =>
    apiRequest('/skills', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  update: (id, updates) =>
    apiRequest(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id) =>
    apiRequest(`/skills/${id}`, {
      method: 'DELETE',
    }),
};

// Habits API
export const habitsAPI = {
  getAll: () => apiRequest('/habits'),

  create: (name, skillIds) =>
    apiRequest('/habits', {
      method: 'POST',
      body: JSON.stringify({ name, skillIds }),
    }),

  update: (id, updates) =>
    apiRequest(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  delete: (id) =>
    apiRequest(`/habits/${id}`, {
      method: 'DELETE',
    }),

  complete: (id) =>
    apiRequest(`/habits/${id}/complete`, {
      method: 'POST',
    }),

  uncomplete: (id) =>
    apiRequest(`/habits/${id}/complete`, {
      method: 'DELETE',
    }),

  getCompletions: () => apiRequest('/habits/completions'),
};
