import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import StoreLayout from '../layouts/StoreLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../admin/layout/AdminLayout';
import AdminRoute from './AdminRoute';

// Pages
import Home from '../pages/Home/Home';
import Collection from '../pages/Collection/Collection';
import NewArrivals from '../pages/NewArrivals/NewArrivals';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import About from '../pages/About/About';
import Cart from '../pages/Cart/Cart';
import Wishlist from '../pages/Wishlist/Wishlist';
import Contact from '../pages/Contact/Contact';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
// import NotFound from '../pages/NotFound/NotFound';

// Admin Pages
import AddCategory from '../admin/pages/Category/AddCategory';
import AddProduct from '../admin/pages/Product/AddProduct';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Store Routes with Navbar and Footer */}
      <Route element={<StoreLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Collection />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/collection/:categoryId" element={<Collection />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          {/* You can add an admin dashboard component here for index route later */}
          <Route path="/admin" element={<div style={{padding: '30px', fontSize: '1.2rem', color: '#555'}}>Select an action from the sidebar.</div>} />
          <Route path="/admin/categories/add" element={<AddCategory />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
        </Route>
      </Route>

      {/* Fallback */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
