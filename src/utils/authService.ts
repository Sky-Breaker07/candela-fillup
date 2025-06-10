import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth, authStateListener } from '../firebase';
import { User } from 'firebase/auth';
import { getAuthErrorMessage } from './firebaseErrorHandler';

// Keys for storage
const AUTH_TOKEN_KEY = '@fillup_auth_token';
const USER_DATA_KEY = '@fillup_user_data';

/**
 * Interface for login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Interface for registration data
 */
export interface RegistrationData {
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  password: string;
}

/**
 * Interface for user profile data
 */
export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  createdAt: any;
  updatedAt: any;
}

/**
 * Service for handling authentication-related operations using Firebase
 */
export const authService = {
  login: async (credentials: LoginCredentials): Promise<string> => {
    try {
      const { email, password } = credentials;
      
      // Sign in with Firebase
      const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
      
      if (!result.user) {
        throw new Error('Failed to sign in');
      }
      
      // Get the user's ID token
      const token = await result.user.getIdToken();
      
      // Store the token
      await authService.storeToken(token);
      
      return token;
    } catch (error: any) {
      console.error('Login error:', error);
      // Convert Firebase error to user-friendly message
      throw new Error(getAuthErrorMessage(error));
    }
  },
  
  register: async (data: RegistrationData): Promise<string> => {
    try {
      const { email, password, firstName, lastName, mobileNumber } = data;
      
      // Register with Firebase
      const result = await firebaseAuth.registerWithEmailAndPassword(email, password);
      
      if (!result.user) {
        throw new Error('Failed to register user');
      }
      
      // Send email verification
      await firebaseAuth.sendEmailVerification();
      
      // Create user profile data
      const userData: Omit<UserProfile, 'createdAt' | 'updatedAt'> = {
        uid: result.user.uid,
        email,
        firstName,
        lastName,
        mobileNumber,
      };
      
      // Save user data to Firestore
      await firebaseAuth.saveUserToFirestore(result.user, {
        firstName,
        lastName,
        mobileNumber,
      });
      
      // Get the user's ID token
      const token = await result.user.getIdToken();
      
      // Store the token
      await authService.storeToken(token);
      
      return token;
    } catch (error: any) {
      console.error('Registration error:', error);
      // Convert Firebase error to user-friendly message
      throw new Error(getAuthErrorMessage(error));
    }
  },
  
  forgotPassword: async (email: string): Promise<boolean> => {
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      return true;
    } catch (error: any) {
      console.error('Forgot password error:', error);
      // Convert Firebase error to user-friendly message
      throw new Error(getAuthErrorMessage(error));
    }
  },
  
  changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    // This would require reauthentication first, which is not implemented in this version
    console.log('Password change functionality requires reauthentication');
    return false;
  },
  
  /**
   * Log out user by removing stored token and data
   */
  logout: async (): Promise<void> => {
    try {
      await firebaseAuth.signOut();
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },
  
  /**
   * Clear all authentication data from storage
   * Use this for debugging or resetting the app state
   */
  clearAuthData: async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      console.log('Auth data cleared from AsyncStorage');
    } catch (error) {
      console.error('Clear auth data error:', error);
      throw error;
    }
  },
  
  isAuthenticated: async (): Promise<boolean> => {
    try {
      // Check if the user is logged in with Firebase
      const isAuthenticated = firebaseAuth.isAuthenticated();
      
      // If not, check if we have a stored token
      if (!isAuthenticated) {
        const token = await authService.getToken();
        return !!token;
      }
      
      return isAuthenticated;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  },
  
  getUserProfile: async (): Promise<UserProfile | null> => {
    try {
      // Get the current Firebase user
      const currentUser = firebaseAuth.getCurrentUser();
      
      if (!currentUser) {
        return null;
      }
      
      // Get the user's profile from Firestore
      const userData = await firebaseAuth.getUserFromFirestore(currentUser.uid);
      
      if (!userData) {
        return null;
      }
      
      return userData as UserProfile;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  },
  
  storeToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  
  getToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  storeUserData: async (userData: UserProfile): Promise<void> => {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  },
  
  /**
   * Set up a listener for authentication state changes
   */
  onAuthStateChanged: (callback: (user: User | null) => void) => {
    return authStateListener(callback);
  }
};

export default authService; 