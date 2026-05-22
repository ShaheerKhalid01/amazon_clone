import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useCart() {
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(items);
  }, []);

  const addToCart = (product: any) => {
    const items = [...cartItems];
    const existing = items.find(i => i.productId === product.productId);
    if (existing) {
      existing.quantity += product.quantity || 1;
    } else {
      items.push({ ...product, quantity: product.quantity || 1 });
    }
    localStorage.setItem('cartItems', JSON.stringify(items));
    setCartItems(items);
    toast.success('Added to cart!');
  };

  const removeFromCart = (productId: string) => {
    const items = cartItems.filter(i => i.productId !== productId);
    localStorage.setItem('cartItems', JSON.stringify(items));
    setCartItems(items);
    toast.success('Removed from cart');
  };

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return { cartItems, addToCart, removeFromCart, itemCount };
}