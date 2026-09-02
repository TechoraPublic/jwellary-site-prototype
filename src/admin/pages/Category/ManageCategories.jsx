import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoryService } from '../../../services/category.service';
import '../../layout/AdminTable.css';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Note that this might affect products in this category.')) {
      try {
        await categoryService.softDeleteCategory(id);
        toast.success('Category deleted successfully');
        // Refresh list
        fetchCategories();
      } catch (error) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Manage Categories</h2>
        <Link to="/admin/categories/add" className="btn-primary">Add New Category</Link>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">No categories found.</td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.description || 'N/A'}</td>
                <td className="actions-cell">
                  <Link to={`/admin/categories/edit/${category._id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(category._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageCategories;
