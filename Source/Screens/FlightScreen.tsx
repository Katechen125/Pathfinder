import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Flight } from '../Services/types';
import { searchFlights } from '../Services/API';
import Icon from 'react-native-vector-icons/FontAwesome';
import FakeBooking from '../Screens/FakeBooking';
import { addToItinerary } from '../Services/storage';

interface Props {
  route: RouteProp<RootStackParamList, 'Flights'>;
}

const airlineLogos = {
  'Air France': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb-VcKXn2_IQFcoPsRctKazojHYuSD2AvZww&shttps://cdn.dribbble.com/userupload/28317662/file/original-03bf36bb8152e7cbb02e087fa0f12775.jpg',
  'Lufthansa': 'https://www.flyintravel.me/wp-content/uploads/2023/12/Lufthansa-Logo-PNG15.png'
};

const FlightsScreen: React.FC<Props> = ({ route }) => {
  const { origin, destination, date } = route.params;
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        setLoading(true);
        const flightData = await searchFlights(origin, destination, date);
        setFlights(flightData);
      } catch (error) {
        Alert.alert('Error', 'Failed to load flights');
      } finally {
        setLoading(false);
      }
    };

    fetchFlightData();
  }, [origin, destination, date]);

  const handleBook = async () => {
    if (!selectedFlight) return;
    await addToItinerary({
      id: selectedFlight.id,
      type: 'flight',
      data: selectedFlight,
      date: new Date().toISOString(),
    });
    setShowBookingModal(false);
    Alert.alert('Booking Successful', 'Your flight has been added to your itinerary!');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={{ marginTop: 10, color: '#2196F3' }}>Loading flights...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Icon name="plane" size={28} color="#2196F3" style={{ marginRight: 10 }} />
        <Text style={styles.title}>Flights</Text>
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <View style={styles.iconTextGroup}>
            <Icon name="map-marker" size={18} color="#FF9800" style={styles.leftIcon} />
            <Text style={styles.locationText} numberOfLines={2} ellipsizeMode="tail">
              Current{'\n'}Location
            </Text>
          </View>
          <Icon name="arrow-right" size={22} color="#2196F3" style={styles.arrowIcon} />
          <View style={styles.iconTextGroup}>
            <Icon name="map-marker" size={18} color="#FF9800" style={styles.leftIcon} />
            <Text style={styles.locationText} numberOfLines={2} ellipsizeMode="tail">
              {destination}
            </Text>
          </View>
          <View style={styles.iconTextGroup}>
            <Icon name="calendar" size={18} color="#607D8B" style={styles.leftIcon} />
            <Text style={styles.dateText} numberOfLines={2} ellipsizeMode="tail">
              {date}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={flights}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.flightContainer}>
            <View style={styles.flightHeader}>
              <View style={styles.flightInfoBlock}>
                <Text style={styles.airline}>{item.airline}</Text>
                <Text style={styles.flightInfo}><Text style={styles.bold}>Flight #:</Text> {item.flightNumber}</Text>
                <Text style={styles.flightInfo}><Text style={styles.bold}>Price:</Text> €{item.price}</Text>
                <Text style={styles.flightInfo}><Text style={styles.bold}>Departure:</Text> {item.departureDate}</Text>
              </View>
              <Image
                source={{ uri: airlineLogos[item.airline as keyof typeof airlineLogos] }}
                style={styles.airlineLogo}
              />
            </View>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => {
                setSelectedFlight(item);
                setShowBookingModal(true);
              }}
            >
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      <FakeBooking
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleBook}
        item={selectedFlight}
        type="flight"
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    paddingHorizontal: 14,
    paddingTop: 8
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2196F3'
  },
  flightContainer: {
    marginBottom: 14,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  flightDetails: {
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.7,
  },
  emptyText: {
    color: '#888',
    fontSize: 17,
    marginTop: 8,
    textAlign: 'center',
  },
  iconMargin: {
    marginHorizontal: 8,
  },
  sideSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.2,
  },
  flightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  flightInfoBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  airlineLogo: {
    width: 64,
    height: 64,
    marginLeft: 18,
    resizeMode: 'contain',
    borderRadius: 12,
    backgroundColor: '#f4f8fb',
  },
  airline: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 2,
  },
  flightInfo: {
    fontSize: 15,
    color: '#555',
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  calendarIcon: {
    marginLeft: 8,
    marginRight: 2,
  },
  destinationIcon: {
    marginTop: 4,
    alignSelf: 'center',
  },
  locationColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    maxWidth: 80,
    flexShrink: 1,
  },
  destIcon: {
    marginTop: 2,
  },
  dateColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 64,
    marginLeft: 8,
  },
  summaryBox: {
    backgroundColor: '#e3eaf4',
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    maxWidth: 110,
    flexShrink: 1,
  },
  leftIcon: {
    marginRight: 6,
    alignSelf: 'flex-start',
  },
  locationText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'left',
    lineHeight: 18,
    flexShrink: 1,
  },
  arrowIcon: {
    marginHorizontal: 10,
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'left',
    lineHeight: 18,
    flexShrink: 1,
  },
});

export default FlightsScreen;
