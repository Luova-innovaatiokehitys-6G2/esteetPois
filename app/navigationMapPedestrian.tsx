import { MapboxNavigationView } from "@badatgil/expo-mapbox-navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import fixedEntranceCordinateList from "./hooks/fetchEntranceCoordinates";

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

    console.log(entranceLatitude)
    console.log(entranceLongitude)
    console.log("userPLatitude", parkingLotLatitude)
    console.log("userPLongitude", parkingLotLongitude)

    const userCoordinates: userCoordinate[] = [
        { latitude: parkingLotLatitude, longitude: parkingLotLongitude },
        { latitude: entranceLatitude, longitude: entranceLongitude },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <MapboxNavigationView
                style={{ flex: 1 }}
                coordinates={userCoordinates}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onCancelNavigation={onToggleNavigation}
                routeProfile="mapbox/walking"
            />
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#1C3557"
    },
});

export default NavigationMapPedestrian;