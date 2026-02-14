import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("📤 Attempting login with:", { email, password });
      const res = await axiosClient.post("/auth/login", { email, password });
      const { token, refreshToken } = res.data;

      console.log("✅ Login response received:", { token, refreshToken });

      if (token && refreshToken) {
        console.log("🔐 Calling login() in context with tokens...");
        await login(token, refreshToken);
        navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      } else {
        throw new Error("Token missing in login response");
      }
    } catch (err) {
      console.error("🔥 Login error:", err.message);
      Alert.alert("Login Failed", "Please check your credentials and try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} style={styles.input} />
      <TextInput placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="New? Register" onPress={() => navigation.navigate("Register")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 80 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
});

export default LoginScreen;
