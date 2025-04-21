// ✅ DashboardScreen.js with role-based background color
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getBackgroundColorForRole } from "../utils/roleStyles";

const DashboardScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  if (!user) {
    return (
      <View style={styles.container}> 
        <Text>⏳ Loading your dashboard...</Text>
      </View>
    );
  }

  const backgroundColor = getBackgroundColorForRole(user.role);

  return (
    <View style={[styles.container, { backgroundColor }]}> 
      <Text style={styles.title}>Welcome, {user.name}!</Text>
      <Text style={styles.subtitle}>Role: {user.role}</Text>

      {user.role === "admin" && (
        <>
          <Button
            title="📋 View All Agent Leads"
            onPress={() => navigation.navigate("AdminLeads")}
          />
          <Button
            title="🧞 Summon Page"
            onPress={() => navigation.navigate("NowhereLead")}
          />
        </>
      )}

      {user.role === "agent" && (
        <>
          <Button
            title="📋 My Leads"
            onPress={() => navigation.navigate("AgentLeads")}
          />
          <Button
            title="➕ Create New Lead"
            onPress={() => navigation.navigate("CreateLead")}
          />
          <Button
            title="🧭 Nowhere Page"
            onPress={() => navigation.navigate("NowhereLead")}
          />
        </>
      )}

      {user.role === "customer" && (
        <Button
          title="🌐 Visit Our Website"
          onPress={() => Linking.openURL("https://example.com")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default DashboardScreen;
