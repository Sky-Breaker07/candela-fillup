import { createStackNavigator } from "@react-navigation/stack";

import { PrivateStackParamsList } from "../navigation/types";
import DashboardScreen from "../screens/DashboardScreen";

const PrivateStack = createStackNavigator<PrivateStackParamsList>();

export default function PrivateNavigator() {
  return (
    <PrivateStack.Navigator screenOptions={{ headerShown: false }}>
      <PrivateStack.Screen name="DashboardScreen" component={DashboardScreen} />
    </PrivateStack.Navigator>
  );
}
