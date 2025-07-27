import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@/utils/url';

export default function AuthScreen({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async () => {
    const endpoint = isLogin ? '/login' : '/signup';
    
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/auth${endpoint}`, {
        email,
        password,
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={isLogin ? 'Login' : 'Sign Up'} onPress={handleSubmit} />
      <Text onPress={toggleMode} style={styles.toggle}>
        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 100 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  toggle: { color: '#113DEE', marginTop: 10, textAlign: 'center' },
});
