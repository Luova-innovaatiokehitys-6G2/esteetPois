import { useState, useEffect } from "react";
import fixedEntranceCordinateList, { EntranceCoordinate } from "./hooks/fetchEntranceCoordinates";
import {
    StyleSheet,
    View,
    Text
} from "react-native";
import { MarkerView } from "@rnmapbox/maps"

const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        fontSize: 16,
    }
});

interface EntranceLocationMarkerProps {
    toggleNavigation: (latitude: number, longitude: number) => void;
}

const EntranceLocationMarkers = ({ toggleNavigation }: EntranceLocationMarkerProps) => {
    const [entranceCoordinates, setEntranceCoordinates] = useState<EntranceCoordinate[]>([]);

    useEffect(() => {
        const loadEntrances = async () => {
            try {
                const entrances = await fixedEntranceCordinateList();
                if (Array.isArray(entrances)) {
                    setEntranceCoordinates(entrances);
                } else {
                    console.error("Entrances is not an array:", entrances);
                }
            } catch (err) {
                console.error("Failed to load entrance markers:", err);
            }
        };

        loadEntrances();
    }, []);

    return (
        <>
            {entranceCoordinates.map((entranceLocation) => (
                <MarkerView
                    key={entranceLocation.id}
                    coordinate={[entranceLocation.longitude, entranceLocation.latitude]}
                    anchor={{ x: 0.5, y: 1 }}
                >
                    <View>
                        <Text style={styles.text}>
                            🔷
                        </Text>
                    </View>
                </MarkerView>
            ))}
        </>
    );
};

export default EntranceLocationMarkers;