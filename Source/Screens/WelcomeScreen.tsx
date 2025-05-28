import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Services/types';
import { searchLocations } from '../Services/API';
import { getPastSearches, addPastSearch } from '../Services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const BAD_WORDS = ['damn', 'hell', 'shit', 'fuck', 'bitch', 'asshole', 'dick', 'piss', 'crap'];

const containsBadWords = (text: string) =>
  BAD_WORDS.some(word => text.toLowerCase().includes(word));

type LocationSuggestion = { id: string; name: string; };

const WelcomeScreen: React.FC = () => {
  // -------------------- Navigation --------------------
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  // -------------------- State --------------------
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [lastSuggestions, setLastSuggestions] = useState<LocationSuggestion[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // -------------------- Effects --------------------
  // Show Skip button only if user has logged in before
  useEffect(() => {
    AsyncStorage.getItem('@has_logged_in').then(val => setShowSkip(val === 'true'));
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: showSkip
        ? () => (
          <TouchableOpacity style={{ marginRight: 15 }} onPress={handleSkip}>
            <Text style={{ color: '#2196F3', fontWeight: 'bold' }}>Skip</Text>
          </TouchableOpacity>
        )
        : undefined,
    });
  }, [navigation, showSkip]);

  // Fetch suggestions when searchTerm changes
  useEffect(() => {
    let isActive = true;

    if (isSuggestionSelected) {
      setIsSuggestionSelected(false);
      return;
    }

    if (searchTerm.length < 2 || containsBadWords(searchTerm)) {
      setSuggestions([]);
      setShowNotFound(false);
      setShowWarning(containsBadWords(searchTerm));
      return;
    }

    setIsLoading(true);
    searchLocations(searchTerm)
      .then(res => {
        if (isActive) {
          const uniqueResults = res.filter(
            (item: LocationSuggestion, idx: number, self: LocationSuggestion[]) =>
              self.findIndex((s: LocationSuggestion) => s.id === item.id) === idx
          );
          setSuggestions(uniqueResults);
          setLastSuggestions(uniqueResults);
          setShowNotFound(false);
        }
      })
      .catch(() => {
        if (isActive) setSuggestions([]);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => { isActive = false; };
  }, [searchTerm, isSuggestionSelected]);

  // -------------------- Handlers --------------------
  const handleExplore = () => {
    if (containsBadWords(searchTerm)) {
      setShowWarning(true);
      setShowNotFound(false);
      return;
    }
    setShowWarning(false);

    const cleanSearchTerm = searchTerm.trim().toLowerCase();
    const matchFound = lastSuggestions.some(suggestion =>
      cleanSearchTerm.includes(suggestion.name.toLowerCase()) ||
      suggestion.name.toLowerCase().includes(cleanSearchTerm)
    );

    if (!matchFound && cleanSearchTerm !== '') {
      setShowNotFound(true);
      return;
    }

    addPastSearch(searchTerm.trim());
    setShowNotFound(false);
    navigation.navigate('Home', { destination: searchTerm });
  };

  const handleSuggestionPress = (place: string) => {
    setSearchTerm(place);
    setSuggestions([]);
    setShowWarning(false);
    setShowNotFound(false);
    setIsSuggestionSelected(true);
    setShowSuggestions(false);
  };

  const handleSkip = async () => {
    const searches = await getPastSearches();
    const lastSearch = searches.length > 0 ? searches[searches.length - 1] : '';
    navigation.navigate('Home', { destination: lastSearch });
  };

  // -------------------- Render --------------------
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=80' }}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Pathfinder</Text>
        <Text style={styles.subtitle}>Discover your next adventure</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Where to? (City, Country)"
            value={searchTerm}
            onChangeText={text => {
              setSearchTerm(text);
              setShowWarning(false);
              setShowNotFound(false);
              setShowSuggestions(true);
            }}
            style={styles.searchInput}
            placeholderTextColor="#555"
            autoCorrect={false}
            autoCapitalize="words"
          />
          {isLoading && <ActivityIndicator style={styles.loadingIcon} color="#2196F3" />}
          {searchTerm.length > 0 && (
            <TouchableOpacity
              style={styles.clearIcon}
              onPress={() => setSearchTerm('')}
              accessibilityLabel="Clear search"
            >
              <Icon name="times-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={suggestions}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSuggestionPress(item.name)} style={styles.suggestionItem}>
                  <Text style={styles.suggestionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
        {showWarning && (
          <Text style={styles.warningText}>
            Oops! Please use friendly language.
          </Text>
        )}
        {showNotFound && (
          <Text style={styles.warningText}>
            Sorry, we couldn't find that place. Try another or pick from suggestions!
          </Text>
        )}
        <TouchableOpacity
          style={[
            styles.searchButton,
            (showWarning || showNotFound || searchTerm.trim() === '') && { backgroundColor: '#ccc' }
          ]}
          onPress={handleExplore}
          disabled={showWarning || showNotFound || searchTerm.trim() === ''}
        >
          <Text style={styles.buttonText}>Explore</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
  },
  inputWrapper: {
    width: '100%',
    position: 'relative',
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 25,
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    fontSize: 18,
    position: 'relative',
  },
  loadingIcon: {
    position: 'absolute',
    right: 15,
    top: 13,
  },
  suggestionBox: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    maxHeight: 180,
    elevation: 3,
    zIndex: 10,
  },
  suggestionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  warningText: {
    color: '#FF9800',
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  suggestionText: {
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'black',
  },
  searchButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  clearIcon: {
    position: 'absolute',
    right: 44,
    top: '50%',
    transform: [{ translateY: -12 }], 
    zIndex: 2,
  },

});

export default WelcomeScreen;
