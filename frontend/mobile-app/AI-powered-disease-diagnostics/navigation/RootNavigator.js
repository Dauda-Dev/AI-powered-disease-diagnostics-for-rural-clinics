import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Onboarding1 from '../app/screens/OnboardingScreen1';
import Onboarding2 from '../app/screens/OnboardingScreen2';
import LoginScreen from '../app/screens/patients/LoginScreen';
import SignupScreen from '../app/screens/patients/SignupScreen';
import ProfileSetUpScreen from '../app/screens/patients/ProfileSetUpScreen';
import MainTabNavigator from './MainTabNavigator'; // bottom tab nav
import HospitalAuthStack from './HospitalAuthStack'; // hospital auth stack
import HospitalTabs from './HospitalTabs'; // hospital bottom tab nav

const Stack = createNativeStackNavigator();

const RootNavigator = ({ isAuthenticated, setIsAuthenticated, roleSelected, setRoleSelected, onLogout }) => {
//   

return (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {!isAuthenticated ? (
      roleSelected === 'onboard' ? (
        // Show onboarding role selection screen
        <>
          <Stack.Screen name="Onboarding1" component={Onboarding1} />
          <Stack.Screen name="Onboarding3">
          {(props) => (
              <Onboarding2 {...props} setRoleSelected = {setRoleSelected} />
            )}
            </Stack.Screen>
        </>
      ) : roleSelected === 'patient' ? (
        // Patient Auth Stack
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} onAuthSuccess={() => setIsAuthenticated(true)} setRoleSelected={setRoleSelected} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ProfileSetup">
            {(props) => (
              <ProfileSetUpScreen {...props} onSetupComplete={() => setIsAuthenticated(true)} setRoleSelected = {setRoleSelected} />
            )}
          </Stack.Screen>
        </>
      ) : roleSelected === 'hospital' ? (
        // Hospital Auth Stack
        <Stack.Screen name="HospitalAuth">
          {(props) => (
            <HospitalAuthStack {...props} setIsAuthenticated={setIsAuthenticated} roleSelected={roleSelected} setRoleSelected = {setRoleSelected} />
          )}
        </Stack.Screen>
      ) : null // fallback for unexpected role
    ) : (
      
      roleSelected === 'patient' ? (
        <Stack.Screen name="MainTabs">
          {(props) => <MainTabNavigator {...props} onLogout={onLogout} />}
        </Stack.Screen>
      ) : roleSelected === 'hospital' ? (
        <Stack.Screen name="HospitalTabs">
          {(props) => <HospitalTabs {...props} onLogout={onLogout} />}
        </Stack.Screen> 
      ) : null // fallback for unexpected role
    )}
  </Stack.Navigator>
  
);
}

export default RootNavigator;
