import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Text, TouchableOpacity, Platform } from "react-native";
import fixedEntranceCordinateList from "./hooks/fetchEntranceCoordinates";
import { useState, useEffect, useRef } from "react";
import { getDistance } from "geolib";
import {
    MapView,
    Camera,
    ShapeSource,
    LineLayer,
    UserLocation,
    PointAnnotation,
    UserTrackingMode
} from "@rnmapbox/maps";
import useWalkingRoute from "./hooks/fetchWalkingRoute";

interface NavigationPedestrianMapProps {
    onToggleNavigation: () => void;
    startingLatitude: number;
    startingLongitude: number;
}

type EntranceCoordinate = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
};

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

const STEP_ADVANCE_THRESHOLD = 5;

const NavigationMapPedestrian = ({
    onToggleNavigation,
    startingLatitude,
    startingLongitude
}: NavigationPedestrianMapProps) => {

    const [warningMsg, setWarningMsg] = useState<string | null>(null);
    const [showWarning, setShowWarning] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [followUser, setFollowUser] = useState(true)

    const hazardLatitude: number = 65.061125;
    const hazardLongitude: number = 25.470295;

    const entranceCoordinates: EntranceCoordinate[] = fixedEntranceCordinateList();

    const nearestEntrance = entranceCoordinates.reduce((closest, entrance) => {
        const distance = getDistance(
            { latitude: startingLatitude, longitude: startingLongitude },
            { latitude: entrance.latitude, longitude: entrance.longitude }
        );

        if (!closest || distance < closest.distance) {
            return { entrance, distance };
        }
        return closest;
    }, null as { entrance: EntranceCoordinate; distance: number } | null);

    const entranceLatitude = nearestEntrance?.entrance.latitude ?? entranceCoordinates[0].latitude;
    const entranceLongitude = nearestEntrance?.entrance.longitude ?? entranceCoordinates[0].longitude;

    const walkingRoute = useWalkingRoute(
        { latitude: startingLatitude, longitude: startingLongitude },
        { latitude: entranceLatitude, longitude: entranceLongitude }
    )

    const steps = walkingRoute.routeInstructions;
    const currentStep = steps[currentStepIndex] ?? null;
    const isLastStep = currentStepIndex === steps.length - 1;
    const camera = useRef<Camera>(null);


    useEffect(() => {
        if (!steps.length || isLastStep) return;

        const nextStep = steps[currentStepIndex + 1];
        if (!nextStep?.location) return;

        const [nextLng, nextLat] = nextStep.location;
        const distance = getDistanceMetres(startingLatitude, startingLongitude, nextLat, nextLng);

        if (distance <= STEP_ADVANCE_THRESHOLD) {
            setCurrentStepIndex(prev => prev + 1);
        }
    }, [startingLatitude, startingLongitude]);

    useEffect(() => {
        if (isLastStep && steps.length > 0) {
            const timer = setTimeout(onToggleNavigation, 3000);
            return () => clearTimeout(timer);
        }
    }, [isLastStep]);


    useEffect(() => {
        if (!startingLatitude || !startingLongitude) return;

        const distanceToHazard = getDistance(
            { latitude: startingLatitude, longitude: startingLongitude },
            { latitude: hazardLatitude, longitude: hazardLongitude },
            1
        );

        if (distanceToHazard < 1000) {
            setWarningMsg("⚠ Icy path ahead — proceed with caution");
            setShowWarning(true);
        } else {
            setWarningMsg(null);
            setShowWarning(false);
        }
    }, [startingLatitude, startingLongitude]);

    console.log("starting", startingLatitude, startingLongitude)
    console.log("hazard", hazardLatitude, hazardLongitude)

    const userCoordinates = [
        { latitude: startingLatitude, longitude: startingLongitude },
        { latitude: entranceLatitude, longitude: entranceLongitude },
    ];

    const arrivedAtDestination = () => {
        onToggleNavigation();
    };

    const dismissWarning = () => setShowWarning(false);

    if (showWarning) {
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
                    {walkingRoute.route && (
                        <ShapeSource
                            id="routeSource"
                            shape={walkingRoute.route}
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
                        coordinate={[entranceLongitude, entranceLatitude]}
                    >
                        <Text style={{ fontSize: 24, width: 48, height: 30, textAlign: 'center' }}>🚪</Text>
                    </PointAnnotation>
                </MapView>
                <TouchableOpacity style={styles.exitNavigationButton} onPress={onToggleNavigation}>
                    <Text style={styles.exitButtonText}>X</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.pinButton}
                    onPress={() => setFollowUser(true)}
                >
                    <Text style={styles.pinText}>↓</Text>
                </TouchableOpacity>

                <View style={styles.warningContainer}>
                    <TouchableOpacity onPress={dismissWarning}>
                        <Text style={styles.text}>{warningMsg}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
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
                    onTouchStart={() => setFollowUser(false)}
                >
                    <Camera
                        ref={camera}
                        centerCoordinate={[startingLatitude, startingLongitude]}
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
                    {walkingRoute.route && (
                        <ShapeSource
                            id="routeSource"
                            shape={walkingRoute.route}
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
                        coordinate={[entranceLongitude, entranceLatitude]}
                    >
                        <Text style={{ fontSize: 24, width: 48, height: 30, textAlign: 'center' }}>🚪</Text>
                    </PointAnnotation>
                </MapView>
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
    warningContainer: {
        position: 'absolute',
        top: 170,
        backgroundColor: '#FF6B35',
        padding: 16,
        flexDirection: "row",
        left: 0,
        right: 0
    },
    text: {
        textAlign: "center",
        fontSize: 16,
        color: "#FFFFFF"
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
});

export default NavigationMapPedestrian;