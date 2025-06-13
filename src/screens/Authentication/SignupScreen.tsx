import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, useWindowDimensions, View, Alert, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import Container from '../../components/container'
import { cn } from '~/src/utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthenticationStackParamsList } from '~/src/navigation/types';
import { useDispatch } from 'react-redux';
import { googleLogin } from '../../../store/slices/authSlice';
import { useGoogleAuth } from '../../utils/googleAuth';
import { isValidEmail, validatePassword } from '~/src/utils/validation';
import { firebaseAuth } from '~/src/firebase';
import { getAuthErrorMessage } from '~/src/utils/firebaseErrorHandler';

const Signup = () => {
  const { height } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<AuthenticationStackParamsList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const passwordValidation = validatePassword(password);
  const allPasswordRequirementsMet = Object.values(passwordValidation).every(Boolean);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePasswords = () => {
    let isValid = true;

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!allPasswordRequirementsMet) {
      setPasswordError("Password doesn't meet requirements");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const signup = async () => {
    if (!validateEmail() || !validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setGeneralError("");
    
    try {
      // Register the user directly - no need to check if email exists first
      const registerResult = await firebaseAuth.registerWithEmailAndPassword(email, password);
      
      // Send verification email
      await firebaseAuth.sendEmailVerification();
      
      // Navigate to email verification screen
      navigation.navigate('emailVerification', { email });
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackNavigation = () => {
    navigation.navigate('login');
  };

  // Social signup handler
  const handleSocialSignup = (provider: string) => {
    console.log(`Signup with ${provider}`);
    // In a real app, implement OAuth signup
    Alert.alert('Coming Soon', `${provider} authentication will be available soon.`);
  };

  const onGoogleAuthSuccess = (user: { email: string; name: string; picture: string }) => {
    dispatch(googleLogin(user));
    // Navigation to dashboard will be handled by RootNavigator based on isAuthenticated
  };
  
  const onGoogleAuthError = (error: string) => {
    console.log('Google auth error:', error);
    setGeneralError(error);
  };
  
  const { promptAsync } = useGoogleAuth(onGoogleAuthSuccess, onGoogleAuthError);

  return (
    <Container>
      <View className="flex-1 px-4 py-2" style={{ paddingTop: height * 0.03 }}>
         <TouchableOpacity 
           onPress={handleBackNavigation} 
           className="py-2 bg-white rounded-full w-10 items-center"
         >
            <Icon name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black mb-1 mt-3">Sign up to Fill Up</Text>
          <View className="px-2">
            {generalError ? (
              <View className="bg-red-100 p-2 rounded-md mb-3 flex-row items-center">
                <Icon name="exclamationcircleo" size={16} color="#FF3B30" style={{ marginRight: 6 }} />
                <Text className="text-red-500 flex-1 text-sm">{generalError}</Text>
              </View>
            ) : null}
            
            <Text className="text-sm text-black mb-1">Email Address</Text>
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError("");
                if (generalError) setGeneralError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              className={`border ${emailError ? "border-red-500" : "border-gray-300"} h-12 rounded-md px-3 py-2 text-base text-black`}
            />
            {emailError ? <Text className="text-red-500 text-xs mt-1">{emailError}</Text> : null}
            
            <Text className="text-sm text-black mb-1 mt-3">Password</Text>
            <View className={`relative flex-row border ${passwordError ? "border-red-500" : "border-gray-300"} rounded-md px-3 items-center h-12`}>
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError("");
                  if (generalError) setGeneralError("");
                }}
                secureTextEntry={secure}
                className="flex-1 text-base text-black"
              />
              <TouchableOpacity onPress={() => setSecure(!secure)}>
                <Text className="text-gray-500 text-sm">{secure ? "Show" : "Hide"}</Text>
              </TouchableOpacity>
            </View>
            {passwordError ? <Text className="text-red-500 text-xs mt-1">{passwordError}</Text> : null}

            <View className="mt-2 flex-row flex-wrap">
              <View className="flex-row items-center mr-3 mb-1" style={{ width: '45%' }}>
                <Icon 
                  name={passwordValidation.hasLetter ? "checkcircle" : "closecircle"} 
                  size={12} 
                  color={passwordValidation.hasLetter ? "#4CAF50" : "#9E9E9E"} 
                />
                <Text className="text-xs ml-1">One letter (a-z)</Text>
              </View>
              <View className="flex-row items-center mb-1" style={{ width: '45%' }}>
                <Icon 
                  name={passwordValidation.hasNumber ? "checkcircle" : "closecircle"} 
                  size={12} 
                  color={passwordValidation.hasNumber ? "#4CAF50" : "#9E9E9E"} 
                />
                <Text className="text-xs ml-1">One number (0-9)</Text>
              </View>
              <View className="flex-row items-center mr-3 mb-1" style={{ width: '45%' }}>
                <Icon 
                  name={passwordValidation.hasSpecialChar ? "checkcircle" : "closecircle"} 
                  size={12} 
                  color={passwordValidation.hasSpecialChar ? "#4CAF50" : "#9E9E9E"} 
                />
                <Text className="text-xs ml-1">Special character</Text>
              </View>
              <View className="flex-row items-center mb-1" style={{ width: '45%' }}>
                <Icon 
                  name={passwordValidation.hasMinLength ? "checkcircle" : "closecircle"} 
                  size={12} 
                  color={passwordValidation.hasMinLength ? "#4CAF50" : "#9E9E9E"} 
                />
                <Text className="text-xs ml-1">8 chars minimum</Text>
              </View>
            </View>

            <Text className="text-sm text-black mb-1 mt-3">Confirm Password</Text>
            <View className={`relative flex-row border ${confirmPasswordError ? "border-red-500" : "border-gray-300"} rounded-md px-3 items-center h-12`}>
              <TextInput
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError("");
                  if (generalError) setGeneralError("");
                }}
                secureTextEntry={secureConfirm}
                className="flex-1 text-base text-black"
              />
              <TouchableOpacity onPress={() => setSecureConfirm(!secureConfirm)}>
                <Text className="text-gray-500 text-sm">{secureConfirm ? "Show" : "Hide"}</Text>
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text className="text-red-500 text-xs mt-1">{confirmPasswordError}</Text> : null}
            
            <TouchableOpacity
              onPress={signup}
              disabled={isLoading || !email || !password || !confirmPassword}
              className={cn(
                "w-full flex-row items-center justify-center rounded-[60px] py-3 mt-5",
                email && password && confirmPassword && !isLoading ? "bg-primary-500" : "bg-primary-500/75"
              )}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-base font-semibold text-center">Continue</Text>
              )}
            </TouchableOpacity>
            
            <View className="flex-row items-center my-4">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-2 text-gray-500 text-sm">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
            
            <TouchableOpacity
              onPress={() => promptAsync()}
              className="w-full flex-row items-center justify-center rounded-[60px] py-3 bg-transparent border"
            >
              <Icon name="google" size={18} color="#333" style={{ marginRight: 8 }} />
              <Text className="text-dark-500 text-sm font-semibold text-center">Get Started With Google</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleSocialSignup('Facebook')}
              className="w-full flex-row items-center justify-center rounded-[60px] py-3 bg-transparent border mt-3"
            >
              <Icon name="facebook-square" size={18} color="#3b5998" style={{ marginRight: 8 }} />
              <Text className="text-dark-500 text-sm font-semibold text-center">Get Started With Facebook</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleSocialSignup('Twitter')}
              className="w-full flex-row items-center justify-center rounded-[60px] py-3 bg-transparent border mt-3"
            >
              <Icon name="twitter" size={18} color="#1DA1F2" style={{ marginRight: 8 }} />
              <Text className="text-dark-500 text-sm font-semibold text-center">Get Started With Twitter</Text>
            </TouchableOpacity>
          </View>
      </View>
    </Container>
  )
}

export default Signup