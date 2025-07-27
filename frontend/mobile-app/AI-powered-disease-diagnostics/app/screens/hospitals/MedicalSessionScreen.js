import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { BASE_URL } from '@/utils/url';
import api from '@/utils/api';

export default function SessionScreen({ route, navigation }) {
  const { appointment } = route.params;

  const [consultationNotes, setConsultationNotes] = useState('');
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  const fetchMedicalHistory = async () => {
    // try {
    //   setLoading(true);
    //   const response = await axios.get(
    //     `https://your-api.com/api/patients/${appointment.patient_id}/medical-history`
    //   );
    //   setMedicalHistory(response.data);
    // } catch (error) {
    //   console.error('Error fetching medical history:', error);
    //   Alert.alert('Error', 'Unable to load medical history.');
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleSubmit = async () => {
    try {
        if(consultationNotes.trim()) {
      await api.put(`${BASE_URL}/api/v1/hospital/appointments/${appointment.id}/complete`, {
        notes: consultationNotes,
      });
      Alert.alert("Success", "Consultation notes saved successfully!");
      setConsultationNotes('');
      navigation.goBack();
    }
    } catch (error) {
      console.error('Error saving notes:', error);
      Alert.alert("Error", "Failed to save consultation notes.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Consultation Session</Text>

      {/* Patient Info Header */}
      <View style={styles.headerCard}>
        <Image
          source={require('../../../assets/images/heart-logo.png')}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.patientName}>{appointment.patient_name}</Text>
          <Text style={styles.patientDetail}>
            {new Date(appointment.appointment_date).toLocaleString()}
          </Text>
          <Text style={styles.patientDetail}>Reason: {appointment.reason}</Text>
        </View>
      </View>

      {/* Medical History Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Medical History</Text>
        {loading ? (
          <Text style={styles.loading}>Loading history...</Text>
        ) : medicalHistory && medicalHistory.length > 0 ? (
          medicalHistory.map((entry, idx) => (
            <View key={idx} style={styles.historyItem}>
              <Text style={styles.historyCondition}>{entry.condition}</Text>
              <Text style={styles.historyDate}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.loading}>No medical history found.</Text>
        )}
      </View>

      {/* Notes Input Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Consultation Notes</Text>
        <TextInput
          multiline
          placeholder="Type your consultation notes here..."
          style={styles.notesInput}
          value={consultationNotes}
          onChangeText={setConsultationNotes}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>💾 Save Notes</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.endSessionButton} onPress={() => navigation.goBack()}>
        <Text style={styles.endSessionText}>🚪 End Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f7fc',
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F52BA',
    marginBottom: 20,
  },
  headerCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#ddd',
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  patientDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F52BA',
    marginBottom: 10,
  },
  historyItem: {
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  historyCondition: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  historyDate: {
    fontSize: 13,
    color: '#888',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 15,
    marginTop: 8,
  },
  saveButton: {
    marginTop: 14,
    backgroundColor: '#0F52BA',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  endSessionButton: {
    marginTop: 20,
    backgroundColor: '#dc3545',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  endSessionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  loading: {
    fontStyle: 'italic',
    color: '#999',
    paddingTop: 6,
  },
});
