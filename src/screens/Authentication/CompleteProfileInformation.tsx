import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import Container from '~/src/components/container'
import { cn } from '~/src/utils';
import { useNavigation, useRoute, RouteProp, CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AuthenticationStackParamsList } from '~/src/navigation/types';
import { AppDispatch } from '~/store';
import { firebaseAuth } from '~/src/firebase';
import { checkAuthStatus, completeOnboarding, login } from '~/store/slices/authSlice';
import authService from '~/src/utils/authService';

type FormData = {
  firstName: string;
  lastName: string;
  mobileNumber: string;
};

const CompleteProfileInformation = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<AuthenticationStackParamsList, 'completeProfileInformation'>>();
    const { email } = route.params;
    const dispatch = useDispatch<AppDispatch>();
    
    const methods = useForm<FormData>({
      defaultValues: {
        firstName: '',
        lastName: '',
        mobileNumber: '',
      },
    });

    const [countryCode, setCountryCode] = useState('+234');
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      setValue,
      handleSubmit,
      formState: { errors },
    } = methods;

    // Register inputs manually
    useEffect(() => {
      register("firstName", { required: "First name is required" });
      register("lastName", { required: "Last name is required" });
      register("mobileNumber", { required: "Mobile number is required" });
    }, [register]);

    const onSubmit = async (data: FormData) => {
        console.log("Form Data:", data);
        setIsLoading(true);
        
        try {
          // Get the current user
          const currentUser = firebaseAuth.getCurrentUser();
          
          if (!currentUser) {
            Alert.alert("Error", "You need to be logged in to complete your profile");
            return;
          }
          
          // Save user data to Firestore
          await firebaseAuth.saveUserToFirestore(currentUser, {
            firstName: data.firstName,
            lastName: data.lastName,
            mobileNumber: countryCode + data.mobileNumber,
          });
          
          // Update display name in Firebase Auth
          await firebaseAuth.updateUserProfile(`${data.firstName} ${data.lastName}`);
          
          // Get the user's ID token to use for authentication
          const token = await currentUser.getIdToken();
          
          // Store the token in AsyncStorage to ensure persistence
          await authService.storeToken(token);
          
          // Explicitly set authentication state to true in Redux
          dispatch(login(token));
          
          // Explicitly set onboarding as completed
          dispatch(completeOnboarding());
          
          // Also update the full auth state to get the user profile
          await dispatch(checkAuthStatus());
          
          // Show success message
          Alert.alert(
            "Profile Completed",
            "Your profile has been successfully updated!",
            [{ 
              text: "Continue", 
              onPress: () => {}  // Do nothing here, let Redux state change handle navigation
            }]
          );
        } catch (error: any) {
          Alert.alert("Error", error.message || "Failed to update profile");
        } finally {
          setIsLoading(false);
        }
    };
    
    const handleBack = () => {
      navigation.goBack();
    };
  
  return (
    <Container>
      <View className="mt-10 px-4 py-4">
        <TouchableOpacity onPress={handleBack} className="py-2 bg-white rounded-full w-10 items-center">
          <Icon name="arrowleft" size={26} color="black" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black mb-2 mt-5">Complete your Info</Text>
        <FormProvider {...methods}>
          <View className="py-4">
            <View className="py-2">
              <Text className="text-base text-black mb-2">First Name</Text>
              <TextInput
                placeholder="Enter your first name"
                className="border border-gray-300 rounded-md px-4 py-3 h-14 text-base"
                onChangeText={(text) => setValue("firstName", text, { shouldValidate: true })}
                keyboardType="default"
                autoCapitalize="words"
              />
              {errors.firstName?.message && (
                <Text className="text-red-500 mt-1">{String(errors.firstName.message)}</Text>
              )}
            </View>
            <View className="py-2">
              <Text className="text-base text-black mb-2">Last Name</Text>
              <TextInput
                placeholder="Enter your last name"
                className="border border-gray-300 rounded-md px-4 py-3 h-14 text-base"
                onChangeText={(text) => setValue("lastName", text, { shouldValidate: true })}
                keyboardType="default"
                autoCapitalize="words"
              />
              {errors.lastName?.message && <Text className="text-red-500 mt-1">{String(errors.lastName.message)}</Text>}
            </View>
            <View className="py-2">
              <Text className="text-base text-black mb-2">Mobile Number</Text>
              <View className="flex-row gap-2 items-center">
                <View className="border border-gray-300 rounded-md px-3 flex-row items-center justify-between h-14 w-24">
                  <Text className="text-black">{countryCode}</Text>
                  <Icon name="down" size={14} color="gray" />
                </View>

                <TextInput
                  placeholder="Enter your mobile number"
                  className="border border-gray-300 rounded-md px-4 py-3 h-14 flex-1"
                  keyboardType="phone-pad"
                  onChangeText={(text) => setValue("mobileNumber", text, { shouldValidate: true })}
                  autoCapitalize="none"
                />
              </View>
              {errors.mobileNumber?.message && (
                <Text className="text-red-500 mt-1">{String(errors.mobileNumber.message)}</Text>
              )}
            </View>
            <View className="w-full p-4 py-6 rounded-md bg-gray-100 my-6 flex-row gap-4">
              <Text className='text-xs text-dark-100'>By selecting Next, I agree to Fill Up's terms of service & Privacy Policy.</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className={cn(
              "w-full flex-row items-center justify-center rounded-[60px] py-4",
              !isLoading ? "bg-primary-500" : "bg-primary-500/75"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-base font-semibold text-center mr-2">Complete Profile</Text>
            )}
          </TouchableOpacity>
        </FormProvider>
      </View>
    </Container>
  )
}

export default CompleteProfileInformation