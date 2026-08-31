import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is in localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.success && data.data) {
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.success && data.data) {
      setUser(data.data);
      localStorage.setItem('user', JSON.stringify(data.data));
    }
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
