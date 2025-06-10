import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider as ReactNavigationThemeProvider,
  Theme,
} from "@react-navigation/native";
import AppNavigation from "./src/navigation";
import RNRestart from "react-native-restart";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";
import { Button, StyleSheet } from "react-native";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { Text, View } from "react-native";
import { useEffect } from "react";
import authService from "./src/utils/authService";
import { checkAuthStatus } from "./store/slices/authSlice";
import { AppDispatch, RootState } from "./store";

// Firebase Auth State Component
const FirebaseAuthStateListener = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check authentication status on app load
    dispatch(checkAuthStatus());

    // Set up listener for auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      // Only update auth state if we don't already have a valid token
      // This prevents the auth state from being reset when we've manually set it
      if (!isAuthenticated || !token) {
        if (user) {
          // User is signed in, dispatch checkAuthStatus to update Redux
          dispatch(checkAuthStatus());
        }
      }
    });

    // Clean up subscription
    return () => unsubscribe();
  }, [dispatch, isAuthenticated, token]);

  return null;
};

// Main App Component
const MainApp = () => {
  // Get the auth state from Redux to use as a key for NavigationContainer
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <NavigationContainer key={isAuthenticated ? 'authenticated' : 'unauthenticated'}>
      <ErrorBoundary
        actionButton={
          <Button
            title="Reload App"
            onPress={() => RNRestart.restart()}
          />
        }
      >
        <FirebaseAuthStateListener />
        <AppNavigation />
      </ErrorBoundary>
    </NavigationContainer>
  );
};

// Main App export
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <MainApp />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  debugContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  }
});

