import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    // CATALOG
    { name: 'Products', path: '/admin/products/manage' },
    { name: 'Categories', path: '/admin/categories/manage' },
    { name: 'Collections', path: '/admin/collections/manage' },
    // SALES
    { name: 'Orders', path: '/admin/orders/manage' },
    // CUSTOMERS
    { name: 'Customers', path: '/admin/customers/manage' },
    // INVENTORY
    { name: 'Inventory', path: '/admin/inventory/manage' },
    // CONTENT
    { name: 'New Arrivals', path: '/admin/content/new-arrivals' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <h2>BLUE BELLS</h2>
          <p>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="admin-main-content">
        <header className="admin-header">
          <div className="admin-header-title">
            <h1>Store Management</h1>
            <p>Administration</p>
          </div>
          <Link to="/" className="back-to-store-btn">
            <ArrowLeft size={16} />
            Back to Store
          </Link>
        </header>
        <div className="admin-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
