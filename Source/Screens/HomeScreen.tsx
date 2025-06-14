import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, Alert, TextInput, Modal, Pressable } from 'react-native';
import { fetchPlaces, getPhotoUrl, geocodeLocation, fetchNearbyPlaces, searchActivities, searchHotels } from '../Services/API';
import { RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, Place, MapRegion, Coordinates, SavedItem } from '../Services/types';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import debounce from 'lodash.debounce';
import { logoutUser, getPastSearches, deletePastSearch, addToItinerary, deleteFromItinerary, loadItinerary, getCurrentUser, } from '../Services/storage';

interface Props {
  route: RouteProp<RootStackParamList, 'Home'>;
}

const DEFAULT_REGION: MapRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

const DEFAULT_DELTA = 0.0922;

const HomeScreen: React.FC<Props> = ({ route }) => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [hotels, setHotels] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState<MapRegion>();
  const [coordinates, setCoordinates] = useState<Coordinates | undefined>();
  const [warning, setWarning] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [pastSearches, setPastSearches] = useState<string[]>([]);
  const [loadingSearches, setLoadingSearches] = useState(true);
  const [showPastSearches, setShowPastSearches] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPlans, setSavedPlans] = useState<Place[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const initialDestination = route.params?.destination || '';
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>([]);

  // -------------------- Effects --------------------
  //0. Function to sync itinerary favourites with homescreen
  const fetchSavedPlaces = async () => {
    const username = await getCurrentUser();
    if (!username) return;
    const items = await loadItinerary(username);
    setSavedPlaceIds(items.filter(i => i.type === 'place').map(i => i.id));
  };

  useFocusEffect(
    useCallback(() => {
      fetchSavedPlaces();
    }, [places])
  );

  // 1. Set initial search if coming from WelcomeScreen
  useEffect(() => {
    if (initialDestination && !searchQuery) {
      setSearchQuery(initialDestination);
    }
  }, [initialDestination]);

  // 2. Fetch past searches on mount
  useEffect(() => {
    const fetchPast = async () => {
      setLoadingSearches(true);
      const searches = await getPastSearches();
      setPastSearches(searches.reverse());
      setLoadingSearches(false);
    };
    fetchPast();
  }, []);

  // 3. Fetch hotels and activities when region changes
  useEffect(() => {
    if (region) {
      searchHotels(region.latitude, region.longitude).then(setHotels);
      searchActivities(region.latitude, region.longitude).then(setActivities);
    }
  }, [region]);

  // 4. Debounced search for places
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query) {
        loadData(query);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, debouncedSearch]);

  // 5. Set menu icon in header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setMenuVisible(true)} style={{ marginRight: 15 }}>
          <Icon name="bars" size={26} color="#333" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);



  const toggleFavorite = async (place: Place) => {
    const username = await getCurrentUser();
    if (!username) {
      Alert.alert('Login required', 'Please log in to save favorites');
      return;
    }
    const isSaved = savedPlaceIds.includes(place.id);

    if (isSaved) {
      await deleteFromItinerary(username, place.id);
    } else {
      await addToItinerary({
        id: place.id,
        type: 'place',
        data: place,
        date: new Date().toISOString(),
      });
    }
    
    fetchSavedPlaces();
  };

  // -------------------- Handlers --------------------
  const loadData = async (query: string) => {
    setLoading(true);
    try {
      setWarning('');
      const coords = await geocodeLocation(query);

      if (!coords) {
        setWarning('No location found for your search.');
        setRegion(undefined);
        setCoordinates(undefined);
        setPlaces([]);
        setLoading(false);
        return;
      }

      setCoordinates({ lat: coords.lat, lng: coords.lng });
      setRegion({
        latitude: coords.lat,
        longitude: coords.lng,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
      });

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
      setCoordinates(undefined);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSearch = async (term: string) => {
    await deletePastSearch(term);
    setPastSearches(prev => prev.filter(s => s !== term.toLowerCase()));
  };

  // -------------------- Menu Options --------------------
  const menuOptions = [
    {
      label: 'Map',
      icon: 'map',
      onPress: () => {
        setMenuVisible(false);
        if (region) {
          navigation.navigate('Map', { places, hotels, activities, region });
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
          coordinates
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

  // -------------------- Render Functions --------------------
  const renderPastSearches = () => (
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
            {pastSearches.map((term) => (
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
  );

  const renderMenuModal = () => (
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
  );

  const renderPlaces = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Searching for places...</Text>
        </View>
      );
    }

    if (places.length > 0) {
      return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
          {places.map(place => (
            <View style={{ alignItems: 'center', width: '100%' }} key={place.id}>
              <View style={styles.card}>
                <Image
                  source={{
                    uri: place.photoReference
                      ? getPhotoUrl(place.photoReference)
                      : place.image
                        ? place.image
                        : 'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                  style={styles.image}
                />
                <View style={styles.addressHeartRow}>
                  <Text style={styles.placeName} numberOfLines={1} ellipsizeMode="tail">
                    {place.name || 'No name'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(place)}
                    style={styles.heartContainer}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={savedPlaceIds.includes(place.id) ? 'heart' : 'heart-o'}
                      size={32}
                      color={savedPlaceIds.includes(place.id) ? '#FFA500' : '#ccc'}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      );
    };


    return null;
  };


  // -------------------- Render --------------------
  return (
    <View style={styles.container}>
      {renderPastSearches()}
      {renderMenuModal()}

      <View style={styles.searchHeader}>
        <TextInput
          style={styles.searchInput}
          placeholder={initialDestination || "Search destinations..."}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="words"
        />
      </View>

      {warning !== '' && (
        <Text style={styles.warningText}>{warning}</Text>
      )}

      {renderPlaces()}
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
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    width: '92%',
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    backgroundColor: '#eee',
  },
  addressHeartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    backgroundColor: '#fff',
  },
  placeName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginRight: 8,
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 4,
  },


});

export default HomeScreen;