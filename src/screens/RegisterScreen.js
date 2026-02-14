import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";

const RegisterScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Default stays customer
  const [role, setRole] = useState("customer");

  const handleRegister = async () => {
    try {
      const res = await axiosClient.post("/auth/register", {
        name,
        email,
        password,
        role, // ✅ now dynamic
      });

      const { token, refreshToken } = res.data;
      console.log("✅ Registration successful:", { token, refreshToken, role });

      if (token && refreshToken) {
        await login(token, refreshToken);

        // ✅ Route after register based on role (agent stays on CreateLead)
        if (role === "agent") {
          navigation.reset({ index: 0, routes: [{ name: "CreateLead" }] });
          return;
        }

        navigation.reset({ index: 0, routes: [{ name: "Landing" }] });
      } else {
        throw new Error("Token missing from registration response");
      }
    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      Alert.alert("Registration Error", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Register as {role === "agent" ? "Agent" : "Customer"}
      </Text>

      {/* ✅ Role selector (customer default) */}
      <View style={styles.roleRow}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "customer" && styles.roleButtonActive,
          ]}
          onPress={() => setRole("customer")}
        >
          <Text
            style={[
              styles.roleText,
              role === "customer" && styles.roleTextActive,
            ]}
          >
            Customer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "agent" && styles.roleButtonActive,
          ]}
          onPress={() => setRole("agent")}
        >
          <Text
            style={[
              styles.roleText,
              role === "agent" && styles.roleTextActive,
            ]}
          >
            Agent
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Nombre del Agente/Nombre del Negocio"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email o Telefono"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button title="Register" onPress={handleRegister} />

      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 80 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },

  roleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
    gap: 10,
  },
  roleButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f2f2f2",
  },
  roleButtonActive: {
    borderColor: "#333",
    backgroundColor: "#ddd",
  },
  roleText: { fontSize: 16, color: "#444" },
  roleTextActive: { color: "#111", fontWeight: "700" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
});

export default RegisterScreen;

