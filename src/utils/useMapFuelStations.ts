import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { 
  getCurrentLocation, 
  fetchNearbyGasStations, 
  FuelStation, 
  LocationCoordinates 
} from './mapService';

export type SortType = 'distance' | 'price' | 'name' | 'fuelType';

export const useMapFuelStations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationCoordinates | null>(null);
  const [stations, setStations] = useState<FuelStation[]>([]);
  const [selectedStation, setSelectedStation] = useState<FuelStation | null>(null);
  const [sortType, setSortType] = useState<SortType>('distance');

  // Initial fetch of user location and nearby stations
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load user location and nearby fuel stations
  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user's current location
      const location = await getCurrentLocation();
      
      if (!location) {
        setError('Unable to access your location. Please enable location services.');
        setIsLoading(false);
        return;
      }
      
      setUserLocation(location);
      
      // Fetch nearby gas stations
      await fetchFuelStations(location);
    } catch (e) {
      setError('An error occurred while fetching data. Please try again.');
      console.error('Error in loadInitialData:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch fuel stations based on coordinates
  const fetchFuelStations = async (location: LocationCoordinates) => {
    setIsLoading(true);
    try {
      const stations = await fetchNearbyGasStations(location);
      setStations(stations);
    } catch (e) {
      console.error('Error fetching fuel stations:', e);
      setError('Failed to fetch nearby fuel stations.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data with current user location
  const refreshData = async () => {
    if (!userLocation) {
      // Try to get location again if it's not available
      await loadInitialData();
      return;
    }
    
    await fetchFuelStations(userLocation);
  };

  // Search stations by name or address
  const searchStations = (query: string): FuelStation[] => {
    if (!query.trim()) return getSortedStations();
    
    const lowerCaseQuery = query.toLowerCase().trim();
    return getSortedStations().filter(station => 
      station.name.toLowerCase().includes(lowerCaseQuery) || 
      station.address.toLowerCase().includes(lowerCaseQuery)
    );
  };

  // Select a specific station
  const selectStation = (stationId: string) => {
    const station = stations.find(s => s.id === stationId);
    if (station) {
      setSelectedStation(station);
    }
  };

  // Clear selected station
  const clearSelectedStation = () => {
    setSelectedStation(null);
  };

  // Set sort type
  const setSortBy = (type: SortType) => {
    setSortType(type);
  };

  // Get sorted stations based on current sort type
  const getSortedStations = (): FuelStation[] => {
    switch (sortType) {
      case 'distance':
        return [...stations].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      case 'price':
        // If price level is available, sort by price level
        return [...stations].sort((a, b) => {
          if (a.priceLevel === undefined && b.priceLevel === undefined) return 0;
          if (a.priceLevel === undefined) return 1;
          if (b.priceLevel === undefined) return -1;
          return a.priceLevel - b.priceLevel;
        });
      case 'name':
        return [...stations].sort((a, b) => a.name.localeCompare(b.name));
      case 'fuelType':
        // This would be more functional if we had fuel type data
        // For now, just sort by whether they're currently selling fuel
        return [...stations].sort((a, b) => {
          if (a.isCurrentlySelling === b.isCurrentlySelling) return 0;
          return a.isCurrentlySelling ? -1 : 1;
        });
      default:
        return stations;
    }
  };

  return {
    isLoading,
    error,
    userLocation,
    stations: getSortedStations(),
    selectedStation,
    sortType,
    setSortBy,
    refreshData,
    searchStations,
    selectStation,
    clearSelectedStation
  };
}; 