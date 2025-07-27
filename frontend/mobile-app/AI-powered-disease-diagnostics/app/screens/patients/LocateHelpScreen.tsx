import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapboxGL from '@rnmapbox/maps';
import * as Location from 'expo-location';
import useHospitals from '../../../hooks/useHospitals';
import Map from '../../../components/Map';

MapboxGL.setAccessToken('pk.eyJ1IjoiZGF1ZGFpYiIsImEiOiJjbWNjaDdlNXgwNnI0MmlzN2VjcWNzZTltIn0.ev8abgU9fmjs2HSzSKQbYA');

export default function LocateHelpScreen() {
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(5000);
  const { hospitals, loading } = useHospitals(location, radius);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [sortedHospitals, setSortedHospitals] = useState([]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      // Start watching for location changes
      Location.watchPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // every 5 sec
        distanceInterval: 5, // or every 5m moved
      }, (loc) => {
        setLocation(loc.coords);
      });
    })();
  }, []);

  useEffect(() => {
    if (location && hospitals.length) {
      const sorted = hospitals.map(hospital => {
        const dist = getDistance(location, hospital);
        return { ...hospital, distance: dist };
      }).sort((a, b) => a.distance - b.distance);
      setSortedHospitals(sorted);
    }
  }, [location, hospitals]);

  return (
    <View style={{ flex: 1 }}>
      <Map
        location={location}
        hospitals={hospitals}
        selectedHospital={selectedHospital}
      />

      <View style={styles.controls}>
        <Text style={{ fontSize: 16 }}>Radius (m):</Text>
        <Picker
          selectedValue={radius}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue) => setRadius(itemValue)}
        >
          <Picker.Item label="1 km" value={1000} />
          <Picker.Item label="3 km" value={3000} />
          <Picker.Item label="5 km" value={5000} />
          <Picker.Item label="10 km" value={10000} />
        </Picker>
        <Button title={loading ? "Loading..." : "Reload"} onPress={() => {}} disabled={loading} />
      </View>

      <View style={styles.bottomList}>
        <FlatList
          data={sortedHospitals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => setSelectedHospital(item)}
            >
              <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ fontSize: 12 }}>
                ETA: ~{Math.ceil(item.distance_km / 80)} min
              </Text>
              <Text style={{ fontSize: 12 }}>
                {/* ({(item.distance / 1000).toFixed(2)} km) */}
                ({ item.distance_km} km)
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

function getDistance(loc1, loc2) {
  if (!loc1 || !loc2) return 0;
  const toRad = x => x * Math.PI / 180;
  const R = 6371e3; // earth radius in m
  const φ1 = toRad(loc1.latitude), φ2 = toRad(loc2.lat);
  const Δφ = toRad(loc2.lat - loc1.latitude);
  const Δλ = toRad(loc2.lon - loc1.longitude);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const styles = StyleSheet.create({
  controls: {
    position: 'absolute',
    top: 40,
    left: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    zIndex: 10
  },
  bottomList: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#fff'
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  }
});
