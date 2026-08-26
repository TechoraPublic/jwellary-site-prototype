import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(ShopContext);

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
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(217, 164, 65, 0.3)' }}>
              <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)' }}>{item.name}</h3>
                <p style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>₹{item.price.toFixed(2)}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(3, 22, 55, 0.2)', borderRadius: '2px' }}>
                <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '0.5rem', cursor: 'pointer', background: 'transparent', border: 'none' }}><Minus size={16} /></button>
                <span style={{ padding: '0 1rem' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '0.5rem', cursor: 'pointer', background: 'transparent', border: 'none' }}><Plus size={16} /></button>
              </div>
              
              <button onClick={() => removeFromCart(item.id)} style={{ padding: '0.5rem', cursor: 'pointer', background: 'transparent', border: 'none', color: '#ff4d4f' }} aria-label="Remove item">
                <Trash2 size={20} />
              </button>
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
    </div>
  );
};

export default Cart;
