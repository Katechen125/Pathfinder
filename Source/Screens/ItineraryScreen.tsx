
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchPlaces, getPhotoUrl } from '../Services/API';

interface Props {
  route: any;
}

const ItineraryScreen: React.FC<Props> = ({ route }) => {
  const { destination } = route.params;
  const [places, setPlaces] = useState<any[]>([]);
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Places in {destination}</Text>

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
                onPress={() => Alert.alert(`Added ${place.name} to itinerary`)}
              >
                <Text style={styles.buttonText}>Save to Plan</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.hotelButton]}
                onPress={() => Alert.alert(`Searching hotels near ${place.name}`)}
              >
                <Text style={styles.buttonText}>Hotels</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.activityButton]}
                onPress={() => Alert.alert(`Showing activities for ${place.name}`)}
              >
                <Text style={styles.buttonText}>Activities</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.flightButton]}
                onPress={() => Alert.alert(`Finding flights to ${place.name}`)}
              >
                <Text style={styles.buttonText}>Flights</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: places[0]?.location.lat || 0,
          longitude: places[0]?.location.lng || 0,
          latitudeDelta: 5,
          longitudeDelta: 5,
        }}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.location.lat,
              longitude: place.location.lng,
            }}
            title={place.name}
          />
        ))}
      </MapView>
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
  placeName: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  placeImage: { 
    width: '100%', 
    height: 200 
  },
  placeAddress: { 
    fontSize: 16 
  },
  map: { 
    flexGrow: 1, 
    height: '40%' 
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  itineraryButton: {
    backgroundColor: '#4CAF50', // Green
  },
  hotelButton: {
    backgroundColor: '#2196F3', // Blue
  },
  activityButton: {
    backgroundColor: '#FF9800', // Orange
  },
  flightButton: {
    backgroundColor: '#9C27B0', // Purple
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  }
});

export default ItineraryScreen;
