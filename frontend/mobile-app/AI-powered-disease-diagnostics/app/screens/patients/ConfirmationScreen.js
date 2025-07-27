import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function ConfirmationScreen() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require('../../../assets/animation/Animation - 1748706472340.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.message}>Appointment Confirmed!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb', // blue-600
  },
  animation: {
    width: 150,
    height: 150,
  },
});
