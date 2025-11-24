// CreateLeadScreen.js (with new button for report navigation)

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

export default function CreateLeadScreen() {
  const [customerName, setCustomerName] = useState('');
  const [remarks, setRemarks] = useState('');
  const [qrValue, setQrValue] = useState('');
  const navigation = useNavigation();
  const { user, token } = useAuth();

  const handleCreateLead = async () => {
    if (!customerName) {
      Alert.alert('Missing info', 'Please enter the customer name.');
      return;
    }

    try {
      const res = await axios.post(
        'https://backend-y5mo.onrender.com/api/leads',
        { customerName, remarks },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setQrValue(res.data._id);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not create lead.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Customer Name</Text>
      <TextInput
        style={styles.input}
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Enter customer name"
      />

      <Text style={styles.label}>Remarks</Text>
      <TextInput
        style={styles.input}
        value={remarks}
        onChangeText={setRemarks}
        placeholder="Optional notes"
      />

      <Button title="Generate Lead & QR" onPress={handleCreateLead} />

      {qrValue ? (
        <View style={styles.qrContainer}>
          <Text style={styles.label}>Scan QR Code:</Text>
          <QRCode value={qrValue} size={200} />
        </View>
      ) : null}

      <Button
        title="📋 View My Leads Report"
        onPress={() => navigation.navigate('AgentLeads')}
        color="gray"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

