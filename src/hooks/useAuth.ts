'use client';
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import type { UserProfile } from '@/types';

export function useAuth() {
  const { user, setUser, setAuthLoading, addToast } = useStore();
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login - in production, this would use Firebase Auth
      const mockUser: UserProfile = {
        uid: 'user-' + Date.now(),
        displayName: email.split('@')[0],
        email,
        phone: '',
        role: email === 'admin@homestlk.com' ? 'admin' : 'customer',
        photoURL: '',
        banned: false,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      };
      setUser(mockUser);
      addToast({ message: 'Welcome back!', type: 'success' });
      return mockUser;
    } catch {
      addToast({ message: 'Login failed. Please try again.', type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [setUser, addToast]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const mockUser: UserProfile = {
        uid: 'user-' + Date.now(),
        displayName: name,
        email,
        phone: '',
        role: email === 'admin@homestlk.com' ? 'admin' : 'customer',
        photoURL: '',
        banned: false,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      };
      setUser(mockUser);
      addToast({ message: 'Account created successfully!', type: 'success' });
      return mockUser;
    } catch {
      addToast({ message: 'Registration failed. Please try again.', type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [setUser, addToast]);

  const logout = useCallback(() => {
    setUser(null);
    addToast({ message: 'You have been logged out.', type: 'info' });
  }, [setUser, addToast]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const mockUser: UserProfile = {
        uid: 'google-' + Date.now(),
        displayName: 'Google User',
        email: 'user@gmail.com',
        phone: '',
        role: 'customer',
        photoURL: '',
        banned: false,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      };
      setUser(mockUser);
      addToast({ message: 'Signed in with Google!', type: 'success' });
      return mockUser;
    } catch {
      addToast({ message: 'Google sign-in failed.', type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [setUser, addToast]);

  useEffect(() => {
    setAuthLoading(false);
  }, [setAuthLoading]);

  return { user, loading, login, register, logout, loginWithGoogle, isAdmin: user?.role === 'admin' };
}
