import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';

export default function useUserTrackLocation() {
  const [updatedUserLocation, setUpdatedUserLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function trackUserLocation() {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg('Oops, cannot get location on Android Emulator');
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission denied');
        return;
      }

      const loc = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10
        },
        (newLocation) => {
          setUpdatedUserLocation(newLocation)
        }
      )
      return () => {
        loc.remove()
      }
    }
    trackUserLocation();
  }, []);

  return { updatedUserLocation, errorMsg };
}