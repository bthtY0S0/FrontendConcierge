import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { getBackgroundColorForRole } from "../utils/roleStyles";

const LANDING_PAGE_URL = "https://conciergeapp.onrender.com";

const CreateLeadScreen = () => {
  const { authToken, user } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [qrPayloadUrl, setQrPayloadUrl] = useState(null);
  const [leadCode, setLeadCode] = useState("");

  if (!authToken || !user) {
    console.log("⏳ Waiting for authToken or user...");
    return <Text style={styles.error}>⏳ Waiting for token or user...</Text>;
  }

  const backgroundColor = getBackgroundColorForRole(user.role);
  const agentId = user.id;

  const generate4DigitCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("🔢 Generated Lead Code:", code);
    return code;
  };

  const handleCreateLead = async () => {
    if (!customerName.trim()) {
      alert("Customer name is required");
      return;
    }

    const code = generate4DigitCode();
    const fullRemarks = `${code} — ${remarks}`;
    console.log("📝 Full Remarks:", fullRemarks);

    const leadPayload = {
      agentId,
      customerName,
      remarks: fullRemarks,
      status: "new",
    };

    console.log("📦 Sending lead payload:", leadPayload);

    try {
      const res = await axiosClient.post("/leads", leadPayload);
      const newLead = res.data;
      const url = `${LANDING_PAGE_URL}/?agentId=${agentId}&leadId=${newLead._id}`;

      console.log("✅ Lead created successfully:", newLead);
      console.log("🔗 QR Payload URL:", url);

      setLeadCode(code);
      setQrPayloadUrl(url);
      setCustomerName("");
      setRemarks("");
    } catch (err) {
      console.error("❌ Lead creation failed:", err.response?.data || err.message);
      alert("Failed to create lead. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Create a New Lead</Text>

      <TextInput
        placeholder="Customer Name"
        value={customerName}
        onChangeText={(text) => {
          setCustomerName(text);
          setLeadCode(""); // reset code if input changes
        }}
        style={styles.input}
      />

      <TextInput
        placeholder="Remarks / Notes"
        value={remarks}
        onChangeText={(text) => {
          setRemarks(text);
          setLeadCode(""); // reset code if input changes
        }}
        style={styles.input}
      />

      <Button title="Create Lead & Generate QR *****" onPress={handleCreateLead} />

      {qrPayloadUrl && (
        <View style={styles.qrContainer}>
          <Text style={styles.leadCode}>Lead Code: {leadCode}</Text>
          <Text style={styles.qrLabel}>Customer, please scan this:</Text>
          <QRCode value={qrPayloadUrl} size={220} />
          <Text style={styles.qrNote}>This QR links to the app install page</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 20, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 12,
    width: "100%",
    borderRadius: 5,
  },
  qrContainer: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  qrLabel: { fontSize: 16, marginBottom: 12 },
  qrNote: { fontSize: 12, marginTop: 10, color: "#666" },
  leadCode: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  error: { color: "red", textAlign: "center", marginTop: 20 },
});

export default CreateLeadScreen;

