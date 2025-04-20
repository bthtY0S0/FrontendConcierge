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

const Stack = createStackNavigator();

function AppNavigator() {
  const { user, logout } = useAuth();

  const getHeaderRight = (navigation) => () => (
    <Button
      title="Logout"
      onPress={() => {
        logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }}
    />
  );

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={({ navigation }) => ({
                headerRight: getHeaderRight(navigation),
              })}
            />
            {user.role === 'agent' && (
              <>
                <Stack.Screen
                  name="AgentLeadsList"
                  component={AgentLeadsListScreen}
                  options={({ navigation }) => ({
                    headerRight: getHeaderRight(navigation),
                  })}
                />
                <Stack.Screen
                  name="CreateLead"
                  component={CreateLeadScreen}
                  options={({ navigation }) => ({
                    headerRight: getHeaderRight(navigation),
                  })}
                />
              </>
            )}
            {user.role === 'admin' && (
              <Stack.Screen
                name="AdminLeads"
                component={AdminLeadsScreen}
                options={({ navigation }) => ({
                  headerRight: getHeaderRight(navigation),
                })}
              />
            )}
            {user.role === 'customer' && (
              <>
                <Stack.Screen
                  name="NowhereCustomer"
                  component={NowhereCustomer}
                  options={({ navigation }) => ({
                    headerRight: getHeaderRight(navigation),
                  })}
                />
                <Stack.Screen
                  name="NowhereLead"
                  component={NowhereLead}
                  options={({ navigation }) => ({
                    headerRight: getHeaderRight(navigation),
                  })}
                />
              </>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;