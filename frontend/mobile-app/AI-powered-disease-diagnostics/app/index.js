import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import RootNavigator from '../navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'; // ✅ Import this


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleSelected, setRoleSelected] = useState('onboard'); // Default role

  useEffect(() => {
    const checkAuth = async () => {
      console.log('checking')
      const token = await AsyncStorage.getItem('authToken');
      console.log('token: ', token)
      if (token) {
        try {
          console.log('decoding token')
          const { exp, role } = jwtDecode(token);
          const now = Date.now() / 1000;
          console.log(now, exp)
          console.log('is token expired?')
          if (exp < now) {

            // Token expired
            await AsyncStorage.removeItem('authToken');
            setIsAuthenticated(false);
          } else {
            console.log('false')
            setIsAuthenticated(true);
            setRoleSelected(role)
          }
        } catch (error) {
          // Invalid token or decode failed
          await AsyncStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);



  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setRoleSelected('onboard'); // Reset role to default
  };

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#0000ff" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
 <BottomSheetModalProvider> 
    <RootNavigator
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      roleSelected={roleSelected}
      setRoleSelected={setRoleSelected}
      onLogout = {handleLogout}
    />
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
