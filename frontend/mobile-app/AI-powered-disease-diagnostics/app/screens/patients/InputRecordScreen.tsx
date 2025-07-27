import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function InputRecordScreen() {
  const [form, setForm] = useState({ age: '', gender: '', condition: '', symptoms: '' });
  const navigation = useNavigation();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Patient Record</Text>

      {['age', 'gender', 'condition', 'symptoms'].map((field) => (
        <View key={field} style={styles.inputGroup}>
          <Text style={styles.label}>{capitalize(field)}</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter ${field}`}
            value={form[field as keyof typeof form]}
            onChangeText={(text) => handleChange(field, text)}
          />
        </View>
      ))}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => navigation.navigate('Confirmation')}
      >
        <Text style={styles.submitText}>Submit Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  submitButton: {
    backgroundColor: '#2563eb', // Blue-600
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
