import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlistItems } = useContext(ShopContext);
  const isInWishlist = wishlistItems.some(item => item.id === product.id);

  return (
    <div className="product-card">
      <div className="product-image-wrapper" style={{ position: 'relative' }}>
        {product.isNewArrival && (
          <div className="new-arrival-badge">
            New Arrival
          </div>
        )}
        <div className="image-zoom-container">
          <Link to={`/product/${product.id}`}>
            <img src={product.image} alt={product.name} />
          </Link>
        </div>
        <button 
          className="wishlist-btn" 
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          aria-label="Add to wishlist"
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%', padding: '8px', zIndex: 10, color: isInWishlist ? 'red' : 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Heart size={20} fill={isInWishlist ? 'red' : 'none'} />
        </button>
        <button 
          className="quick-view" 
          onClick={(e) => { e.preventDefault(); addToCart(product); }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}
        >
          <ShoppingBag size={16} /> Add to Cart
        </button>
      </div>
      <div className="product-info">
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <p className="product-price">
          ₹ {product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
