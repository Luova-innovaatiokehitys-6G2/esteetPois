import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TouchableOpacity, Text, Platform, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import {
    MapView,
    Camera,
    ShapeSource,
    LineLayer,
    UserLocation,
    PointAnnotation,
    UserTrackingMode
} from "@rnmapbox/maps";
import useRoute from "./hooks/fetchRoute";
import NavigationMapPedestrian from "./navigationMapPedestrian";

interface NavigationMapProps {
    onToggleNavigation: () => void;
    userLatitude: number;
    userLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
}

// Haversine formula
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

const STEP_ADVANCE_THRESHOLD = 20;

const NavigationMapCar = ({
    onToggleNavigation,
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude
}: NavigationMapProps) => {

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [followUser, setFollowUser] = useState(true)
    const [reachedParkingLot, setReachedParkingLot] = useState(false)

    const startingLatitude = userLatitude ?? 0;
    const startingLongitude = userLongitude ?? 0;

    const carRoute = useRoute(
        { latitude: startingLatitude, longitude: startingLongitude },
        { latitude: destinationLatitude, longitude: destinationLongitude }
    );

    const steps = carRoute.routeInstructions;
    console.log(steps)
    const currentStep = steps[currentStepIndex] ?? null;
    const isLastStep = currentStepIndex === steps.length - 1;
    const camera = useRef<Camera>(null);

    useEffect(() => {
        if (!steps.length || isLastStep) return;

        const nextStep = steps[currentStepIndex + 1];
        if (!nextStep?.location) return;

        const [nextLng, nextLat] = nextStep.location;
        const distance = getDistanceMetres(userLatitude, userLongitude, nextLat, nextLng);

        if (distance <= STEP_ADVANCE_THRESHOLD) {
            setCurrentStepIndex(prev => prev + 1);
        }
    }, [userLatitude, userLongitude]);

    useEffect(() => {
        if (isLastStep && steps.length > 0) {
            setReachedParkingLot(true)
        }
    }, [isLastStep]);

    const onToggleWalkingNavigation = () => {
        setReachedParkingLot(prev => !prev);
    };

    const onToggleInstructionChangeForward = () => {
        setCurrentStepIndex(prev => prev + 1);
    }

    const onToggleInstructionChangeBackward = () => {
        setCurrentStepIndex(prev => prev - 1);
    }

    if (reachedParkingLot) {
        return (
            <NavigationMapPedestrian
                onToggleNavigation={onToggleNavigation}
                startingLatitude={destinationLatitude}
                startingLongitude={destinationLongitude}
            />
        )
    } else {
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
                        <View style={styles.stepCounterContainer}>
                            <TouchableOpacity
                                style={styles.stepCounterButton}
                                onPress={onToggleInstructionChangeBackward}
                            >
                                <Text style={styles.stepCounterButtonText}>{"<-"}</Text>
                            </TouchableOpacity>
                            <Text style={styles.stepCounter}>
                                Step {currentStepIndex + 1} of {steps.length}
                            </Text>
                            <TouchableOpacity
                                style={styles.stepCounterButton}
                                onPress={onToggleInstructionChangeForward}
                            >
                                <Text style={styles.stepCounterButtonText}>{"->"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                <MapView
                    styleURL="mapbox://styles/mapbox/navigation-day-v1"
                    style={styles.map}
                    scaleBarEnabled={false}
                    logoPosition={Platform.OS === "android" ? { bottom: 40, left: 8 } : undefined}
                    attributionPosition={Platform.OS === "android" ? { bottom: 40, right: 8 } : undefined}
                    onTouchStart={() => setFollowUser(false)}
                >
                    <Camera
                        ref={camera}
                        animationMode="flyTo"
                        animationDuration={1000}
                        followUserLocation={followUser}
                        followUserMode={UserTrackingMode.FollowWithCourse}
                        followZoomLevel={18}
                        followPitch={32}
                    />
                    <UserLocation
                        androidRenderMode="gps"
                        showsUserHeadingIndicator={true}
                    />
                    {carRoute.route && (
                        <ShapeSource
                            id="routeSource"
                            shape={carRoute.route}
                            maxZoomLevel={18}
                        >
                            <LineLayer
                                id="routeLine"
                                style={{ lineColor: "#F5A623", lineWidth: 8 }}
                            />
                        </ShapeSource>
                    )}
                    <PointAnnotation
                        id="destinationPoint"
                        coordinate={[destinationLongitude, destinationLatitude]}
                    >
                        <Text style={{ fontSize: 24, width: 48, height: 30, textAlign: 'center' }}>♿</Text>
                    </PointAnnotation>
                </MapView>

                <TouchableOpacity style={styles.toggleWalkingNavigationButton} onPress={onToggleWalkingNavigation}>
                    <Text style={styles.exitButtonText}>{"->"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.exitNavigationButton} onPress={onToggleNavigation}>
                    <Text style={styles.exitButtonText}>X</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.pinButton}
                    onPress={() => setFollowUser(true)}
                >
                    <Text style={styles.pinText}>↓</Text>
                </TouchableOpacity>

            </SafeAreaView>
        );
    }
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
        bottom: 256,
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
    },
    pinButton: {
        position: "absolute",
        bottom: 120,
        right: 32,
        padding: 24,
        backgroundColor: "#F5A623",
        borderRadius: 80,
        borderWidth: 4,
        borderColor: "#FFFFFF"
    },
    pinText: { color: "#1C3557", fontSize: 32 },
    toggleWalkingNavigationButton: {
        position: "absolute",
        bottom: 392,
        right: 32,
        padding: 32,
        backgroundColor: "#F5A623",
        borderRadius: 80,
        borderWidth: 4,
        borderColor: "#FFFFFF"
    },
    stepCounterContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    stepCounterButton: {
    },
    stepCounterButtonText: {
        fontSize: 16,
        color: "#FFFFFF"
    }
});

export default NavigationMapCar;