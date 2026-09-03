import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../../../services/product.service';
import '../../layout/AdminTable.css';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      if (response.success && response.data) {
        setProducts(response.data);
        setFilteredProducts(response.data);
      }
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (stockFilter === 'low') {
      result = result.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5));
    } else if (stockFilter === 'out') {
      result = result.filter(p => p.stock === 0);
    } else if (stockFilter === 'in') {
      result = result.filter(p => p.stock > (p.lowStockThreshold || 5));
    }

    setFilteredProducts(result);
  }, [searchTerm, stockFilter, products]);

  const triggerDelete = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await productService.softDeleteProduct(itemToDelete);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
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
    return <div style={{ padding: '20px' }}>Loading products...</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Manage Products</h2>

        <div className="admin-table-controls">
          <input
            type="text"
            placeholder="Search name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <Link to="/admin/products/add" className="btn-primary">Add New Product</Link>
        </div>
      </div>

      <div className="table-responsive-wrapper">
        <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">No products found.</td>
            </tr>
          ) : (
            filteredProducts.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0].url} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px' }}></div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.sku || 'N/A'}</td>
                <td>₹{product.price.toLocaleString()}</td>
                <td>{product.category?.name || 'N/A'}</td>
                <td>
                  <span style={{
                    color: product.stock === 0 ? 'red' : product.stock <= (product.lowStockThreshold || 5) ? 'orange' : 'green',
                    fontWeight: 'bold'
                  }}>
                    {product.stock || 0}
                  </span>
                </td>
                <td>{product.isDeleted ? 'Deleted' : 'Active'}</td>
                <td className="actions-cell">
                  <Link to={`/admin/products/edit/${product._id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => triggerDelete(product._id)} className="btn-delete">Delete</button>
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
              Are you sure you want to remove this product from your store?
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

export default ManageProducts;
