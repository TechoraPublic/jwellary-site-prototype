import api from './api';

export const adminService = {
  getDashboardStats: async (filter = '30 Days') => {
    try {
      const response = await api.get(`/admin/dashboard?filter=${filter}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
