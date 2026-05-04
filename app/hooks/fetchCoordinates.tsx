// This component fetches fixed coordinates from the local JSON-file assets/coordinates.json
// The coordinates are used for fixed markers on the map to demonstrate possible buildings to navigate to

export type FixedCoordinate = {
  id: number;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
};

const fixedCoordinateList = () => {
    const localData = require("../../assets/fixedCoordinates.json");
    return localData.coordinates; 
};

export default fixedCoordinateList;