import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Place } from '../Services/types';

interface Props {
    route: RouteProp<RootStackParamList, 'MapScreen'>;
  }
  
const MapScreen: React.FC<Props> = ({ route }) => {
  const { places } = route.params;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: places[0]?.location.lat || 0,
          longitude: places[0]?.location.lng || 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {places.map((place: Place) => (
          <Marker
            key={place.id}
            coordinate={{
              latitude: place.location.lat,
              longitude: place.location.lng,
            }}
            title={place.name}
            description={place.address}
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
