// AppNavigator.js (rewritten for role-based initial routing)

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import CreateLeadScreen from './CreateLeadScreen';
import DashboardScreen from './DashboardScreen';
import LeadsScreen from './LeadsScreen';
import AgentLeadsListScreen from './AgentLeadsListScreen';
import { useAuth } from './AuthContext';

const Stack = createNativeStackNavigator();

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

