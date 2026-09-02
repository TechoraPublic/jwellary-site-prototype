import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getMyOrders: async () => {
    try {
      const response = await api.get('/orders/myorders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin routes
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateOrderStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/orders/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
