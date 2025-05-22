import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, Alert, TextInput, Modal, Pressable } from 'react-native';
import { fetchPlaces, getPhotoUrl, geocodeLocation, fetchNearbyPlaces } from '../Services/API';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Place, MapRegion } from '../Services/types';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import debounce from 'lodash.debounce';
import { logoutUser } from '../Services/storage';
import { getPastSearches, deletePastSearch } from '../Services/storage';


interface Props {
  route: RouteProp<RootStackParamList, 'Home'>;
}

const DEFAULT_REGION: MapRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

const HomeScreen: React.FC<Props> = ({ route }) => {
  const initialDestination = route.params?.destination;
  const [searchQuery, setSearchQuery] = useState(initialDestination);
  const [places, setPlaces] = useState<Place[]>([]);
  const [savedPlans, setSavedPlans] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<MapRegion>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [pastSearches, setPastSearches] = useState<string[]>([]);
  const [loadingSearches, setLoadingSearches] = useState(true);
  const [showPastSearches, setShowPastSearches] = useState(false);
  const [warning, setWarning] = useState('');

  useEffect(() => {
    const fetchPastSearches = async () => {
      setLoadingSearches(true);
      const searches = await getPastSearches();
      setPastSearches(searches.reverse());
      setLoadingSearches(false);
    };
    fetchPastSearches();
  }, []);

  const handleDeleteSearch = async (term: string) => {
    await deletePastSearch(term);
    setPastSearches(prev => prev.filter(s => s !== term.toLowerCase()));
  };


  const loadData = async (query: string) => {
    try {
      setWarning('');
      setLoading(true);
      const coords = await geocodeLocation(query);
      if (!coords) {
        setWarning('No location found for your search.');
        setPlaces([]);
        return;
      }
      const [textPlaces, nearbyPlaces] = await Promise.all([
        fetchPlaces(query),
        fetchNearbyPlaces(coords.lat, coords.lng)
      ]);
      const combined = [...textPlaces, ...nearbyPlaces].filter(
        (place, index, self) => self.findIndex(p => p.id === place.id) === index
      );
      setPlaces(combined);
      if (combined.length === 0) {
        setWarning('No places found. Try another search.');
      }
    } catch (error) {
      setWarning('Could not load results. Please try again.');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      loadData(query);
    }, 500),
    []
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 15 }}>
          <Icon name="bars" size={26} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch(searchQuery);
    }
  }, [searchQuery, debouncedSearch]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const menuOptions = [
    {
      label: 'Map',
      icon: 'map',
      onPress: () => {
        setMenuVisible(false);
        if (region) {
          navigation.navigate('Map', { places, region, hotels, activities });
        } else {
          Alert.alert('Error', 'No region data available. Please search for a destination first.');
        }
      }
    },
    {
      label: 'Itinerary',
      icon: 'list-alt',
      onPress: () => {
        setMenuVisible(false);
        navigation.navigate('Itinerary', { savedPlans });
      }
    },
    {
      label: 'Booking',
      icon: 'suitcase',
      onPress: () => {
        setMenuVisible(false);
        navigation.navigate('Booking', {
          destination: searchQuery,
          coordinates: region
            ? { lat: region.latitude, lng: region.longitude }
            : undefined,
        });
      }
    },
    {
      label: 'Budget',
      icon: 'money',
      onPress: () => {
        setMenuVisible(false);
        navigation.navigate('Budget');
      }
    },
    {
      label: 'Calendar',
      icon: 'calendar',
      onPress: () => {
        setMenuVisible(false);
        navigation.navigate('Calendar');
      }
    },
    {
      label: 'Visa Requirement',
      icon: 'id-card',
      onPress: () => {
        setMenuVisible(false);
        navigation.navigate('Visa');
      }
    },
    {
      label: 'Feedback',
      icon: 'comment',
      onPress: () => {
        setMenuVisible(false);
        navigation.navigate('Feedback');
      }
    },
    {
      label: 'Log Out',
      icon: 'sign-out',
      onPress: async () => {
        setMenuVisible(false);
        await logoutUser();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  ];
  return (
    <View style={styles.container}>
      <View style={styles.pastSearchesHeader}>
        <TouchableOpacity
          style={styles.pastSearchesToggle}
          onPress={() => setShowPastSearches(v => !v)}
        >
          <Text style={styles.pastSearchesTitle}>Past Searches</Text>
          <Icon
            name={showPastSearches ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#2196F3"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        {showPastSearches && (
          loadingSearches ? (
            <ActivityIndicator size="small" color="#2196F3" />
          ) : pastSearches.length === 0 ? (
            <Text style={{ color: '#888', marginTop: 8 }}>No past searches</Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {pastSearches.map((term, idx) => (
                <View key={term} style={styles.searchCard}>
                  <Text style={{ fontSize: 16 }}>{term}</Text>
                  <TouchableOpacity onPress={() => handleDeleteSearch(term)}>
                    <Icon name="trash" size={18} color="#d32f2f" style={{ marginLeft: 8 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )
        )}
      </View>
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            {menuOptions.map((opt) => (
              <TouchableOpacity
                key={opt.label}
                style={styles.menuItem}
                onPress={opt.onPress}
              >
                <Icon name={opt.icon} size={22} color="#2196F3" style={{ marginRight: 15 }} />
                <Text style={styles.menuText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
        />
      </View>

      {warning !== '' && (
        <Text style={styles.warningText}>{warning}</Text>
      )}

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
              <View style={styles.addressRow}>
                <Text style={styles.placeAddress} numberOfLines={1} ellipsizeMode="tail">
                  {place.address}
                </Text>
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
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 50,
    marginRight: 10,
    paddingVertical: 10,
    minWidth: 220,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  pastSearchesHeader: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pastSearchesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pastSearchesTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2196F3',
  },
  warningText: {
    color: '#FF9800',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 8,
  }

});

export default HomeScreen;