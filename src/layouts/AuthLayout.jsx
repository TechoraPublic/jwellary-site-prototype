import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const AuthLayout = () => {
  return (
    <>
      <Navbar />
      <div className="auth-layout">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default AuthLayout;
