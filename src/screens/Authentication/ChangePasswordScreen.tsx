import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Container from "../../components/container";
import Icon from "react-native-vector-icons/AntDesign";
import { cn } from "~/src/utils";
import { validatePassword } from '~/src/utils/validation';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const passwordValidation = validatePassword(newPassword);
  const allRequirementsMet = Object.values(passwordValidation).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleChangePassword = () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!allRequirementsMet) {
      Alert.alert('Error', 'Please ensure your new password meets all requirements');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Error', 'New password and confirmation do not match');
      return;
    }

    // This is a placeholder - in a real app, we would call a Firebase function
    // to change the password after reauthenticating the user
    Alert.alert(
      'Feature Not Implemented',
      'Password change functionality requires reauthentication and will be implemented in a future update.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
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
          Change Password
        </Text>
        
        <View className="p-4">
          <Text className="text-base text-gray-600 mb-6">
            Update your password to keep your account secure.
          </Text>
          
          <Text className="text-base text-black mb-2">Current Password</Text>
          <View className="flex-row border border-gray-300 h-14 rounded-md px-4 items-center mb-4">
            <TextInput
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              className="flex-1 py-3 text-base text-black"
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Text className="text-gray-500">{showCurrentPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          
          <Text className="text-base text-black mb-2">New Password</Text>
          <View className="flex-row border border-gray-300 h-14 rounded-md px-4 items-center mb-2">
            <TextInput
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              className="flex-1 py-3 text-base text-black"
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Text className="text-gray-500">{showNewPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          
          <View className="mt-2 mb-4 space-y-1">
            <View className="flex-row items-center mb-1">
              <Icon 
                name={passwordValidation.hasLetter ? "checkcircle" : "closecircle"} 
                size={16} 
                color={passwordValidation.hasLetter ? "#4CAF50" : "#9E9E9E"} 
              />
              <Text className="text-sm ml-2">One letter (a-z)</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Icon 
                name={passwordValidation.hasNumber ? "checkcircle" : "closecircle"} 
                size={16} 
                color={passwordValidation.hasNumber ? "#4CAF50" : "#9E9E9E"} 
              />
              <Text className="text-sm ml-2">One number (0-9)</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Icon 
                name={passwordValidation.hasSpecialChar ? "checkcircle" : "closecircle"} 
                size={16} 
                color={passwordValidation.hasSpecialChar ? "#4CAF50" : "#9E9E9E"} 
              />
              <Text className="text-sm ml-2">One special character</Text>
            </View>
            <View className="flex-row items-center">
              <Icon 
                name={passwordValidation.hasMinLength ? "checkcircle" : "closecircle"} 
                size={16} 
                color={passwordValidation.hasMinLength ? "#4CAF50" : "#9E9E9E"} 
              />
              <Text className="text-sm ml-2">8 characters minimum</Text>
            </View>
          </View>
          
          <Text className="text-base text-black mb-2">Confirm New Password</Text>
          <View className="flex-row border border-gray-300 h-14 rounded-md px-4 items-center mb-2">
            <TextInput
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              className="flex-1 py-3 text-base text-black"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text className="text-gray-500">{showConfirmPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          
          {confirmPassword && !passwordsMatch && (
            <Text className="text-red-500 mb-4">Passwords do not match</Text>
          )}
          
          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={!currentPassword || !allRequirementsMet || !passwordsMatch}
            className={cn(
              "w-full flex-row items-center justify-center rounded-[60px] py-4 mt-6",
              (currentPassword && allRequirementsMet && passwordsMatch) ? "bg-primary-500" : "bg-primary-500/75"
            )}
          >
            <Text className="text-white text-base font-semibold text-center">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export default ChangePasswordScreen; 