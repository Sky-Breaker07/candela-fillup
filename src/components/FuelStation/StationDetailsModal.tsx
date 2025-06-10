import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView
} from 'react-native';
import { FuelStation, getPlaceDetails } from '../../utils/mapService';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface StationDetailsModalProps {
  station: FuelStation | null;
  visible: boolean;
  onClose: () => void;
}

const StationDetailsModal: React.FC<StationDetailsModalProps> = ({ 
  station, 
  visible, 
  onClose 
}) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (station && visible) {
      fetchStationDetails(station.id);
    } else {
      setDetails(null);
    }
  }, [station, visible]);

  const fetchStationDetails = async (placeId: string) => {
    setLoading(true);
    try {
      const placeDetails = await getPlaceDetails(placeId);
      setDetails(placeDetails);
    } catch (error) {
      console.error('Error fetching station details:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDirections = () => {
    if (!station) return;
    
    const { latitude, longitude } = station.coordinates;
    const label = encodeURI(station.name);
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };

  const openPhone = (phone: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const openWebsite = (website: string) => {
    if (!website) return;
    Linking.openURL(website);
  };

  if (!station) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          
          <ScrollView style={styles.scrollView}>
            <Text style={styles.stationName}>{station.name}</Text>
            <Text style={styles.stationAddress}>{station.address}</Text>
            
            <View style={styles.statusRow}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: station.isCurrentlySelling ? '#4CAF50' : '#F44336' }
                ]} 
              />
              <Text style={styles.statusText}>
                {station.isCurrentlySelling ? 'Currently Selling Fuel' : 'Not Selling Fuel'}
              </Text>
            </View>
            
            {station.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingLabel}>Rating: </Text>
                <Text style={styles.ratingValue}>{station.rating}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= Math.floor(station.rating!) ? "star" : star <= station.rating! ? "star-half" : "star-outline"}
                      size={16}
                      color="#FFD700"
                    />
                  ))}
                </View>
              </View>
            )}
            
            {loading ? (
              <ActivityIndicator size="large" color="#FF6B00" style={styles.loader} />
            ) : details ? (
              <View style={styles.detailsContainer}>
                {details.opening_hours && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Opening Hours</Text>
                    {details.opening_hours.weekday_text?.map((day: string, index: number) => (
                      <Text key={index} style={styles.openingHoursText}>{day}</Text>
                    ))}
                    {!details.opening_hours.weekday_text && (
                      <Text style={styles.openNowText}>
                        {details.opening_hours.open_now ? 'Open Now' : 'Closed Now'}
                      </Text>
                    )}
                  </View>
                )}
                
                {details.formatted_phone_number && (
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => openPhone(details.formatted_phone_number)}
                  >
                    <Ionicons name="call" size={20} color="#FF6B00" />
                    <Text style={styles.contactButtonText}>{details.formatted_phone_number}</Text>
                  </TouchableOpacity>
                )}
                
                {details.website && (
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => openWebsite(details.website)}
                  >
                    <Ionicons name="globe" size={20} color="#FF6B00" />
                    <Text style={styles.contactButtonText}>Visit Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : null}
            
            <TouchableOpacity style={styles.directionsButton} onPress={openDirections}>
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  scrollView: {
    maxHeight: '100%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  stationName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stationAddress: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#666',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  loader: {
    marginVertical: 20,
  },
  detailsContainer: {
    marginTop: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  openingHoursText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  openNowText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  contactButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  directionsButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default StationDetailsModal; 