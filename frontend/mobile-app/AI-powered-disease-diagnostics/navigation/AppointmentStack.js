// navigation/AppointmentStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppointmentScreen from '../app/screens/patients/AppointmentScreen';
import InputRecordScreen from '../app/screens/patients/InputRecordScreen';
import ConfirmationScreen from '../app/screens/patients/ConfirmationScreen';
import BookAppointmentScreen from '../app/screens/patients/BookAppointments';
import HospitalSelectionScreen from '../app/screens/patients/HospitalSelectionScreen';

const Stack = createNativeStackNavigator();

export default function AppointmentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AppointmentHome" component={AppointmentScreen} />
      <Stack.Screen name='HospitalSelection' component={HospitalSelectionScreen} />
      <Stack.Screen name='AppointmentBooking' component={BookAppointmentScreen} />
      <Stack.Screen name="InputRecord" component={InputRecordScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
}
