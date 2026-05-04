import { useState, useEffect } from "react";
import { fixedCoordinateList, FixedCoordinate } from "./hooks/fetchCoordinates";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from "react-native";
import { MarkerView } from "@rnmapbox/maps"

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

const LocationMarkers = ({ toggleNavigation }: LocationMarkerProps) => {
    const [fixedCoordinates, setFixedCoordinates] = useState<FixedCoordinate[]>([]);

    useEffect(() => {
    const loadCoordinates = async () => {
        try {
            const locations = await fixedCoordinateList();
            console.log("locations: ", locations);
            setFixedCoordinates(locations);
        } catch (err) {
            console.error("Failed to load location markers:", err);
        }
    };

    loadCoordinates();
}, []);

    return (
        <>
            {fixedCoordinates.map((fixedLocation) => (
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
            ))}
        </>
    );
};

export default LocationMarkers;