import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axiosClient.post("/auth/register", {
        name,
        email,
        password,
        role: "customer",
      });

      const { token, refreshToken } = res.data;
      console.log("✅ Registration successful:", { token, refreshToken });

      if (token && refreshToken) {
        await login(token, refreshToken);
        navigation.reset({ index: 0, routes: [{ name: "Dashboard" }] });
      } else {
        throw new Error("Token missing from registration response");
      }
    } catch (err) {
      console.error("❌ Registration failed:", err.message);
      Alert.alert("Registration Error", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register as Customer</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Register" onPress={handleRegister} />
      <Button title="Already have an account? Login" onPress={() => navigation.navigate("Login")} />
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

export default RegisterScreen;
