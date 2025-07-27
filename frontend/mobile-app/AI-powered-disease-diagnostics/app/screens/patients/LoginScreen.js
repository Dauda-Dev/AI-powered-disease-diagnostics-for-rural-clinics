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
import { BASE_URL } from '@/utils/url';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation, onAuthSuccess, setRoleSelected }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Dummy login logic - replace with API
    if (email && password) {
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
              email,
              password,
              role: 'patient', // Set the role to 'patient' for login
            },
            {headers: { 'Content-Type': 'Application/json' }}
          );
            console.log(response.data)
            const { token, refresh } = response.data;
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('refreshToken', refresh);
            onAuthSuccess(); // navigate to main screen
          } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
          }
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.closeIcon} onPress={() => setRoleSelected('onboard')}>
      <Ionicons name="close" size={28} color="#333" />
    </TouchableOpacity>
      <Text style={styles.title}>Welcome Back</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
