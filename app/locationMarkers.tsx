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
    press: {

    },
    text: {
        color: "#FFFFFF",
        textAlign: "center"
    }
});

const LocationMarkers = () => {
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
                            <TouchableOpacity>
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