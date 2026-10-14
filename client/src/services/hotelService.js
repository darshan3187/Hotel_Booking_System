import api from './api';

export const hotelService = {
  // Public Hotel endpoints
  getHotels: async (params = {}) => {
    return await api.get('/hotels', { params });
  },

  getHotelById: async (id) => {
    return await api.get(`/hotels/${id}`);
  },

  // Rooms
  getRooms: async (params = {}) => {
    return await api.get('/rooms', { params });
  },

  getRoomById: async (id) => {
    return await api.get(`/rooms/${id}`);
  },

  // Admin Hotel CRUD
  createHotel: async (data) => {
    return await api.post('/hotels', data);
  },

  updateHotel: async (id, data) => {
    return await api.put(`/hotels/${id}`, data);
  },

  deleteHotel: async (id) => {
    return await api.delete(`/hotels/${id}`);
  },

  // Admin Room CRUD
  createRoom: async (data) => {
    return await api.post('/rooms', data);
  },

  updateRoom: async (id, data) => {
    return await api.put(`/rooms/${id}`, data);
  },

  deleteRoom: async (id) => {
    return await api.delete(`/rooms/${id}`);
  }
};

export default hotelService;
