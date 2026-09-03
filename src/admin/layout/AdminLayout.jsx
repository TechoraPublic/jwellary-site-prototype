import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    // CATALOG
    { name: 'Products', path: '/admin/products/manage' },
    { name: 'Categories', path: '/admin/categories/manage' },
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
      {/* Mobile Top Header for Hamburger */}
      <div className="admin-mobile-header">
        <div className="admin-mobile-logo">
          <img src="/imagesss/logo.png" alt="Blue Bells Logo" className="admin-sidebar-logo" />
        </div>
        <button className="admin-mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} color="#F8F5EE" /> : <Menu size={24} color="#F8F5EE" />}
        </button>
      </div>

      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-logo">
          <img src="/imagesss/logo.png" alt="Blue Bells Logo" className="admin-sidebar-logo" />
        </div>
        <nav className="admin-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
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
