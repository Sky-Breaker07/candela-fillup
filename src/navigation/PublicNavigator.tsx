import { createStackNavigator } from '@react-navigation/stack'

import { PublicStackParamsList } from '../navigation/types'
import LoginScreen from '../screens/LoginScreen'

const PublicStack = createStackNavigator<PublicStackParamsList>()

export default function PublicNavigator() {
  return (
    <PublicStack.Navigator screenOptions={{ headerShown: false }}>
      <PublicStack.Screen name="LoginScreen" component={LoginScreen} />
    </PublicStack.Navigator>
  )
}
