import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

export default function HospitalMarker({ hospital }) {

  const lon = parseFloat(hospital?.lng);
  const lat = parseFloat(hospital?.lat);
  console.log(`Hospital coordinates: ${lon}, ${lat}`);
  return (
    <MapboxGL.PointAnnotation
      key={hospital.id.toString()}
      id={hospital.id.toString()}
      coordinate={[lon, lat]}
    >
      <View style={styles.redPoint} />
    </MapboxGL.PointAnnotation>
  );
}

const styles = StyleSheet.create({
  redPoint: {
    width: 12,
    height: 12,
    backgroundColor: 'red',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff'
  }
});
