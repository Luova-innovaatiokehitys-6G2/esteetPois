import {
  Camera,
  MapView
} from '@rnmapbox/maps';

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import useUserCurrentLocation from './hooks/userCurrentLocation';
import Loading from './loading';

const Map = () => {
  const { location } = useUserCurrentLocation();
  console.log("fetch", location?.coords.latitude, location?.coords.longitude);
  return location ? (
    <View style={{ flex: 1 }}>
      <MapView
        styleURL={"mapbox://styles/mapbox/standard"}
        style={styles.map}
        projection='globe'
        scaleBarEnabled={false}
        logoPosition={Platform.OS === 'android' ? { bottom: 40, left: 10 } : undefined}
        attributionPosition={Platform.OS === 'android' ? { bottom: 40, right: 10 } : undefined}
      >
        <Camera
          defaultSettings={{
            centerCoordinate: [location.coords.longitude, location.coords.latitude],
            zoomLevel: 16,
            pitch: 70,
            heading: -161.81,
          }}
          centerCoordinate={[location.coords.longitude, location.coords.latitude]}
        />
      </MapView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("button pressed", location?.coords.latitude, location?.coords.longitude);
        }}>
      </TouchableOpacity>
    </View>
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