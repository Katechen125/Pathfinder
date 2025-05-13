import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, Place } from '../Services/types';

interface MapScreenProps {
  route: RouteProp<RootStackParamList, 'Map'>;
}

const MapScreen: React.FC<MapScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { places, region } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        initialRegion={region} // Fallback if region is undefined
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.location.lat,
              longitude: place.location.lng,
            }}
            title={place.name}
            description={place.address}
            pinColor={place.saved ? '#FF0000' : '#0000FF'}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MapScreen;


