import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const toggleWishlist = (product) => {
    const isExisting = wishlistItems.some(item => item.id === product.id);
    
    if (isExisting) {
      setWishlistItems(prev => prev.filter(item => item.id !== product.id));
      toast.info(`${product.name} removed from wishlist`);
    } else {
      setWishlistItems(prev => [...prev, product]);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  const removeFromWishlist = (productId) => {
    const itemToRemove = wishlistItems.find(item => item.id === productId);
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
    if (itemToRemove) {
      toast.info(`${itemToRemove.name} removed from wishlist`);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      });
    });
  };

  return (
    <ShopContext.Provider value={{ cartItems, wishlistItems, addToCart, toggleWishlist, removeFromWishlist, removeFromCart, updateQuantity }}>
      {children}
    </ShopContext.Provider>
  );
};
