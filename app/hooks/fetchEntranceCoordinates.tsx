export type EntranceCoordinate = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const generateEntranceNearLocation = (
    lat: number,
    lng: number,
    id: number,
    name: string
): EntranceCoordinate => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 0.0002;
    return {
        id,
        name: `${name}-entrance`,
        latitude: lat + distance * Math.sin(angle),
        longitude: lng + distance * Math.cos(angle),
    };
};

export const fixedEntranceCordinateList = async (): Promise<EntranceCoordinate[]> => {
    const response = await fetch(`${API_URL}/locations`);
    const data = await response.json();
    console.log("entrance data: ", data);
    if (!Array.isArray(data.coordinates)) {
        console.error("coordinates is not an array:", data);
        return [];
    }
    return data.coordinates.map((location: any) =>
        generateEntranceNearLocation(
            location.latitude,
            location.longitude,
            location.id,
            location.name
        )
    );
};

export default fixedEntranceCordinateList;