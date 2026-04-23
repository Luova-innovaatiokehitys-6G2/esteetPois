// This component fetches the route to be used for when starting navigation to destination from user's location

import { useEffect, useState } from "react";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_API_KEY

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface UseRouteResult {
    route: GeoJSON.Geometry | null;
    loading: boolean;
    error: string | null;
}

export default function useRoute(origin: Coordinate | null, destination: Coordinate | null): UseRouteResult {
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getRoute() {
            if (!origin || !destination) return;
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/` +
                    `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}` +
                    `?geometries=geojson&overview=full&steps=true&access_token=${MAPBOX_TOKEN}`
                );

                if (!res.ok) throw new Error(`Directions API error: ${res.status}`);

                const data = await res.json()

                if (!data.routes?.length) throw new Error("No routes found");

                setRoute(data.routes[0].geometry)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch route");
            } finally {
                setLoading(false)
            }
        }
        getRoute();
    }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude]);

    return { route, loading, error };
}