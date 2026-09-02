import React, { useState, useEffect } from 'react';
import { adminService } from '../../../services/admin.service';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  Package,
  Grid,
  ShoppingBag,
  Users,
  Plus,
  ListOrdered,
  TrendingUp,
  Box,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const salesOverView = [
    {
      id: 1,

    }
  ]


  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardStats();
        if (response.success) {
          setStats(response.data);

        }
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#73798A' }}>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#73798A' }}>
        <p>Unable to load dashboard data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* Dashboard Header */}
      <div className="admin-dashboard-header">
        <h2>Dashboard</h2>
        <p>Hello Admin. Here's an overview of your jewellery store.</p>
      </div>

      {/* Top Statistics Cards */}
      <div className="dashboard-grid-4">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Products</span>
            <Package size={20} className="dashboard-card-icon" />
          </div>
          <span className="dashboard-card-value">{stats.totalProducts}</span>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Categories</span>
            <Grid size={20} className="dashboard-card-icon" />
          </div>
          <span className="dashboard-card-value">{stats.totalCategories}</span>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Orders</span>
            <ShoppingBag size={20} className="dashboard-card-icon" />
          </div>
          <span className="dashboard-card-value">{stats.totalOrders}</span>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <span className="dashboard-card-title">Customers</span>
            <Users size={20} className="dashboard-card-icon" />
          </div>
          <span className="dashboard-card-value">{stats.totalCustomers}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/admin/products/manage" className="action-btn">
          <Plus size={16} />
          Add Product
        </Link>
        <Link to="/admin/categories/manage" className="action-btn secondary">
          <Plus size={16} />
          Add Category
        </Link>
        <Link to="/admin/orders/manage" className="action-btn secondary">
          <ListOrdered size={16} />
          View Orders
        </Link>
      </div>

      {/* Middle Section */}
      <div className="dashboard-grid-2">
        {/* Sales Overview */}
        <div className="dashboard-panel">
          <h3 className="dashboard-panel-title">Sales Overview</h3>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '200px' }}>
            {stats.totalRevenue > 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  backgroundColor: 'rgba(217, 164, 65, 0.1)',
                  padding: '20px',
                  borderRadius: '50%',
                  color: 'var(--color-gold)'
                }}>
                  <TrendingUp size={40} />
                </div>
                <div>
                  <p style={{ color: '#73798A', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Total Revenue</p>
                  <h1 style={{ color: 'var(--color-navy)', fontSize: '3.5rem', margin: '0', fontFamily: 'var(--font-serif)', lineHeight: '1' }}>
                    ₹{stats.totalRevenue.toLocaleString()}
                  </h1>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#73798A' }}>
                <TrendingUp size={32} style={{ opacity: 0.5, marginBottom: '10px' }} />
                <p>No sales data available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Status */}
        <div className="dashboard-panel">
          <h3 className="dashboard-panel-title">Order Status</h3>
          <ul className="status-list">
            <li className="status-item">
              <div className="status-label">
                <span className="status-dot" style={{ backgroundColor: '#F39C12' }}></span>
                Pending
              </div>
              <span className="status-value">{stats.orderStats.pending}</span>
            </li>
            <li className="status-item">
              <div className="status-label">
                <span className="status-dot" style={{ backgroundColor: '#3498DB' }}></span>
                Processing
              </div>
              <span className="status-value">{stats.orderStats.processing}</span>
            </li>
            <li className="status-item">
              <div className="status-label">
                <span className="status-dot" style={{ backgroundColor: '#9B59B6' }}></span>
                Shipped
              </div>
              <span className="status-value">{stats.orderStats.shipped}</span>
            </li>
            <li className="status-item">
              <div className="status-label">
                <span className="status-dot" style={{ backgroundColor: '#27AE60' }}></span>
                Delivered
              </div>
              <span className="status-value">{stats.orderStats.delivered}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="dashboard-grid-2">
        {/* Recent Orders */}
        <div className="dashboard-panel" style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(217, 164, 65, 0.2)', paddingBottom: '15px', marginBottom: '25px' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-navy)' }}>Recent Orders</h3>
            <Link to="/admin/orders/manage" style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', fontSize: '0.85rem', textDecoration: 'none' }}>
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="premium-table-wrapper">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map(order => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', color: '#73798A' }}>#{order._id.substring(0, 8).toUpperCase()}</td>
                      <td style={{ fontWeight: '500' }}>{order.user?.name || 'Guest'}</td>
                      <td>₹{order.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className="status-badge" style={getStatusBadgeStyle(order.status)}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#73798A' }}>
              <Package size={32} style={{ opacity: 0.5, marginBottom: '10px' }} />
              <p>No orders available yet.</p>
            </div>
          )}
        </div>

        {/* Inventory Overview */}
        <div className="dashboard-panel" style={{ gridColumn: 'span 1' }}>
          <h3 className="dashboard-panel-title">Inventory Overview</h3>

          {stats.inventoryStats ? (
            <ul className="status-list" style={{ marginTop: '20px' }}>
              <li className="status-item" style={{ padding: '24px 0' }}>
                <div className="status-label">
                  <div style={{ backgroundColor: 'rgba(217, 164, 65, 0.1)', padding: '12px', borderRadius: '50%', color: 'var(--color-gold)' }}>
                    <Box size={24} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Total Products</span>
                    <span style={{ fontSize: '0.8rem', color: '#73798A', textTransform: 'uppercase' }}>Active Catalog</span>
                  </div>
                </div>
                <span className="status-value" style={{ fontSize: '2rem' }}>{stats.totalProducts}</span>
              </li>
              <li className="status-item" style={{ padding: '24px 0' }}>
                <div className="status-label">
                  <div style={{ backgroundColor: 'rgba(243, 156, 18, 0.1)', padding: '12px', borderRadius: '50%', color: '#F39C12' }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Low Stock</span>
                    <span style={{ fontSize: '0.8rem', color: '#73798A', textTransform: 'uppercase' }}>Needs Restock</span>
                  </div>
                </div>
                <span className="status-value" style={{ fontSize: '2rem' }}>{stats.inventoryStats.lowStock || 0}</span>
              </li>
              <li className="status-item" style={{ padding: '24px 0' }}>
                <div className="status-label">
                  <div style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)', padding: '12px', borderRadius: '50%', color: '#E74C3C' }}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>Out of Stock</span>
                    <span style={{ fontSize: '0.8rem', color: '#73798A', textTransform: 'uppercase' }}>Unavailable</span>
                  </div>
                </div>
                <span className="status-value" style={{ fontSize: '2rem' }}>{stats.inventoryStats.outOfStock || 0}</span>
              </li>
            </ul>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#73798A' }}>
              <Box size={32} style={{ opacity: 0.5, marginBottom: '10px' }} />
              <p>Inventory data unavailable.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

// Helper for status badge colors matching the premium style
const getStatusBadgeStyle = (status) => {
  if (status === 'Pending') return { color: '#F39C12', borderColor: 'rgba(243, 156, 18, 0.3)', backgroundColor: 'rgba(243, 156, 18, 0.05)' };
  if (status === 'Processing') return { color: '#3498DB', borderColor: 'rgba(52, 152, 219, 0.3)', backgroundColor: 'rgba(52, 152, 219, 0.05)' };
  if (status === 'Shipped') return { color: '#9B59B6', borderColor: 'rgba(155, 89, 182, 0.3)', backgroundColor: 'rgba(155, 89, 182, 0.05)' };
  if (status === 'Delivered') return { color: '#27AE60', borderColor: 'rgba(39, 174, 96, 0.3)', backgroundColor: 'rgba(39, 174, 96, 0.05)' };
  if (status === 'Cancelled') return { color: '#E74C3C', borderColor: 'rgba(231, 76, 60, 0.3)', backgroundColor: 'rgba(231, 76, 60, 0.05)' };
  return { color: '#73798A', borderColor: 'rgba(115, 121, 138, 0.3)', backgroundColor: 'rgba(115, 121, 138, 0.05)' };
};

export default Dashboard;
