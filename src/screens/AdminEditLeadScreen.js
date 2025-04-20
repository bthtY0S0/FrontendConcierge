// ✅ AdminEditLeadScreen.js — Editable Form for Admins
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button, Alert } from "react-native";
import axiosClient from "../utils/axiosClient";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

const AdminEditLeadScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { lead } = route.params;

  const [customerName, setCustomerName] = useState(lead.customerName);
  const [remarks, setRemarks] = useState(lead.remarks);
  const [status, setStatus] = useState(lead.status);
  const [transactionId, setTransactionId] = useState(lead.transactionId || "");
  const [transactionAmount, setTransactionAmount] = useState(String(lead.transactionAmount || ""));

  const handleSubmit = async () => {
    const payload = {
      customerName,
      remarks,
      status,
      transactionId,
      transactionAmount: parseFloat(transactionAmount)
    };

    // Calculate earnings only if status is 'serviced' and transactionAmount is valid
    if (status === "serviced" && !isNaN(payload.transactionAmount)) {
      payload.earnings = lead.agentId?.commissionRate
        ? parseFloat((lead.agentId.commissionRate * payload.transactionAmount).toFixed(2))
        : 0;
    }

    try {
      await axiosClient.put(`/leads/${lead._id}`, payload);
      Alert.alert("Success", "Lead updated successfully");
      navigation.goBack();
    } catch (err) {
      console.error("❌ Update failed:", err);
      Alert.alert("Error", "Failed to update lead");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Lead</Text>

      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
      />

      <TextInput
        style={styles.input}
        placeholder="Remarks"
        value={remarks}
        onChangeText={setRemarks}
      />

      <Picker
        selectedValue={status}
        style={styles.input}
        onValueChange={(value) => setStatus(value)}>
        <Picker.Item label="New" value="new" />
        <Picker.Item label="Serviced" value="serviced" />
        <Picker.Item label="Paid" value="paid" />
        <Picker.Item label="Retired" value="retired" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Transaction ID"
        value={transactionId}
        onChangeText={setTransactionId}
      />

      <TextInput
        style={styles.input}
        placeholder="Transaction Amount ($)"
        value={transactionAmount}
        onChangeText={setTransactionAmount}
        keyboardType="numeric"
      />

      <Button title="✅ Commit Changes" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 16,
    borderRadius: 6,
  },
});

export default AdminEditLeadScreen;
