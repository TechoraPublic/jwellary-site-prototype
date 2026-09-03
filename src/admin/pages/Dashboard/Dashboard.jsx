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
  ChevronRight,
  Search,
  Bell,
  ArrowUp,
  ExternalLink
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('30 Days');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await adminService.getDashboardStats(timeFilter);
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
  }, [timeFilter]);

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

  // --- Chart Data Configurations ---

  // Sales Overview (Line Chart)
  const salesLabels = stats.salesChartData?.map(d => {
    const date = new Date(d._id);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }) || [];
  const salesDataValues = stats.salesChartData?.map(d => d.revenue) || [];

  const salesData = {
    labels: salesLabels,
    datasets: [
      {
        label: 'Revenue',
        data: salesDataValues,
        borderColor: '#D9A441',
        backgroundColor: 'rgba(217, 164, 65, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#D9A441',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const salesOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return '₹' + context.parsed.y.toLocaleString();
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#73798A', font: { size: 11 } }
      },
      y: {
        border: { display: false },
        grid: { color: '#E2E8F0', drawBorder: false },
        ticks: {
          color: '#73798A',
          font: { size: 11 },
          callback: function(value) {
            if (value >= 100000) return '₹' + (value / 100000).toFixed(1) + 'L';
            if (value >= 1000) return '₹' + (value / 1000).toFixed(1) + 'k';
            return '₹' + value;
          }
        }
      }
    }
  };

  // Order Status (Doughnut Chart)
  const orderStatusData = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [
          stats.orderStats.pending,
          stats.orderStats.processing,
          stats.orderStats.shipped,
          stats.orderStats.delivered,
          stats.orderStats.cancelled
        ],
        backgroundColor: [
          '#F59E0B', // Pending
          '#8B5CF6', // Processing
          '#3B82F6', // Shipped
          '#10B981', // Delivered
          '#EF4444'  // Cancelled
        ],
        borderWidth: 0,
        cutout: '75%'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return ` ${context.label}: ${context.parsed}`;
          }
        }
      }
    }
  };

  // Customer Overview (Doughnut Chart)
  const customerData = {
    labels: ['New Customers', 'Returning Customers'],
    datasets: [
      {
        data: [
          stats.customerOverview.newCustomers,
          stats.customerOverview.returningCustomers
        ],
        backgroundColor: ['#F59E0B', '#0F172A'],
        borderWidth: 0,
        cutout: '75%'
      }
    ]
  };

  // Status Badge Helper
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending': return { color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)' };
      case 'Processing': return { color: '#8B5CF6', backgroundColor: 'rgba(139, 92, 246, 0.1)' };
      case 'Shipped': return { color: '#3B82F6', backgroundColor: 'rgba(59, 130, 246, 0.1)' };
      case 'Delivered': return { color: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.1)' };
      case 'Cancelled': return { color: '#EF4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' };
      default: return { color: '#73798A', backgroundColor: '#F1F5F9' };
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Stats Grid */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#D9A441', backgroundColor: 'rgba(217, 164, 65, 0.1)' }}>
            <Package size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-title">Total Products</span>
            <span className="stat-value">{stats.totalProducts}</span>
            <span className="stat-trend"><ArrowUp size={12} /> 12 this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <Grid size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-title">Total Categories</span>
            <span className="stat-value">{stats.totalCategories}</span>
            <span className="stat-trend"><ArrowUp size={12} /> 2 this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#D9A441', backgroundColor: 'rgba(217, 164, 65, 0.1)' }}>
            <ShoppingBag size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-title">Total Orders</span>
            <span className="stat-value">{stats.totalOrders}</span>
            <span className="stat-trend"><ArrowUp size={12} /> 18% this month</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ color: '#F59E0B', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-title">Total Customers</span>
            <span className="stat-value">{stats.totalCustomers}</span>
            <span className="stat-trend"><ArrowUp size={12} /> 124 this month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        <span className="quick-actions-label">Quick Actions</span>
        <Link to="/admin/products/manage" className="btn-primary">
          <Plus size={16} /> Add Product
        </Link>
        <Link to="/admin/categories/manage" className="btn-outline">
          <Plus size={16} /> Add Category
        </Link>
        <Link to="/admin/orders/manage" className="btn-outline">
          <ShoppingBag size={16} /> View Orders
        </Link>
      </div>

      {/* Main Grid: Sales & Order Status */}
      <div className="dashboard-main-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Sales Overview</h3>
            <div className="time-filters">
              {['Today', '7 Days', '30 Days', '12 Months'].map(filter => (
                <button
                  key={filter}
                  className={`time-filter-btn ${timeFilter === filter ? 'active' : ''}`}
                  onClick={() => setTimeFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="sales-total-block">
            <div className="sales-total-label">Total Revenue</div>
            <h1 className="sales-total-value">₹{stats.totalRevenue.toLocaleString()}</h1>
            <div className="sales-trend"><ArrowUp size={12} /> 14.8% from last 30 days</div>
          </div>

          <div className="chart-container">
            <Line data={salesData} options={salesOptions} />
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Order Status</h3>
          </div>
          
          <div className="doughnut-container">
            <Doughnut data={orderStatusData} options={doughnutOptions} />
            <div className="doughnut-center-text">
              <span className="doughnut-center-value">{stats.totalOrders}</span>
              <span className="doughnut-center-label">Total Orders</span>
            </div>
          </div>

          <ul className="legend-list">
            <li className="legend-item">
              <div className="legend-label">
                <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }}></span> Pending
              </div>
              <div className="legend-value">{stats.orderStats.pending} ({(stats.orderStats.pending / Math.max(stats.totalOrders, 1) * 100).toFixed(0)}%)</div>
            </li>
            <li className="legend-item">
              <div className="legend-label">
                <span className="legend-dot" style={{ backgroundColor: '#8B5CF6' }}></span> Processing
              </div>
              <div className="legend-value">{stats.orderStats.processing} ({(stats.orderStats.processing / Math.max(stats.totalOrders, 1) * 100).toFixed(0)}%)</div>
            </li>
            <li className="legend-item">
              <div className="legend-label">
                <span className="legend-dot" style={{ backgroundColor: '#3B82F6' }}></span> Shipped
              </div>
              <div className="legend-value">{stats.orderStats.shipped} ({(stats.orderStats.shipped / Math.max(stats.totalOrders, 1) * 100).toFixed(0)}%)</div>
            </li>
            <li className="legend-item">
              <div className="legend-label">
                <span className="legend-dot" style={{ backgroundColor: '#10B981' }}></span> Delivered
              </div>
              <div className="legend-value">{stats.orderStats.delivered} ({(stats.orderStats.delivered / Math.max(stats.totalOrders, 1) * 100).toFixed(0)}%)</div>
            </li>
            <li className="legend-item">
              <div className="legend-label">
                <span className="legend-dot" style={{ backgroundColor: '#EF4444' }}></span> Cancelled
              </div>
              <div className="legend-value">{stats.orderStats.cancelled} ({(stats.orderStats.cancelled / Math.max(stats.totalOrders, 1) * 100).toFixed(0)}%)</div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Grid: Inventory, Recent Orders, Top Selling & Customers */}
      <div className="dashboard-bottom-grid">
        
        {/* Column 1: Inventory Overview */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Inventory Overview</h3>
          </div>
          
          <div className="inventory-stats-box">
            <div className="inv-stat">
              <span className="inv-stat-label">Total Stock</span>
              <span className="inv-stat-value" style={{ color: 'var(--admin-navy)' }}>{stats.inventoryStats.totalStock}</span>
              <span className="inv-stat-sub">Products</span>
            </div>
            <div className="inv-stat warning">
              <span className="inv-stat-label">Low Stock</span>
              <span className="inv-stat-value" style={{ color: '#F59E0B' }}>{stats.inventoryStats.lowStock}</span>
              <span className="inv-stat-sub">Products</span>
            </div>
            <div className="inv-stat danger">
              <span className="inv-stat-label">Out of Stock</span>
              <span className="inv-stat-value" style={{ color: '#EF4444' }}>{stats.inventoryStats.outOfStock}</span>
              <span className="inv-stat-sub">Products</span>
            </div>
          </div>

          <div className="panel-header" style={{ marginTop: '32px' }}>
            <h3 className="panel-title" style={{ fontSize: '14px' }}>Low Stock Products</h3>
            <Link to="/admin/inventory/manage" className="panel-action">View All</Link>
          </div>
          
          <div className="low-stock-list">
            {stats.inventoryStats.lowStockList?.map((product, idx) => (
              <div className="low-stock-item" key={product._id || idx}>
                <img src={product.images?.[0]?.url || 'https://via.placeholder.com/40'} alt={product.name} className="low-stock-img" />
                <div className="low-stock-info">
                  <span className="low-stock-name">{product.name}</span>
                </div>
                <span className="low-stock-left">{product.stock} left</span>
              </div>
            ))}
            {(!stats.inventoryStats.lowStockList || stats.inventoryStats.lowStockList.length === 0) && (
              <p style={{ color: '#73798A', fontSize: '13px', textAlign: 'center' }}>No low stock products.</p>
            )}
          </div>
        </div>

        {/* Column 2: Recent Orders */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h3 className="panel-title">Recent Orders</h3>
            <Link to="/admin/orders/manage" className="panel-action">View All</Link>
          </div>
          
          <table className="recent-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders?.map((order) => (
                <tr key={order._id}>
                  <td className="order-id">#{order._id.substring(0, 8).toUpperCase()}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {order.user?.name ? order.user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{order.user?.name || 'Guest'}</span>
                    </div>
                  </td>
                  <td>
                    {order.orderItems && order.orderItems.length > 0
                      ? order.orderItems[0].name.substring(0, 15) + (order.orderItems.length > 1 ? '...' : '')
                      : 'Unknown'}
                  </td>
                  <td>₹{order.totalPrice.toLocaleString()}</td>
                  <td>
                    <span className="status-badge" style={getStatusStyle(order.status)}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats.recentOrders || stats.recentOrders.length === 0) && (
            <p style={{ color: '#73798A', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>No recent orders.</p>
          )}
        </div>

        {/* Column 3: Top Selling & Customers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Selling */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h3 className="panel-title">Top Selling Products</h3>
              <Link to="/admin/products/manage" className="panel-action">View All</Link>
            </div>
            
            <div className="top-selling-list">
              {stats.topSellingProducts?.map((product, idx) => (
                <div className="top-selling-item" key={product._id || idx}>
                  <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="low-stock-img" style={{ borderRadius: '50%' }} />
                  <div>
                    <span className="top-selling-name">{product.name?.substring(0, 20)}...</span>
                    <span className="top-selling-sold">{product.sold} sold</span>
                  </div>
                  <span className="top-selling-rev">₹{product.revenue.toLocaleString()}</span>
                </div>
              ))}
              {(!stats.topSellingProducts || stats.topSellingProducts.length === 0) && (
                <p style={{ color: '#73798A', fontSize: '13px', textAlign: 'center' }}>No sales data yet.</p>
              )}
            </div>
          </div>

          {/* Customer Overview */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h3 className="panel-title">Customer Overview</h3>
              <Link to="/admin/customers/manage" className="panel-action">View All</Link>
            </div>
            
            <div className="customer-overview-chart">
              <div className="customer-total">
                <span className="customer-total-val">{stats.customerOverview.totalOrderedCustomers}</span>
                <span style={{ color: '#73798A', fontSize: '12px', display: 'block', marginBottom: '8px' }}>Total Customers</span>
                <span className="customer-trend"><ArrowUp size={12} /> 124 this month</span>
              </div>
              <div className="customer-chart">
                <Doughnut data={customerData} options={{...doughnutOptions, cutout: '70%'}} />
              </div>
            </div>
            
            <ul className="legend-list" style={{ marginTop: '16px', gap: '8px' }}>
              <li className="legend-item">
                <div className="legend-label">
                  <span className="legend-dot" style={{ backgroundColor: '#F59E0B' }}></span> New Customers
                </div>
                <div className="legend-value">{stats.customerOverview.newCustomers}</div>
              </li>
              <li className="legend-item">
                <div className="legend-label">
                  <span className="legend-dot" style={{ backgroundColor: '#0F172A' }}></span> Returning Customers
                </div>
                <div className="legend-value">{stats.customerOverview.returningCustomers}</div>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
