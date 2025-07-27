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
import { BASE_URL } from '@/utils/url';
import { useNavigation } from '@react-navigation/native';
const SignupScreen = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignup = async () => {
    if (email && password) {
      const response = await axios.post(`${BASE_URL}/api/v1/auth/signup`, {
        email,
        password,
        role: 'patient', // Set the role to 'patient' for signup
      },
      {headers: { 'Content-Type': 'Application/json' }}
    );
      const { token, refresh } = response.data;
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('refreshToken', refresh);
      // onAuthSuccess();
      navigation.navigate('ProfileSetup'); // Navigate to Profile Setup Screen

    } else {
      console.log('Please enter email and password');
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  return (
    <View style={styles.container}>
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

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
  });