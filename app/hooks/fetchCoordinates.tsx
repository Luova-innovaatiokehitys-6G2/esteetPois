// This component fetches fixed coordinates from the local JSON-file assets/coordinates.json
// The coordinates are used for fixed markers on the map to demonstrate possible buildings to navigate to

const fixedCoordinateList = () => {
    const localData = require("../../assets/fixedCoordinates.json");
    return localData.coordinates; 
};

export default fixedCoordinateList;