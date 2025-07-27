
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Modal, SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ Ensure installed
import api from '@/utils/api';
import { BASE_URL } from '@/utils/url';
import { jwtDecode } from 'jwt-decode';
import { useNavigation } from '@react-navigation/native';


export default function DashboardScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null); // ✅ For current staff user

  const navigation = useNavigation();

  const handleStartSession = (appointment) => {
    navigation.navigate('StartSessionScreen', {
      appointment,
    });
  };
  
  const statusOptions = ['All', 'Assigned to Me', 'Pending', 'Confirmed', 'Completed'];

  const filteredAppointments = appointments.filter(appt => {
    if (statusFilter === 'All') return true;
    if (statusFilter === 'Assigned to Me') return appt.assigned_staff_id === userId;
    return appt.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BASE_URL}/api/v1/hospital/appointments`);
      setAppointments(response.data.appointments || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/v1/auth/staff`);
      const filteredEmployees = response.data.staff?.filter(emp => emp.firstName) || [];
      setEmployees(filteredEmployees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };
  

  const getUserIdFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('authToken'); // Assumes user info stored
      const {user_id} = jwtDecode(userData); // Decode JWT to get user ID
      if (user_id) {
        setUserId(user_id); // Adjust key if your structure is different
      }
    } catch (err) {
      console.error('Error getting user ID:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
      fetchEmployees();
      getUserIdFromStorage();
    }, [])
  );

  const handleReschedule = async (id) => {
    const newDate = new Date().toISOString();
    try {
      await api.put(`${BASE_URL}/api/v1/hospital/appointments/${id}/reschedule`, {
        appointment_date: newDate,
      });
      fetchAppointments();
    } catch (err) {
      console.error('Reschedule failed:', err);
    }
  };

  const handleAssignPress = (id) => {
    setSelectedAppointmentId(id);
    setModalVisible(true);
  };

  const handleAssignStaff = async (staffId) => {
    try {
      console.log('Assigning staff:', staffId, 'to appointment:', selectedAppointmentId);
      await api.put(`${BASE_URL}/api/v1/hospital/appointments/${selectedAppointmentId}/assign`, {
        staff_id: staffId,
      });
      setModalVisible(false);
      fetchAppointments();
    } catch (err) {
      console.error('Assign failed:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Appointments</Text>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusOptions.map((status, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setStatusFilter(status)}
              style={[
                styles.filterButton,
                statusFilter === status && styles.activeFilterButton,
              ]}
            >
              <Text style={[
                styles.filterText,
                statusFilter === status && styles.activeFilterText,
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView>
      {filteredAppointments.map((appt) => {
        console.log('Appointment:', appt.assigned_staff_id, " ", userId);
  const staff = employees.find(e => e.id === appt.assigned_staff_id);
  const staffDisplay = staff?.firstName
    ? `${staff.firstName} ${staff.lastName || ''}`
    : staff?.email?.split('@')[0] || 'Unassigned';

  return (
    <View key={appt.id} style={styles.card}>
      <Text style={styles.name}>{appt.patient_name}</Text>
      <Text style={styles.reason}>{appt.reason}</Text>
      <Text style={styles.date}>📅 {new Date(appt.appointment_date).toDateString()}</Text>
      <Text style={styles.status}>Status: <Text style={styles.statusValue}>{appt.status}</Text></Text>
      <Text style={styles.assignedTo}>Assigned To: <Text style={styles.staffName}>{staffDisplay}</Text></Text>
      
      <View style={styles.buttonRow}>
        
        {/* <TouchableOpacity onPress={() => handleReschedule(appt.id)} style={styles.outlineButton}>
          <Text style={styles.outlineText}>Reschedule</Text>
        </TouchableOpacity> */}
        {(appt.status === 'pending') && (
        <TouchableOpacity onPress={() => handleAssignPress(appt.id)} style={styles.assignButton}>
          <Text style={styles.assignText}>Assign Staff</Text>
        </TouchableOpacity>
        )}
        {(appt.status === 'Confirmed' || appt.status === 'Started') && (appt.assigned_staff_id === userId) && (
        <TouchableOpacity
            onPress={() => handleStartSession(appt)}
            style={styles.primaryButton}
        >
            <Text style={styles.buttonText}>Start Session</Text>
        </TouchableOpacity>
)}

      </View>
    </View>
  );
})}

        {/* )} */}
      </ScrollView>

      {/* Modal for assigning staff */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.sheetTitle}>Select Staff to Assign</Text>
            <ScrollView>
              {employees.map(emp => (
                <TouchableOpacity
                  key={emp.id}
                  onPress={() => handleAssignStaff(emp.id)}
                  style={styles.staffButton}
                >
                  <Text style={styles.staffName}>
                    {emp.firstName ? `${emp.firstName} ${emp.lastName}` : emp.email}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: '#fff', textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  empty: { color: '#888' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  buttonRow: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-evenly' },
  primaryButton: { backgroundColor: '#0F52BA', padding: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  outlineButton: {
    borderColor: '#0F52BA', borderWidth: 1, padding: 10, borderRadius: 8,
  },
  outlineText: { color: '#0F52BA' },
  assignButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 8 },
  assignText: { color: '#fff', fontWeight: 'bold' },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#0F52BA',
    borderColor: '#0F52BA',
  },
  filterText: {
    color: '#333',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  staffButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  staffName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#0F52BA',
    padding: 12,
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  reason: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  status: {
    fontSize: 13,
    color: '#333',
  },
  statusValue: {
    fontWeight: 'bold',
    color: '#0F52BA',
  },
  assignedTo: {
    fontSize: 13,
    marginTop: 4,
  },
  staffName: {
    fontWeight: '600',
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#aaa',
  },
  
});
