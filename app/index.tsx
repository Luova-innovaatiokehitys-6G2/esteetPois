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

import { 
  useEffect, 
  useRef
} from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

import useUserCurrentLocation from './hooks/userCurrentLocation';
import Loading from './loading';

const Map = () => {
  // Get user's current location
  const { userLocation } = useUserCurrentLocation();

  // Set initial location
  const userLongitude = userLocation?.coords.longitude ?? 0;
  const userLatitude = userLocation?.coords.latitude ?? 0;

  // Make sure location has been fetched
  const userLocationFetched = userLongitude !== 0 && userLatitude !== 0;

  console.log("Fetched user location:", userLatitude, userLongitude)
  console.log("User's location fetched:", userLocationFetched)

  // Mutable ref to the Camera component to control the map's camera
  const camera = useRef<Camera>(null);

  // Handling for when user's location changes
  useEffect(() => {
    camera.current?.setCamera({ 
      centerCoordinate: [userLongitude, userLatitude],
      zoomLevel: 17,
      pitch: 64,
      heading: -161.81,
      animationDuration: 1000,
    });
  }, [userLongitude, userLatitude]);

  // Display a loading screen until location is available
  // Render the map centered on user's location
  // Show user's location with heading arrow
  return userLocationFetched ? (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        styleURL={"mapbox://styles/mapbox/standard"}
        style={styles.map}
        projection='globe'
        scaleBarEnabled={false}
        logoPosition={Platform.OS === 'android' ? { bottom: 40, left: 8 } : undefined}
        attributionPosition={Platform.OS === 'android' ? { bottom: 40, right: 8 } : undefined}
      >
        <Camera
          ref={camera}
          centerCoordinate={[userLongitude, userLatitude]}
          zoomLevel={17}
          pitch={64}
          heading={-161.81}
          animationDuration={0}
           />
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
          console.log("Locate user button pressed | Coords:", userLatitude, userLongitude);
          camera.current?.setCamera({
            centerCoordinate: [userLongitude, userLatitude],
            zoomLevel: 17,
            pitch: 64,
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

// Styling
const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 96,
    right: 32,
    padding: 32,
    backgroundColor: 'blue',
    borderRadius: 32,
  },
});

export default Map;