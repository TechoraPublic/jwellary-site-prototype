import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(ShopContext);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = subtotal * 0.15; // 15% discount
  const total = subtotal - discount;

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '160px', minHeight: '80vh', textAlign: 'center', backgroundColor: 'var(--color-ivory)' }}>
        <h1 style={{ marginBottom: '2rem', color: 'var(--color-navy)' }}>Your Cart</h1>
        <p style={{ color: 'var(--color-navy-light)', marginBottom: '2rem' }}>Your cart is currently empty.</p>
        <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '160px', paddingBottom: '6rem', minHeight: '80vh', backgroundColor: 'var(--color-ivory)' }}>
      <h1 style={{ marginBottom: '3rem', textAlign: 'center', color: 'var(--color-navy)' }}>Your Cart</h1>

      <div className="responsive-cart-grid">
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item-row">
              <img src={item.image} alt={item.name} className="cart-item-image" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <div className="cart-item-details" style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)' }}>{item.name}</h3>
                <p style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>₹{item.price.toFixed(2)}</p>
              </div>

              <div className="cart-item-actions">
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(3, 22, 55, 0.2)', borderRadius: '2px' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.5rem', cursor: 'pointer', background: 'transparent', border: 'none' }}><Minus size={16} /></button>
                  <span style={{ padding: '0 1rem' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.5rem', cursor: 'pointer', background: 'transparent', border: 'none' }}><Plus size={16} /></button>
                </div>

                <button onClick={() => setItemToDelete(item.id)} style={{ padding: '0.5rem', cursor: 'pointer', background: 'transparent', border: 'none', color: '#ff4d4f' }} aria-label="Remove item">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'transparent', padding: '2rem', border: '1px solid rgba(217, 164, 65, 0.3)', borderRadius: '2px', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--color-navy)' }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--color-navy-light)' }}>
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--color-gold)' }}>
            <span>Discount (15%)</span>
            <span>-₹{discount.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold', borderTop: '1px solid rgba(217, 164, 65, 0.3)', paddingTop: '1rem', color: 'var(--color-navy)' }}>
            <span>Total Payable</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }}>Proceed to Checkout</button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(3, 22, 55, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--color-ivory)',
            padding: '2rem',
            borderRadius: '4px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>Remove Item</h3>
            <p style={{ marginBottom: '2rem', color: 'var(--color-navy-light)' }}>Are you sure you want to remove this item from your cart?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setItemToDelete(null)}
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                No
              </button>
              <button
                onClick={() => {
                  removeFromCart(itemToDelete);
                  setItemToDelete(null);
                }}
                className="btn btn-primary"
                style={{ flex: 1, backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .cart-item-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-bottom: 1.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(217, 164, 65, 0.3);
        }
        .cart-item-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        @media (max-width: 600px) {
          .cart-item-row {
            flex-wrap: wrap;
            gap: 1rem;
          }
          .cart-item-image {
            width: 80px !important;
            height: 80px !important;
          }
          .cart-item-details {
            min-width: 150px;
          }
          .cart-item-actions {
            width: 100%;
            justify-content: space-between;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
