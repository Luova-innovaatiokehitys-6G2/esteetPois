import {
  Camera,
  MapView,
  LocationPuck,
  Images
} from '@rnmapbox/maps';

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import useUserCurrentLocation from './hooks/userCurrentLocation';
import Loading from './loading';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const Map = () => {
  // Get user's current location
  const { location } = useUserCurrentLocation();

  // Set initial location
  const lon = location?.coords.longitude || 0;
  const lat = location?.coords.latitude || 0;

  console.log("fetch", lat, lon);

  // mutable ref to the Camera component to control the map's camera
  const camera = useRef<Camera>(null);

  useEffect(() => {
    camera.current?.setCamera({
      centerCoordinate: [lon, lat],
      zoomLevel: 16,
      pitch: 70,
      heading: -161.81,
      animationDuration: 1000,
    });
  }, [lon, lat]);

  // Render the map centered on user's location
  // Display a loading screen until location is available
  // Show user's location with heading arrow
  return location ? (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        styleURL={"mapbox://styles/mapbox/standard"}
        style={styles.map}
        projection='globe'
        scaleBarEnabled={true}
        logoPosition={Platform.OS === 'android' ? { bottom: 40, left: 10 } : undefined}
        attributionPosition={Platform.OS === 'android' ? { bottom: 40, right: 10 } : undefined}
      >
        <Camera ref={camera} />
        <Images images={{ 'headingArrow': require('../assets/images/headingArrow.png') }} />
        <LocationPuck
          bearingImage="headingArrow"
          puckBearing='heading'
          puckBearingEnabled={true}
          visible={true}
        />
      </MapView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("button pressed", location?.coords.latitude, location?.coords.longitude);
          camera.current?.setCamera({
            centerCoordinate: [location.coords.longitude, location.coords.latitude],
            zoomLevel: 16,  
            pitch: 70,
            heading: -161.81,
            animationDuration: 1000,
          });
        }}>
      </TouchableOpacity>
    </SafeAreaView>
  ) : (
    <Loading />
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    padding: 32,
    backgroundColor: 'white',
    borderRadius: 32,
  },
});

export default Map;