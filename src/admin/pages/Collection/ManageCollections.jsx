import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collectionService } from '../../../services/collection.service';
import '../../layout/AdminTable.css';

const ManageCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await collectionService.getAllCollections();
      if (response.success && response.data) {
        setCollections(response.data);
      }
    } catch (error) {
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        await collectionService.softDeleteCollection(id);
        toast.success('Collection deleted successfully');
        fetchCollections();
      } catch (error) {
        toast.error(error.message || 'Failed to delete collection');
      }
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading collections...</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Manage Collections</h2>
        <Link to="/admin/collections/add" className="btn-primary">Add New Collection</Link>
      </div>
      
      <div className="table-responsive-wrapper">
        <table className="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No collections found.</td>
            </tr>
          ) : (
            collections.map((collection) => (
              <tr key={collection._id}>
                <td>
                  {collection.image && collection.image.url ? (
                    <img src={collection.image.url} alt={collection.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px' }}></div>
                  )}
                </td>
                <td>{collection.name}</td>
                <td>
                  <span style={{ color: collection.isActive ? 'green' : 'red', fontWeight: 'bold' }}>
                    {collection.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="actions-cell">
                  <Link to={`/admin/collections/edit/${collection._id}`} className="btn-edit">Edit</Link>
                  <button onClick={() => handleDelete(collection._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ManageCollections;
