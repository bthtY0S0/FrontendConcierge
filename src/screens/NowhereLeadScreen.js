import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NowhereLeadScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You've arrived.</Text>
      <Text style={styles.message}>
        This is the end of the path. There's nothing here. No leads. No data. Just silence.
      </Text>
      <Text style={styles.agent}>Agent Mirage was here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 28,
    color: "#ffffff",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 24,
  },
  agent: {
    marginTop: 40,
    fontStyle: "italic",
    color: "#444",
  },
});

export default NowhereLeadScreen;