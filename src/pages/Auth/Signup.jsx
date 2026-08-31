import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = React.useContext(AuthContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await register(formData);
      if (data.success) {
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '120px', paddingBottom: '6rem', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', padding: '2rem', backgroundColor: 'var(--color-ivory)', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Sign Up</h1>

        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: 'green', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
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
