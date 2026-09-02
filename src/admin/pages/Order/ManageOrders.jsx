import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../../../services/order.service';
import '../../layout/AdminTable.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderService.getAllOrders();
        if (response.success && response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadgeStyle = (status) => {
    let bgColor = '#ecf0f1';
    let color = '#7f8c8d';
    
    if (status === 'Pending') { bgColor = '#fef9e7'; color = '#f39c12'; }
    else if (status === 'Processing') { bgColor = '#e8f8f5'; color = '#1abc9c'; }
    else if (status === 'Shipped') { bgColor = '#eaf2f8'; color = '#3498db'; }
    else if (status === 'Delivered') { bgColor = '#e9f7ef'; color = '#27ae60'; }
    else if (status === 'Cancelled') { bgColor = '#fdedec'; color = '#e74c3c'; }
    
    return {
      backgroundColor: bgColor,
      color: color,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '0.85rem',
      fontWeight: 'bold'
    };
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading orders...</div>;
  }

  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2>Manage Orders</h2>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">No orders found.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id.substring(0, 8).toUpperCase()}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div>{order.user?.name || 'Guest'}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{order.user?.email}</div>
                </td>
                <td>₹{order.totalPrice.toLocaleString()}</td>
                <td>
                  <span style={{ color: order.isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
                    {order.isPaid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td>
                  <span style={getStatusBadgeStyle(order.status)}>{order.status}</span>
                </td>
                <td className="actions-cell">
                  <Link to={`/admin/orders/${order._id}`} className="btn-primary" style={{ padding: '6px 12px' }}>View Details</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
