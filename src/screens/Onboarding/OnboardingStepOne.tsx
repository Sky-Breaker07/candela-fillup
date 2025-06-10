import React from 'react'
import { Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import OnboardingStepOneImage from '../../../assets/images/onboarding_one.png'
import Icon from 'react-native-vector-icons/AntDesign';
import Container from '../../components/container'
import OnboardingIndicator from './OnboardingIndicator'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamsList } from '../../navigation/types';

const OnboardingStepOne = () => {
    const { width, height } = useWindowDimensions();
    const { navigate } =
    useNavigation<StackNavigationProp<OnboardingStackParamsList, 'OnboardingStepTwo'>>()
  return (
    <Container>
        <View className="flex-1 bg-white">
          <View className="flex-1">
            <Image
              source={OnboardingStepOneImage}
              style={{ width: width, height: height * 0.55 }}
              resizeMode="cover"
            />
          </View>
          <View className="items-center justify-center p-5 px-8 rounded-t-3xl bg-white">
            <Text className="text-2xl font-bold text-black mb-2 text-center">
              Find Fuel Stations Near You
            </Text>
            <Text className="text-base text-black text-center mb-5">
              Easily locate the nearest fuel station based on your location, preferences, and station services.
            </Text>
            <View className="my-3">
                  <OnboardingIndicator currentIndex={0} /> 
            </View>
          
            <TouchableOpacity
              onPress={() => navigate('OnboardingStepTwo')}
              className="w-full flex-row items-center justify-center rounded-[60px] py-4 bg-primary-500 mt-2"
            >
              <Text className="text-white text-base font-semibold text-center mr-2">continue</Text>
              <View className="ml-4 p-3 bg-white rounded-full">
                <Icon name="arrowright" size={20} color="#E85C2A" />
              </View>
            </TouchableOpacity>
          </View>
        </View> 
    </Container>
  )
}

export default OnboardingStepOne    