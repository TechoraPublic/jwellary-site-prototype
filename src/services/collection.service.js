import api from './api';

export const collectionService = {
  getAllCollections: async () => {
    try {
      const response = await api.get('/collections/get-collections');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCollectionById: async (id) => {
    try {
      const response = await api.get(`/collections/get-collection/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createCollection: async (collectionData) => {
    try {
      const response = await api.post('/collections/create-collection', collectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCollection: async (id, collectionData) => {
    try {
      const response = await api.put(`/collections/update-collection/${id}`, collectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  softDeleteCollection: async (id) => {
    try {
      const response = await api.delete(`/collections/delete-collection/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
