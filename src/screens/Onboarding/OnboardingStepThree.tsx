import React from 'react'
import { Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import OnboardingStepThreeImage from '../../../assets/images/onboarding_three.png'
import Icon from 'react-native-vector-icons/AntDesign';
import Container from '../../components/container'
import OnboardingIndicator from './OnboardingIndicator'
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingStackParamsList } from '../../navigation/types';
import { useDispatch } from 'react-redux';
import { completeOnboarding } from '../../../store/slices/authSlice';

const OnboardingStepThree = () => {
    const { width, height } = useWindowDimensions();
    const { navigate } =
    useNavigation<StackNavigationProp<OnboardingStackParamsList, 'OnboardingStepThree'>>()
    const dispatch = useDispatch()
  return (
    <Container>
        <View className="flex-1 bg-white">
          <View className="flex-1">
            <Image
              source={OnboardingStepThreeImage}
              style={{ width: width, height: height * 0.55 }}
              resizeMode="cover"
            />
          </View>
          <View className="items-center justify-center p-5 px-8 rounded-t-3xl bg-white">
            <Text className="text-2xl font-bold text-black mb-2 text-center">
              Check Fuel Availability Instantly
            </Text>
            <Text className="text-base text-black text-center mb-5">
            Avoid the queues. Know which stations have fuel before heading out.
            </Text>
            <View className="my-3">
                  <OnboardingIndicator currentIndex={2} /> 
            </View>
          
            <TouchableOpacity
              onPress={() => dispatch(completeOnboarding())}
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

export default OnboardingStepThree    