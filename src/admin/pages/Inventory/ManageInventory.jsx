import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../../../services/product.service';
import '../../layout/AdminTable.css';

const ManageInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'out'

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      if (response.success && response.data) {
        setProducts(response.data);
      }
    } catch (error) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const getFilteredProducts = () => {
    if (filter === 'all') return products;
    if (filter === 'low') return products.filter(p => p.stock > 0 && p.stock <= (p.lowStockThreshold || 5));
    if (filter === 'out') return products.filter(p => p.stock === 0);
    return products;
  };

  const filteredProducts = getFilteredProducts();

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading inventory...</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Manage Inventory</h2>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="all">All Products</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Current Stock</th>
            <th>Low Stock Threshold</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No inventory items found for this filter.</td>
            </tr>
          ) : (
            filteredProducts.map((product) => {
              const isOut = product.stock === 0;
              const isLow = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
              
              return (
                <tr key={product._id} style={{ backgroundColor: isOut ? '#fdedec' : isLow ? '#fef9e7' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {product.images && product.images[0] && (
                        <img src={product.images[0].url} alt={product.name} style={{ width: '30px', height: '30px', objectFit: 'cover', borderRadius: '4px' }} />
                      )}
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td>{product.sku || 'N/A'}</td>
                  <td>
                    <span style={{ fontWeight: 'bold', color: isOut ? 'red' : isLow ? 'orange' : 'green' }}>
                      {product.stock || 0}
                    </span>
                  </td>
                  <td>{product.lowStockThreshold || 5}</td>
                  <td>
                    {isOut ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock</span>
                    ) : isLow ? (
                      <span style={{ color: 'orange', fontWeight: 'bold' }}>Low Stock</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>In Stock</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/admin/products/edit/${product._id}`} className="btn-edit" style={{ fontSize: '0.8rem', padding: '4px 8px' }}>Update Stock</Link>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageInventory;
