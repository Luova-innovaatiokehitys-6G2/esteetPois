import React, { useState, useEffect, useRef } from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Text
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  MapView,
  LocationPuck,
  Images,
} from "@rnmapbox/maps";
import { Feature, Point } from "geojson";
import useUserCurrentLocation from "./hooks/userCurrentLocation";
import useUserTrackLocation from "./hooks/userTrackLocation";
import ParkingSpots from "./ParkingSpots";
import LocationMarkers from "./locationSpots";
import EntranceLocationMarkers from "./entranceSpots";
import NavigateButton from "./navigateButton";
import NavigationMapCar from "./navigationMapCar";
import Loading from "./loading";
import { fixedCoordinateList, FixedCoordinate } from './hooks/fetchCoordinates';

type SpotProperties = {
  id: string;
  reserved?: boolean;
};

const BaseMap = () => {
  const [spots, setSpots] = useState<Feature<Point, SpotProperties>[]>([]);
  const [showNavigationButton, setShowNavigationButton] = useState(false);
  const [destinationLatitude, setDestinationLatitude] = useState(0);
  const [destinationLongitude, setDestinationLongitude] = useState(0);
  const [navigationMapView, setNavigationMapView] = useState(false);

  const { userLocation } = useUserCurrentLocation();
  const { updatedUserLocation } = useUserTrackLocation();

  const userInitialLatitude = userLocation?.coords.latitude ?? 0;
  const userInitialLongitude = userLocation?.coords.longitude ?? 0;
  console.log("lat", userInitialLatitude, "lon", userInitialLongitude)

  const userLatitude = updatedUserLocation?.coords.latitude ?? 0;
  const userLongitude = updatedUserLocation?.coords.longitude ?? 0;
  console.log("updatedLat", userLatitude, "updateLon", userLongitude)

  const camera = useRef<Camera>(null);

  const userLocationFetched = userInitialLatitude !== 0 && userInitialLatitude !== 0;

  const generateSpotsNearLocation = (
    lat: number,
    lng: number,
    locationId: string
  ): Feature<Point, SpotProperties>[] => {
    const spots = Array.from({ length: 5 }, (_, i) => ({
      type: "Feature" as const,
      geometry: {
        type: "Point" as const,
        coordinates: [
          lng + Math.random() * 0.0003 * Math.cos(Math.random() * 2 * Math.PI),
          lat + Math.random() * 0.0003 * Math.sin(Math.random() * 2 * Math.PI),
        ],
      },
      properties: { id: `${locationId}-${i + 1}` },
    }));

    const reservedCount = Math.floor(Math.random() * 2) + 2;
    const reservedIds = [...spots]
      .sort(() => 0.5 - Math.random())
      .slice(0, reservedCount)
      .map((s) => s.properties.id);

    return spots.map((spot) => ({
      ...spot,
      properties: {
        ...spot.properties,
        reserved: reservedIds.includes(spot.properties.id),
      },
    }));
  };

  useEffect(() => {
    if (!userLocationFetched) return;

    const loadSpots = async () => {
      try {
        const locations: FixedCoordinate[] = await fixedCoordinateList();

        const allSpots = locations.flatMap((location) =>
          generateSpotsNearLocation(
            location.latitude,
            location.longitude,
            String(location.id)
          )
        );

        setSpots(allSpots);
      } catch (err) {
        console.error("Failed to load spots:", err);
      }
    };

    loadSpots();
  }, [userLocationFetched, navigationMapView]);

  useEffect(() => {
    if (!userLocationFetched) return;

    camera.current?.setCamera({
      centerCoordinate: [userInitialLongitude, userInitialLatitude],
      zoomLevel: 18,
      pitch: 54,
      heading: 0,
      animationDuration: 300,
    });
  }, [userLocationFetched]);

  const handleSelectSpot = (lat: number, lng: number, reserved?: boolean) => {
    if (reserved) {
      alert("This spot is reserved!");
      return;
    }
    setDestinationLatitude(lat);
    setDestinationLongitude(lng);
    setShowNavigationButton(true);
  };

  const toggleNavigationFromMarker = (lat: number, lng: number) => {
    setDestinationLatitude(lat);
    setDestinationLongitude(lng);

    const freeSpots = spots.filter(s => !s.properties?.reserved);

    if (freeSpots.length > 0) {
      const closestSpot = freeSpots.reduce((prev, curr) => {
        const prevDistance = Math.sqrt(
          Math.pow(prev.geometry.coordinates[1] - lat, 2) +
          Math.pow(prev.geometry.coordinates[0] - lng, 2)
        );
        const currDistance = Math.sqrt(
          Math.pow(curr.geometry.coordinates[1] - lat, 2) +
          Math.pow(curr.geometry.coordinates[0] - lng, 2)
        );
        return currDistance < prevDistance ? curr : prev;
      });

      const [spotLng, spotLat] = closestSpot.geometry.coordinates;
      setDestinationLatitude(spotLat);
      setDestinationLongitude(spotLng);
    }

    setShowNavigationButton(true);
  };

  const startNavigation = () => {
    setShowNavigationButton(false);
    setNavigationMapView(true);
  };

  if (navigationMapView && userLocationFetched && destinationLatitude !== 0 && destinationLongitude !== 0) {
    return (
      <NavigationMapCar
        onToggleNavigation={() => setNavigationMapView(prev => !prev)}
        userLatitude={userLatitude}
        userLongitude={userLongitude}
        destinationLatitude={destinationLatitude}
        destinationLongitude={destinationLongitude}
      />
    );
  } else if (!navigationMapView && userLocationFetched) {
    return (
      <SafeAreaView style={styles.container}>
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
            centerCoordinate={[userInitialLongitude, userInitialLatitude]}
            zoomLevel={18}
            pitch={54}
            heading={0}
            animationDuration={500}
            animationMode="flyTo"
          />
          <Images images={{ headingArrow: require("../assets/images/headingArrow.png") }} />
          <LocationPuck bearingImage="headingArrow" puckBearing="heading" puckBearingEnabled visible />
          <ParkingSpots spots={spots} onSelectSpot={handleSelectSpot} />
          <LocationMarkers
            toggleNavigation={toggleNavigationFromMarker}
            navigationMapView={navigationMapView}
          />
          <EntranceLocationMarkers toggleNavigation={toggleNavigationFromMarker} />
        </MapView>
        <TouchableOpacity
          style={styles.pinButton}
          onPress={() => {
            camera.current?.setCamera({
              centerCoordinate: [userLongitude, userLatitude],
              zoomLevel: 18,
              pitch: 54,
              heading: 0,
              animationDuration: 500,
              animationMode: "flyTo",
            });
          }}
        >
          <Text style={styles.pinText}>↓</Text>
        </TouchableOpacity>
        {showNavigationButton && <NavigateButton startNavigation={startNavigation} />}
      </SafeAreaView>
    );
  } else {
    return <Loading />;
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1C3557" },
  map: { flex: 1, width: "100%" },
  pinButton: {
    position: "absolute",
    bottom: 120,
    right: 32,
    padding: 24,
    backgroundColor: "#F5A623",
    borderRadius: 80,
    borderWidth: 4,
    borderColor: "#FFFFFF"
  },
  pinText: { color: "#1C3557", fontSize: 32 },
});

export default BaseMap;