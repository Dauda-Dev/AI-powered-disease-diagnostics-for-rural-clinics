import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '@/utils/url';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = ({ onAuthSuccess, setRoleSelected }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();
 const role = 'hospital'; // Set the role to 'hospital' for signup

  const handleSignup = async () => {
    if (email && password) {
      const response = await axios.post(`${BASE_URL}/api/v1/auth/signup`, {
        email,
        password,
        role,
      },
      {headers: { 'Content-Type': 'Application/json' }}
    );
      const { token, refresh } = response.data;
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('refreshToken', refresh);
      // onAuthSuccess();
      navigation.navigate('ProfileSetupHospital'); // Navigate to Profile Setup Screen

    } else {
      console.log('Please enter email and password');
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => setRoleSelected('onboard')}>
      <Ionicons name="close" size={28} color="#333" />
    </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('LoginHospital')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 32,
      textAlign: 'center',
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 14,
      marginBottom: 16,
      borderRadius: 8,
    },
    button: {
      backgroundColor: '#007bff',
      padding: 14,
      borderRadius: 8,
      marginBottom: 16,
    },
    buttonText: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 16,
    },
    link: {
      color: '#007bff',
      textAlign: 'center',
    },
    closeIcon: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
    },
    
  });