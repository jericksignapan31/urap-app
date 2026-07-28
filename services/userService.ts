import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase/firebaseConfig';
import { User } from '../types';
import { mockUsers } from '../utils/mockData';

// Create or update user in Firestore
export const createUserInFirestore = async (userData: User) => {
  try {
    const userDocRef = doc(db, 'users', userData.id);
    await setDoc(userDocRef, {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatar: userData.avatar,
      createdAt: userData.createdAt,
    });
    console.log('User created in Firestore:', userData.email);
    return true;
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw error;
  }
};

// Get user from Firestore by UID
export const getUserFromFirestore = async (uid: string) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      return userDocSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user from Firestore:', error);
    throw error;
  }
};

// Initialize test users (FOR DEVELOPMENT ONLY)
// Call this once to seed the database with test users
export const initializeTestUsers = async () => {
  try {
    console.log('Initializing test users...');
    
    for (const mockUser of mockUsers) {
      try {
        // Try to create auth user and Firestore user
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          mockUser.email,
          'password' // Default password for test users
        );
        
        // Create user document in Firestore with the auth UID
        await createUserInFirestore({
          ...mockUser,
          id: userCredential.user.uid,
        });
        
        console.log(`✅ Test user created: ${mockUser.email}`);
      } catch (authError: any) {
        // If user already exists, just update the Firestore document
        if (authError.code === 'auth/email-already-in-use') {
          console.log(`⚠️ User already exists: ${mockUser.email}, updating Firestore...`);
          // Try to find existing user by email and update
          // For now, just log it
        } else {
          console.error(`❌ Error creating user ${mockUser.email}:`, authError.message);
        }
      }
    }
    
    console.log('Test users initialization complete!');
  } catch (error) {
    console.error('Error initializing test users:', error);
  }
};

// Get current user profile
export const getCurrentUserProfile = async (uid: string) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      return userDocSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting current user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, updates: Partial<User>) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, updates, { merge: true });
    console.log('User profile updated:', uid);
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const usersCollectionRef = collection(db, 'users');
    const querySnapshot = await getDocs(usersCollectionRef);
    
    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });
    
    return users;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};
