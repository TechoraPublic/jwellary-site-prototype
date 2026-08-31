import React from 'react';
import { ShopProvider } from '../context/ShopContext';
import { AuthProvider } from '../context/AuthContext';

const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ShopProvider>
        {children}
      </ShopProvider>
    </AuthProvider>
  );
};

export default AppProviders;
