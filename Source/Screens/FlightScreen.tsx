import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Flight } from '../Services/types';
import { searchFlights } from '../Services/API';
 
interface Props {
  route: RouteProp<RootStackParamList, 'Flights'>;
}

const FlightsScreen: React.FC<Props> = ({ route }) => {
  const { origin, destination, date } = route.params;
  const [flights, setFlights] = useState<Flight[]>([]);
  const [savedFlights, setSavedFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

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

  const saveFlight = (flight: Flight) => {
    setSavedFlights((prev) => [...prev, flight]);
    Alert.alert(`Flight ${flight.flightNumber} saved!`);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`Flights from ${origin} to ${destination}`}</Text>
      <FlatList
        data={flights}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.flightContainer}>
            <Text style={styles.airline}>{item.airline}</Text>
            <Text>Flight #: {item.flightNumber}</Text>
            <Text>Price: €{item.price}</Text>
            <Text>Departure: {item.departureDate}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} 
                onPress={() => saveFlight(item)}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.bookButton]} 
                onPress={() => Alert.alert('Redirect to booking website...')}>
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  flightContainer: {
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton:{
   paddingVertical :8 ,
   paddingHorizontal :12 ,
   borderRadius :8 ,
   minWidth :80 ,
   alignItems :'center'
},
saveButton:{ 
backgroundColor:'#4CAF50'},
bookButton:{ 
backgroundColor:'#FF9800'},
buttonText:{
color:'white',
fontWeight:'bold'
},
airline: {
  fontSize: 16,
  fontWeight: '600',
  color: '#2d3436',
  marginBottom: 4
}
});

export default FlightsScreen;