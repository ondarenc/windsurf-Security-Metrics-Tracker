const API_BASE_URL = '/api';

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Metrics API
export const metricsApi = {
  getAll: () => apiRequest('/metrics'),
  add: (data) => apiRequest('/metrics', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/metrics/${id}`, {
    method: 'DELETE',
  }),
};

// Follow-up API
export const followupApi = {
  getAll: (visibleOnly = false) => {
    const query = visibleOnly ? '?visible_only=true' : '';
    return apiRequest(`/followup${query}`);
  },
  add: (data) => apiRequest('/followup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/followup/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/followup/${id}`, {
    method: 'DELETE',
  }),
};

// Health check
export const healthCheck = () => apiRequest('/health');

// Reports API
export const reportsApi = {
  getAll: () => apiRequest('/reports'),
  getById: (id) => apiRequest(`/reports/${id}`),
  getBySection: (section) => apiRequest(`/reports?section=${encodeURIComponent(section)}`),
  add: (data) => apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/reports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/reports/${id}`, {
    method: 'DELETE',
  }),
};
