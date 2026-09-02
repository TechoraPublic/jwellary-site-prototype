import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, User } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';
import { AuthContext } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems, wishlistItems } = React.useContext(ShopContext);
  const { user, logout } = React.useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className={`navbar ${isScrolled || location.pathname !== '/' ? 'scrolled' : ''}`}>
      <div className="container navbar-container">

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>

        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/imagesss/logo.png" alt="Blue Bells Jewellery" />
        </Link>

        {/* Navigation Menu */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li className="mobile-only-logo">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/imagesss/logo.png" alt="Blue Bells Jewellery" />
            </Link>
          </li>
          <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>Collections</Link></li>
          <li><Link to="/new-arrivals" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link></li>
          <li><Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link></li>
          <li><Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <Link to="/wishlist" className="cart-btn" style={{ marginRight: '1rem' }} aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
            <span className="cart-count">{wishlistItems.length}</span>
          </Link>
          <Link to="/cart" className="cart-btn" style={{ marginRight: '1rem' }} aria-label="Cart">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="cart-count">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </Link>
          {user ? (
            <div className="user-dropdown-container">
              <div className="user-avatar" onClick={() => setDropdownOpen(!dropdownOpen)}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  {user.role !== 'admin' && (
                    <Link 
                      to="/profile" 
                      onClick={() => setDropdownOpen(false)} 
                      style={{ display: 'block', padding: '10px 15px', color: '#333', textDecoration: 'none', borderBottom: '1px solid #eee' }}
                    >
                      My Profile
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{ display: 'block', padding: '10px 15px', color: '#333', textDecoration: 'none', borderBottom: '1px solid #eee' }}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={() => { logout(); setDropdownOpen(false); }} className="logout-btn">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="cart-btn" aria-label="My Profile">
              <User size={20} strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
