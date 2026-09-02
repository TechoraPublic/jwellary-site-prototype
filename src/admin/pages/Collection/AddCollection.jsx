import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collectionService } from '../../../services/collection.service';

const AddCollection = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Please enter a collection name');
      return;
    }
    
    try {
      setLoading(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('isActive', formData.isActive);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      await collectionService.createCollection(submitData);
      toast.success('Collection created successfully!');
      navigate('/admin/collections/manage');
    } catch (error) {
      toast.error(error.message || 'Failed to create collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-form-container">
      <h2>Add New Collection</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="name">Collection Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
          ></textarea>
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            style={{ width: 'auto' }}
          />
          <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer' }}>Active</label>
        </div>

        <div className="form-group">
          <label htmlFor="image">Collection Image</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/collections/manage')} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Collection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCollection;
