'use client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, UserProfile } from '@/types';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface StoreState {
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  user: UserProfile | null;
  authLoading: boolean;
  wishlist: string[];
  setUser: (user: UserProfile | null) => void;
  setAuthLoading: (loading: boolean) => void;
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  setWishlist: (ids: string[]) => void;

  searchOpen: boolean;
  mobileMenuOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  toasts: Toast[];
  addToast: (t: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;

  appliedCoupon: { code: string; type: 'percentage' | 'fixed'; value: number } | null;
  applyCoupon: (c: StoreState['appliedCoupon']) => void;
  removeCoupon: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartOpen: false,
      addToCart: (item) => {
        const existing = get().cart.find(c =>
          c.productId === item.productId &&
          JSON.stringify(c.variant) === JSON.stringify(item.variant)
        );
        if (existing) {
          set({
            cart: get().cart.map(c =>
              c.productId === item.productId
                ? { ...c, quantity: Math.min(c.quantity + item.quantity, item.stock) }
                : c
            ),
          });
        } else {
          set({ cart: [...get().cart, item] });
        }
        set({ cartOpen: true });
      },
      removeFromCart: (id) => set({ cart: get().cart.filter(c => c.productId !== id) }),
      updateQuantity: (id, qty) => {
        if (qty < 1) { get().removeFromCart(id); return; }
        set({ cart: get().cart.map(c => c.productId === id ? { ...c, quantity: Math.min(qty, c.stock) } : c) });
      },
      clearCart: () => set({ cart: [] }),
      setCartOpen: (open) => set({ cartOpen: open }),
      getCartTotal: () => get().cart.reduce((s, i) => s + i.price * i.quantity, 0),
      getCartCount: () => get().cart.reduce((s, i) => s + i.quantity, 0),

      user: null,
      authLoading: true,
      wishlist: [],
      setUser: (user) => set({ user }),
      setAuthLoading: (loading) => set({ authLoading: loading }),
      addToWishlist: (id) => set({ wishlist: [...new Set([...get().wishlist, id])] }),
      removeFromWishlist: (id) => set({ wishlist: get().wishlist.filter(w => w !== id) }),
      setWishlist: (ids) => set({ wishlist: ids }),

      searchOpen: false,
      mobileMenuOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      toasts: [],
      addToast: (t) => {
        const id = Math.random().toString(36).slice(2);
        set({ toasts: [...get().toasts, { ...t, id }] });
        setTimeout(() => get().removeToast(id), 3500);
      },
      removeToast: (id) => set({ toasts: get().toasts.filter(t => t.id !== id) }),

      appliedCoupon: null,
      applyCoupon: (c) => set({ appliedCoupon: c }),
      removeCoupon: () => set({ appliedCoupon: null }),
    }),
    {
      name: 'homenest-store-v3',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ cart: s.cart, wishlist: s.wishlist, appliedCoupon: s.appliedCoupon }),
    }
  )
);
