import React from "react";
import useUserCurrentLocation from "./hooks/userCurrentLocation";
import Loading from "./loading";
import BaseMap from "./baseMap"

const Map = () => {

  const { userLocation } = useUserCurrentLocation();
  const userLatitude: number = userLocation?.coords.latitude ?? 0;
  const userLongitude: number = userLocation?.coords.longitude ?? 0;
  const userLocationFetched: boolean = userLongitude !== 0 && userLatitude !== 0;

  if (!userLocationFetched) return <Loading />;
  return <BaseMap />;
}

export default Map;