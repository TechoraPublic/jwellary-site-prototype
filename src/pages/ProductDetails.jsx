import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getProductById } from '../data/products';
import { ShopContext } from '../context/ShopContext';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart, toggleWishlist, wishlistItems } = useContext(ShopContext);

  useEffect(() => {
    const fetchedProduct = getProductById(productId);
    setProduct(fetchedProduct);
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div style={{ paddingTop: '120px', minHeight: '60vh', textAlign: 'center' }}>
        <h2>Product not found</h2>
        <Link to="/" className="btn btn-outline" style={{ marginTop: '2rem' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', paddingBottom: '6rem' }} className="container">
      <div className="grid grid-cols-2" style={{ gap: '4rem', alignItems: 'center' }}>
        
        {/* Product Image */}
        <div className="product-image-large">
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }} 
          />
        </div>

        {/* Product Info */}
        <div className="product-details-content">
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-gold)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {product.category}
          </p>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{product.name}</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', fontFamily: 'var(--font-sans)', fontWeight: '300' }}>
            ${product.price.toLocaleString()}
          </p>
          
          <div style={{ marginBottom: '3rem', lineHeight: '1.8', color: 'var(--color-gray-dark)' }}>
            <p>{product.description}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              onClick={() => addToCart(product)}
            >
              Add to Bag
            </button>
            <button 
              className="btn btn-outline" 
              style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => toggleWishlist(product)}
              aria-label="Add to wishlist"
            >
              <Heart size={24} fill={wishlistItems.some(item => item.id === product.id) ? 'red' : 'none'} color={wishlistItems.some(item => item.id === product.id) ? 'red' : 'currentColor'} />
            </button>
          </div>
          
          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--color-gray-light)', paddingTop: '2rem' }}>
            <h4 style={{ marginBottom: '1rem', fontFamily: 'var(--font-sans)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
              Product Details
            </h4>
            <ul style={{ color: 'var(--color-gray-dark)', fontSize: '0.9rem', lineHeight: '2' }}>
              <li>Complimentary standard shipping on all orders</li>
              <li>Free returns within 30 days</li>
              <li>Includes certificate of authenticity</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
