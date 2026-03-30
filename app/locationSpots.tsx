import fixedCoordinateList from "./hooks/fetchCoordinates"
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from "react-native";
import { MarkerView } from "@rnmapbox/maps"

type Coordinate = {
    city: string;
    id: number;
    latitude: number;
    longitude: number;
    name: string;
};

const styles = StyleSheet.create({
    container: {
        width: 54,
        height: 32,
        backgroundColor: "#00B386",
        borderRadius: 8
    },
    text: {
        color: "#FFFFFF",
        textAlign: "center"
    }
});

interface LocationMarkerProps {
    toggleNavigation: (latitude: number, longitude: number) => void;
}

const LocationMarkers = ({toggleNavigation}: LocationMarkerProps) => {
    const fixedCoordinates = fixedCoordinateList();
    return (
        <>
            {
                fixedCoordinates.map((fixedLocation: Coordinate) => (
                    <MarkerView
                        key={fixedLocation.id}
                        coordinate={[fixedLocation.longitude, fixedLocation.latitude]}
                        anchor={{ x: 0.5, y: 1 }}
                    >
                        <View style={styles.container}>
                            <TouchableOpacity
                                onPress={() => toggleNavigation(fixedLocation.latitude, fixedLocation.longitude)}
                            >
                                <Text style={styles.text}>
                                    {fixedLocation.name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </MarkerView>
                ))
            }
        </>
    )
}

export default LocationMarkers;