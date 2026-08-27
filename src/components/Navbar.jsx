import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Heart, Menu, X, User } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { cartItems, wishlistItems } = React.useContext(ShopContext);

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
          <img src="/img/blue_bell/logo.png" alt="Blue Bells Jewellery" />
        </Link>

        {/* Navigation Menu */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li className="mobile-only-logo">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/img/blue_bell/logo.png" alt="Blue Bells Jewellery" />
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
          <Link to="/login" className="cart-btn" aria-label="My Profile">
            <User size={20} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
