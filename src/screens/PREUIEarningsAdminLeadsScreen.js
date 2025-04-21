// ✅ AdminLeadsScreen.js — full version with agent filter, status filter, and earnings total with role-based background color
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
import { useNavigation } from "@react-navigation/native";
import { getBackgroundColorForRole } from "../utils/roleStyles";

const AdminLeadsScreen = () => {
  const { authToken, user } = useAuth();
  const navigation = useNavigation();
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("serviced");
  const [agentFilter, setAgentFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authToken || !user) return;

    const fetchLeads = async () => {
      try {
        const res = await axiosClient.get("/leads");
        setLeads(res.data);
      } catch (err) {
        console.error("Error fetching leads:", err);
        alert("Could not load leads.");
      }
    };

    const fetchAgents = async () => {
      try {
        const res = await axiosClient.get("/users/agents");
        setAgents(res.data);
      } catch (err) {
        console.error("Error fetching leads/agents:", err);
        alert("Could not load agents.");
      }
    };

    fetchLeads();
    fetchAgents();
    setLoading(false);
  }, [authToken, user]);

  if (!authToken || !user || loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>⏳ Loading admin leads...</Text>
      </View>
    );
  }

  const backgroundColor = getBackgroundColorForRole(user.role);

  const filtered = leads.filter((lead) => {
    const matchesStatus = lead.status === statusFilter;
    const matchesAgent = agentFilter ? lead.agentId?._id === agentFilter : true;
    return matchesStatus && matchesAgent;
  });

  const totalEarnings = filtered.reduce((sum, lead) => {
    return sum + (lead.earnings ?? 0);
  }, 0);

  const renderLead = ({ item }) => (
    <TouchableOpacity
      style={styles.leadItem}
      onPress={() => navigation.navigate("AdminEditLead", { lead: item })}
    >
      <Text style={styles.leadCustomer}>👤 {item.customerName}</Text>
      <Text style={styles.leadRemarks}>📝 {item.remarks || "(No remarks)"}</Text>
      <Text>Agent: {item.agentId?.name || "Unknown"}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Transaction ID: {item.transactionId || "—"}</Text>
      <Text>Amount: ${item.transactionAmount?.toFixed(2) || "0.00"}</Text>
      <Text>Earnings: ${item.earnings?.toFixed(2) || "0.00"}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Admin Lead Viewer</Text>
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

      <Picker
        selectedValue={agentFilter}
        onValueChange={(value) => setAgentFilter(value)}
        style={styles.picker}
      >
        <Picker.Item label="All Agents" value="" />
        {agents.map((agent) => (
          <Picker.Item key={agent._id} label={agent.name} value={agent._id} />
        ))}
      </Picker>

      <Text style={styles.earningsSummary}>
        Total Earnings (Serviced): ${totalEarnings.toFixed(2)}
      </Text>

      <FlatList
        data={filtered}
        renderItem={renderLead}
        keyExtractor={(item) => item._id}
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
  picker: {
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
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

export default AdminLeadsScreen;



