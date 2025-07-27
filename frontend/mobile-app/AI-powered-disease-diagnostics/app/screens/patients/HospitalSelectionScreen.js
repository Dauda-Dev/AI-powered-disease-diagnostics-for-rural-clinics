import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '@/utils/api';
import { BASE_URL } from '@/utils/url';
import { useNavigation } from '@react-navigation/native';

const HospitalSelectionScreen = ({

}) => {
  const [hospitals, setHospitals] = useState([]);
  const [registeredHospitalIds, setRegisteredHospitalIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
  const [loading, setLoading] = useState(false);
 

 
  const navigation = useNavigation();
  
  const fetchMockHospitals = ()=> {
    setHospitals(hospitalsData);
    setFilteredHospitals(hospitalsData)
  }
  
  const fetchHospitals = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/v1/hospital/info`);
      const hospitalData = response.data;
      const hospitalDetails = hospitalData.map((hospital) => (
        {
          id: hospital.id,
          name: hospital.business_name,
          location: hospital.business_address,
          imageUrl: hospital.imageUrl || 'https://via.placeholder.com/64x64.png?text=H',
        }
      ))

      setHospitals(hospitalDetails);
      setFilteredHospitals(hospitalDetails);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      Alert.alert('Error', 'Failed to load hospitals.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchHospitals();
   
  }, []);


  const onSelectHospital = (hospital) =>{
    navigation.navigate('AppointmentBooking', { hospital });
  }
  
  const handleRegisterToggle = (hospital) => {
    if (registeredHospitalIds.includes(hospital.id)) {
      setRegisteredHospitalIds((ids) => ids.filter((id) => id !== hospital.id));
    } else {
      setRegisteredHospitalIds((ids) => [...ids, hospital.id]);
    }
  };
  

  useEffect(() => {
    const filtered = hospitals.filter((hospital) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHospitals(filtered);
  }, [searchQuery, hospitals]);

  const renderHospital = ({ item }) => {
    const isRegistered = registeredHospitalIds.includes(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => onSelectHospital(item)}
      >
        <View style={styles.cardContent}>
          <Image
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/64x64.png?text=H' }}
            style={styles.hospitalImage}
          />

          <View style={styles.hospitalDetails}>
            <Text style={styles.hospitalName}>{item.name}</Text>
            <Text style={styles.hospitalLocation}>{item.location}</Text>
            {isRegistered && <Text style={styles.registeredTag}>Registered</Text>}
          </View>

          <TouchableOpacity
            style={isRegistered ? styles.unregisterBtn : styles.registerBtn}
            onPress={() => handleRegisterToggle(item)}
          >
            <Text style={isRegistered ? styles.unregisterText : styles.registerText}>
              {isRegistered ? 'Unregister' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Schedule a Practitioner</Text>
      <Text style={styles.subtitle}>Choose where to book your appointment</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search hospitals..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#9CA3AF"
      />

{loading ? (
        <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 40 }} />
      ) : (
      <FlatList
        data={filteredHospitals}
        renderItem={renderHospital}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hospitals match your search.</Text>
        }
      />
    )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    color: '#111827',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hospitalImage: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 14,
  },
  hospitalDetails: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
  },
  hospitalLocation: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 3,
  },
  registeredTag: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 5,
  },
  registerBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  registerText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  unregisterBtn: {
    backgroundColor: '#F87171',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unregisterText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 40,
  },
});


export default HospitalSelectionScreen;
