import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import StoreLayout from '../layouts/StoreLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../admin/layout/AdminLayout';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';

// Pages
import Home from '../pages/Home/Home';
import Collection from '../pages/Collection/Collection';
import NewArrivals from '../pages/NewArrivals/NewArrivals';
import ProductDetails from '../pages/ProductDetails/ProductDetails';
import About from '../pages/About/About';
import Cart from '../pages/Cart/Cart';
import Wishlist from '../pages/Wishlist/Wishlist';
import Contact from '../pages/Contact/Contact';
import Checkout from '../pages/Checkout/Checkout';
import OrderSuccess from '../pages/Checkout/OrderSuccess';
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import Profile from '../pages/Profile/Profile';
// import NotFound from '../pages/NotFound/NotFound';

// Admin Pages
import Dashboard from '../admin/pages/Dashboard/Dashboard';
import AddCategory from '../admin/pages/Category/AddCategory';
import EditCategory from '../admin/pages/Category/EditCategory';
import ManageCategories from '../admin/pages/Category/ManageCategories';
import AddProduct from '../admin/pages/Product/AddProduct';
import EditProduct from '../admin/pages/Product/EditProduct';
import ManageProducts from '../admin/pages/Product/ManageProducts';
import ManageCollections from '../admin/pages/Collection/ManageCollections';
import AddCollection from '../admin/pages/Collection/AddCollection';
import EditCollection from '../admin/pages/Collection/EditCollection';
import ManageInventory from '../admin/pages/Inventory/ManageInventory';
import ManageOrders from '../admin/pages/Order/ManageOrders';
import OrderDetails from '../admin/pages/Order/OrderDetails';
import ManageCustomers from '../admin/pages/Customer/ManageCustomers';
import HomepageSettings from '../admin/pages/Content/HomepageSettings';
import AdminNewArrivals from '../admin/pages/Content/NewArrivals';

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
        
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:orderId" element={<OrderSuccess />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

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
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/categories/manage" element={<ManageCategories />} />
          <Route path="/admin/categories/add" element={<AddCategory />} />
          <Route path="/admin/categories/edit/:id" element={<EditCategory />} />

          <Route path="/admin/products/manage" element={<ManageProducts />} />
          <Route path="/admin/collections/manage" element={<ManageCollections />} />
          <Route path="/admin/collections/add" element={<AddCollection />} />
          <Route path="/admin/collections/edit/:id" element={<EditCollection />} />
          <Route path="/admin/inventory/manage" element={<ManageInventory />} />
          <Route path="/admin/orders/manage" element={<ManageOrders />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/customers/manage" element={<ManageCustomers />} />
          <Route path="/admin/content/homepage" element={<HomepageSettings />} />
          <Route path="/admin/content/new-arrivals" element={<AdminNewArrivals />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/products/edit/:id" element={<EditProduct />} />
        </Route>
      </Route>

      {/* Fallback */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
