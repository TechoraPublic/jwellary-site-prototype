import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoryService } from '../../../services/category.service';
import '../Product/ProductForm.css'; // Reusing the clean card styling from Product forms

const AddCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

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
      await categoryService.createCategory(formData);
      toast.success('Category created successfully!');
      // Reset form & redirect
      setFormData({ name: '', description: '' });
      navigate('/admin/categories/manage');
    } catch (error) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form-container">
      <h2>Add New Category</h2>
      <p className="form-subtitle">Create a new category for your store.</p>
      
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

        <div className="form-actions">
          <Link to="/admin/categories/manage" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
