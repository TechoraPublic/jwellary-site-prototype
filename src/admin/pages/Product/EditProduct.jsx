import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UploadCloud, X, Plus, Bold, Italic, Underline, List, ListOrdered, AlignLeft, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { categoryService } from '../../../services/category.service';
import { productService } from '../../../services/product.service';
import './ProductForm.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    unit: 'piece',
    description: '',
    stylingTip: '',
    baseMetal: '',
    plating: '',
    typeOfStone: '',
    closure: '',
    weight: '',
    isNewArrival: false
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await categoryService.getAllCategories();
        if (catRes.success && catRes.data) {
          setCategories(catRes.data);
        }

        const prodRes = await productService.getProductById(id);
        if (prodRes.success && prodRes.data) {
          const p = prodRes.data;
          setFormData({
            name: p.name || '',
            sku: p.sku || '',
            category: p.category?._id || p.category || '',
            price: p.price || '',
            stock: p.stock || 0,
            unit: p.unit || 'piece',
            description: p.description || '',
            stylingTip: p.stylingTip || '',
            baseMetal: p.baseMetal || '',
            plating: p.plating || '',
            typeOfStone: p.typeOfStone || '',
            closure: p.closure || '',
            weight: p.weight || '',
            isNewArrival: p.isNewArrival || false
          });
          
          if (p.images && p.images.length > 0) {
            setExistingImages(p.images);
            // Pre-fill previews with existing images
            setImagePreviews(p.images.map(img => img.url));
          }
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
    // Note: If they upload new files, we'll replace existing images as per original logic.
    // For a real production app, you might want to mix existing and new, but keeping it simple here.
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      toast.error('You can only upload up to 6 images');
      return;
    }
    
    setImageFiles(files);
    
    // Create new previews, replacing old ones since backend replaces them entirely on new upload
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
    setExistingImages([]); // visually indicate they've been overwritten
    
    e.target.value = null; // reset input
  };

  const removeImage = (index) => {
    if (existingImages.length > 0) {
      toast.info('Removing existing images requires uploading new ones currently.');
      return;
    }

    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // clean up
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      toast.error('Please fill in all required fields (*)');
      return;
    }

    try {
      setLoading(true);
      
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
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
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#73798A' }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="admin-product-form-container">
      <h2>Edit Product</h2>
      <p className="form-subtitle">Update product details below.</p>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* Basic Information */}
        <h3 className="form-section-title">Basic Information</h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="sku">SKU *</label>
            <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} min="0" required />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit</label>
            <select id="unit" name="unit" value={formData.unit} onChange={handleChange}>
              <option value="piece">piece</option>
              <option value="gram">gram</option>
              <option value="pair">pair</option>
              <option value="set">set</option>
            </select>
          </div>
        </div>

        {/* Images */}
        <div className="form-group" style={{ marginTop: '16px' }}>
          <label>Product Images * <span style={{fontSize:'12px', color:'#73798A', fontWeight:'normal'}}>(Uploading new images replaces existing ones)</span></label>
          
          {imagePreviews.length === 0 ? (
            <div className="image-upload-zone">
              <input type="file" multiple accept="image/*" onChange={handleFileChange} />
              <UploadCloud size={32} className="upload-icon" />
              <p className="upload-text">Drag & drop images here or click to upload</p>
              <p className="upload-subtext">Supports: JPG, PNG, WEBP (Max 5MB each)</p>
            </div>
          ) : (
            <div className="image-preview-container">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="image-preview-box">
                  <img src={src} alt="preview" />
                  <button type="button" className="remove-img-btn" onClick={() => removeImage(idx)}><X size={14} /></button>
                </div>
              ))}
              {imagePreviews.length < 6 && (
                <div className="image-preview-box add-more-box">
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} />
                  <Plus size={20} />
                  <span>Replace All</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Descriptions & Details */}
        <h3 className="form-section-title">Descriptions & Details</h3>
        
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <div className="rich-text-toolbar">
            <button type="button"><Bold size={16} /></button>
            <button type="button"><Italic size={16} /></button>
            <button type="button"><Underline size={16} /></button>
            <button type="button"><List size={16} /></button>
            <button type="button"><ListOrdered size={16} /></button>
            <button type="button"><AlignLeft size={16} /></button>
            <button type="button"><LinkIcon size={16} /></button>
            <button type="button"><ImageIcon size={16} /></button>
            <button type="button"><X size={16} /></button>
          </div>
          <textarea id="description" name="description" className="rich-text-textarea" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="stylingTip">Styling Tip</label>
          <textarea id="stylingTip" name="stylingTip" value={formData.stylingTip} onChange={handleChange}></textarea>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="baseMetal">Base Metal</label>
            <input type="text" id="baseMetal" name="baseMetal" value={formData.baseMetal} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="plating">Plating</label>
            <input type="text" id="plating" name="plating" value={formData.plating} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="typeOfStone">Type of Stone</label>
            <input type="text" id="typeOfStone" name="typeOfStone" value={formData.typeOfStone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="closure">Closure</label>
            <input type="text" id="closure" name="closure" value={formData.closure} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight</label>
            <input type="text" id="weight" name="weight" value={formData.weight} onChange={handleChange} />
          </div>
          
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
            <input type="checkbox" id="isNewArrival" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} style={{ width: 'auto' }} />
            <label htmlFor="isNewArrival" style={{ margin: 0, cursor: 'pointer' }}>Mark as New Arrival</label>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/admin/products/manage" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditProduct;
