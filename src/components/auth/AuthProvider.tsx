'use client';

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import type { UserProfile } from '@/types';
import { STORE } from '@/types';

/**
 * Fetch the Firestore user profile for a given Firebase Auth UID.
 * Returns null if the document does not exist.
 */
async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (err) {
    console.error('[AuthProvider] Failed to fetch user profile from Firestore:', err);
  }
  return null;
}

/**
 * Ensure a Firestore user document exists for the given Firebase Auth user.
 * If it doesn't exist yet (first login), create it with the correct role.
 * If it DOES exist, return it as-is (preserving the admin role you set manually).
 */
async function ensureUserDocument(authUser: User): Promise<UserProfile> {
  const uid = authUser.uid;
  const existing = await fetchUserProfile(uid);

  if (existing) {
    // Update email/displayName if they changed in Auth but not Firestore
    const updates: Partial<UserProfile> = {};
    if (authUser.email && existing.email !== authUser.email) updates.email = authUser.email;
    if (authUser.displayName && existing.displayName !== authUser.displayName) updates.displayName = authUser.displayName;

    if (Object.keys(updates).length > 0) {
      try {
        await setDoc(doc(db, 'users', uid), updates, { merge: true });
        return { ...existing, ...updates };
      } catch {
        // Merge failed — return what we have
      }
    }
    return existing;
  }

  // First-time user: create the Firestore document
  const role = authUser.email === STORE.adminEmail ? 'admin' : 'customer';
  const newProfile: UserProfile = {
    uid,
    displayName: authUser.displayName || authUser.email?.split('@')[0] || 'User',
    email: authUser.email || '',
    phone: '',
    role,
    photoURL: authUser.photoURL || '',
    banned: false,
    createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
  };

  try {
    await setDoc(doc(db, 'users', uid), {
      ...newProfile,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error('[AuthProvider] Failed to create user document:', err);
  }

  return newProfile;
}

// ─────────────────────────────────────────────────────────────────────────────
// AuthProvider — mount ONCE at the app root, BEFORE any guarded routes
// ─────────────────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setAuthLoading, addToast } = useStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // This listener fires immediately with the current auth state
    // (including persisted sessions on page refresh), and again
    // whenever sign-in / sign-out occurs.
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // ── User is signed in (or session was restored on refresh) ──

        // Check ban status from Firestore first
        const profile = await fetchUserProfile(firebaseUser.uid);
        if (profile?.banned) {
          await signOut(auth);
          setUser(null);
          addToast({ message: 'Your account has been suspended.', type: 'error' });
          setAuthLoading(false);
          setInitialized(true);
          return;
        }

        // Ensure the Firestore user document exists, then store in Zustand
        const fullProfile = await ensureUserDocument(firebaseUser);
        setUser(fullProfile);
      } else {
        // ── No user signed in ──
        setUser(null);
      }

      setAuthLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show nothing until the first onAuthStateChanged callback has fired.
  // This prevents the AdminGuard from seeing a null user and flashing
  // a redirect before the Firebase session is restored.
  if (!initialized) {
    return null;
  }

  return <>{children}</>;
}
