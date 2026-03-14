import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from "react-native";
import QRCode from "react-native-qrcode-svg";
import axios from "axios";
import jwtDecode from "jwt-decode";

const BASE_URL = "https://backend-y5mo.onrender.com";
const LANDING_PAGE_URL = "https://leads.concierge-now.com";

const LeadsScreen = ({ route }) => {
  const token = route.params?.token;

  // Decode token to get real agent ID
  let agentId = null;
  try {
    const decoded = jwtDecode(token);
    agentId = decoded.id;
  } catch (err) {
    console.error("Invalid or missing token", err);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Invalid token. Please log in again.</Text>
      </View>
    );
  }

  const [customerName, setCustomerName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [qrPayloadUrl, setQrPayloadUrl] = useState(null);
  const [lastLeadId, setLastLeadId] = useState(null);

  const handleCreateLead = async () => {
    if (!customerName.trim()) return alert("Customer name is required");

    const leadPayload = {
      agentId,
      customerName,
      remarks,
    };

    console.log("🧾 Sending lead:", leadPayload);

    try {
      const res = await axios.post(`${BASE_URL}/api/leads`, leadPayload);

      const newLead = res.data;
      setLastLeadId(newLead._id);

      const url = `${LANDING_PAGE_URL}/?agentId=${agentId}&leadId=${newLead._id}`;
      setQrPayloadUrl(url);

      setCustomerName("");
      setRemarks("");
    } catch (err) {
      console.error("❌ Lead creation failed:", err.response?.data || err.message);
      alert("Failed to create lead. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create a New Lead</Text>

      <TextInput
        placeholder="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
        style={styles.input}
      />

      <TextInput
        placeholder="Remarks / Notes"
        value={remarks}
        onChangeText={setRemarks}
        style={styles.input}
      />

      <Button title="Create Lead & Generate QR" onPress={handleCreateLead} />

      {qrPayloadUrl && (
        <View style={styles.qrContainer}>
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
});

export default LeadsScreen;
