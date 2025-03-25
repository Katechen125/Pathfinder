import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Flight } from '../Services/types';
import { searchFlights } from '../Services/API';

interface Props {
  route: RouteProp<RootStackParamList, 'FlightScreen'>;
}

const FlightsScreen: React.FC<Props> = ({ route }) => {
  const { origin, destination, date } = route.params;
  const [flights, setFlights] = useState<Flight[]>([]);
  const [savedFlights, setSavedFlights] = useState<Flight[]>([]);

  useEffect(() => {
    const fetchFlightData = async () => {
      const flightData = await searchFlights(origin, destination, date);
      setFlights(flightData);
    };

    fetchFlightData();
  }, [origin, destination, date]);

  const saveFlight = (flight: Flight) => {
    setSavedFlights((prev) => [...prev, flight]);
    Alert.alert(`Flight saved!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Flights</Text>
      <FlatList
        data={flights}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.flightContainer}>
            <Text>Airline: {item.airline || "Unknown"}</Text>
            <Text>Price: €{item.price || "N/A"}</Text>
            <Text>Departure Date: {item.departureDate || "N/A"}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={() => saveFlight(item)}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.bookButton]} onPress={() => Alert.alert('Booking flight...')}>
                <Text style={styles.buttonText}>Book</Text>
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
});

export default FlightsScreen;
