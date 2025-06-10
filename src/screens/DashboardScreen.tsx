import React, { useEffect, useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  FlatList, 
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  BackHandler,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker, PROVIDER_GOOGLE, Circle } from "react-native-maps";
import BottomNav from "../components/BottomNav";
import { useMapFuelStations, SortType } from "../utils/useMapFuelStations";
import StationDetailsModal from "../components/FuelStation/StationDetailsModal";
import { FuelStation } from "../utils/mapService";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "~/store";
import { logoutUser } from "~/store/slices/authSlice";

const DashboardScreen = () => {
  const [mapView, setMapView] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'home' | 'alerts' | 'saved' | 'settings'>('home');
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  
  // Get user from Redux store
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // Get user's first name
  const firstName = user ? 
    'firstName' in user ? user.firstName : 
    'name' in user ? user.name.split(' ')[0] : 
    'User' : 'User';

  // Use our custom hook for map and fuel stations
  const { 
    isLoading, 
    error, 
    userLocation, 
    stations, 
    refreshData, 
    searchStations,
    sortType,
    setSortBy
  } = useMapFuelStations();

  // Filter stations based on search query
  const filteredStations = searchQuery ? searchStations(searchQuery) : stations;

  // Get the selected station from the station ID
  const selectedStation = selectedStationId 
    ? stations.find(station => station.id === selectedStationId) || null
    : null;

  // Handle station selection
  const handleStationSelect = (stationId: string) => {
    setSelectedStationId(stationId);
    setModalVisible(true);
  };

  // Close the modal and clear selection
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Handle tab press in bottom navigation
  const handleTabPress = (tab: 'home' | 'alerts' | 'saved' | 'settings') => {
    setActiveTab(tab);
  };

  // Toggle sort modal
  const toggleSortModal = () => {
    setSortModalVisible(!sortModalVisible);
  };

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setProfileMenuVisible(!profileMenuVisible);
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await dispatch(logoutUser());
      // The root navigator will automatically redirect based on auth state
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to sign out');
    }
  };

  // Handle sort type selection
  const handleSortSelect = (type: SortType) => {
    setSortBy(type);
    setSortModalVisible(false);
  };

  // Get sort type display name
  const getSortTypeDisplay = (): string => {
    switch (sortType) {
      case 'distance': return 'Distance';
      case 'price': return 'Price';
      case 'name': return 'Name';
      case 'fuelType': return 'Fuel Type';
      default: return 'Distance';
    }
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    if (!BackHandler) return;
    
    const backHandler = () => {
      if (profileMenuVisible) {
        setProfileMenuVisible(false);
        return true;
      }
      return false;
    };

    // Add listener for back button
    const subscription = BackHandler.addEventListener('hardwareBackPress', backHandler);

    return () => {
      subscription.remove();
    };
  }, [profileMenuVisible]);

  // Empty state component when no stations are found
  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image 
        source={require('../../assets/images/no_connection_bro_3.png')} 
        style={styles.emptyStateImage} 
      />
      <Text style={styles.emptyStateTitle}>No Fuel Stations Nearby!</Text>
      <Text style={styles.emptyStateDesc}>
        We couldn't find any fuel stations around your current location.
      </Text>
      <Text style={styles.emptyStateDesc}>
        Try adjusting your location settings or checking back later.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
        <Text style={styles.retryText}>RETRY</Text>
      </TouchableOpacity>
    </View>
  );

  // Individual station item component for the list view
  const StationItem = ({ item }: { item: FuelStation }) => (
    <TouchableOpacity 
      style={styles.stationItem}
      onPress={() => handleStationSelect(item.id)}
    >
      <View style={styles.stationIconContainer}>
        <View style={styles.stationIcon}>
          <Text style={styles.stationIconText}>⛽</Text>
        </View>
      </View>
      <View style={styles.stationDetails}>
        <Text style={styles.stationName}>{item.name}</Text>
        <Text style={styles.stationAddress}>{item.address}</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: item.isCurrentlySelling ? '#4CAF50' : '#F44336' }]} />
          <Text style={styles.statusText}>
            {item.isCurrentlySelling ? 'Currently Selling Fuel' : 'Not Selling Fuel'}
          </Text>
        </View>
      </View>
      <Text style={styles.distance}>{item.distance} km</Text>
    </TouchableOpacity>
  );

  // Loading state
  if (isLoading && !stations.length) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B00" />
          <Text style={styles.loadingText}>Finding fuel stations near you...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header with search */}
        <View style={styles.header}>
          <View style={styles.topHeaderRow}>
            <View>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.userName}>{firstName}</Text>
            </View>
            <View style={styles.headerRightContainer}>
              <TouchableOpacity style={styles.notificationButton}>
                <Ionicons name="notifications-outline" size={20} color="#333" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.profileButton}
                onPress={toggleProfileMenu}
              >
                <Ionicons name="person-circle" size={32} color="#FF6B00" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.searchIconContainer}>
              <Ionicons name="search" size={16} color="#666" />
            </View>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search fuel station" 
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Profile menu dropdown */}
        {profileMenuVisible && (
          <View style={styles.profileMenu}>
            <TouchableOpacity 
              style={styles.profileMenuItem}
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={18} color="#FF3B30" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* View toggle buttons */}
        <View style={styles.viewToggleContainer}>
          <View style={styles.viewToggle}>
            <TouchableOpacity 
              style={[styles.toggleButton, mapView && styles.activeToggle]}
              onPress={() => setMapView(true)}
            >
              <Text style={[styles.toggleText, mapView && styles.activeToggleText]}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !mapView && styles.activeToggle]}
              onPress={() => setMapView(false)}
            >
              <Text style={[styles.toggleText, !mapView && styles.activeToggleText]}>List</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Error state */}
        {error ? (
          <View style={styles.errorContainer}>
            <Image 
              source={require('../../assets/images/no_connection_bro_3.png')} 
              style={styles.emptyStateImage} 
            />
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
              <Text style={styles.retryText}>RETRY</Text>
            </TouchableOpacity>
          </View>
        ) : filteredStations.length === 0 ? (
          <EmptyState />
        ) : mapView ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={userLocation ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              } : undefined}
              showsUserLocation
              showsMyLocationButton
            >
              {/* User location circle */}
              {userLocation && (
                <Circle 
                  center={userLocation}
                  radius={1000} // 1km radius
                  fillColor="rgba(66, 133, 244, 0.1)"
                  strokeColor="rgba(66, 133, 244, 0.5)"
                  strokeWidth={1}
                />
              )}
              
              {/* Station markers */}
              {filteredStations.map((station) => (
                <Marker
                  key={station.id}
                  coordinate={station.coordinates}
                  title={station.name}
                  description={station.address}
                  onPress={() => handleStationSelect(station.id)}
                >
                  <View style={styles.markerContainer}>
                    <View style={styles.markerIcon}>
                      <Text style={styles.markerText}>⛽</Text>
                    </View>
                  </View>
                </Marker>
              ))}
            </MapView>
            
            {/* Refresh button */}
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={refreshData}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.refreshButtonText}>↻</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredStations}
            renderItem={({ item }) => <StationItem item={item} />}
            keyExtractor={item => item.id}
            style={styles.stationList}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderText}>
                  Now showing {filteredStations.length} fuel stations closest to you
                </Text>
                <View style={styles.sortBy}>
                  <Text style={styles.sortByText}>Sort by</Text>
                  <TouchableOpacity style={styles.sortByButton} onPress={toggleSortModal}>
                    <Text style={styles.sortByButtonText}>{getSortTypeDisplay()}</Text>
                    <Text style={styles.sortByButtonIcon}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            refreshing={isLoading}
            onRefresh={refreshData}
          />
        )}

        {/* Bottom navigation */}
        <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
        
        {/* Station details modal */}
        <StationDetailsModal 
          station={selectedStation}
          visible={modalVisible}
          onClose={handleCloseModal}
        />

        {/* Sort options modal */}
        <Modal
          transparent={true}
          visible={sortModalVisible}
          animationType="fade"
          onRequestClose={toggleSortModal}
        >
          <TouchableOpacity 
            style={styles.sortModalOverlay} 
            activeOpacity={1} 
            onPress={toggleSortModal}
          >
            <View style={styles.sortModalContent}>
              <Text style={styles.sortModalTitle}>Sort Stations By</Text>
              
              <TouchableOpacity 
                style={[styles.sortOption, sortType === 'distance' && styles.selectedSortOption]}
                onPress={() => handleSortSelect('distance')}
              >
                <Text style={[styles.sortOptionText, sortType === 'distance' && styles.selectedSortOptionText]}>
                  Distance
                </Text>
                {sortType === 'distance' && <Ionicons name="checkmark" size={16} color="#FF6B00" />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sortOption, sortType === 'price' && styles.selectedSortOption]}
                onPress={() => handleSortSelect('price')}
              >
                <Text style={[styles.sortOptionText, sortType === 'price' && styles.selectedSortOptionText]}>
                  Price
                </Text>
                {sortType === 'price' && <Ionicons name="checkmark" size={16} color="#FF6B00" />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sortOption, sortType === 'name' && styles.selectedSortOption]}
                onPress={() => handleSortSelect('name')}
              >
                <Text style={[styles.sortOptionText, sortType === 'name' && styles.selectedSortOptionText]}>
                  Name
                </Text>
                {sortType === 'name' && <Ionicons name="checkmark" size={16} color="#FF6B00" />}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.sortOption, sortType === 'fuelType' && styles.selectedSortOption]}
                onPress={() => handleSortSelect('fuelType')}
              >
                <Text style={[styles.sortOptionText, sortType === 'fuelType' && styles.selectedSortOptionText]}>
                  Fuel Type
                </Text>
                {sortType === 'fuelType' && <Ionicons name="checkmark" size={16} color="#FF6B00" />}
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#fff',
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 12,
    color: '#666',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  notificationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMenu: {
    position: 'absolute',
    top: 55,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 5,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  signOutText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF3B30',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIconContainer: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 14,
  },
  viewToggleContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    height: 36,
  },
  toggleButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggle: {
    backgroundColor: '#FF6B00',
  },
  toggleText: {
    fontSize: 14,
    color: '#808080',
  },
  activeToggleText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapStatusBar: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBarText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 24,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptyStateDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#FF6B00',
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stationList: {
    flex: 1,
    padding: 15,
  },
  listHeader: {
    marginBottom: 10,
  },
  listHeaderText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  sortBy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortByText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  sortByButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sortByButtonText: {
    fontSize: 12,
    color: '#333',
    marginRight: 4,
  },
  sortByButtonIcon: {
    fontSize: 10,
    color: '#666',
  },
  stationItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stationIconContainer: {
    marginRight: 15,
  },
  stationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE0CC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stationIconText: {
    fontSize: 20,
  },
  stationDetails: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stationAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  distance: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B00',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFE0CC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF6B00',
  },
  markerText: {
    fontSize: 18,
  },
  sortModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortModalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
  },
  sortModalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedSortOption: {
    backgroundColor: '#FFF5EC',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSortOptionText: {
    color: '#FF6B00',
    fontWeight: '500',
  },
});