import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { ShopContext } from '../../context/ShopContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart } = useContext(ShopContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleMoveToCart = (item) => {
    addToCart(item);
    removeFromWishlist(item.id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '160px', minHeight: '80vh', textAlign: 'center', backgroundColor: 'var(--color-ivory)' }}>
        <h1 style={{ marginBottom: '2rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)' }}>Your Wishlist</h1>
        <p style={{ color: 'var(--color-navy-light)', marginBottom: '2rem' }}>You haven't added any items to your wishlist yet.</p>
        <Link to="/shop" className="btn btn-primary">Explore Collections</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '160px', paddingBottom: '6rem', minHeight: '80vh', backgroundColor: 'var(--color-ivory)' }}>
      <h1 style={{ marginBottom: '3rem', textAlign: 'center', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)' }}>Your Wishlist</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {wishlistItems.map((item) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(217, 164, 65, 0.3)', flexWrap: 'wrap' }}>
            <Link to={`/product/${item.id}`}>
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            </Link>
            
            <div style={{ flex: '1 1 200px' }}>
              <Link to={`/product/${item.id}`} style={{ textDecoration: 'none' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)' }}>{item.name}</h3>
              </Link>
              <p style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>₹{item.price.toLocaleString()}</p>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                onClick={() => handleMoveToCart(item)} 
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ShoppingBag size={16} /> Move to Cart
              </button>
              
              <button 
                onClick={() => removeFromWishlist(item.id)} 
                style={{ padding: '0.75rem', cursor: 'pointer', background: 'transparent', border: '1px solid rgba(3,22,55,0.2)', borderRadius: '2px', color: '#ff4d4f', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
