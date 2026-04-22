import { SafeAreaView } from "react-native-safe-area-context";
import useUserCurrentLocation from "./hooks/userCurrentLocation";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
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
    destinationLatitude: number;
    destinationLongitude: number;
}

const NavigationMapCar = ({ onToggleNavigation, destinationLatitude, destinationLongitude }: NavigationMapProps) => {

    const { userLocation } = useUserCurrentLocation();
    const [arrivedParkingLot, setArrivedParkingLot] = useState(false);
    const userLatitude: number = userLocation?.coords.latitude ?? 0;
    const userLongitude: number = userLocation?.coords.longitude ?? 0;

    // set variables for handling when pedestrian-navigation starts as the current destination coords (used for car-navigation)
    let userArrivedParkingLotLatitude: number = destinationLatitude;
    let userArrivedParkingLotLongitude: number = destinationLongitude;

    const carRoute = useRoute(
        { latitude: userLatitude, longitude: userLongitude },
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

    console.log(carRoute)



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

    return (
        <SafeAreaView style={styles.container}>
            <MapView
                styleURL="mapbox://styles/mapbox/navigation-day-v1"
                style={styles.map}
            >
                <Camera followUserLocation followZoomLevel={15} />
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
                style={styles.arrivedButton}
                onPress={userArrivedParkingLot}
            >
                <Text style={styles.arrivedButtonText}>
                    🚶‍♂️
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
    }
});

export default NavigationMapCar;