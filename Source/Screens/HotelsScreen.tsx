import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Hotel } from '../Services/types';
import { searchHotels } from '../Services/API';
import Icon from 'react-native-vector-icons/FontAwesome';
import FakeBooking from '../Screens/FakeBooking';
import { addToItinerary } from '../Services/storage';

const HotelsScreen: React.FC<{ route: RouteProp<RootStackParamList, 'Hotels'> }> = ({ route }) => {
  const { location } = route.params;
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      if (!location) return;
      try {
        setLoading(true);
        const data = await searchHotels(location.lat, location.lng);
        setHotels(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load hotels');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, [location]);

  const handleBook = async () => {
    if (!selectedHotel) return;
    await addToItinerary({
      id: selectedHotel.id,
      type: 'hotel',
      data: selectedHotel,
      date: new Date().toISOString(),
    });
    setShowBookingModal(false);
    Alert.alert('Booking Successful', 'Your hotel has been added to your itinerary!');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0984e3" />
        <Text style={styles.loadingText}>Loading hotels...</Text>
      </View>
    );
  }

  
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Icon name="hotel" size={28} color="#0984e3" style={styles.headerIcon} />
        <Text style={styles.header}>Available Hotels</Text>
      </View>

      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon name="exclamation-circle" size={36} color="#bbb" />
            <Text style={styles.emptyText}>No hotels found in this area</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            
            <View style={styles.detailsRow}>
              <Icon name="euro" size={16} color="#4CAF50" />
              <Text style={styles.price}>{item.price}/night</Text>
              
              <Icon name="star" size={16} color="#FF9800" style={styles.ratingIcon} />
              <Text style={styles.rating}>{item.rating}/5</Text>
            </View>

            <Text style={styles.address}>{item.address}</Text>

            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => {
                setSelectedHotel(item);
                setShowBookingModal(true);
              }}
            >
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <FakeBooking
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleBook}
        item={selectedHotel}
        type="hotel"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#0984e3',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
  },
  headerIcon: {
    marginHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2d3436',
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hotelIcon: {
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    flexShrink: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#4CAF50',
    marginRight: 20,
  },
  ratingIcon: {
    marginLeft: 20,
  },
  rating: {
    fontSize: 16,
    color: '#FF9800',
  },
  address: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#0984e3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.7,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default HotelsScreen;

