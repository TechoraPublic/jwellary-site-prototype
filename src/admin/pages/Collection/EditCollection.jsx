import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collectionService } from '../../../services/collection.service';

const EditCollection = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await collectionService.getCollectionById(id);
        if (response.success && response.data) {
          const c = response.data;
          setFormData({
            name: c.name || '',
            description: c.description || '',
            isActive: c.isActive !== false
          });
          if (c.image) setExistingImage(c.image);
        }
      } catch (error) {
        toast.error('Failed to fetch collection details');
        navigate('/admin/collections/manage');
      } finally {
        setLoading(false);
      }
    };
    fetchCollection();
  }, [id, navigate]);

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
      setSubmitting(true);
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('isActive', formData.isActive);
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      await collectionService.updateCollection(id, submitData);
      toast.success('Collection updated successfully!');
      navigate('/admin/collections/manage');
    } catch (error) {
      toast.error(error.message || 'Failed to update collection');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;

  return (
    <div className="admin-form-container">
      <h2>Edit Collection</h2>
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
          <label htmlFor="image">Update Image</label>
          {existingImage && !imageFile && (
            <div style={{ marginBottom: '10px' }}>
              <img src={existingImage.url} alt="Current" style={{ width: '100px', borderRadius: '4px' }} />
            </div>
          )}
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/collections/manage')} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Collection'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCollection;
