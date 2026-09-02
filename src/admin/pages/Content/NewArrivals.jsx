import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import { productService } from '../../../services/product.service';
import '../../layout/AdminTable.css';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      if (response.success && response.data) {
        setProducts(response.data);
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

  const handleToggle = async (productId, currentStatus) => {
    try {
      // Create a small API call to directly update this flag without full form submit
      const res = await api.put(`/products/update-product/${productId}`, { isNewArrival: !currentStatus });
      if (res.data && res.data.success) {
        toast.success(`Product ${!currentStatus ? 'added to' : 'removed from'} New Arrivals`);
        fetchProducts();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading products...</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Manage New Arrivals</h2>
        <p style={{ color: '#666', marginTop: '10px' }}>Select which products should appear in the New Arrivals section on the customer website.</p>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>New Arrival Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} style={{ backgroundColor: product.isNewArrival ? '#f4fbf8' : 'transparent' }}>
              <td>
                {product.images && product.images.length > 0 && (
                  <img src={product.images[0].url} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.category?.name || 'N/A'}</td>
              <td>
                <span style={{ 
                  color: product.isNewArrival ? '#27ae60' : '#95a5a6', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {product.isNewArrival ? '★ Featured as New' : 'Not Featured'}
                </span>
              </td>
              <td>
                <button 
                  onClick={() => handleToggle(product._id, product.isNewArrival)} 
                  className={product.isNewArrival ? "btn-delete" : "btn-primary"}
                  style={{ padding: '6px 12px' }}
                >
                  {product.isNewArrival ? 'Remove' : 'Mark as New'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewArrivals;
