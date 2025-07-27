import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignupScreen from '../app/screens/hospitals/SignupScreen';
import LoginScreen from '../app/screens/hospitals/LoginScreen';
import ProfileSetUpScreen from '../app/screens/hospitals/ProfileSetUpScreen';

const Stack = createNativeStackNavigator();

export default function HospitalAuthStack({ setIsAuthenticated, roleSelected, setRoleSelected }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

    <Stack.Screen name="LoginHospital">
        {(props) => (
          <LoginScreen {...props} onAuthSuccess={() => setIsAuthenticated(true)} setRoleSelected={setRoleSelected} />
        )}
      </Stack.Screen>
     
      <Stack.Screen name="SignupHospital">
        {(props) => (
          <SignupScreen {...props} onAuthSuccess={() => setIsAuthenticated(true)} setRoleSelected={setRoleSelected} />
        )}
      </Stack.Screen>
    
      <Stack.Screen name="ProfileSetupHospital">
        {(props) => (
          <ProfileSetUpScreen {...props} onSetupComplete={() => setIsAuthenticated(true)} roleSelected={roleSelected} setRoleSelected={setRoleSelected} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}