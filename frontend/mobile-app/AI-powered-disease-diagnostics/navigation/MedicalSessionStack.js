// navigation/AppointmentStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MedicalSessionScreen from '../app/screens/hospitals/MedicalSessionScreen';
import DashboardScreen from '../app/screens/hospitals/DashboardScreen';
const Stack = createNativeStackNavigator();

export default function MedicalSessionStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={DashboardScreen} />
        <Stack.Screen name="StartSessionScreen" component={MedicalSessionScreen} />
    </Stack.Navigator>
  );
}
