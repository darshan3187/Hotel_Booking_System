import api from './api';

export const bookingService = {
  // User endpoints
  createBooking: async (bookingData) => {
    return await api.post('/bookings', bookingData);
  },

  getMyBookings: async () => {
    return await api.get('/bookings/my');
  },

  getBookingById: async (id) => {
    return await api.get(`/bookings/${id}`);
  },

  cancelBooking: async (id) => {
    return await api.patch(`/bookings/${id}/cancel`);
  },

  // Admin endpoints
  getAdminBookings: async () => {
    return await api.get('/admin/bookings');
  },

  updateBookingStatus: async (id, status) => {
    return await api.patch(`/admin/bookings/${id}/status`, { status });
  },

  getAdminStats: async () => {
    return await api.get('/admin/stats');
  },

  getAdminUsers: async () => {
    return await api.get('/admin/users');
  }
};

export default bookingService;
