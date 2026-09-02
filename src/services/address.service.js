import api from './api';

export const addressService = {
  createAddress: async (addressData) => {
    try {
      const response = await api.post('/addresses', addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create address' };
    }
  },

  getUserAddresses: async () => {
    try {
      const response = await api.get('/addresses');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch addresses' };
    }
  },

  getAddressById: async (id) => {
    try {
      const response = await api.get(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch address' };
    }
  },

  updateAddress: async (id, addressData) => {
    try {
      const response = await api.put(`/addresses/${id}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update address' };
    }
  },

  deleteAddress: async (id) => {
    try {
      const response = await api.delete(`/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete address' };
    }
  }
};
