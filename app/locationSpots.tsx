import { useState, useEffect, useRef } from "react";
import { fixedCoordinateList, FixedCoordinate } from "./hooks/fetchCoordinates";
import {
    StyleSheet,
    View,
    Text
} from "react-native";
import { PointAnnotation } from "@rnmapbox/maps"

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 36,
        backgroundColor: "#00B386",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    text: {
        color: "#FFFFFF",
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
        paddingHorizontal: 4,
    }
});

interface LocationMarkerProps {
    toggleNavigation: (latitude: number, longitude: number) => void;
    navigationMapView: boolean;
}

const LocationMarker = ({ fixedLocation, toggleNavigation }: {
    fixedLocation: FixedCoordinate;
    toggleNavigation: (latitude: number, longitude: number) => void;
}) => {
    const annotationRef = useRef<PointAnnotation>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            annotationRef.current?.refresh();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <PointAnnotation
            ref={annotationRef}
            key={String(fixedLocation.id)}
            id={String(fixedLocation.id)}
            coordinate={[fixedLocation.longitude, fixedLocation.latitude]}
            anchor={{ x: 0.5, y: 1 }}
            onSelected={() => toggleNavigation(fixedLocation.latitude, fixedLocation.longitude)}
        >
            <View style={styles.container}>
                <Text style={styles.text}>
                    {fixedLocation.name}
                </Text>
            </View>
        </PointAnnotation>
    );
};

const LocationMarkers = ({ toggleNavigation, navigationMapView }: LocationMarkerProps) => {
    const [fixedCoordinates, setFixedCoordinates] = useState<FixedCoordinate[]>([]);

    useEffect(() => {
        const loadCoordinates = async () => {
            try {
                const locations = await fixedCoordinateList();
                setFixedCoordinates(locations);
            } catch (err) {
                console.error("Failed to load location markers:", err);
            }
        };

        loadCoordinates();
    }, [navigationMapView]);

    return (
        <>
            {fixedCoordinates.map((fixedLocation) => (
                <LocationMarker
                    key={fixedLocation.id}
                    fixedLocation={fixedLocation}
                    toggleNavigation={toggleNavigation}
                />
            ))}
        </>
    );
};

export default LocationMarkers;