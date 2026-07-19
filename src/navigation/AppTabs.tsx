import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import AlertsScreen from "../screens/AlertsScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import { colors } from "../utils/theme";

export type AppTabsParamList = {
  Accueil: undefined;
  Historique: undefined;
  Alertes: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

const ICONS: Record<keyof AppTabsParamList, keyof typeof Ionicons.glyphMap> = {
  Accueil: "home-outline",
  Historique: "time-outline",
  Alertes: "notifications-outline",
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name as keyof AppTabsParamList]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Historique" component={HistoryScreen} />
      <Tab.Screen name="Alertes" component={AlertsScreen} />
    </Tab.Navigator>
  );
}
