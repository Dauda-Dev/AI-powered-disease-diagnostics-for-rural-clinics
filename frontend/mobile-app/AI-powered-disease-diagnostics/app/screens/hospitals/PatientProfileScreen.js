import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function PatientProfileScreen() {
  const [section, setSection] = useState('general');

  const renderContent = () => {
    if (section === 'general') {
      return (
        <>
          <Text>Age: 32</Text>
          <Text>Gender: Female</Text>
          <Text>Phone: 09012345678</Text>
        </>
      );
    } else if (section === 'history') {
      return (
        <>
          <Text>Allergies: Penicillin</Text>
          <Text>Medications: Paracetamol</Text>
        </>
      );
    } else {
      return (
        <>
          <Text>04/01 - Patient feeling better</Text>
          <Text>04/03 - Scheduled follow-up</Text>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Patient Profile</Text>

      <View style={styles.tabs}>
        <Button title="General" onPress={() => setSection('general')} />
        <Button title="History" onPress={() => setSection('history')} />
        <Button title="Notes" onPress={() => setSection('notes')} />
      </View>

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  tabs: { flexDirection: 'row', justifyContent: 'space-around' },
  content: { marginTop: 20 },
});
