import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button } from 'react-native';
import { useAuth } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import LeadsScreen from "../screens/LeadsScreen";
import CreateLeadScreen from "../screens/CreateLeadScreen";
import AgentLeadsListScreen from "../screens/AgentLeadsListScreen";
import AdminLeadsScreen from "../screens/AdminLeadsScreen";
import NowhereCustomer from "../screens/NowhereCustomer";
import NowhereLead from "../screens/NowhereLead";
import AdminEditLeadScreen from "../screens/AdminEditLeadScreen";
import TestScreen from "../screens/TestScreen";
const Stack = createStackNavigator();


export default function AppNavigator() {
  const { user } = useAuth();

  let initialRouteName = 'Login';
  if (user) {
    if (user.role === 'admin') {
      initialRouteName = 'Dashboard';
    } else if (user.role === 'agent') {
      initialRouteName = 'CreateLead';
    }
  }


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CreateLead" component={CreateLeadScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Leads" component={LeadsScreen} />
        <Stack.Screen name="AgentLeads" component={AgentLeadsListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

