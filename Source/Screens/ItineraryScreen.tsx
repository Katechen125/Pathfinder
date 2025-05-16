import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { loadItinerary, deleteFromItinerary, getCurrentUser } from '../Services/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SavedItem } from '../Services/types';

const ItineraryScreen = () => {
  const [plans, setPlans] = useState<SavedItem[]>([]);

  const loadData = async () => {
    const username = await getCurrentUser();
    if (!username) {
      Alert.alert('Login Required', 'Please log in to view your itinerary');
      return;
    }
    const items = await loadItinerary(username);
    setPlans(items);
  };

  const handleDelete = async (id: string) => {
    const username = await getCurrentUser();
    if (!username) return;

    try {
      await deleteFromItinerary(username, id);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        <Icon name="bookmark" size={24} color="#2196F3" /> My Itinerary
      </Text>

      <FlatList
        data={plans}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No bookings yet. Start planning!</Text>
        }
        renderItem={({ item }) => {
          const isFlight = item.type === 'flight';
          const isPlace = item.type === 'place';
          const isHotel = item.type === 'hotel';
          const isActivity = item.type === 'activity';

          return (
            <View style={styles.card}>
              {item.data.image && (
                <Image source={{ uri: item.data.image }} style={styles.image} />
              )}
              <Text style={styles.title}>
                {isFlight
                  ? (item.data as any).airline
                  : (item.data as any).name}
              </Text>

              <Text style={styles.subtitle}>
                {item.type.toUpperCase()} •{' '}
                {item.date && new Date(item.date).toLocaleDateString()}
              </Text>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
              >
                <Icon name="trash" size={16} color="white" />
                <Text style={styles.buttonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        }}
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    padding: 16,
    margin: 16,
    textAlign: 'center',
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
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 8,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    alignSelf: 'flex-end',
    width: 100
  },
  buttonText: {
    color: 'white',
    marginLeft: 5
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
  },
});

export default ItineraryScreen;
