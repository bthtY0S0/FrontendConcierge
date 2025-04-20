import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NowhereCustomer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏡 Mirage House is still under construction.</Text>
      <Text style={styles.subtitle}>This will be the future space for customer onboarding, rewards, and story arcs.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", color: "#666" },
});

export default NowhereCustomer;