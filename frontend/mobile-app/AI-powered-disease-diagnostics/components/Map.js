import React, { useEffect, useState } from 'react';
import MapboxGL from '@rnmapbox/maps';
import { View, StyleSheet, Text } from 'react-native';
import HospitalMarker from './HospitalMarker';

export default function Map({ location, hospitals, selectedHospital }) {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    if (location && selectedHospital) {
      getRoute([location.longitude, location.latitude], [selectedHospital.lng, selectedHospital.lat]);
    }
  }, [selectedHospital]);

  async function getRoute(start, end) {
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=pk.eyJ1IjoiZGF1ZGFpYiIsImEiOiJjbWNjaDdlNXgwNnI0MmlzN2VjcWNzZTltIn0.ev8abgU9fmjs2HSzSKQbYA`;
      const res = await fetch(url);
      const json = await res.json();
      console.log(res.status, json);
      setRoute(json.routes[0].geometry);
    } catch (err) {
      console.error(err);
    }
  }

  if (!location) {
    return <View style={styles.center}><Text>Loading map...</Text></View>;
  }

  return (
    <MapboxGL.MapView style={{ flex: 1 }}>
      <MapboxGL.Camera
        centerCoordinate={[location.longitude, location.latitude]}
        zoomLevel={13}
      />

      <MapboxGL.PointAnnotation
        id="me"
        coordinate={[location.longitude, location.latitude]}
      >
        <View style={styles.meMarker} />
      </MapboxGL.PointAnnotation>

      {hospitals.map(hospital => (
        <HospitalMarker key={hospital.id} hospital={hospital} />
      ))}

      {route && (
        <MapboxGL.ShapeSource id="route" shape={{ type: 'Feature', geometry: route }}>
          <MapboxGL.LineLayer
            id="routeLine"
            style={{ lineWidth: 4, lineColor: '#007AFF' }}
          />
        </MapboxGL.ShapeSource>
      )}
    </MapboxGL.MapView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  meMarker: {
    width: 12, height: 12, borderRadius: 6, backgroundColor: 'blue'
  }
});
