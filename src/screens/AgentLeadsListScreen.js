// ✅ AgentLeadsListScreen.js — displays earnings from serviced leads with safe logic and role-based background
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";
import { useIsFocused } from "@react-navigation/native";
import { getBackgroundColorForRole } from "../utils/roleStyles";

const AgentLeadsListScreen = () => {
  const { authToken, user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchLeads = async () => {
      if (!authToken || !user) return;
      try {
        const res = await axiosClient.get(`/leads/agent/${user.id}`);
        setLeads(res.data);
      } catch (err) {
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [authToken, user, isFocused]);

  if (!authToken || !user || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>⏳ Loading your leads...</Text>
      </View>
    );
  }

  const backgroundColor = getBackgroundColorForRole(user.role);
  const servicedLeads = leads.filter((lead) => lead.status === "serviced");
  const totalEarnings = servicedLeads.reduce((sum, lead) => {
    return sum + (lead.earnings ?? 0);
  }, 0);

  const renderLead = ({ item }) => (
    <View style={styles.leadItem}>
      <Text style={styles.leadCustomer}>👤 {item.customerName}</Text>
      <Text style={styles.leadRemarks}>📝 {item.remarks || "(No remarks)"}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Transaction ID: {item.transactionId || "—"}</Text>
      <Text>Amount: ${item.transactionAmount?.toFixed(2) || "0.00"}</Text>
      <Text>Earnings: ${item.earnings?.toFixed(2) || "0.00"}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Your Leads</Text>
      <Text style={styles.earningsSummary}>Total Earnings (Serviced): ${totalEarnings.toFixed(2)}</Text>

      <FlatList
        data={leads}
        renderItem={renderLead}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  earningsSummary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 16,
  },
  leadItem: {
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  leadCustomer: { fontSize: 16 },
  leadRemarks: { fontSize: 14, color: "#555", marginTop: 4 }
});

export default AgentLeadsListScreen;


