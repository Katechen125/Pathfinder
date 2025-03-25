import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../Services/types';
import { searchHotels, searchLocations} from '../Services/API';

const HotelsScreen: React.FC<{ route: RouteProp<RootStackParamList, 'HotelsScreen'> }> = ({ route }) => {
    const [hotels, setHotels] = useState<any[]>([]);
  
    useEffect(() => {
      const fetchHotels = async () => {
        const locations = await searchLocations('Monaco');
        const monacoId = locations.find( l => l.type === 'CITY')?.id;
        if(monacoId) {
          const data = await searchHotels(monacoId);
          setHotels(data);
        }
      };
      fetchHotels();
    }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Hotels</Text>
      <FlatList
        data={hotels}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Price/night: €{item.price}</Text>
            <Text>Rating: {item.rating}/5</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.saveButton]}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.bookButton]}>
                <Text style={styles.buttonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      padding: 16,
      backgroundColor: '#f5f5f5'
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2d3436',
      marginBottom: 20,
      textAlign: 'center'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
      },
    name: {
      fontSize: 18,
      fontWeight: '600',
      color: '#2d3436',
      marginBottom: 8
    },
    price: {
      fontSize: 16,
      color: '#0984e3',
      marginBottom: 4
    },
    rating: {
      fontSize: 14,
      color: '#636e72'
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      minWidth: 120,
      alignItems: 'center'
    },
    saveButton: { 
      backgroundColor: '#00b894'
    },
    bookButton: { 
      backgroundColor: '#0984e3'
    },
    buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 14
    }
  });
  
export default HotelsScreen;
