import { MapboxNavigationView } from "@badatgil/expo-mapbox-navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import fixedEntranceCordinateList from "./hooks/fetchEntranceCoordinates";
import { useState, useEffect } from "react";
import { getDistance } from "geolib";

interface NavigationPedestrianMapProps {
    onToggleNavigation: () => void;
    startingLatitude: number;
    startingLongitude: number;
}

type EntranceCoordinate = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
};

const NavigationMapPedestrian = ({
    onToggleNavigation,
    startingLatitude,
    startingLongitude
}: NavigationPedestrianMapProps) => {

    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [showWarning, setShowWarning] = useState(false);

    const hazardLatitude: number = 65.07588506456669;
    const hazardLongitude: number = 25.445894257616906;

    const entranceCoordinates: EntranceCoordinate[] = fixedEntranceCordinateList();

    // 🔹 Find the nearest entrance
    const nearestEntrance = entranceCoordinates.reduce((closest, entrance) => {
        const distance = getDistance(
            { latitude: startingLatitude, longitude: startingLongitude },
            { latitude: entrance.latitude, longitude: entrance.longitude }
        );

        if (!closest || distance < closest.distance) {
            return { entrance, distance };
        }
        return closest;
    }, null as { entrance: EntranceCoordinate; distance: number } | null);

    const entranceLatitude = nearestEntrance?.entrance.latitude ?? entranceCoordinates[0].latitude;
    const entranceLongitude = nearestEntrance?.entrance.longitude ?? entranceCoordinates[0].longitude;

    // 🔹 Hazard warning logic
    useEffect(() => {
        if (!startingLatitude || !startingLongitude) return;

        const distanceToHazard = getDistance(
            { latitude: startingLatitude, longitude: startingLongitude },
            { latitude: hazardLatitude, longitude: hazardLongitude },
            1
        );

        if (distanceToHazard < 100) {
            setWarningMsg("⚠ Icy path ahead — proceed with caution");
            setShowWarning(true);
        } else {
            setWarningMsg(null);
            setShowWarning(false);
        }
    }, [startingLatitude, startingLongitude]);

    const userCoordinates = [
        { latitude: startingLatitude, longitude: startingLongitude },
        { latitude: entranceLatitude, longitude: entranceLongitude },
    ];

    const arrivedAtDestination = () => {
        onToggleNavigation();
    };

    const dismissWarning = () => setShowWarning(false);

    if (showWarning) {
        return (
            <SafeAreaView style={styles.container}>
                <MapboxNavigationView
                    style={{ flex: 1 }}
                    coordinates={userCoordinates}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    onCancelNavigation={onToggleNavigation}
                    routeProfile="mapbox/walking"
                    onFinalDestinationArrival={arrivedAtDestination}
                />
                <View style={styles.warningContainer}>
                    <TouchableOpacity onPress={dismissWarning}>
                        <Text style={styles.text}>{warningMsg}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <MapboxNavigationView
                style={{ flex: 1 }}
                coordinates={userCoordinates}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onCancelNavigation={onToggleNavigation}
                routeProfile="mapbox/walking"
                onFinalDestinationArrival={arrivedAtDestination}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1C3557"
    },
    warningContainer: {
        position: 'absolute',
        bottom: 100,
        left: 16,
        right: 16,
        backgroundColor: '#FF6B35',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        textAlign: "center",
        fontSize: 16,
        color: "#FFFFFF"
    },
});

export default NavigationMapPedestrian;