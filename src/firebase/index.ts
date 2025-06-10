import app, { auth, db } from './config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  sendEmailVerification as firebaseSendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Firebase auth service
const firebaseAuth = {
  // Register a new user with email and password
  registerWithEmailAndPassword: async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      throw error;
    }
  },

  // Sign in with email and password
  signInWithEmailAndPassword: async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error: any) {
      throw error;
    }
  },

  // Sign out current user
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (displayName: string, photoURL?: string) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
          ...(photoURL && { photoURL })
        });
      }
    } catch (error: any) {
      throw error;
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw error;
    }
  },

  // Send email verification
  sendEmailVerification: async () => {
    try {
      if (auth.currentUser) {
        await firebaseSendEmailVerification(auth.currentUser);
      }
    } catch (error: any) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => auth.currentUser,

  // Check if user is authenticated
  isAuthenticated: () => !!auth.currentUser,

  // Save user data to Firestore
  saveUserToFirestore: async (user: User, userData: any) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...userData,
        email: user.email,
        uid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (error: any) {
      throw error;
    }
  },

  // Get user data from Firestore
  getUserFromFirestore: async (uid: string) => {
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        return null;
      }
    } catch (error: any) {
      throw error;
    }
  }
};

export { app, auth, db, firebaseAuth };

// Auth state listener
export const authStateListener = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
}; 