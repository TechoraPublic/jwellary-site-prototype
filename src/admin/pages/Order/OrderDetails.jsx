import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../../../services/order.service';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      if (response.success && response.data) {
        setOrder(response.data);
      }
    } catch (error) {
      toast.error('Failed to load order details');
      navigate('/admin/orders/manage');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, navigate]);

  const handleStatusChange = async (e) => {
    try {
      setUpdating(true);
      await orderService.updateOrderStatus(id, { status: e.target.value });
      toast.success('Order status updated');
      fetchOrder();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading order...</div>;
  if (!order) return <div style={{ padding: '20px' }}>Order not found.</div>;

  return (
    <div className="admin-form-container" style={{ maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Order #{order._id.substring(0, 8).toUpperCase()}</h2>
        <button onClick={() => navigate('/admin/orders/manage')} className="btn-secondary">Back to Orders</button>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Left Column */}
        <div style={{ flex: '1 1 600px' }}>
          
          <div className="panel" style={panelStyle}>
            <h3>Order Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                  <th style={{ padding: '10px' }}>Item</th>
                  <th style={{ padding: '10px' }}>Qty</th>
                  <th style={{ padding: '10px' }}>Price</th>
                  <th style={{ padding: '10px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.orderItems.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f9f9f9' }}>
                    <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <span>{item.name}</span>
                    </td>
                    <td style={{ padding: '10px' }}>{item.qty}</td>
                    <td style={{ padding: '10px' }}>₹{item.price.toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>₹{(item.qty * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel" style={{ ...panelStyle, marginTop: '20px' }}>
            <h3>Shipping Details</h3>
            <div style={{ marginTop: '15px', color: '#555' }}>
              <p><strong>Address:</strong> {order.shippingAddress.address}</p>
              <p><strong>City:</strong> {order.shippingAddress.city}</p>
              <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
              <p><strong>Country:</strong> {order.shippingAddress.country}</p>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ flex: '1 1 300px' }}>
          
          <div className="panel" style={panelStyle}>
            <h3>Order Summary</h3>
            <div style={{ marginTop: '15px', color: '#555' }}>
              <div style={summaryRowStyle}>
                <span>Items:</span>
                <span>₹{(order.totalPrice - order.taxPrice - order.shippingPrice).toLocaleString()}</span>
              </div>
              <div style={summaryRowStyle}>
                <span>Shipping:</span>
                <span>₹{order.shippingPrice.toLocaleString()}</span>
              </div>
              <div style={summaryRowStyle}>
                <span>Tax:</span>
                <span>₹{order.taxPrice.toLocaleString()}</span>
              </div>
              <div style={{ ...summaryRowStyle, borderTop: '2px solid #eee', paddingTop: '10px', marginTop: '10px', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
                <span>Total:</span>
                <span>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="panel" style={{ ...panelStyle, marginTop: '20px' }}>
            <h3>Customer & Payment</h3>
            <div style={{ marginTop: '15px', color: '#555' }}>
              <p><strong>Name:</strong> {order.user?.name}</p>
              <p><strong>Email:</strong> {order.user?.email}</p>
              <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #eee' }} />
              <p><strong>Method:</strong> {order.paymentMethod}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span style={{ color: order.isPaid ? 'green' : 'red', fontWeight: 'bold' }}>
                  {order.isPaid ? 'Paid on ' + new Date(order.paidAt).toLocaleDateString() : 'Not Paid'}
                </span>
              </p>
            </div>
          </div>

          <div className="panel" style={{ ...panelStyle, marginTop: '20px', backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <h3>Update Status</h3>
            <div style={{ marginTop: '15px' }}>
              <select 
                value={order.status} 
                onChange={handleStatusChange} 
                disabled={updating}
                style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

const panelStyle = {
  backgroundColor: '#fff',
  padding: '25px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

const summaryRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '10px'
};

export default OrderDetails;
