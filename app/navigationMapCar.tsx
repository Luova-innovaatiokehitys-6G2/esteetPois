import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, Text, Platform, View } from "react-native";
import { useState, useEffect } from "react";
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

// Haversine formula — returns distance in metres between two coords
const getDistanceMetres = (
    lat1: number, lon1: number,
    lat2: number, lon2: number
): number => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// How close (metres) the user must be to trigger the next step
const STEP_ADVANCE_THRESHOLD = 20;

const NavigationMapCar = ({
    onToggleNavigation,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude
}: NavigationMapProps) => {

    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const startingLatitude = userLatitude ?? 0;
    const startingLongitude = userLongitude ?? 0;

    const carRoute = useRoute(
        { latitude: startingLatitude, longitude: startingLongitude },
        { latitude: destinationLatitude, longitude: destinationLongitude }
    );

    const steps = carRoute.routeInstructions;
    const currentStep = steps[currentStepIndex] ?? null;
    const isLastStep = currentStepIndex === steps.length - 1;

    // Advance step when user gets close enough to the maneuver point
    useEffect(() => {
        if (!steps.length || isLastStep) return;

        const nextStep = steps[currentStepIndex + 1];
        if (!nextStep?.location) return; // location = [lng, lat] from maneuver

        const [nextLng, nextLat] = nextStep.location;
        const distance = getDistanceMetres(userLatitude, userLongitude, nextLat, nextLng);

        if (distance <= STEP_ADVANCE_THRESHOLD) {
            setCurrentStepIndex(prev => prev + 1);
        }
    }, [userLatitude, userLongitude]);

    // Trigger exit when the final "arrive" step is reached
    useEffect(() => {
        if (isLastStep && steps.length > 0) {
            // Small delay so the user sees the arrival message
            const timer = setTimeout(onToggleNavigation, 3000);
            return () => clearTimeout(timer);
        }
    }, [isLastStep]);

    return (
        <SafeAreaView style={styles.container}>

            {currentStep && (
                <View style={styles.instructionsContainer}>
                    <View style={styles.instructionsTextContainer}>
                        <Text style={styles.instructionsIcon}>{currentStep.icon}</Text>
                        <View style={styles.instructionsText}>
                            <Text style={styles.directionsText}>{currentStep.instruction}</Text>
                            <Text style={[styles.directionsText, { fontSize: 13, opacity: 0.7 }]}>
                                {currentStep.distance}
                            </Text>
                        </View>
                    </View>

                    {/* Step counter — helpful for debugging, remove if not needed */}
                    <Text style={styles.stepCounter}>
                        Step {currentStepIndex + 1} of {steps.length}
                    </Text>
                </View>
            )}
            
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
                    <ShapeSource id="routeSource" shape={carRoute.route}>
                        <LineLayer
                            id="routeLine"
                            style={{ lineColor: "#F5A623", lineWidth: 8 }}
                        />
                    </ShapeSource>
                )}
            </MapView>

            <TouchableOpacity style={styles.exitNavigationButton} onPress={onToggleNavigation}>
                <Text style={styles.exitButtonText}>X</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 5,
        backgroundColor: "#1C3557"
    },
    instructionsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#1C3557",
    },
    instructionsTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2E5F8C",
        padding: 16,
        borderRadius: 80,
        gap: 12,
    },
    instructionsText: {
        flex: 1,
        flexDirection: "column",
    },
    instructionsIcon: {
        fontSize: 24,
    },
    directionsText: {
        fontSize: 16,
        color: "#FFFFFF",
    },
    stepCounter: {
        color: "#FFFFFF",
        opacity: 0.5,
        fontSize: 12,
        textAlign: "center",
        marginTop: 6,
    },
    map: {
        flex: 1,
        width: "100%"
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