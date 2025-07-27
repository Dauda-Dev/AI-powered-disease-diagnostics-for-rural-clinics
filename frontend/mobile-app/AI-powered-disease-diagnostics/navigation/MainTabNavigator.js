import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import DashboardScreen from '../screens/DashboardScreen';
// import ChatbotScreen from '../screens/ChatbotScreen';
import VoiceChatScreen from '../app/screens/VoiceChatScreen'
import AppointmentScreen from '../app/screens/patients/AppointmentScreen';
import { Ionicons } from '@expo/vector-icons'; // or 'react-native-vector-icons/Ionicons'
import AppointmentStack from './AppointmentStack';
import ProfileScreen from '../app/screens/patients/ProfileScreen';
import ChatAndAppointmentStack from './ChatAndAppointmentStack';
import LocateHelpScreen from '../app/screens/patients/LocateHelpScreen';



const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ onLogout }) => {
  return (
    <Tab.Navigator 
    screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }else if(route.name === 'LocateHelp'){
            iconName = focused ? 'locate' : 'locate-outline';
          }
          else if (route.name === 'Chat AI') {
            iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          }else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      {/* <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} /> */}
      <Tab.Screen name="Appointments" component={AppointmentStack} />
      <Tab.Screen name="LocateHelp" component={LocateHelpScreen} />
      <Tab.Screen name="Chat AI" component={ChatAndAppointmentStack} />
      <Tab.Screen name="Profile">
      {(props) => (
              <ProfileScreen {...props} onLogout={() => onLogout()} />
            )}
        </Tab.Screen>
      {/* Add logout to a profile/settings tab if needed */}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
