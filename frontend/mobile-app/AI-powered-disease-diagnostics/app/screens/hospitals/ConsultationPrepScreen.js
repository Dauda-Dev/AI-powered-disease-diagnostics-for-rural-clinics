import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';

const prepTasks = [
  'Review patient details',
  'Prepare medical tools',
  'Check medical history',
];

export default function ConsultationPrepScreen() {
  const [checkedItems, setCheckedItems] = useState(Array(prepTasks.length).fill(false));

  const toggleCheck = (index) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Prepare for Consultation</Text>
      {prepTasks.map((task, index) => (
        <View style={styles.row} key={index}>
          <Checkbox
            status={checkedItems[index] ? 'checked' : 'unchecked'}
            onPress={() => toggleCheck(index)}
          />
          <Text>{task}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
});
