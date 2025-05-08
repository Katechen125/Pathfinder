import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, MapRegion, Place } from '../Services/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { getPhotoUrl } from '../Services/API'; 

interface Props {
  route: RouteProp<RootStackParamList, 'Itinerary'>;
}

const ItineraryScreen: React.FC<Props> = ({ route }) => { 
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Itinerary'>>(); 
  const { savedPlans } = route.params;

  const defaultRegion: MapRegion = {
    latitude: savedPlans[0]?.location.lat || 48.8566,
    longitude: savedPlans[0]?.location.lng || 2.3522,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Plans</Text>
      <FlatList
        data={savedPlans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {item.photoReference && (
              <Image
                source={{ uri: getPhotoUrl(item.photoReference) }}
                style={styles.placeImage}
              />
            )}
            <Text style={styles.placeName}>{item.name}</Text>
            <Text style={styles.placeAddress}>{item.address}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
  },
});

export default ItineraryScreen;
