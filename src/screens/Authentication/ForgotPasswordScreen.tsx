import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Container from '~/src/components/container';
import { cn } from '~/src/utils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { sendPasswordReset } from '~/store/slices/authSlice';
import { isValidEmail } from '~/src/utils/validation';
import { AppDispatch } from '~/store';
import { AuthenticationStackParamsList } from '~/src/navigation/types';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<AuthenticationStackParamsList>>();
  const dispatch = useDispatch<AppDispatch>();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);
    try {
      const result = await dispatch(sendPasswordReset(email));
      
      if (sendPasswordReset.fulfilled.match(result)) {
        Alert.alert(
          'Password Reset Link Sent',
          'Please check your email for instructions to reset your password.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        // Error is handled by the reducer and will be displayed in the UI
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <View className="mt-10 px-4 py-4">
        <TouchableOpacity 
          onPress={handleBack}
          className="py-2 bg-white rounded-full w-10 items-center"
        >
          <Icon name="arrowleft" size={26} color="black" />
        </TouchableOpacity>
        
        <Text className="text-2xl font-bold text-black mb-2 mt-5">
          Reset Password
        </Text>
        
        <View className="p-4">
          <Text className="text-base text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
          
          <Text className="text-base text-black mb-2">Email Address</Text>
          <TextInput
            placeholder="example@email.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            className={`border ${emailError ? 'border-red-500' : 'border-gray-300'} h-14 rounded-md px-4 py-3 text-base text-black mb-1`}
          />
          {emailError ? <Text className="text-red-500 mb-4">{emailError}</Text> : <View className="mb-6" />}
          
          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={isLoading || !email}
            className={cn(
              "w-full flex-row items-center justify-center rounded-[60px] py-4 mt-2",
              (email && !isLoading) ? "bg-primary-500" : "bg-primary-500/75"
            )}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-base font-semibold text-center">
                Send Reset Link
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleBack}
            className="mt-6 items-center"
          >
            <Text className="text-primary-500">Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default ForgotPasswordScreen; 