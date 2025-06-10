import { createStackNavigator } from "@react-navigation/stack";
import { AuthenticationStackParamsList } from "~/src/navigation/types";
import Signup from "../screens/Authentication/SignupScreen";
import CompleteProfileInformation from "../screens/Authentication/CompleteProfileInformation";
import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/Authentication/ForgotPasswordScreen";
import ChangePasswordScreen from "../screens/Authentication/ChangePasswordScreen";
import EmailVerificationScreen from "../screens/Authentication/EmailVerificationScreen";

const AuthenticationStack = createStackNavigator<AuthenticationStackParamsList>();

export default function AuthenticationNavigator() {
  return (
    <AuthenticationStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthenticationStack.Screen name="login" component={LoginScreen} />
      <AuthenticationStack.Screen name="signup" component={Signup} />
      <AuthenticationStack.Screen name="emailVerification" component={EmailVerificationScreen} />
      <AuthenticationStack.Screen name="completeProfileInformation" component={CompleteProfileInformation} />
      <AuthenticationStack.Screen name="forgotPassword" component={ForgotPasswordScreen} />
      <AuthenticationStack.Screen name="changePassword" component={ChangePasswordScreen} />
    </AuthenticationStack.Navigator>
  );
}
