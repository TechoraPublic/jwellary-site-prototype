import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoryService } from '../../../services/category.service';
import '../../layout/AdminTable.css';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  const triggerDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await categoryService.softDeleteCategory(itemToDelete);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
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

      <div className="table-responsive-wrapper">
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
                  <button onClick={() => triggerDelete(category._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {deleteModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(31, 41, 55, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FDFBF7', padding: '40px', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center', width: '450px', maxWidth: '90%' }}>
            <h3 style={{ fontFamily: 'var(--font-serif, serif)', color: '#0F172A', fontSize: '28px', marginBottom: '20px', fontWeight: 'normal' }}>Remove Item</h3>
            <p style={{ color: '#0F172A', marginBottom: '32px', fontSize: '16px', lineHeight: '1.5' }}>
              Are you sure you want to remove this category from your store? Note that this might affect products in this category.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button onClick={cancelDelete} style={{ padding: '12px 40px', backgroundColor: 'transparent', border: '1px solid #D9A441', color: '#D9A441', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', letterSpacing: '1px', flex: 1 }}>NO</button>
              <button onClick={confirmDelete} style={{ padding: '12px 40px', backgroundColor: '#FF5252', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', letterSpacing: '1px', flex: 1 }}>YES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;
