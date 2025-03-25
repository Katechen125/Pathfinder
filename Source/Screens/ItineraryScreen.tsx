
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { fetchPlaces, getPhotoUrl } from '../Services/API';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Place } from '../Services/types';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
    route: RouteProp<RootStackParamList, 'ItineraryScreen'>;
  }

const ItineraryScreen: React.FC<Props> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { destination } = route.params;
  const [places, setPlaces] = useState<any[]>([]);
  const [savedPlans, setSavedPlans] = useState<any[]>([]); // To store saved places
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlacesData = async () => {
      try {
        const data = await fetchPlaces(destination);
        setPlaces(data);
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };

    getPlacesData();
  }, [destination]);

  const saveToPlan = (place: Place) => {
    setSavedPlans((prevPlans) => [...prevPlans, place]);
    Alert.alert(`${place.name} has been added to your itinerary!`);
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
  <View style={styles.headerButtons}>
    <TouchableOpacity
      style={[styles.actionButton, styles.mapButton]}
      onPress={() => navigation.navigate('MapScreen', { places })}
    >
      <Text style={styles.buttonText}>View Full Map</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.actionButton, styles.savedPlansButton]}
      onPress={() => navigation.navigate('SavedPlansScreen', { savedPlans })}
    >
      <Text style={styles.buttonText}>Saved Plans</Text>
    </TouchableOpacity>
  </View>

  <ScrollView contentContainerStyle={styles.scrollContainer}>
        {places.map((place) => (
          <View key={place.id} style={styles.placeContainer}>
            <Text style={styles.placeName}>{place.name}</Text>
            {place.photoReference && (
              <Image
                source={{ uri: getPhotoUrl(place.photoReference) }}
                style={styles.placeImage}
              />
            )}
            <Text style={styles.placeAddress}>{place.address}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.itineraryButton]}
                onPress={() => saveToPlan(place)}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.hotelButton]}
                onPress={() => navigation.navigate('HotelsScreen', { 
                  location: place.location 
                })}
              >
                <Text style={styles.buttonText}>Hotels</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.activityButton]}
                onPress={() => navigation.navigate('ActivitiesScreen', { 
                  location: place.location 
                })}
              >
                <Text style={styles.buttonText}>Activities</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.flightButton]}
                onPress={() => navigation.navigate('FlightScreen', { 
                  origin: 'Orlando', 
                  destination: place.name,
                  date: new Date().toISOString().split('T')[0]
                })}
              >
                <Text style={styles.buttonText}>Flights</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
   );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  scrollContainer: { 
    paddingHorizontal: 20 
  },
  placeContainer: { 
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeName: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  placeImage: { 
    width: '100%', 
    height: 200, 
    borderRadius: 10 
  },
  placeAddress: { 
    fontSize: 16, 
    color: '#555', 
    marginTop: 5 
  },
  
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  
  actionButton:{
   paddingVertical :8 ,
   paddingHorizontal :12 ,
   borderRadius :8 ,
   minWidth :65 ,
   alignItems :'center'
},
  

itineraryButton:{ 
  backgroundColor:'#4CAF50'
},
hotelButton:{ 
  backgroundColor:'#2196F3'
},
activityButton:{ 
  backgroundColor:'#FF9800'
},
flightButton:{ 
  backgroundColor:'#9C27B0'
},

buttonText:{
color:'white',
fontWeight:'bold'
},
  
map:{
  flexGrow :1 ,
  height :'40%' 
},

headerButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 15,
},
mapButton: {
  backgroundColor: '#795548',
},
savedPlansButton: {
  backgroundColor: '#9E9E9E',
},
});

export default ItineraryScreen;
