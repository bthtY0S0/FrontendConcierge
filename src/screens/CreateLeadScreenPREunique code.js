// ✅ CreateLeadScreen.js with role-based background color + report button + PDF report generator
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
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { getBackgroundColorForRole } from "../utils/roleStyles";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const LANDING_PAGE_URL = "https://conciergeapp.onrender.com";

const CreateLeadScreen = () => {
  const { authToken, user } = useAuth();
  const [customerName, setCustomerName] = useState("");
  const [remarks, setRemarks] = useState("");
  const [qrPayloadUrl, setQrPayloadUrl] = useState(null);
  const navigation = useNavigation();

  if (!authToken || !user) {
    return <Text style={styles.error}>⏳ Waiting for token or user...</Text>;
  }

  const backgroundColor = getBackgroundColorForRole(user.role);
  const agentId = user.id;

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
    } catch (err) {
      alert("Failed to create lead. Please try again.");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosClient.get(`/leads/agent/${user.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const leads = response.data;
      const html = `
        <html>
          <body>
            <h1>Leads Report for ${user.name}</h1>
            <ul>
              ${leads.map(
                (lead) => `
                <li>
                  <strong>${lead.customerName}</strong> — ${lead.status}<br/>
                  Remarks: ${lead.remarks || "(none)"}<br/>
                  Amount: $${lead.transactionAmount || 0} – Earnings: $${lead.earnings || 0}
                </li>`
              ).join("")}
            </ul>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (err) {
      alert("Could not generate report.");
    }
  };

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

      <View style={styles.reportButtonContainer}>
        <Button
          title="📋 View My Leads Report"
          color="gray"
          onPress={() => navigation.navigate("AgentLeads")}
        />
        <View style={{ marginTop: 12 }}>
          <Button
            title="📄 Download Report as PDF"
            color="#444"
            onPress={handleDownloadReport}
          />
        </View>
      </View>
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
  },
  qrLabel: { fontSize: 16, marginBottom: 12 },
  qrNote: { fontSize: 12, marginTop: 10, color: "#666" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  reportButtonContainer: { marginTop: 30, width: "100%" },
});

export default CreateLeadScreen;
