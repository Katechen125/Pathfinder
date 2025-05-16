import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Services/types';

type BookingRouteProp = RouteProp<RootStackParamList, 'Booking'>;

const images = {
  Flights: { uri: 'https://cdn.pixabay.com/photo/2020/08/14/16/32/airplane-5488437_1280.jpg' },
  Hotels: { uri: 'https://cdn.pixabay.com/photo/2016/04/15/11/48/hotel-1330850_1280.jpg' },
  Activities: { uri: 'https://cdn.pixabay.com/photo/2016/06/09/22/52/paragliding-1446851_1280.jpg' },
};

const cards = [
  {
    label: 'Flights',
    screen: 'Flights' as const,
    icon: 'plane',
    image: images.Flights,
  },
  {
    label: 'Activities',
    screen: 'Activities' as const,
    icon: 'ticket',
    image: images.Activities,
  },
  {
    label: 'Hotels',
    screen: 'Hotels' as const,
    icon: 'hotel',
    image: images.Hotels,
  },
];

const BookingScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<BookingRouteProp>();
  const { destination, coordinates } = route.params;

  return (
    <View style={styles.container}>
      {cards.map(card => (
        <TouchableOpacity
          key={card.label}
          style={styles.card}
          onPress={() => {
            if (card.screen === 'Flights') {
              navigation.navigate('Flights', {
                origin: 'Current Location',
                destination: destination,
                date: new Date().toISOString().split('T')[0],
              });
            } else if (card.screen === 'Hotels' || card.screen === 'Activities') {
              if (coordinates) {
                navigation.navigate(card.screen, {
                  location: coordinates,
                });
              } else {
                // fallback: show alert
                Alert.alert('No location data available. Please search for a destination first.');
              }
            }
          }}
        >
          <Image source={card.image} style={styles.cardImage} />
          <View style={styles.cardOverlay}>
            <Icon name={card.icon} size={30} color="#fff" />
            <Text style={styles.cardText}>{card.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      paddingVertical: 16,
      paddingHorizontal: 8,
      justifyContent: 'space-evenly', 
    },
    card: {
      width: '96%', 
      aspectRatio: 1.7, 
      borderRadius: 24,
      overflow: 'hidden',
      elevation: 5,
      alignSelf: 'center',
      backgroundColor: '#fff',
      marginVertical: 8,
    },
    cardImage: {
      ...StyleSheet.absoluteFillObject,
      width: undefined,
      height: undefined,
      resizeMode: 'cover',
    },
    cardOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardText: {
      color: '#fff',
      fontSize: 26,
      fontWeight: 'bold',
      marginTop: 10,
      letterSpacing: 1,
      textShadowColor: 'rgba(0,0,0,0.4)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
  });

export default BookingScreen;
