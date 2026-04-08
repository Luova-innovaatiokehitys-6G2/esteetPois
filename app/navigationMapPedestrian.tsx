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

const NavigationMapPedestrian = ({ onToggleNavigation, startingLatitude, startingLongitude }: NavigationPedestrianMapProps) => {

    type userCoordinate = {
        latitude: number;
        longitude: number;
    };

    const entranceCoordinates = fixedEntranceCordinateList();
    const entranceLatitude: number = entranceCoordinates[1].latitude;
    const entranceLongitude: number = entranceCoordinates[1].longitude;
    const parkingLotLatitude: number = startingLatitude;
    const parkingLotLongitude: number = startingLongitude;
    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [showWarning, setShowWarning] = useState(false)

    const hazardLatitude: number = 65.07588506456669
    const hazardLongitude: number = 25.445894257616906

    useEffect(() => {
        if (!parkingLotLatitude || !parkingLotLongitude) return;

        const distanceToHazard = getDistance(
            { latitude: parkingLotLatitude, longitude: parkingLotLongitude },
            { latitude: hazardLatitude, longitude: hazardLongitude },       
            1
        );

        if (distanceToHazard < 100) {
            setWarningMsg("⚠ Icy path ahead — proceed with caution");
            setShowWarning(true)
        } else {
            setWarningMsg(null);
        }
    }, [parkingLotLatitude, parkingLotLongitude]);

    console.log(entranceLatitude)
    console.log(entranceLongitude)
    console.log("userPLatitude", parkingLotLatitude)
    console.log("userPLongitude", parkingLotLongitude)

    const userCoordinates: userCoordinate[] = [
        { latitude: parkingLotLatitude, longitude: parkingLotLongitude },
        { latitude: entranceLatitude, longitude: entranceLongitude },
    ];

    const arrivedAtDestination = () => {
        console.log("arrived at destination")
        onToggleNavigation()
    }

    const dismissWarning = () => {
        setShowWarning(false)
    }

    if (showWarning) return (
        <SafeAreaView
            style={styles.container}
        >
            <MapboxNavigationView
                style={{ flex: 1 }}
                coordinates={userCoordinates}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onCancelNavigation={onToggleNavigation}
                routeProfile="mapbox/walking"
                onFinalDestinationArrival={arrivedAtDestination}
            >
            </MapboxNavigationView>
            <View style={styles.warningContainer}>
                <TouchableOpacity
                    onPress={dismissWarning}>
                    <Text style= {styles.text}>{warningMsg}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

    return (
        <SafeAreaView
            style={styles.container}
        >
            <MapboxNavigationView
                style={{ flex: 1 }}
                coordinates={userCoordinates}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onCancelNavigation={onToggleNavigation}
                routeProfile="mapbox/walking"
                onFinalDestinationArrival={arrivedAtDestination}

            >
            </MapboxNavigationView>
        </SafeAreaView>
    );
}

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