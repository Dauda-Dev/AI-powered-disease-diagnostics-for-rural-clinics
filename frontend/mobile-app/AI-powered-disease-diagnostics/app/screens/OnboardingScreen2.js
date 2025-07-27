
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const Onboarding2 = ({ navigation, setRoleSelected }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/heart-logo.png')} style={styles.image} />
      <Text style={styles.title}>Welcome to AI Clinic</Text>
      <Text style={styles.subtitle}>
        Please choose your role to continue
      </Text>

      <TouchableOpacity
        style={[styles.button, styles.patientButton]}
        onPress={() => {
          setRoleSelected('patient');
          navigation.navigate('Signup')}
        }
      >
        <Text style={styles.buttonText}>Continue as Patient</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.hospitalButton]}
        onPress={() => {
          setRoleSelected('hospital');
          navigation.navigate('SignupHospital')}
        }
      >
        <Text style={styles.buttonText}>Continue as a Doctor</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Onboarding2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    width: '85%',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  patientButton: {
    backgroundColor: '#007bff',
  },
  hospitalButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
