// This component fetches the route to be used for when starting navigation from the parking lot to entrance of the building from user's location

import { useEffect, useState } from "react";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_API_KEY

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface UseWalkingRouteResult {
    route: GeoJSON.Geometry | null;
    loading: boolean;
    error: string | null;
    routeInstructions: any[];
}

const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
};

const getManeuverIcon = (type: string, modifier: string) => {
    if (type === "depart") return "🚦";
    if (type === "arrive") return "🏁";
    if (type === "roundabout") return "🔄";

    switch (modifier) {
        case "left": return "⬅️";
        case "right": return "➡️";
        case "slight left": return "↖️";
        case "slight right": return "↗️";
        case "sharp left": return "⬅️";
        case "sharp right": return "➡️";
        case "uturn": return "↩️";
        case "straight": return "⬆️";
        default: return "⬆️";
    }
};

export default function useWalkingRoute(origin: Coordinate | null, destination: Coordinate | null): UseWalkingRouteResult {
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [routeInstructions, setRouteInstructions] = useState([])

    useEffect(() => {
        async function getRoute() {
            if (!origin || !destination) return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/walking/` +
                    `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}` +
                    `?geometries=geojson&overview=full&steps=true&banner_instructions=true&language=fi&access_token=${MAPBOX_TOKEN}`
                );

                if (!res.ok) throw new Error(`Directions API error: ${res.status}`);

                const data = await res.json();

                if (!data.routes?.length) throw new Error("No routes found");

                setRoute(data.routes[0].geometry);

                const steps = data.routes[0].legs[0].steps;

                const formattedSteps = steps.map((step: any, index: number) => ({
                    id: index,
                    instruction: step.maneuver.instruction,
                    distance: formatDistance(step.distance),
                    type: step.maneuver.type,
                    modifier: step.maneuver.modifier ?? null,
                    icon: getManeuverIcon(step.maneuver.type, step.maneuver.modifier),
                    name: step.name == "",

                }))

                setRouteInstructions(formattedSteps)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch route");
            } finally {
                setLoading(false)
            }
        }
        getRoute();
    }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude]);

    return { route, loading, error, routeInstructions };
}