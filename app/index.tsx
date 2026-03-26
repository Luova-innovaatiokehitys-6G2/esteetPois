import React, { useState, useEffect, useRef } from "react";
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
  View
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feature, Point } from "geojson";

import ParkingSpots from "./ParkingSpots";
import useUserCurrentLocation from "./hooks/userCurrentLocation";
import Loading from "./loading";

const Map = () => {

  const { userLocation } = useUserCurrentLocation();

  const userLongitude = userLocation?.coords.longitude ?? 0;
  const userLatitude = userLocation?.coords.latitude ?? 0;

  const userLocationFetched = userLongitude !== 0 && userLatitude !== 0;

  const camera = useRef<Camera>(null);

  const [spots, setSpots] = useState<Feature<Point>[]>([]);


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

  return userLocationFetched ? (
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
<<<<<<< HEAD
          console.log("Locate user button pressed | Coords:", userLatitude, userLongitude);
=======
>>>>>>> a9f622d50308992a23b3be2a892d3d20d54b06f9
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
        style={styles.clearButton}
        onPress={clearParkingSpots}
      />

    </SafeAreaView>
  ) : (
    <Loading />
  );
};

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
});

export default Map;