import React, { useState, useEffect } from "react";
import {
  Camera,
  MapView,
  LocationPuck,
  Images
} from "@rnmapbox/maps";

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from "react-native";

import { Feature, Point } from "geojson";

import ParkingSpots from "./ParkingSpots";
import useUserCurrentLocation from "./hooks/userCurrentLocation";
import Loading from "./loading";

const Map = () => {

  const { location } = useUserCurrentLocation();

  const [spots, setSpots] = useState<Feature<Point>[]>([]);

  useEffect(() => {
    if (!location) return;

    const { latitude, longitude } = location.coords;

    const randomSpots: Feature<Point>[] = [];

    const numberOfSpots = Math.floor(Math.random() * 10) + 5;

    for (let i = 0; i < numberOfSpots; i++) {
      const latOffset = (Math.random() - 0.5) * 0.002;
      const lngOffset = (Math.random() - 0.5) * 0.002;

      const newSpot: Feature<Point> = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            longitude + lngOffset,
            latitude + latOffset,
          ],
        },
        properties: {
          id: `${Date.now()}-${i}`,
        },
      };

      randomSpots.push(newSpot);
    }

    setSpots(randomSpots);

  }, [location]);

  const clearParkingSpots = () => {
    setSpots([]);
  };

  return location ? (
    <View style={{ flex: 1 }}>
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
        projection="globe"
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

        <ParkingSpots spots={spots} />

      </MapView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log("Locate user button pressed | Coords:", userLongitude, userLatitude);
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
    width: "100%",
  },
  button: {
    position: 'absolute',
    bottom: 96,
    right: 32,
    padding: 32,
    backgroundColor: 'blue',
    borderRadius: 32,
  },
  clearButton: {
    position: "absolute",
    top: 60,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#ff4d4d",
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Map;