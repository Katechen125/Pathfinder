import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Services/types';
import { searchLocations } from '../Services/API';
import { getPastSearches, addPastSearch } from '../Services/storage';
import Icon from 'react-native-vector-icons/FontAwesome';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const BAD_WORDS = [
  'damn', 'hell', 'shit', 'fuck', 'bitch', 'asshole', 'dick', 'piss', 'crap'
];

const containsBadWords = (text: string) => {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
};

type LocationSuggestion = {
  id: string;
  name: string;
};


const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string, name: string }[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionSelected, setIsSuggestionSelected] = useState(false);
  const [lastSuggestions, setLastSuggestions] = useState<LocationSuggestion[]>([]);
  const [hasPastSearches, setHasPastSearches] = useState(false);

  useEffect(() => {
    const checkPastSearches = async () => {
      const searches = await getPastSearches();
      setHasPastSearches(searches.length > 0);
    };

    checkPastSearches();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => hasPastSearches ? (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })}
        >
          <Text style={{ color: '#2196F3', fontWeight: '600' }}>Skip</Text>
        </TouchableOpacity>
      ) : null,
      headerLeft: () => null,
    });
  }, [hasPastSearches, navigation]);

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

    const exactMatch = suggestions.some(s => s.name === searchTerm);

    if (exactMatch) return;

    setIsLoading(true);
    searchLocations(searchTerm)
      .then(res => {
        if (isActive) {

          const uniqueResults = res.filter((item: LocationSuggestion, index: number, self: LocationSuggestion[]) =>
            self.findIndex((s: LocationSuggestion) => s.id === item.id) === index
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
  }, [searchTerm]);

  const handleExplore = () => {
    if (containsBadWords(searchTerm)) {
      setShowWarning(true);
      setShowNotFound(false);
      return;
    }
    setShowWarning(false);

    const cleanSearchTerm = searchTerm.trim().toLowerCase();

    const matchFound = lastSuggestions.some(suggestion => {
      const cleanSuggestion = suggestion.name.toLowerCase();
      return cleanSearchTerm.includes(cleanSuggestion) ||
        cleanSuggestion.includes(cleanSearchTerm);
    });

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
  };

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
              accessibilityLabel="Clear password"
            >
              <Icon name="times-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        {suggestions.length > 0 && (
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
    padding: 8,
    zIndex: 2,
  },
});

export default WelcomeScreen;
