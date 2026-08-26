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

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        
        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="logo">
          <img src="/images/Other/blue-bell-jewellery-logo.png" alt="Blue Bell Jewellery" style={{ height: '50px' }} />
        </Link>

        {/* Desktop Navigation */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Collections</Link></li>
          <li><Link to="/new-arrivals">New Arrivals</Link></li>
          <li><Link to="/about">Our Story</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        {/* Actions */}
        <div className="nav-actions">
          <Link to="/wishlist" className="cart-btn" style={{ marginRight: '1rem' }} aria-label="Wishlist">
            <Heart size={20} />
            <span className="cart-count">{wishlistItems.length}</span>
          </Link>
          <Link to="/cart" className="cart-btn" style={{ marginRight: '1rem' }} aria-label="Cart">
            <ShoppingBag size={20} />
            <span className="cart-count">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </Link>
          <Link to="/login" className="cart-btn" aria-label="My Profile">
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
