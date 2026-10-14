import api from './api';

export const authService = {
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  getMe: async () => {
    return await api.get('/auth/me');
  }
};

export default authService;
