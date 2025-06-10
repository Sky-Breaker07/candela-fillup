import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../../store/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoogleAuth } from '../utils/googleAuth';

export const useFirebaseAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  
  // Use our custom Google auth hook
  const { promptAsync, isLoading: googleAuthLoading } = useGoogleAuth(
    (user) => {
      // On success, login the user
      dispatch(login(`google-token-${Date.now()}`));
    },
    (error) => {
      setError(error);
    }
  );

  // Google sign-in function
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await promptAsync();
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password sign-in function (dummy implementation)
  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate dummy token and user
      const token = `email-dummy-token-${Date.now()}`;
      const user = {
        email,
        getIdToken: async () => token
      };
      
      // Store the token
      await AsyncStorage.setItem('@fillup_auth_token', token);
      
      // Store a dummy user profile
      const userProfile = {
        id: `email-user-${Date.now()}`,
        email,
        firstName: 'Test',
        lastName: 'User',
        mobileNumber: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('@fillup_user_data', JSON.stringify(userProfile));
      
      // Update Redux
      dispatch(login(token));
      
      return user;
    } catch (err: any) {
      setError(err.message || 'Email sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create account function (dummy implementation)
  const createAccount = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate dummy token and user
      const token = `signup-dummy-token-${Date.now()}`;
      const user = {
        email,
        getIdToken: async () => token
      };
      
      // Store the token
      await AsyncStorage.setItem('@fillup_auth_token', token);
      
      // Store a dummy user profile
      const userProfile = {
        id: `signup-user-${Date.now()}`,
        email,
        firstName: 'New',
        lastName: 'User',
        mobileNumber: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('@fillup_user_data', JSON.stringify(userProfile));
      
      // Update Redux
      dispatch(login(token));
      
      return user;
    } catch (err: any) {
      setError(err.message || 'Account creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Remove stored data
      await AsyncStorage.multiRemove(['@fillup_auth_token', '@fillup_user_data']);
      dispatch(logout());
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password function (dummy implementation)
  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Password reset email would be sent to ${email}`);
    } catch (err: any) {
      setError(err.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading: loading || googleAuthLoading,
    error,
    signInWithGoogle,
    signInWithEmail,
    createAccount,
    signOut,
    resetPassword,
    // Dummy implementations
    isAuthenticated: async () => {
      const token = await AsyncStorage.getItem('@fillup_auth_token');
      return !!token;
    },
    currentUser: async () => {
      const userData = await AsyncStorage.getItem('@fillup_user_data');
      return userData ? JSON.parse(userData) : null;
    },
  };
}; 