import api from './api';

export const productService = {
  // Create a new product (handles FormData for image upload)
  createProduct: async (productFormData) => {
    try {
      // Let browser set the Content-Type for multipart/form-data boundary automatically
      const response = await api.post('/products/create-product', productFormData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/products/get-products');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/get-product/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a product
  updateProduct: async (id, productFormData) => {
    try {
      const response = await api.put(`/products/update-product/${id}`, productFormData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Soft delete a product
  softDeleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/delete-product/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
