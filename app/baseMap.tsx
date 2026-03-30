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
import useUserCurrentLocation from "./hooks/userCurrentLocation"
import ParkingSpots from "./ParkingSpots";
import LocationMarkers from "./locationSpots";
import NavigateButton from "./navigateButton";

// Define the types of props
interface BaseMapProps {
    navigationMapView: boolean;
    onToggle: () => void;
}

const BaseMap = ({ navigationMapView, onToggle }: BaseMapProps) => {

    const [spots, setSpots] = useState<Feature<Point>[]>([]);
    const [showNavigationButton, setShowNavigationButton] = useState(false)
    const { userLocation } = useUserCurrentLocation();
    const userLatitude: number = userLocation?.coords.latitude ?? 0;
    const userLongitude: number = userLocation?.coords.longitude ?? 0;

    const camera = useRef<Camera>(null);
    const userLocationFetched: boolean = userLongitude !== 0 && userLatitude !== 0;

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
            zoomLevel: 18,
            pitch: 54,
            heading: 0,
            animationDuration: 300,
        });

    }, [userLongitude, userLatitude]);

    const clearParkingSpots = () => {
        setSpots([]);
    };

    console.log(showNavigationButton)

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
                    zoomLevel={18}
                    pitch={54}
                    heading={0}
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
                <LocationMarkers toggleNavigation={() => setShowNavigationButton(prev => !prev)}/>
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
                        animationMode: "flyTo"
                    });
                }}
            >
                <Text style={styles.pinText}>↓</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.clearButton}
                onPress={clearParkingSpots}
            />

            <TouchableOpacity
                style={styles.swapMapViewButton}
                onPress={onToggle}
            />
            {showNavigationButton && <NavigateButton onToggleNavigationButton={() => setShowNavigationButton(prev => !prev)}/>}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
        width: "100%",
    },
    pinButton: {
        position: "absolute",
        bottom: 96,
        right: 32,
        padding: 24,
        backgroundColor: "#F5A623",
        borderRadius: 80,
        borderWidth: 4,
        borderColor: "#FFFFFF"
    },
    pinText: {
        color: "#1C3557",
        fontSize: 32
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
    },
});

export default BaseMap;