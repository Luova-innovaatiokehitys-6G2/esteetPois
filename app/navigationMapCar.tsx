import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import { useState } from "react";
import NavigationMapPedestrian from "./navigationMapPedestrian";
import {
    MapView,
    Camera,
    ShapeSource,
    LineLayer,
    UserLocation
} from "@rnmapbox/maps";
import useRoute from "./hooks/fetchRoute";

interface NavigationMapProps {
    onToggleNavigation: () => void;
    userLatitude: number;
    userLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
}

const NavigationMapCar = ({ onToggleNavigation, userLatitude, userLongitude, destinationLatitude, destinationLongitude }: NavigationMapProps) => {

    const [arrivedParkingLot, setArrivedParkingLot] = useState(false);
    const startingLatitude: number = userLatitude ?? 0;
    const startingLongitude: number = userLongitude ?? 0;

    // set variables for handling when pedestrian-navigation starts as the current destination coords (used for car-navigation)
    let userArrivedParkingLotLatitude: number = destinationLatitude;
    let userArrivedParkingLotLongitude: number = destinationLongitude;

    const carRoute = useRoute(
        { latitude: startingLatitude, longitude: startingLongitude },
        { latitude: destinationLatitude, longitude: destinationLongitude }
    )

    const userArrivedParkingLot = () => {
        if ((userArrivedParkingLotLatitude === destinationLatitude && userArrivedParkingLotLongitude === destinationLongitude) || (userLatitude === destinationLatitude && userLongitude === destinationLongitude)) {
            setArrivedParkingLot(prev => !prev);
            if (arrivedParkingLot) {
                onToggleNavigation();
            }
        }
    }

    /* Old code for handling the start of pedestrian-navigation
    if (arrivedParkingLot) return <NavigationMapPedestrian
        onToggleNavigation={onToggleNavigation}
        startingLatitude={userArrivedParkingLotLatitude}
        startingLongitude={userArrivedParkingLotLongitude}
    />
    */

    /* old console logs
    console.log("userArrivedParkingLot: ", arrivedParkingLot)
    console.log("userArrivedParkingLotLatitude: ", userArrivedParkingLotLatitude)
    console.log("userArrivedParkingLotLongitude: ", userArrivedParkingLotLongitude)
    */


    console.log("userlatitude: ", userLatitude, "userLongitude: ", userLongitude)

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                styleURL="mapbox://styles/mapbox/navigation-day-v1"
                style={styles.map}
                scaleBarEnabled={false}
                logoPosition={Platform.OS === "android" ? { bottom: 40, left: 8 } : undefined}
                attributionPosition={Platform.OS === "android" ? { bottom: 40, right: 8 } : undefined}
            >
                <Camera followUserLocation followZoomLevel={18} />
                <UserLocation />
                {carRoute.route && (
                    <ShapeSource
                        id="routeSource"
                        shape={carRoute.route}
                    >
                        <LineLayer
                            id="routeLine"
                            style={{ lineColor: "#F5A623", lineWidth: 5 }}
                        />
                    </ShapeSource>
                )}
            </MapView>
            <TouchableOpacity
                style={styles.exitNavigationButton}
                onPress={onToggleNavigation}
            >
                <Text style={styles.exitButtonText}>
                    X
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        backgroundColor: "#1C3557"
    },
    map: {
        flex: 1,
        width: "100%"
    },
    arrivedButton: {
        position: "absolute",
        bottom: 120,
        right: 32,
        padding: 24,
        backgroundColor: "#F5A623",
        borderRadius: 80,
        borderWidth: 4,
        borderColor: "#FFFFFF"
    },
    arrivedButtonText: {
        fontSize: 32
    },
    exitNavigationButton: {
        position: "absolute",
        bottom: 120,
        right: 32,
        padding: 32,
        backgroundColor: "#F5A623",
        borderRadius: 80,
        borderWidth: 4,
        borderColor: "#FFFFFF"
    },
    exitButtonText: {
        fontSize: 24,
        color: "#1C3557"
    }
});

export default NavigationMapCar;