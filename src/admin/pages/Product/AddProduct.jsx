import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UploadCloud, X, Plus, Bold, Italic, Underline, List, ListOrdered, AlignLeft, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { categoryService } from '../../../services/category.service';
import { productService } from '../../../services/product.service';
import './ProductForm.css';

const AddProduct = () => {
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
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount to populate the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.success && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 6) {
      toast.error('You can only upload up to 6 images in total');
      return;
    }
    
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    e.target.value = null; // reset input
  };

  const removeImage = (index) => {
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
    
    // Basic validation
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

      await productService.createProduct(submitData);
      toast.success('Product created successfully!');
      
      navigate('/admin/products/manage');
    } catch (error) {
      toast.error(error.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form-container">
      <h2>Add Product</h2>
      <p className="form-subtitle">Fill in the details to add a new product to your store.</p>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        
        {/* Basic Information */}
        <h3 className="form-section-title">Basic Information</h3>
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" required />
          </div>
          <div className="form-group">
            <label htmlFor="sku">SKU *</label>
            <input type="text" id="sku" name="sku" value={formData.sku} onChange={handleChange} placeholder="Enter SKU (e.g. AJR-001)" required />
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
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} placeholder="Enter price" min="0" required />
          </div>

          <div className="form-group">
            <label htmlFor="stock">Stock Quantity *</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} placeholder="Enter stock quantity" min="0" required />
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
          <label>Product Images *</label>
          
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
                  <span>Add More</span>
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
          <textarea id="description" name="description" className="rich-text-textarea" value={formData.description} onChange={handleChange} placeholder="Enter product description..." required></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="stylingTip">Styling Tip</label>
          <textarea id="stylingTip" name="stylingTip" value={formData.stylingTip} onChange={handleChange} placeholder="e.g. Pair with sparkling studs to create a coordinated festive look."></textarea>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="baseMetal">Base Metal</label>
            <input type="text" id="baseMetal" name="baseMetal" value={formData.baseMetal} onChange={handleChange} placeholder="e.g. Stainless Steel" />
          </div>
          <div className="form-group">
            <label htmlFor="plating">Plating</label>
            <input type="text" id="plating" name="plating" value={formData.plating} onChange={handleChange} placeholder="e.g. 18 kt Gold Tone" />
          </div>
          <div className="form-group">
            <label htmlFor="typeOfStone">Type of Stone</label>
            <input type="text" id="typeOfStone" name="typeOfStone" value={formData.typeOfStone} onChange={handleChange} placeholder="e.g. Cubic Zirconia" />
          </div>
          <div className="form-group">
            <label htmlFor="closure">Closure</label>
            <input type="text" id="closure" name="closure" value={formData.closure} onChange={handleChange} placeholder="e.g. Secure Clasp" />
          </div>
          <div className="form-group">
            <label htmlFor="weight">Weight</label>
            <input type="text" id="weight" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g. 5 gm" />
          </div>
          
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
            <input type="checkbox" id="isNewArrival" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} style={{ width: 'auto' }} />
            <label htmlFor="isNewArrival" style={{ margin: 0, cursor: 'pointer' }}>Mark as New Arrival</label>
          </div>
        </div>

        <div className="form-actions">
          <Link to="/admin/products/manage" className="btn-cancel">Cancel</Link>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProduct;
