import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import api from '@/utils/api'; // Adjust the import based on your project structure
import { BASE_URL } from '@/utils/url';

const ProfileSetUpScreen = ({ onSetupComplete, onLogout }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('')

  const handleSaveProfile = async () => {
    if (!firstName || !lastName || !mobile) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    try {
      const response = await api.post(`${BASE_URL}/api/v1/auth/profile`, {
        firstName,
        lastName,
        mobile,
      });

      if (response.status === 200) {
        onSetupComplete();
        Alert.alert('Success', 'Profile updated successfully.');
      } else {
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while saving the profile.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>First Name:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="John"
        />

        <Text style={styles.label}>Last Name:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Doe"
          
        />

      <Text style={styles.label}>Mobile number:</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          placeholder="234812345678"
          keyboardType='phone-pad'
          
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default ProfileSetUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    color: '#888',
  },
  input: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
