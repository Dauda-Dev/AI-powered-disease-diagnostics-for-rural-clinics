import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddEmployeeModal from '../../../components/AddEmployeeModal';
import { BASE_URL } from '@/utils/url';
import api from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const EmployeeManagementScreen = ({onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const navigation = useNavigation();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await api.get(`${BASE_URL}/api/v1/auth/staff`);
      const data = await response.data;
      setEmployees(data.staff.map(emp => ({
        id: emp.id.toString(),
        name: emp.firstName ? `${emp.firstName} ${emp.lastName}` : emp.email,
        role: emp.roleName || 'Owner',
      })));
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [updateList]);

  const handleAddEmployee = async (employee) => {
    uploadToServer(employee).then(() => {
      setUpdateList(!updateList);
      Alert.alert('Success', 'Employee added successfully');
    }).catch((error) => {
      Alert.alert('Error', error.message);
    });
    setModalVisible(false);
  };

  const uploadToServer = async (employee) => {
    try {
      const response = await api.post(`${BASE_URL}/api/v1/auth/staff`, {
        firstName: employee.firstname,
        lastName: employee.lastname,
        email: employee.email,
        password: employee.password,
        mobile: employee.mobile,
        role: employee.role,
      });
      return response.data;
    } catch (error) {
      Alert.alert('Error', error.message);
      throw error;
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // or your token key
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Employee Management</Text>
        <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.employeeCard}>
              <Text style={styles.employeeName}>{item.name}</Text>
              <Text style={styles.employeeRole}>{item.role}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddEmployeeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddEmployee}
      />
    </SafeAreaView>
  );
};

export default EmployeeManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#222',
  },
  logoutButton: {
    padding: 8,
  },
  list: {
    paddingBottom: 100,
  },
  employeeCard: {
    backgroundColor: '#f8f9fb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '500',
  },
  employeeRole: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
});
