import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const api = {
  async checkHealth() {
    const response = await apiClient.get('/health');
    return response.data;
  },

  async createCase(premise, difficulty) {
    const response = await apiClient.post('/cases', { premise, difficulty });
    return response.data;
  },

  async getCase(id) {
    const response = await apiClient.get(`/cases/${id}`);
    return response.data;
  },

  async discoverClue(id, clueId) {
    const response = await apiClient.post(`/cases/${id}/clues/${clueId}/discover`);
    return response.data;
  },

  async requestHint(id) {
    const response = await apiClient.post(`/cases/${id}/hints`);
    return response.data;
  },

  async submitAccusation(id, suspectId) {
    const response = await apiClient.post(`/cases/${id}/accuse`, { suspectId });
    return response.data;
  },

  async getCaseResult(id) {
    const response = await apiClient.get(`/cases/${id}/result`);
    return response.data;
  },
};

export default api;
