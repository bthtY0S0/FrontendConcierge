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


const AppNavigator = () => {
  const { authToken, logout, user } = useAuth();

  const screenOptionsWithHeader = ({ navigation }) => ({
    headerRight: () => (
      <Button
        title="Logout"
        onPress={() => {
          logout(); // token cleared, navigator rerenders to Login
        }}
      />
    ),
  });

  return (
    <NavigationContainer>
      <Stack.Navigator>
      
        {!authToken ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
           
            {user?.role === 'agent' && (
              <>
                
                <Stack.Screen
                  name="CreateLead"
                  component={CreateLeadScreen}
                  options={screenOptionsWithHeader}
                />
              </>
            )}
            {user?.role === 'admin' && (
  <>
 <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={screenOptionsWithHeader}
            />
    <Stack.Screen
      name="AdminLeads"
      component={AdminLeadsScreen}
      options={screenOptionsWithHeader}
    />
    <Stack.Screen
      name="AdminEditLead"
      component={AdminEditLeadScreen}
      options={{ title: "Edit Lead" }}
    />
  </>
)}
            {user?.role === 'customer' && (
              <>
                <Stack.Screen
                  name="NowhereCustomer"
                  component={NowhereCustomer}
                  options={screenOptionsWithHeader}
                />
                <Stack.Screen
                  name="NowhereLead"
                  component={NowhereLead}
                  options={screenOptionsWithHeader}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
