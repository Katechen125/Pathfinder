import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Place } from '../Services/types';
import { getPhotoUrl } from '../Services/API';
import Icon from 'react-native-vector-icons/FontAwesome';

interface MapScreenProps {
  route: RouteProp<RootStackParamList, 'Map'>;
}

const MapScreen: React.FC<MapScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { places = [], hotels = [], activities = [], region } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        initialRegion={region}
      >
        {places.map((place) => (
          <Marker
            key={`place-${place.id}`}
            coordinate={{
              latitude: place.location.lat,
              longitude: place.location.lng,
            }}
            pinColor="#2196F3"
          >
            <Callout tooltip={true}>
              <View style={styles.calloutContainer}>
                {place.photoReference && (
                  <Image
                    source={{ uri: getPhotoUrl(place.photoReference) }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.title}>{place.name}</Text>
                <Text style={styles.address}>{place.address}</Text>
              </View>
            </Callout>
          </Marker>
        ))}


        {hotels.map((hotel) =>
          hotel.location?.lat !== undefined && hotel.location?.lng !== undefined ? (
            <Marker
              key={`hotel-${hotel.id}`}
              coordinate={{
                latitude: hotel.location.lat,
                longitude: hotel.location.lng,
              }}
              pinColor="#0984e3" // blue for hotels
            >
              <Callout tooltip={true}>
                <View style={styles.calloutContainer}>
                  <Icon name="hotel" size={22} color="#0984e3" style={{ marginBottom: 6 }} />
                  <Text style={styles.title}>{hotel.name}</Text>
                  <Text style={styles.address}>{hotel.address}</Text>
                  <Text style={styles.info}>Price: {hotel.price}/night</Text>
                  <Text style={styles.info}>Rating: {hotel.rating}/5</Text>
                </View>
              </Callout>
            </Marker>
          ) : null
        )}


        {activities.map((activity) =>
          activity.location?.lat !== undefined && activity.location?.lng !== undefined ? (
            <Marker
              key={`activity-${activity.id}`}
              coordinate={{
                latitude: activity.location.lat,
                longitude: activity.location.lng,
              }}
              pinColor="#FF9800"
            >
              <Callout tooltip={true}>
                <View style={styles.calloutContainer}>
                  <Icon name="ticket" size={22} color="#FF9800" style={{ marginBottom: 6 }} />
                  <Text style={styles.title}>{activity.name}</Text>
                  <Text style={styles.address}>{activity.address}</Text>
                  <Text style={styles.info}>Rating: {activity.rating}/5</Text>
                  {activity.description && (
                    <Text style={styles.info}>{activity.description}</Text>
                  )}
                </View>
              </Callout>
            </Marker>
          ) : null
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  calloutContainer: {
    width: 250,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 6,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  info: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
});

export default MapScreen;