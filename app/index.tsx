import React, { useState, useEffect, useRef } from "react";
import {
  Camera,
  MapView,
  LocationPuck,
  Images,
} from "@rnmapbox/maps";

import {
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";


import { MapboxNavigationView } from "@badatgil/expo-mapbox-navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feature, Point } from "geojson";

import ParkingSpots from "./ParkingSpots";
import useUserCurrentLocation from "./hooks/userCurrentLocation";
import Loading from "./loading";

const Map = () => {

  const { userLocation } = useUserCurrentLocation();
  const [navigationMapView, setnavigationMapView] = useState(false);

  const userLatitude: number = userLocation?.coords.latitude ?? 0;
  const userLongitude: number = userLocation?.coords.longitude ?? 0;

  const destinationLatitude: number = 65.06044806088848
  const destinationLongitude: number = 25.462700022779803

  const userLocationFetched: boolean = userLongitude !== 0 && userLatitude !== 0;

  const camera = useRef<Camera>(null);

  const handleMapView = () => {
    setnavigationMapView(prev => !prev);
  };

  const [spots, setSpots] = useState<Feature<Point>[]>([]);

  type userCoordinate = {
    latitude: number;
    longitude: number;
  };

  const userCoordinates: userCoordinate[] = [
    { latitude: userLatitude, longitude: userLongitude },
    { latitude: destinationLatitude, longitude: destinationLongitude },
  ];

  useEffect(() => {
    if (!userLocationFetched) return;

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
            userLongitude + lngOffset,
            userLatitude + latOffset,
          ],
        },
        properties: {
          id: `${Date.now()}-${i}`,
        },
      };

      randomSpots.push(newSpot);
    }

    setSpots(randomSpots);

  }, [userLocationFetched]);

  useEffect(() => {
    if (!userLocationFetched) return;

    camera.current?.setCamera({
      centerCoordinate: [userLongitude, userLatitude],
      zoomLevel: 17,
      pitch: 64,
      heading: -161.81,
      animationDuration: 1000,
    });

  }, [userLongitude, userLatitude]);

  const clearParkingSpots = () => {
    setSpots([]);
  };

  console.log("userCoordinates", userCoordinates)

  const styles = StyleSheet.create({
    map: {
      flex: 1,
      width: "100%",
    },
    button: {
      position: "absolute",
      bottom: 96,
      right: 32,
      padding: 32,
      backgroundColor: "blue",
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
    swapMapViewButton: {
      position: "absolute",
      top: 100,
      left: 20,
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor: "#4dff9d",
      borderRadius: 16,
    }
  });

  if (!userLocationFetched) return <Loading />;
  if (navigationMapView) return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapboxNavigationView
        style={{ flex: 1 }}
        coordinates={userCoordinates}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        styleURL={"mapbox://styles/mapbox/standard"}
        style={styles.map}
        projection="globe"
        scaleBarEnabled={false}
        logoPosition={Platform.OS === "android" ? { bottom: 40, left: 8 } : undefined}
        attributionPosition={Platform.OS === "android" ? { bottom: 40, right: 8 } : undefined}
      >
        <Camera
          ref={camera}
          centerCoordinate={[userLongitude, userLatitude]}
          zoomLevel={17}
          pitch={64}
          heading={-161.81}
          animationDuration={0}
        />
        <Images
          images={{
            headingArrow: require("../assets/images/headingArrow.png"),
          }}
        />
        <LocationPuck
          bearingImage="headingArrow"
          puckBearing="heading"
          puckBearingEnabled={true}
          visible={true}
        />
        <ParkingSpots spots={spots} />
      </MapView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          camera.current?.setCamera({
            centerCoordinate: [userLongitude, userLatitude],
            zoomLevel: 17,
            pitch: 64,
            heading: -161.81,
            animationDuration: 1000,
          });
        }}
      />

      <TouchableOpacity
        style={styles.swapMapViewButton}
        onPress={handleMapView}
      />

      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearParkingSpots}
      />
    </SafeAreaView>
  );
}

export default Map;