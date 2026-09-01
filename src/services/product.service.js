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
  }
};
