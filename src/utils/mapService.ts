import * as Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform } from 'react-native';

// Google Maps API Key
const API_KEY = "AIzaSyDQiZU7d7vwSwkfpkGq_2Pzn2JUirdpI-s";

// Interface for location coordinates
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

// Interface for fuel station
export interface FuelStation {
  id: string;
  name: string;
  coordinates: LocationCoordinates;
  address: string;
  isCurrentlySelling: boolean;
  distance: string;
  rating?: number;
  openNow?: boolean;
  priceLevel?: number;
}

/**
 * Request location permissions for Android
 */
const requestAndroidLocationPermission = async (): Promise<boolean> => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Location Permission",
        message: "Candela needs your location to find the nearest fuel stations.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Error requesting location permission:', err);
    return false;
  }
};

/**
 * Request location permissions and get current location
 */
export const getCurrentLocation = async (): Promise<LocationCoordinates | null> => {
  try {
    // Request permissions based on platform
    let permissionGranted = true;
    
    if (Platform.OS === 'android') {
      permissionGranted = await requestAndroidLocationPermission();
    }
    
    if (!permissionGranted) {
      console.error('Location permission not granted');
      return null;
    }
    
    // Get current location
    return new Promise<LocationCoordinates | null>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position: Geolocation.GeoPosition) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error: Geolocation.GeoError) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        { 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000 
        }
      );
    });
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

/**
 * Fetch nearby gas stations from Google Maps API
 */
export const fetchNearbyGasStations = async (
  coordinates: LocationCoordinates,
  radius: number = 10000
): Promise<FuelStation[]> => {
  try {
    const { latitude, longitude } = coordinates;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=gas_station&region=NG&language=en&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Error fetching gas stations:', data.status);
      return [];
    }
    
    // Parse the results into our FuelStation format
    return data.results.map((place: any, index: number) => {
      // Calculate distance in kilometers (simple calculation, not road distance)
      const placeLocation = place.geometry.location;
      const distance = getDistanceFromLatLonInKm(
        coordinates.latitude,
        coordinates.longitude,
        placeLocation.lat,
        placeLocation.lng
      ).toFixed(1);
      
      return {
        id: place.place_id || `station-${index}`,
        name: place.name,
        coordinates: {
          latitude: placeLocation.lat,
          longitude: placeLocation.lng,
        },
        address: place.vicinity,
        isCurrentlySelling: place.business_status === 'OPERATIONAL',
        distance,
        rating: place.rating,
        openNow: place.opening_hours?.open_now,
        priceLevel: place.price_level,
      };
    });
  } catch (error) {
    console.error('Error fetching nearby fuel stations:', error);
    return [];
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 * Using the Haversine formula
 */
function getDistanceFromLatLonInKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Get details for a specific place
 */
export const getPlaceDetails = async (placeId: string): Promise<any> => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,opening_hours,formatted_phone_number,rating,price_level,website&key=${API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Error fetching place details:', data.status);
      return null;
    }
    
    return data.result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}; 