import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('aurora_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Ensure only items with valid ObjectIds are kept in cart to prevent checkout errors
        return parsed.filter(item => item.id && item.id.match(/^[0-9a-fA-F]{24}$/));
      }
      return [];
    } catch (error) {
      return [];
    }
  });

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('aurora_wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('aurora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('aurora_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

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

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <ShopContext.Provider value={{ cartItems, wishlistItems, addToCart, toggleWishlist, removeFromWishlist, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </ShopContext.Provider>
  );
};
