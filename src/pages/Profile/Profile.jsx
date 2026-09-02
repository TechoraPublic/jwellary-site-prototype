import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { addressService } from '../../services/address.service';
import { MapPin, Edit2, Trash2, Plus, Star, LogOut, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { logout } = React.useContext(AuthContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getUserAddresses();
      if (response.success) {
        setAddresses(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleAddNew = () => {
    setFormData({
      fullName: '',
      phoneNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      isDefault: addresses.length === 0
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setFormData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressService.deleteAddress(id);
        toast.success('Address deleted');
        fetchAddresses();
      } catch (error) {
        toast.error(error.message || 'Failed to delete address');
      }
    }
  };

  const handleMakeDefault = async (address) => {
    try {
      await addressService.updateAddress(address._id, { ...address, isDefault: true });
      toast.success('Address set as default');
      fetchAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to update address');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await addressService.updateAddress(editingId, formData);
        toast.success('Address updated successfully');
      } else {
        await addressService.createAddress(formData);
        toast.success('Address added successfully');
      }
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-layout-container">
        
        {/* Sidebar */}
        <div className="profile-sidebar-card">
          <h3 className="sidebar-title">MY ACCOUNT</h3>
          <ul className="profile-sidebar-nav">
            <li className="active">
              <MapPin size={18} />
              <span>Addresses</span>
            </li>
            <li onClick={() => logout()}>
              <LogOut size={18} />
              <span>Logout</span>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="profile-main-card">
          <div className="profile-header-top">
            <h1>My Profile</h1>
            <p>Manage your personal information and saved addresses.</p>
          </div>
          
          <div className="profile-tabs">
            <div className="profile-tab active">Addresses</div>
          </div>

          <div className="addresses-section-header">
            <div>
              <h3>Saved Addresses</h3>
              <p>Add, edit or manage your delivery addresses.</p>
            </div>
            {!showForm && (
              <button className="btn-add-address" onClick={handleAddNew}>
                <Plus size={16} /> Add New Address
              </button>
            )}
          </div>

          {loading ? (
            <div className="loading-state">Loading addresses...</div>
          ) : showForm ? (
            <div className="address-form-box">
              <h3>{editingId ? 'Edit Address' : 'Add New Address'}</h3>
              <form onSubmit={handleSubmit} className="address-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Street Address *</label>
                  <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Postal Code *</label>
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input type="text" name="country" value={formData.country} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    name="isDefault" 
                    checked={formData.isDefault} 
                    onChange={handleInputChange} 
                  />
                  <label htmlFor="isDefault">Set as Default Address</label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-add-address">Save Address</button>
                </div>
              </form>
            </div>
          ) : addresses.length === 0 ? (
            <div className="empty-state">
              <MapPin size={48} color="#ccc" />
              <p>You haven't saved any addresses yet.</p>
            </div>
          ) : (
            <div className="addresses-list">
              {addresses.map(address => (
                <div key={address._id} className="address-item-card">
                  <div className="address-icon-column">
                    {address.isDefault && <div className="default-badge">Default</div>}
                    <div className="icon-box">
                      <MapPin size={24} color="#00183b" />
                    </div>
                  </div>
                  
                  <div className="address-details-column">
                    <h4>{address.fullName}</h4>
                    <p>{address.fullName}</p>
                    <p>{address.streetAddress}, {address.city}, {address.state} - {address.postalCode}</p>
                    <p>Phone: {address.phoneNumber}</p>
                  </div>
                  
                  <div className="address-actions-column">
                    <button onClick={() => handleEdit(address)} className="action-btn-text text-navy">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(address._id)} className="action-btn-text text-red">
                      <Trash2 size={14} /> Delete
                    </button>
                    {!address.isDefault && (
                      <button onClick={() => handleMakeDefault(address)} className="action-btn-text text-gold">
                        <Star size={14} /> Make Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
