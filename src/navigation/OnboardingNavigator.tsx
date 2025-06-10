import { createStackNavigator } from "@react-navigation/stack";
import { OnboardingStackParamsList } from "../navigation/types";
import OnboardingStepOne from "../screens/Onboarding/OnboardingStepOne";
import OnboardingStepTwo from "../screens/Onboarding/OnboardingStepTwo";
import OnboardingStepThree from "../screens/Onboarding/OnboardingStepThree";
const OnboardingStack = createStackNavigator<OnboardingStackParamsList>();

export default function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="OnboardingStepOne" component={OnboardingStepOne} />
      <OnboardingStack.Screen name="OnboardingStepTwo" component={OnboardingStepTwo} />
      <OnboardingStack.Screen name="OnboardingStepThree" component={OnboardingStepThree} />
    </OnboardingStack.Navigator>
  );
}
