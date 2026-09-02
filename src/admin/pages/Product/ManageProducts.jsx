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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.softDeleteProduct(id);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading products...</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <h2>Manage Products</h2>
        
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search name or SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <select 
            value={stockFilter} 
            onChange={(e) => setStockFilter(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          >
            <option value="all">All Stock</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <Link to="/admin/products/add" className="btn-primary">Add New Product</Link>
        </div>
      </div>
      
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
                  <button onClick={() => handleDelete(product._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProducts;
