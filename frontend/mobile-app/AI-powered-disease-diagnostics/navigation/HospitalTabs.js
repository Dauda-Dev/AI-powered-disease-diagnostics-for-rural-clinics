import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from '../app/screens/hospitals/DashboardScreen';
import ConsultationPrepScreen from '../app/screens/hospitals/ConsultationPrepScreen';
import PatientProfileScreen from '../app/screens/hospitals/PatientProfileScreen';
import PostConsultationScreen from '../app/screens/hospitals/PostConsultationScreen';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import EmployeeManagementScreen from '../app/screens/hospitals/EmployeeManagementScreen';
import ProfileScreen from '../app/screens/hospitals/ProfileScreen';
import MedicalSessionStack from './MedicalSessionStack';
const Tab = createBottomTabNavigator();

export default function HospitalTabs({ onLogout }) {
  return (
    <BottomSheetModalProvider>
    <Tab.Navigator screenOptions={({route})=>({ 
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
            let iconName;
  
            if (route.name === 'Home') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            }else if (route.name === 'Consultation Prep') {
              iconName = focused ? 'list-circle' : 'list-circle-outline';
            }else if (route.name === 'Patient Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: 'gray',
        })}
     
    >
        <Tab.Screen name="Dashboard">
        {(props) => (
            <MedicalSessionStack {...props} onLogout={() => onLogout()} />
            )}
        </Tab.Screen>
      {/* <Tab.Screen name="Post Consultation" component={PostConsultationScreen} /> */}
      <Tab.Screen name="Employee Profile">
        {(props) => (
          <EmployeeManagementScreen {...props} onLogout={() => onLogout()} />
        )}
      </Tab.Screen>
     
     
      {/* <Tab.Screen name="Hospital Profile">
        {(props) => (
          <ProfileScreen {...props} onLogout={() => onLogout()} />
        )}
        </Tab.Screen> */}
        </Tab.Navigator>
    </BottomSheetModalProvider>
  );
}
