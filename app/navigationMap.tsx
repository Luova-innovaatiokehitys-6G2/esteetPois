import { MapboxNavigationView } from "@badatgil/expo-mapbox-navigation";
import { SafeAreaView } from "react-native-safe-area-context";
import useUserCurrentLocation from "./hooks/userCurrentLocation";

interface NavigationMapProps{
    onToggleNavigation: () => void;
}

const NavigationMap = ({onToggleNavigation}: NavigationMapProps) => {

    const { userLocation } = useUserCurrentLocation();
    const userLatitude: number = userLocation?.coords.latitude ?? 0;
    const userLongitude: number = userLocation?.coords.longitude ?? 0;
    const destinationLatitude: number = 65.06044806088848
    const destinationLongitude: number = 25.462700022779803

    type userCoordinate = {
        latitude: number;
        longitude: number;
    };

    const userCoordinates: userCoordinate[] = [
        { latitude: userLatitude, longitude: userLongitude },
        { latitude: destinationLatitude, longitude: destinationLongitude },
    ];

    console.log("navigationCoordinates", userCoordinates)
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <MapboxNavigationView
                style={{ flex: 1 }}
                coordinates={userCoordinates}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onCancelNavigation={onToggleNavigation}
            />
        </SafeAreaView>
    );

}

export default NavigationMap;