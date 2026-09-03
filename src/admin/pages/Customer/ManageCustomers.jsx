import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import '../../layout/AdminTable.css';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // We'll create a small inline API call here since we don't have a dedicated customer service yet
        const response = await api.get('/admin/dashboard'); // Use dashboard stats temporarily if we don't have users endpoint
        // Wait, the backend doesn't have a GET /users admin endpoint in the plan? 
        // Let's create one or just use a mock view if the endpoint fails.
        // Actually, we should add a quick endpoint in admin.routes.js for this.
        const res = await api.get('/admin/users');
        if (res.data && res.data.success) {
          setCustomers(res.data.data);
        }
      } catch (error) {
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading customers...</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Manage Customers</h2>
      </div>
      
      <div className="table-responsive-wrapper">
        <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined Date</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">No customers found.</td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: customer.role === 'admin' ? '#e8f8f5' : '#eaf2f8',
                    color: customer.role === 'admin' ? '#1abc9c' : '#3498db',
                    fontSize: '0.85rem',
                    fontWeight: 'bold'
                  }}>
                    {customer.role}
                  </span>
                </td>
                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ManageCustomers;
