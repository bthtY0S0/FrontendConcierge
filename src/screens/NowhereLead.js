import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NowhereLead = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌀 Agent Mirage is not yet available.</Text>
      <Text style={styles.subtitle}>This feature will house agent tips, motivation, and milestones.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center", marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: "center", color: "#666" },
});

export default NowhereLead;
