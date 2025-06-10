import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu5ErLSpvHCol-MB-CpoXqrTRYw577aO8",
  authDomain: "fill-up-90585.firebaseapp.com",
  projectId: "fill-up-90585",
  storageBucket: "fill-up-90585.firebasestorage.app",
  messagingSenderId: "14151508240",
  appId: "1:14151508240:web:779e57a3c99f18d5968595",
  measurementId: "G-7HYD737DYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with React Native persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
const db = getFirestore(app);

export { auth, db };
export default app; 