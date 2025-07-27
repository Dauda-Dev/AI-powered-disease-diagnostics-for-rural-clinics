import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { useRoute } from '@react-navigation/native';
import api from '@/utils/api';
import { BASE_URL } from '@/utils/url';


export default function BookAppointmentScreen() {
  const route = useRoute();
  const { hospital } = route.params;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultType, setConsultType] = useState('Online');
  const navigation = useNavigation();


  const timeSlots = ['10:30 AM', '12:45 PM', '2:30 PM'];
  const consultOptions = ['Online', 'Offline', 'Chat'];

  const HandleBookAppointment= async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    // Logic to handle booking the appointment
    try{
      console.log('Booking appointment with details:', {hospitalId: hospital.id,
        date: selectedDate,
        time: selectedTime,
        consultType,
        registerPatient: hospital.register})
        
      const response = await api.post(`${BASE_URL}/api/v1/hospital/appointment/book`, {
      hospitalId: hospital.id,
      date: selectedDate,
      time: selectedTime,
      consultType,
      registerPatient: hospital.register
      },
      { headers: { 'Content-Type': 'Application/json' } }
    ); 
    navigation.navigate('Confirmation')
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again later.');
    }
    
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{hospital.name}</Text>
        <Text style={styles.specialty}>{hospital.location}</Text>
      </View>

      <Text style={styles.sectionTitle}>Select Date</Text>
      <Calendar
  onDayPress={(day) => {
    console.log(day.dateString)
    setSelectedDate(day.dateString)}}
  markedDates={{
    [selectedDate]: {
      selected: true,
      selectedColor: '#2563eb',
    },
  }}
  minDate={new Date().toISOString().split('T')[0]} // disables past dates
  theme={{
    selectedDayBackgroundColor: '#2563eb',
    todayTextColor: '#2563eb',
    arrowColor: '#2563eb',
  }}
  style={styles.calendar}
/>

      <Text style={styles.sectionTitle}>Available time</Text>
      <View style={styles.chipContainer}>
        {timeSlots.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <TouchableOpacity
              key={time}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => {
                console.log(`Selected time: ${time}`);
                setSelectedTime(time)
              }}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Types of Consultation</Text>
      <View style={styles.chipRow}>
        {consultOptions.map((type) => {
          const isSelected = consultType === type;
          return (
            <TouchableOpacity
              key={type}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => setConsultType(type)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => HandleBookAppointment()}
        disabled={!selectedDate || !selectedTime}
      >
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    color: '#000',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 16,
    opacity: 1,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
