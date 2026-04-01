import { MapboxNavigationView } from "@badatgil/expo-mapbox-navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserCurrentLocation from "./hooks/userCurrentLocation";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import NavigationMapPedestrian from "./navigationMapPedestrian";

interface NavigationMapProps {
    onToggleNavigation: () => void;
    destinationLatitude: number;
    destinationLongitude: number;
}

const NavigationMap = ({ onToggleNavigation, destinationLatitude, destinationLongitude }: NavigationMapProps) => {

    const { userLocation } = useUserCurrentLocation();
    const [arrivedParkingLot, setArrivedParkingLot] = useState(false);
    const userLatitude: number = userLocation?.coords.latitude ?? 0;
    const userLongitude: number = userLocation?.coords.longitude ?? 0;

    let userArrivedParkingLotLatitude: number = destinationLatitude;
    let userArrivedParkingLotLongitude: number = destinationLongitude;

    type userCoordinate = {
        latitude: number;
        longitude: number;
    };

    const userCoordinates: userCoordinate[] = [
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: destinationLatitude, longitude: destinationLongitude },
    ];

    const userArrivedParkingLot = () => {
        if ((userArrivedParkingLotLatitude === destinationLatitude && userArrivedParkingLotLongitude === destinationLongitude) || (userLatitude === destinationLatitude && userLongitude === destinationLongitude)) {
            setArrivedParkingLot(prev => !prev);
            if (arrivedParkingLot) {
                onToggleNavigation();
            }
        }
    }

    if (arrivedParkingLot) return <NavigationMapPedestrian
        onToggleNavigation={onToggleNavigation}
        startingLatitude={userArrivedParkingLotLatitude}
        startingLongitude={userArrivedParkingLotLongitude}
    />

    console.log("userArrivedParkingLot: ", arrivedParkingLot)
    console.log("userArrivedParkingLotLatitude: ", userArrivedParkingLotLatitude)
    console.log("userArrivedParkingLotLongitude: ", userArrivedParkingLotLongitude)

    return (
        <SafeAreaView style={styles.container}>
            <MapboxNavigationView
                style={{ flex: 1 }}
                coordinates={userCoordinates}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onCancelNavigation={onToggleNavigation}
                routeProfile="mapbox/driving-traffic"
            />
            <TouchableOpacity
                style={styles.arrivedButton}
                onPress={userArrivedParkingLot} />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        backgroundColor: "#1C3557"
    },
    arrivedButton: {
        position: "absolute",
        bottom: 96,
        right: 32,
        padding: 24,
        backgroundColor: "#F5A623",
        borderRadius: 80,
        borderWidth: 4,
        borderColor: "#FFFFFF"
    }
});

export default NavigationMap;