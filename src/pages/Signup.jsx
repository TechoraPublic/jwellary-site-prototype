import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '6rem', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: 'var(--color-ivory)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Sign Up</h1>
        
        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="Enter your full name" 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-gray-light)', borderRadius: '4px', outline: 'none' }}
              required 
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter your email" 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-gray-light)', borderRadius: '4px', outline: 'none' }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Create a password" 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-gray-light)', borderRadius: '4px', outline: 'none' }}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Create Account</button>
        </form>
        
        <div style={{ textAlign: 'center', color: 'var(--color-gray-dark)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
