import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Container from '~/src/components/container';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthenticationStackParamsList } from '~/src/navigation/types';
import { firebaseAuth, auth } from '~/src/firebase';
import { useDispatch } from 'react-redux';
import { logoutUser } from '~/store/slices/authSlice';
import { AppDispatch } from '~/store';
import { StackNavigationProp } from '@react-navigation/stack';

type EmailVerificationScreenNavigationProp = StackNavigationProp<
  AuthenticationStackParamsList,
  'emailVerification'
>;

const EmailVerificationScreen = () => {
  const navigation = useNavigation<EmailVerificationScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthenticationStackParamsList, 'emailVerification'>>();
  const { email } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle resend email verification
  const handleResendVerification = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      await firebaseAuth.sendEmailVerification();
      Alert.alert(
        "Email Sent",
        "Verification email has been resent to your email address."
      );
      // Start countdown for resend button (60 seconds)
      setCountdown(60);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend verification email");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle check verification status
  const handleCheckVerification = async () => {
    setIsCheckingStatus(true);
    try {
      // Force refresh the token to get the latest verification status
      if (auth.currentUser) {
        await auth.currentUser.reload();
        
        if (auth.currentUser.emailVerified) {
          Alert.alert(
            "Email Verified",
            "Your email has been verified successfully!",
            [
              {
                text: "Continue",
                onPress: () => navigation.navigate('completeProfileInformation', { email })
              }
            ]
          );
        } else {
          Alert.alert(
            "Not Verified",
            "Your email has not been verified yet. Please check your inbox and click the verification link."
          );
        }
      } else {
        Alert.alert("Error", "You are not signed in. Please sign in again.");
        navigation.navigate('login');
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to check verification status");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser());
      navigation.navigate('login');
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to sign out");
    }
  };

  // Handle change email
  const handleChangeEmail = () => {
    handleSignOut();
    navigation.navigate('signup');
  };

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="mail" size={60} color="#4CAF50" />
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification link to:
          </Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.instructions}>
            Please check your inbox and click the verification link to continue.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, countdown > 0 && styles.disabledButton]}
            onPress={handleResendVerification}
            disabled={isLoading || countdown > 0}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {countdown > 0 ? `Resend Email (${countdown}s)` : "Resend Verification Email"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleCheckVerification}
            disabled={isCheckingStatus}
          >
            {isCheckingStatus ? (
              <ActivityIndicator size="small" color="#4CAF50" />
            ) : (
              <Text style={styles.secondaryButtonText}>I've Verified My Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={handleChangeEmail}
          >
            <Text style={styles.outlineButtonText}>Change Email Address</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.textButton]}
            onPress={handleSignOut}
          >
            <Text style={styles.textButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    marginTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  outlineButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  textButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  outlineButtonText: {
    color: '#666666',
    fontSize: 16,
  },
  textButtonText: {
    color: '#F44336',
    fontSize: 16,
  },
});

export default EmailVerificationScreen; 