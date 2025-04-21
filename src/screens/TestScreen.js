// ✅ TestScreen.js — Barebones debug screen for web
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const TestScreen = () => {
  console.log("✅ TestScreen mounted");

  const handleTestPress = () => {
    console.log("🧪 Test button pressed");
    alert("Button works!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Test Screen</Text>
      <Button title="Press Me" onPress={handleTestPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default TestScreen;