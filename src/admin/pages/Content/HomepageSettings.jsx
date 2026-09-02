import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { settingService } from '../../../services/setting.service';
import '../../layout/AdminTable.css';

const HomepageSettings = () => {
  const [formData, setFormData] = useState({
    heroTitle: 'Discover True Elegance',
    heroSubtitle: 'Explore our latest collection of handcrafted jewellery',
    heroButtonText: 'Shop Now',
    heroButtonLink: '/shop'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingService.getSetting('homepageHero');
        if (response.success && response.data) {
          setFormData(response.data);
        }
      } catch (error) {
        // If not found, it's fine, we'll use defaults
        console.log('No existing settings found, using defaults.');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingService.updateSetting('homepageHero', formData);
      toast.success('Homepage settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading settings...</div>;
  }

  return (
    <div className="admin-form-container">
      <h2>Homepage Settings</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Update the hero section content on the customer homepage.</p>
      
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="heroTitle">Hero Title</label>
          <input
            type="text"
            id="heroTitle"
            name="heroTitle"
            value={formData.heroTitle}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="heroSubtitle">Hero Subtitle</label>
          <input
            type="text"
            id="heroSubtitle"
            name="heroSubtitle"
            value={formData.heroSubtitle}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="heroButtonText">Button Text</label>
            <input
              type="text"
              id="heroButtonText"
              name="heroButtonText"
              value={formData.heroButtonText}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="heroButtonLink">Button Link</label>
            <input
              type="text"
              id="heroButtonLink"
              name="heroButtonLink"
              value={formData.heroButtonLink}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomepageSettings;
