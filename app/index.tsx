import React, { useState } from "react";
import { TouchableOpacity } from "react-native";

import useUserCurrentLocation from "./hooks/userCurrentLocation";
import Loading from "./loading";
import BaseMap from "./baseMap"
import NavigationMap from "./navigationMap";

const Map = () => {

  const { userLocation } = useUserCurrentLocation();
  const [navigationMapView, setNavigationMapView] = useState(false);

  const userLatitude: number = userLocation?.coords.latitude ?? 0;
  const userLongitude: number = userLocation?.coords.longitude ?? 0;

  const userLocationFetched: boolean = userLongitude !== 0 && userLatitude !== 0;

  if (!userLocationFetched) return <Loading />;
  if (navigationMapView && userLocationFetched) return <NavigationMap />;

  console.log(navigationMapView)

  return <BaseMap navigationMapView={navigationMapView} onToggle={() => setNavigationMapView(prev => !prev)} />;
}

export default Map;