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
    <MapboxGL.ShapeSource id="parkingSource" shape={geojson}>
      <MapboxGL.CircleLayer
        id="parkingLayer"
        style={{
          circleRadius: 6,
          circleColor: "#2ecc71",
          circleStrokeWidth: 2,
          circleStrokeColor: "#ffffff",
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default ParkingSpots;