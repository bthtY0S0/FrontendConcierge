// ✅ AgentLeadsListScreen.js — filter by status + earnings only on serviced + scroll support + role-based background
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../utils/axiosClient";
import { useNavigation } from "@react-navigation/native";
import { getBackgroundColorForRole } from "../utils/roleStyles";

const AgentLeadsListScreen = () => {
  const { authToken, user } = useAuth();
  const navigation = useNavigation();
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
        console.error("Error fetching agent leads:", err);
        alert("Could not load leads.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [authToken, user]);

  const backgroundColor = getBackgroundColorForRole(user?.role);

  const filteredLeads = leads.filter((lead) => lead.status === statusFilter);

  const earnings = filteredLeads.reduce((sum, lead) => {
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

  if (!authToken || !user || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>⏳ Loading agent leads...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
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
          Total Earnings (Serviced): ${earnings.toFixed(2)}
        </Text>
      )}

      <FlatList
        data={filteredLeads}
        renderItem={renderLead}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </ScrollView>
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
