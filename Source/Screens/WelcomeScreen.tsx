import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, ActivityIndicator, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Services/types';
import { searchLocations } from '../Services/API';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const BAD_WORDS = [
  'damn', 'hell', 'shit', 'fuck', 'bitch', 'asshole', 'dick', 'piss', 'crap'
];

const containsBadWords = (text: string) => {
  const lower = text.toLowerCase();
  return BAD_WORDS.some(word => lower.includes(word));
};


const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{ id: string, name: string }[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;
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
          setSuggestions(res);
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

    const match = suggestions.find(s => s.name.toLowerCase() === searchTerm.trim().toLowerCase());
    if (!match) {
      setShowNotFound(true);
      return;
    }
    setShowNotFound(false);

    navigation.navigate('Home', { destination: searchTerm });
  };

  const handleSuggestionPress = (place: string) => {
    setSearchTerm(place);
    setShowWarning(false);
    setShowNotFound(false);
    setSuggestions([]);
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
        </View>
        {suggestions.length > 0 && (
          <View style={styles.suggestionBox}>
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={suggestions}
              keyExtractor={item => item.id}
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
  suggestionText: {
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2196F3',
  },
  warningText: {
    color: '#f44336',
    marginBottom: 10,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
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
  }
});

export default HomeScreen;
