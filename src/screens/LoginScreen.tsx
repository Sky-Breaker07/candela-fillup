import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, BackHandler, Alert } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, googleLogin, sendPasswordReset, clearError } from "../../store/slices/authSlice";
import Container from "../components/container";
import Icon from "react-native-vector-icons/AntDesign";
import { cn } from "~/src/utils";
import { AuthenticationStackParamsList, RootStackParamsList } from "../navigation/types";
import { RootState } from "~/store";
import { isValidEmail } from "../utils/validation";
import { resetOnboarding } from "../../store/slices/authSlice";
import { useGoogleAuth } from '../utils/googleAuth';
import { AppDispatch } from "~/store";

const LoginScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const authNavigation = useNavigation<StackNavigationProp<AuthenticationStackParamsList>>();
  
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handle going back to onboarding
  const handleBackNavigation = () => {
    // Instead of using navigation.reset, we'll dispatch a Redux action to change the onboarding flag
    // This will trigger a re-render in the RootNavigator and switch to onboarding screens
    dispatch(resetOnboarding());
  };
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }
    
    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await dispatch(loginUser({ email, password }));
      
      if (loginUser.rejected.match(result)) {
        // Error is already handled in the reducer
        // and displayed through the error selector
      }
    } catch (err) {
      console.log("Login error:", err);
    }
  };

  const navigateToSignup = () => {
    authNavigation.navigate("signup");
  };

  const navigateToForgotPassword = () => {
    authNavigation.navigate("forgotPassword");
  };

  // Social login functions
  const handleSocialLogin = (provider: string) => {
    Alert.alert('Coming Soon', `${provider} authentication will be available soon.`);
  };

  const onGoogleAuthSuccess = (user: { email: string; name: string; picture: string }) => {
    dispatch(googleLogin(user));
    // Navigation to dashboard will be handled by RootNavigator based on isAuthenticated
  };
  
  const onGoogleAuthError = (error: string) => {
    console.log('Google auth error:', error);
    Alert.alert('Google Sign In Failed', error);
  };
  
  const { promptAsync } = useGoogleAuth(onGoogleAuthSuccess, onGoogleAuthError);

  // Update the onChangeText handlers to clear Redux error state
  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
    if (error) dispatch(clearError());
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (passwordError) setPasswordError("");
    if (error) dispatch(clearError());
  };

  return (
    <Container>
      <View className="mt-10 px-4 py-4">
        <TouchableOpacity 
          onPress={handleBackNavigation}
          className="py-2 bg-white rounded-full w-10 items-center"
        >
          <Icon name="arrowleft" size={26} color="black" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold text-black mb-2 mt-5">
          Login to your account
        </Text>
        
        <View className="p-4">
          {error && (
            <View className="bg-red-100 p-3 rounded-md mb-4 flex-row items-center">
              <Icon name="exclamationcircleo" size={18} color="#FF3B30" style={{ marginRight: 8 }} />
              <Text className="text-red-500 flex-1">{error}</Text>
            </View>
          )}
          
          <Text className="text-base text-black mb-2">Email Address</Text>
          <TextInput
            placeholder="example@email.com"
            value={email}
            onChangeText={handleEmailChange}
            keyboardType="email-address"
            autoCapitalize="none"
            className={`border ${emailError ? "border-red-500" : "border-gray-300"} h-14 rounded-md px-4 py-3 text-base text-black mb-1`}
          />
          {emailError ? <Text className="text-red-500 mb-2">{emailError}</Text> : <View className="mb-4" />}
          
          <Text className="text-base text-black mb-2">Password</Text>
          <View className={`flex-row border ${passwordError ? "border-red-500" : "border-gray-300"} h-14 rounded-md px-4 items-center mb-1`}>
            <TextInput
              placeholder="Enter your password"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
              className="flex-1 py-3 text-base text-black"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text className="text-gray-500">{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          {passwordError ? <Text className="text-red-500 mb-2">{passwordError}</Text> : <View className="mb-4" />}
          
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={cn(
              "w-full flex-row items-center justify-center rounded-[60px] py-4 mt-2",
              (email && password && !isLoading) ? "bg-primary-500" : "bg-primary-500/75"
            )}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-base font-semibold text-center">
                Login
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={navigateToForgotPassword}
            className="mt-4 items-center"
          >
            <Text className="text-primary-500">Forgot Password?</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4 mb-6">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text className="text-primary-500">Create New Account</Text>
            </TouchableOpacity>
          </View>

          {/* Social Login Options */}
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-2 text-gray-500">OR LOGIN WITH</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <TouchableOpacity
            onPress={() => promptAsync()}
            className="w-full flex-row items-center justify-center rounded-[60px] py-4 bg-transparent border mt-4"
          >
            <Icon name="google" size={20} color="#333" style={{ marginRight: 8 }} />
            <Text className="text-dark-500 text-base font-semibold text-center">Login with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialLogin('Facebook')}
            className="w-full flex-row items-center justify-center rounded-[60px] py-4 bg-transparent border mt-4"
          >
            <Icon name="facebook-square" size={20} color="#3b5998" style={{ marginRight: 8 }} />
            <Text className="text-dark-500 text-base font-semibold text-center">Login with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialLogin('Twitter')}
            className="w-full flex-row items-center justify-center rounded-[60px] py-4 bg-transparent border mt-4"
          >
            <Icon name="twitter" size={20} color="#1DA1F2" style={{ marginRight: 8 }} />
            <Text className="text-dark-500 text-base font-semibold text-center">Login with Twitter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default LoginScreen;
