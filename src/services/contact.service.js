import api from './api';

export const contactService = {
  submitForm: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send message' };
    }
  }
};
