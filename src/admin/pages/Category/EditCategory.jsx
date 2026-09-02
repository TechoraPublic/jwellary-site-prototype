import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoryService } from '../../../services/category.service';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await categoryService.getCategoryById(id);
        if (response.success && response.data) {
          setFormData({
            name: response.data.name || '',
            description: response.data.description || ''
          });
        }
      } catch (error) {
        toast.error('Failed to load category details');
        navigate('/admin/categories/manage');
      } finally {
        setFetching(false);
      }
    };
    fetchCategory();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      await categoryService.updateCategory(id, formData);
      toast.success('Category updated successfully!');
      navigate('/admin/categories/manage');
    } catch (error) {
      toast.error(error.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div>Loading category details...</div>;
  }

  return (
    <div className="admin-form-container">
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Category Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Diamond Rings"
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
            placeholder="Description of the category..."
            rows="4"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Category'}
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
