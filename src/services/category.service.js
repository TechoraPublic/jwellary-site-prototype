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

  // Get category by ID
  getCategoryById: async (id) => {
    try {
      const response = await api.get(`/categories/get-category/${id}`);
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
  },

  // Update a category
  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/update-category/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Soft delete a category
  softDeleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/delete-category/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
