import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

interface UserContextType {
  currentUser: User | null;
  loading: boolean;
  setCurrentUser: (user: User | null) => void;
  logout: () => Promise<void>;
  fetchUserProfile: (uid: string) => Promise<User | null>;
  setAuthListenerPaused: (paused: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Screens that manage their own auth transition (e.g. RegisterScreen, which
  // signs a brand-new account back out itself right after creating its
  // profile doc) set this so this listener doesn't also react to that same
  // sign-in/out and race it with a concurrent read of the same document.
  const authListenerPausedRef = useRef(false);

  const setAuthListenerPaused = (paused: boolean) => {
    authListenerPausedRef.current = paused;
  };

  useEffect(() => {
    // Check if user is logged in on app load
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      console.log('[UserContext] onAuthStateChanged fired. uid:', firebaseUser?.uid ?? null, 'paused:', authListenerPausedRef.current);

      if (authListenerPausedRef.current) {
        console.log('[UserContext] listener paused, skipping');
        return;
      }

      if (firebaseUser) {
        try {
          console.log('[UserContext] fetching profile for', firebaseUser.uid);
          const userProfile = await fetchUserProfile(firebaseUser.uid);
          console.log('[UserContext] profile fetched:', userProfile ? userProfile.email : null, 'verified:', userProfile?.verified);
          if (userProfile && !userProfile.verified) {
            console.log('[UserContext] unverified, signing out');
            await auth.signOut();
            setCurrentUser(null);
          } else {
            setCurrentUser(userProfile);
          }
        } catch (error) {
          console.error('[UserContext] Error loading user profile:', error);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid: string): Promise<User | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as User;
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{ currentUser, loading, setCurrentUser, logout, fetchUserProfile, setAuthListenerPaused }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
