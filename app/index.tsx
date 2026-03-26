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
      <MapView
        styleURL={"mapbox://styles/mapbox/standard"}
        style={styles.map}
        projection="globe"
        scaleBarEnabled={false}
        logoPosition={Platform.OS === "android" ? { bottom: 40, left: 10 } : undefined}
        attributionPosition={Platform.OS === "android" ? { bottom: 40, right: 10 } : undefined}
      >
        <Camera
          defaultSettings={{
            centerCoordinate: [
              location.coords.longitude,
              location.coords.latitude
            ],
            zoomLevel: 16,
            pitch: 70,
            heading: -161.81,
          }}
          centerCoordinate={[
            location.coords.longitude,
            location.coords.latitude
          ]}
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
          console.log("User location:", location.coords);
        }}
      />

      <TouchableOpacity
        style={styles.clearButton}
        onPress={clearParkingSpots}
      >
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>

    </View>
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
    bottom: 100,
    right: 30,
    padding: 32,
    backgroundColor: "white",
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