import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function PostConsultationScreen() {
  const actions = [
    'Prescribe new meds',
    'Assign doctor for follow-up',
    'Schedule another consultation',
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Post Consultation</Text>
      {actions.map((action, idx) => (
        <TouchableOpacity key={idx} style={styles.card}>
          <Text>{action}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  card: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
    borderRadius: 8,
  },
});
