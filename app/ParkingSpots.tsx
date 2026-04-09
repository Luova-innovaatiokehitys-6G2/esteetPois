import React from "react";
import MapboxGL from "@rnmapbox/maps";
import { Feature, FeatureCollection, Point } from "geojson";

type SpotProperties = {
  id: string;
  reserved?: boolean;
};

type Props = {
  spots: Feature<Point, SpotProperties>[];
  onSelectSpot?: (lat: number, lng: number, reserved?: boolean) => void;
};

const ParkingSpots = ({ spots, onSelectSpot }: Props) => {
  const geojson: FeatureCollection<Point, SpotProperties> = {
    type: "FeatureCollection",
    features: spots,
  };

  return (
    <>
      {/* Define icons for free and reserved spots */}
      <MapboxGL.Images
        images={{
          free: require("../assets/images/free.png"),
          reserved: require("../assets/images/reserved.png"),
        }}
      />

      <MapboxGL.ShapeSource
        id="parkingSource"
        shape={geojson}
        onPress={e => {
          const feature = e.features?.[0] as Feature<Point, SpotProperties> | undefined;
          if (feature?.geometry.type === "Point") {
            const [lng, lat] = feature.geometry.coordinates as [number, number];
            const reserved = feature.properties?.reserved ?? false;
            onSelectSpot?.(lat, lng, reserved);
          }
        }}
      >
        <MapboxGL.SymbolLayer
          id="parkingSymbols"
          style={{
            iconImage: [
              "case",
              ["get", "reserved"], // If reserved = true
              "reserved",
              "free"               // Else free
            ],
            iconSize: 0.8,
            iconAllowOverlap: true,
          }}
        />
      </MapboxGL.ShapeSource>
    </>
  );
};

export default ParkingSpots;