import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axiosClient.post("/auth/login", { email, password });
      const { token, refreshToken } = res.data;

      console.log("✅ Login response received:");
      console.log("Token:", token);
      console.log("Refresh Token:", refreshToken);

      if (token && refreshToken) {
        await login(token, refreshToken);
        console.log("🔐 Calling navigation.reset...");
        navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      } else {
        console.error("❌ Missing tokens in login response");
      }
    } catch (err) {
      console.error("🔥 Login failed:", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Login" onPress={handleLogin} />
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
