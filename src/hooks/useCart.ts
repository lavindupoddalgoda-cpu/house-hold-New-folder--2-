'use client';
import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

export function useCart() {
  const { cart, user, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useStore();

  useEffect(() => {
    // In production, this would sync cart with Firestore when user logs in
    if (user) {
      // Merge logic would go here
    }
  }, [user]);

  return { cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount };
}
