import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  ActivityIndicator, Modal, Pressable,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/api';
import { BASE_URL } from '@/utils/url';

export default function AppointmentScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const pollingInterval = useRef(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const token = await AsyncStorage.getItem('authToken');
          if (!token) return;

          const { user_id } = jwtDecode(token);

          const [userRes, apptRes] = await Promise.all([
            api.get(`${BASE_URL}/api/v1/auth/profile`),
            api.get(`${BASE_URL}/api/v1/hospital/appointments?patientId=${user_id}`),
          ]);

          setUser(userRes.data);
          setAppointments(apptRes.data.appointments);
        } catch (error) {
          console.error('Error fetching data', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      };
    }, [])
  );

  const processAIRecommendations = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const { user_id } = jwtDecode(token);

      const response = await api.post(`${BASE_URL}/api/v1/hospital/appointments/process-ai-recommendations`, {
        user_id,
      });

      if (response.data && response.data.results) {
        console.log('AI Recommendations:', response.data.results.recommendation);
        const newRecommendations = response.data.results;

        setAppointments((prevAppointments) =>
          prevAppointments.map((appt) => {
            const rec = newRecommendations.find((r) => r.appointment_id === appt.id);
            if (rec) {
              return { ...appt, ai_recommendation: rec.recommendation };
            }
            return appt;
          })
        );
      }
    } catch (error) {
      console.error('Error processing AI recommendations:', error);
    }
  };

  useEffect(() => {
    pollingInterval.current = setInterval(() => {
      processAIRecommendations();
    }, 10000);

    return () => clearInterval(pollingInterval.current);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0F52BA" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hello, {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Guest'} 👋
          </Text>
          <Text style={styles.today}>{new Date().toDateString()}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('HospitalSelection')}
        >
          <Text style={styles.addButtonText}>+ Appointment</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
        {appointments.length === 0 ? (
          <Text style={styles.sectionNote}>No upcoming appointments.</Text>
        ) : (
          appointments.map((appt, idx) => (
            <View key={idx} style={styles.reminderCard}>
              <Image
                source={{ uri: appt.doctorImage || 'https://via.placeholder.com/64' }}
                style={styles.doctorImage}
              />
              <View style={styles.reminderInfo}>
                <Text style={styles.doctorName}>{appt.hospital_name}</Text>
                <Text style={styles.specialty}>{appt.hospital_address}</Text>
                <View style={styles.timeRow}>
                  <Text>📅 {formatDate(appt.appointment_date)}</Text>
                  <Text>🕐 {formatTime(appt.appointment_date)}</Text>
                </View>

                {appt.ai_recommendation && (
                  <TouchableOpacity
                    style={styles.viewRecButton}
                    onPress={() => setSelectedRecommendation(appt.ai_recommendation)}
                  >
                    <Text style={styles.viewRecButtonText}>💡 View AI Recommendation</Text>
                  </TouchableOpacity>
                )}
                {appt.status === 'pending' &&(
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.outlineButton}>
                    <Text style={styles.outlineButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Modal for AI Recommendation */}
      <Modal
        visible={selectedRecommendation !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedRecommendation(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>💡 AI Recommendation</Text>
            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalText}>{selectedRecommendation}</Text>
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={() => setSelectedRecommendation(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 50,
  },
  greeting: { fontSize: 20, fontWeight: 'bold' },
  today: { color: '#aaa', fontSize: 14 },
  addButton: { backgroundColor: '#0F52BA', padding: 10, borderRadius: 20 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },

  section: { marginTop: 30 },
  sectionTitle: { fontWeight: 'bold', fontSize: 16 },
  sectionNote: { color: '#999', marginTop: 5 },

  reminderCard: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 15,
  },
  doctorImage: { width: 64, height: 64, borderRadius: 32 },
  reminderInfo: { flex: 1, marginLeft: 15 },
  doctorName: { fontWeight: 'bold', fontSize: 16 },
  specialty: { color: '#555' },
  timeRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,
  },
  primaryButton: {
    backgroundColor: '#0F52BA', padding: 10, borderRadius: 8, flex: 1, marginRight: 10,
  },
  primaryButtonText: { color: '#fff', textAlign: 'center' },
  outlineButton: {
    borderColor: '#0F52BA', borderWidth: 1, padding: 10, borderRadius: 8, flex: 1,
  },
  outlineButtonText: { color: '#0F52BA', textAlign: 'center' },
  loaderContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },

  viewRecButton: {
    backgroundColor: '#e7f0fe',
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  viewRecButtonText: {
    color: '#0F52BA',
    fontWeight: '600',
    textAlign: 'center',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F52BA',
    marginBottom: 10,
  },
  modalContent: {
    maxHeight: 300,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#0F52BA',
    padding: 12,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
