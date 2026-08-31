import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <span className="logo-text">Blue Bells</span>
          </Link>
          <p className="footer-desc">Crafting timeless elegance and modern luxury since 1995.</p>
          <div className="social-links">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">Twitter</a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Collections</h4>
          <ul>
            <li><Link to="/collection/rings">Rings</Link></li>
            <li><Link to="/collection/necklaces">Necklaces</Link></li>
            <li><Link to="/collection/earrings">Earrings</Link></li>
            <li><Link to="/collection/bracelets">Bracelets</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Assistance</h4>
          <ul>
            <li><Link to="#">Shipping & Returns</Link></li>
            <li><Link to="#">Care Guide</Link></li>
            <li><Link to="#">Ring Sizer</Link></li>
            <li><Link to="#">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>Join the list</h4>
          <p>Receive updates on new collections and exclusive offers.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Email address" required />
            <button type="submit">→</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} BlueBell Jewellery. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
