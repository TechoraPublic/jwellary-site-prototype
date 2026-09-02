import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { categoryService } from '../../../services/category.service';
import { productService } from '../../../services/product.service';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    category: '',
    stock: 0,
    lowStockThreshold: 5,
    material: '',
    isNewArrival: false
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories for dropdown
        const catRes = await categoryService.getAllCategories();
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }

        // Fetch product details
        const prodRes = await productService.getProductById(id);
        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setFormData({
            name: p.name || '',
            sku: p.sku || '',
            description: p.description || '',
            price: p.price || '',
            category: p.category?._id || p.category || '',
            stock: p.stock || 0,
            lowStockThreshold: p.lowStockThreshold || 5,
            material: p.material || '',
            isNewArrival: p.isNewArrival || false
          });
          setExistingImages(p.images || []);
        }
      } catch (error) {
        toast.error('Failed to load product details');
        navigate('/admin/products/manage');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      toast.error('You can only upload up to 6 images');
      e.target.value = '';
      setImageFiles([]);
      return;
    }
    setImageFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.price < 0) {
      toast.error('Price cannot be negative');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('sku', formData.sku);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('stock', formData.stock);
      submitData.append('lowStockThreshold', formData.lowStockThreshold);
      submitData.append('material', formData.material);
      submitData.append('isNewArrival', formData.isNewArrival);
      
      if (imageFiles.length > 0) {
        imageFiles.forEach(file => {
          submitData.append('images', file);
        });
      }

      await productService.updateProduct(id, submitData);
      toast.success('Product updated successfully!');
      navigate('/admin/products/manage');
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="admin-form-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
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
          <label htmlFor="sku">SKU</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            required
          ></textarea>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="stock">Stock *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
            <input
              type="number"
              id="lowStockThreshold"
              name="lowStockThreshold"
              value={formData.lowStockThreshold}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="material">Material (Optional)</label>
          <input
            type="text"
            id="material"
            name="material"
            value={formData.material}
            onChange={handleChange}
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <input
            type="checkbox"
            id="isNewArrival"
            name="isNewArrival"
            checked={formData.isNewArrival}
            onChange={handleChange}
            style={{ width: 'auto' }}
          />
          <label htmlFor="isNewArrival" style={{ margin: 0, cursor: 'pointer' }}>Mark as New Arrival</label>
        </div>

        <div className="form-group">
          <label htmlFor="images">Update Product Images (up to 6) - Note: Uploading new images will replace existing ones</label>
          {existingImages.length > 0 && imageFiles.length === 0 && (
            <div style={{marginBottom: '10px', fontSize: '0.9rem', color: '#666'}}>
              Current images: {existingImages.length}
            </div>
          )}
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Updating Product...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
