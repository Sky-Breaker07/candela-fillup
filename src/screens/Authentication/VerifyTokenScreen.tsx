import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign';
import Container from '~/src/components/container'
import OtpInput from '~/src/components/OTPInput';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthenticationStackParamsList } from '~/src/navigation/types';

const VerifyTokenScreen = () => {

    const { navigate } =
    useNavigation<StackNavigationProp<AuthenticationStackParamsList, 'completeProfileInformation'>>()
  const [otp, setOtp] = useState(["", "", "", ""]);
  setTimeout(() => {
    navigate('completeProfileInformation')
  }, 1000);
  return (
      <Container>
         <View className=" mt-10  px-4 py-4">
            <View className=" py-2 bg-white rounded-full">
               <Icon name="arrowleft" size={26} color="black" />
             </View>
             <Text className="text-2xl font-bold text-black mb-2 mt-5 ">Verify your email address</Text>
             <View className="py-4">
               <Text className="text-base text-gray-200 mb-1">Enter the code that was sent to your email address</Text>
               <Text className="text-base text-dark-500 mb-2">dammy@gmail.com</Text>

            <OtpInput otp={otp} setOtp={setOtp} />

            <Text className="text-base text-dark-500 mb-6">Did not receive the code?</Text>
        
          <TouchableOpacity className="w-44 flex-row items-center justify-center rounded-[60px] py-3 bg-transparent border">
           <Text className="text-dark-500 text-base font-semibold text-center mr-2">Resend Code</Text>
            
         </TouchableOpacity>
       
       
       </View>
         </View>
       </Container>
  )
}

export default VerifyTokenScreen