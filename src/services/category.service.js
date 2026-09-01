import api from './api';

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await api.get('/categories/get-categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create a new category
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories/create-category', categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
