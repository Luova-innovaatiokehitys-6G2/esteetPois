import fixedEntranceCordinateList from "./hooks/fetchEntranceCoordinates";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from "react-native";

import { MarkerView } from "@rnmapbox/maps"

type EntranceCoordinate = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
};

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
    const entranceCoordinates = fixedEntranceCordinateList()
    return (
        <>
            {
                entranceCoordinates.map((entranceLocation: EntranceCoordinate) => (
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
                ))
            }
        </>
    )
}

export default EntranceLocationMarkers;