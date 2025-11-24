// ✅ AppNavigator.js (patched to make CreateLeadScreen default for agents)
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import CreateLeadScreen from "../screens/CreateLeadScreen";
import AgentLeadsListScreen from "../screens/AgentLeadsListScreen";
import AdminLeadsScreen from "../screens/AdminLeadsScreen";
import LeadsScreen from "../screens/LeadsScreen";
import NowhereCustomer from "../screens/NowhereCustomer";
import NowhereLead from "../screens/NowhereLead";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  const getInitialScreen = () => {
    if (!user) return "Login";
    if (user.role === "admin") return "Dashboard";
    if (user.role === "agent") return "CreateLead";
    return "NowhereCustomer";
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialScreen()}
        screenOptions={{ headerShown: true }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="CreateLead" component={CreateLeadScreen} />
        <Stack.Screen name="AgentLeads" component={AgentLeadsListScreen} />
        <Stack.Screen name="AdminLeads" component={AdminLeadsScreen} />
        <Stack.Screen name="Leads" component={LeadsScreen} />
        <Stack.Screen name="NowhereCustomer" component={NowhereCustomer} />
        <Stack.Screen name="NowhereLead" component={NowhereLead} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

