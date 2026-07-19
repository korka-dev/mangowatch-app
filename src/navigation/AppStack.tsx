import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import ParcellesScreen from "../screens/ParcellesScreen";
import { colors } from "../utils/theme";
import AppTabs from "./AppTabs";

export type AppStackParamList = {
  Tabs: undefined;
  Parcelles: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: { fontWeight: "700" },
      }}
    >
      <Stack.Screen name="Tabs" component={AppTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Parcelles" component={ParcellesScreen} options={{ title: "Mes parcelles" }} />
    </Stack.Navigator>
  );
}
