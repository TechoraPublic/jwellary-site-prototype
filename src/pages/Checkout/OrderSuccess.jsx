import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const { orderId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container section" style={{ paddingTop: '160px', minHeight: '80vh', backgroundColor: 'var(--color-ivory)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: '600px', backgroundColor: '#fff', padding: '4rem', borderRadius: '4px', boxShadow: '0 10px 30px rgba(3, 22, 55, 0.05)', borderTop: '4px solid var(--color-gold)' }}>
        <CheckCircle size={64} color="var(--color-gold)" style={{ margin: '0 auto 1.5rem auto' }} />
        <h1 style={{ marginBottom: '1rem', color: 'var(--color-navy)', fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Order Placed Successfully!</h1>
        <p style={{ color: 'var(--color-navy-light)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
          Thank you for your purchase. Your exquisite jewellery is being prepared for shipment.
        </p>

        <div style={{ backgroundColor: 'var(--color-ivory)', padding: '1.5rem', borderRadius: '4px', marginBottom: '2.5rem', border: '1px solid rgba(217, 164, 65, 0.2)' }}>
          <p style={{ color: 'var(--color-navy-light)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>Order ID</p>
          <h3 style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '1rem' }}>#{orderId}</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(3, 22, 55, 0.1)', paddingTop: '1rem' }}>
            <span style={{ color: 'var(--color-navy-light)' }}>Estimated Delivery</span>
            <strong style={{ color: 'var(--color-navy)' }}>5–7 Business Days</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/profile" className="btn btn-primary" style={{ flex: 1, minWidth: '200px' }}>
            View Order
          </Link>
          <Link to="/shop" className="btn btn-outline" style={{ flex: 1, minWidth: '200px' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
