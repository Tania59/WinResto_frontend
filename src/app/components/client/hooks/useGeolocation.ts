// src/app/components/client/hooks/useGeolocation.ts
import { useState, useCallback } from "react";

interface GeolocationState {
  loading: boolean;
  error: string | null;
  position: GeolocationPosition | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    position: null,
  });

  const getLocation = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("La géolocalisation n'est pas supportée par votre navigateur"));
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({ loading: false, error: null, position });
          resolve(position);
        },
        (error) => {
          const message = error.message || "Impossible d'obtenir votre position";
          setState({ loading: false, error: message, position: null });
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

  const checkDistance = useCallback((
    userPos: GeolocationPosition,
    restaurantLat: number,
    restaurantLng: number,
    radiusMeters: number = 100
  ): boolean => {
    const R = 6371e3;
    const φ1 = userPos.coords.latitude * Math.PI / 180;
    const φ2 = restaurantLat * Math.PI / 180;
    const Δφ = (restaurantLat - userPos.coords.latitude) * Math.PI / 180;
    const Δλ = (restaurantLng - userPos.coords.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance <= radiusMeters;
  }, []);

  return {
    ...state,
    getLocation,
    checkDistance,
  };
}