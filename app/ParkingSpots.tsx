import React from "react";
import MapboxGL from "@rnmapbox/maps";
import { FeatureCollection, Point } from "geojson";

type Props = {
  spots: GeoJSON.Feature<Point>[];
};

const ParkingSpots = ({ spots }: Props) => {

  const geojson: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: spots,
  };

  return (
    <>
      {/* Register the icon */}
      <MapboxGL.Images
        images={{
          wheelchair: require("../assets/images/wheelchair.png"),
        }}
      />

      <MapboxGL.ShapeSource id="parkingSource" shape={geojson}>
        <MapboxGL.SymbolLayer
          id="parkingSymbols"
          style={{
            iconImage: "wheelchair",
            iconSize: 0.8,
            iconAllowOverlap: true,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};

export default ParkingSpots;