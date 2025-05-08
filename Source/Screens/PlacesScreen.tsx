import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { fetchPlaces, getPhotoUrl, geocodeLocation } from '../Services/API';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Place, MapRegion } from '../Services/types';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import debounce from 'lodash.debounce';

interface Props {
  route: RouteProp<RootStackParamList, 'PlacesToGo'>;
}

const PlacesScreen: React.FC<Props> = ({ route }) => {
  const initialDestination = route.params?.destination || 'Paris';
  const [searchQuery, setSearchQuery] = useState(initialDestination);
  const [places, setPlaces] = useState<Place[]>([]);
  const [savedPlans, setSavedPlans] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<MapRegion>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Memoized debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      try {
        setLoading(true);
        console.log('Searching for:', query);
        
        const coords = await geocodeLocation(query);
        console.log('Received coordinates:', coords);
        
        const placesData = await fetchPlaces(query);
        console.log('Found places:', placesData.length);
        
        setPlaces(placesData);
        
        if (coords) {
          setRegion({
            latitude: coords.lat,
            longitude: coords.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      } catch (error) {
        console.error('Search error:', error);
        Alert.alert('Error', 'Failed to load places. Please try again.');
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    [] // Debounce function created once
  );

  // Handle initial load and subsequent searches
  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  // Clear pending debounces on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const saveToPlan = (place: Place) => {
    setSavedPlans(prev => [...prev, {...place, saved: true}]);
    Alert.alert('Saved', `${place.name} added to itinerary!`);
  };

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
        />
      </View>

      {/* Loading and results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Searching for places...</Text>
        </View>
      ) : places.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        {places.map((place) => (
          <View key={place.id} style={styles.placeContainer}>
            {place.photoReference ? (
              <Image
                source={{ uri: getPhotoUrl(place.photoReference) }}
                style={styles.placeImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imageFallback}>
                <Icon name="image" size={50} color="#ccc" />
              </View>
            )}
            
            <Text style={styles.placeName}>{place.name}</Text>
            <Text style={styles.placeAddress}>{place.address}</Text>
      
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton]}
                onPress={() => saveToPlan(place)}
              >
                <Icon name="bookmark" size={18} color="white" />
                <Text style={styles.buttonText}> Save</Text>
              </TouchableOpacity>
      
              <View style={styles.iconRow}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('Hotels', {
                    location: place.location
                  })}
                >
                  <Icon name="hotel" size={20} color="#2196F3" />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('Activities', {
                    location: place.location
                  })}
                >
                  <Icon name="ticket" size={20} color="#FF9800" />
                </TouchableOpacity>
      
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => navigation.navigate('Flights', {
                    origin: 'Current Location',
                    destination: place.name,
                    date: new Date().toISOString().split('T')[0]
                  })}
                >
                  <Icon name="plane" size={20} color="#9C27B0" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Icon name="map" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No places found for "{searchQuery}"</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchHeader: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  mapButton: {
    backgroundColor: '#795548',
  },
  savedPlansButton: {
    backgroundColor: '#607D8B',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 5,
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  placeContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  placeImage: {
    width: '100%',
    height: 200,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    paddingBottom: 5,
    color: '#333',
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  imageFallback: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0'
  },

    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      color: '#666',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: '#666',
      marginTop: 10,
      textAlign: 'center',
    }
});

export default PlacesScreen;

