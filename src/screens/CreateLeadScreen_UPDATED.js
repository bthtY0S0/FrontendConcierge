// ✅ CreateLeadScreen.js with embedded lead list by status (serviced, new, paid, retired)
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { getBackgroundColorForRole } from "../utils/roleStyles";

const LANDING_PAGE_URL = "https://conciergeapp.onrender.com";

const CreateLeadScreen = () => {
  const { authToken, user } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [qrPayloadUrl, setQrPayloadUrl] = useState(null);
  const [leads, setLeads] = useState([]);

  const agentId = user?.id;
  const backgroundColor = getBackgroundColorForRole(user?.role || "agent");

  const fetchLeads = async () => {
    try {
      const res = await axiosClient.get(`/leads/agent/${agentId}`);
      setLeads(res.data);
    } catch (err) {
      console.error("Error fetching leads for agent:", err);
    }
  };

  useEffect(() => {
    if (authToken && user) {
      fetchLeads();
    }
  }, [authToken, user]);

  const handleCreateLead = async () => {
    if (!customerName.trim()) return alert("Customer name is required");

    const leadPayload = {
      agentId,
      customerName,
      remarks,
      status: "new",
    };

    try {
      const res = await axiosClient.post("/leads", leadPayload);
      setQrPayloadUrl(LANDING_PAGE_URL);
      setCustomerName("");
      setRemarks("");
      fetchLeads(); // Refresh the leads list
    } catch (err) {
      console.error("❌ Lead creation failed:", err.response?.data || err.message);
      alert("Failed to create lead. Please try again.");
    }
  };

  const renderLeadSection = (status, colorLabel) => {
    const sectionLeads = leads.filter((lead) => lead.status === status);
    const totalEarnings =
      status === "serviced"
        ? sectionLeads.reduce((sum, lead) => sum + (lead.earnings || 0), 0)
        : null;

    return (
      <View style={styles.leadSection}>
        <Text style={[styles.sectionTitle, { color: colorLabel }]}>
          {status.toUpperCase()}
        </Text>
        {status === "serviced" && (
          <Text style={styles.earningsText}>
            Total Earnings: ${totalEarnings.toFixed(2)}
          </Text>
        )}
        {sectionLeads.map((lead) => (
          <View key={lead._id} style={styles.leadItem}>
            <Text style={styles.leadCustomer}>👤 {lead.customerName}</Text>
            <Text>📝 {lead.remarks || "(No remarks)"}</Text>
            <Text>💵 ${lead.transactionAmount?.toFixed(2) || "0.00"}</Text>
            <Text>📌 {lead.status}</Text>
          </View>
        ))}
      </View>
    );
  };

  if (!authToken || !user) {
    return <Text style={styles.error}>⏳ Waiting for token or user...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
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
          <Text style={styles.qrLabel}>Hi, please scan this:</Text>
          <QRCode value={qrPayloadUrl} size={220} />
          <Text style={styles.qrNote}>This QR links to the login page</Text>
        </View>
      )}

      {/* Always visible leads grouped by status */}
      {renderLeadSection("serviced", "red")}
      {renderLeadSection("new", "blue")}
      {renderLeadSection("paid", "orange")}
      {renderLeadSection("retired", "gray")}
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
  error: { color: "red", textAlign: "center", marginTop: 20 },
  leadSection: {
    marginTop: 30,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  leadItem: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  leadCustomer: { fontWeight: "600" },
  earningsText: {
    fontSize: 14,
    marginBottom: 10,
    color: "#2c3e50",
    textAlign: "center",
  },
});

export default CreateLeadScreen;
