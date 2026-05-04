export type FixedCoordinate = {
    id: number;
    name: string;
    city: string;
    latitude: number;
    longitude: number;
};

export type EntranceCoordinate = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
};

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const fixedCoordinateList = async (): Promise<FixedCoordinate[]> => {
    console.log("API_URL: ", process.env.EXPO_PUBLIC_API_URL);
    const response = await fetch(`${API_URL}/locations`);
    console.log("response status: ", response.status);
    const data = await response.json();
    console.log("fetched locations: ", data);
    return data.coordinates;
};

export const entranceCoordinateList = async (): Promise<EntranceCoordinate[]> => {
    const response = await fetch(`${API_URL}/entrance-locations`);
    const data = await response.json();
    return data.entranceCoordinates;
};