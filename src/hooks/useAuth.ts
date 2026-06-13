'use client';

import { useState, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import type { UserProfile } from '@/types';
import { STORE } from '@/types';

export function useAuth() {
  const { user, addToast } = useStore();
  const [loading, setLoading] = useState(false);

  // ── Email + Password Login ──────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged in AuthProvider will handle setting the user
      addToast({ message: 'Welcome back!', type: 'success' });
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      // Map Firebase error codes to user-friendly messages
      const friendlyMap: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      const code = (err as { code?: string })?.code ?? '';
      addToast({
        message: friendlyMap[code] || message,
        type: 'error',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ── Email + Password Register ───────────────────────────────────────────
  const register = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // Set displayName in Firebase Auth profile
      await updateProfile(cred.user, { displayName: name });

      // Create the Firestore user document with the correct role
      const role = email === STORE.adminEmail ? 'admin' : 'customer';
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        displayName: name,
        email,
        phone: '',
        role,
        photoURL: '',
        banned: false,
        createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
      };

      await setDoc(doc(db, 'users', cred.user.uid), {
        ...newProfile,
        createdAt: serverTimestamp(),
      });

      addToast({ message: 'Account created successfully!', type: 'success' });
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      const friendlyMap: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
      };
      const code = (err as { code?: string })?.code ?? '';
      addToast({
        message: friendlyMap[code] || message,
        type: 'error',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ── Google Sign-In ──────────────────────────────────────────────────────
  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged in AuthProvider will handle the rest
      addToast({ message: 'Signed in with Google!', type: 'success' });
      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google sign-in failed.';
      // User closed the popup — not really an error
      const code = (err as { code?: string })?.code ?? '';
      if (code === 'auth/popup-closed-by-user') {
        addToast({ message: 'Sign-in was cancelled.', type: 'warning' });
      } else {
        addToast({ message, type: 'error' });
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will set user to null in Zustand
      addToast({ message: 'You have been logged out.', type: 'info' });
    } catch {
      addToast({ message: 'Logout failed. Please try again.', type: 'error' });
    }
  }, [addToast]);

  return {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'admin' || user?.role === 'manager',
  };
}
