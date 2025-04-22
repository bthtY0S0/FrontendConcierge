// ✅ AgentLeadsListScreen.js — scrollable, filtered, and styled per role
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axiosClient from "../utils/axiosClient";
import { useAuth } from "../context/AuthContext";
import { getBackgroundColorForRole } from "../utils/roleStyles";

const AgentLeadsListScreen = () => {
  const { authToken, user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("serviced");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authToken || !user) return;

    const fetchLeads = async () => {
      try {
        const res = await axiosClient.get(`/leads/agent/${user.id}`);
        setLeads(res.data);
      } catch (err) {
        console.error("Error fetching leads for agent:", err);
        alert("Could not load your leads.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [authToken, user]);

  if (!authToken || !user || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>⏳ Loading your leads...</Text>
      </View>
    );
  }

  const backgroundColor = getBackgroundColorForRole(user.role);

  const filtered = leads.filter((lead) => lead.status === statusFilter);

  const totalEarnings = filtered.reduce((sum, lead) => {
    if (lead.status === "serviced" && lead.earnings) {
      return sum + lead.earnings;
    }
    return sum;
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

      <View style={styles.filters}>
        <TouchableOpacity onPress={() => setStatusFilter("new")} style={styles.button}>
          <Text>🟡 New</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStatusFilter("serviced")} style={styles.button}>
          <Text>🟠 Serviced</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStatusFilter("paid")} style={styles.button}>
          <Text>🟢 Paid</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStatusFilter("retired")} style={styles.button}>
          <Text>⚫ Retired</Text>
        </TouchableOpacity>
      </View>

      {statusFilter === "serviced" && (
        <Text style={styles.earningsSummary}>
          Total Earnings (Serviced): ${totalEarnings.toFixed(2)}
        </Text>
      )}

      <FlatList
        data={filtered}
        renderItem={renderLead}
        keyExtractor={(item) => item._id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  filters: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
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
    borderColor: "#ccc",
  },
  leadCustomer: { fontSize: 16 },
  leadRemarks: { fontSize: 14, color: "#555", marginTop: 4 },
});

export default AgentLeadsListScreen;

