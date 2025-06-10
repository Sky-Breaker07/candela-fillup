import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  PublicStackParamsList,
  RootStackParamsList,
} from "./types";
import { PropsWithChildren, useState } from "react";
import { Text } from "react-native";
import PublicNavigator from "./PublicNavigator";
import PrivateNavigator from "./PrivateNavigator";
import { useSelector } from "react-redux";
import { RootState } from "~/store";
import OnboardingNavigator from "./OnboardingNavigator";
import AuthenticationNavigator from "./AuthenticationNavigator";

const Root = createStackNavigator<
  RootStackParamsList & PublicStackParamsList
>();

const NavigationWrapper = ({ children }: PropsWithChildren) => {
  return (
    <SafeAreaProvider>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {children}
      </Root.Navigator>
    </SafeAreaProvider>
  );
};

const RootNavigator = () => {
  const [appLoaded, setAppLoaded] = useState(true);

  const {isAuthenticated, isOnboarded} = useSelector(
    (state: RootState) => state.auth
  );
  console.log({ isAuthenticated, isOnboarded });

  if (!appLoaded) {
    return <Text>Loading...</Text>;
  }

  if(!isAuthenticated && !isOnboarded) {
    return (
      <NavigationWrapper>
        <Root.Screen name="Onboarding" component={OnboardingNavigator} />
      </NavigationWrapper>
    );
  }

  if(!isAuthenticated && isOnboarded) {
    return (
      <NavigationWrapper>
        <Root.Screen name="Authentication" component={AuthenticationNavigator} />
      </NavigationWrapper>
    );
  }

  if (isAuthenticated) {
    return (
      <NavigationWrapper>
        <Root.Screen name="Private" component={PrivateNavigator} />
      </NavigationWrapper>
    );
  }

  // Fallback to public routes (should not reach here with the current logic)
  return (
    <NavigationWrapper>
      <Root.Screen name="Public" component={PublicNavigator} />
    </NavigationWrapper>
  );
};

export default RootNavigator;
