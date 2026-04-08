// This component fetches coordinates of entrances to building from the local JSON-file assets/fixedCoordinatesEntrance.json
// The coordinates are used for fixed markers on the map for entrances to demonstrate possible building-entraces to navigate to

const fixedEntranceCordinateList = () => {
    const localData = require("../../assets/fixedEntranceCoordinates.json");
    return localData.entranceCoordinates; 
};

export default fixedEntranceCordinateList;