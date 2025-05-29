import React, { useEffect, useState } from 'react';
import { View, Text, SectionList, Image, TouchableOpacity, StyleSheet, Alert, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { loadItinerary, deleteFromItinerary, getCurrentUser, } from '../Services/storage';
import { SavedItem, Flight, Hotel, Activity, Place } from '../Services/types';

const ItineraryScreen = () => {
  const [sections, setSections] = useState<{ title: string; data: SavedItem[] }[]>([]);

  const loadData = async () => {
    const username = await getCurrentUser();
    if (!username) {
      Alert.alert('Login Required', 'Please log in to view your itinerary');
      return;
    }
    const items = await loadItinerary(username);
    setSections([
      {
        title: 'Favorites',
        data: items.filter(i => i.type === 'place'),
      },
      {
        title: 'My Bookings',
        data: items.filter(i => i.type !== 'place'),
      },
    ]);
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

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled={true}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.type === 'flight'
                ? (item.data as Flight).airline
                : (item.data as Place | Hotel | Activity).name}
            </Text>
            <Text style={styles.subtitle}>
              {item.type.toUpperCase()} • {item.date && new Date(item.date).toLocaleDateString()}
            </Text>
            <View style={styles.actionRow}>
              {item.type === 'place' ? (
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.heartContainer}
                  activeOpacity={0.7}
                >
                  <Icon
                    name="heart"
                    size={28}
                    color="#FFA500"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => handleDelete(item.id)}
                  style={styles.trashButton}
                  activeOpacity={0.7}
                >
                  <Icon name="trash" size={24} color="#f44336" />
                </TouchableOpacity>
              )}
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
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    padding: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  heartRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  sectionHeaderContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,   
    borderBottomRightRadius: 12, 
    marginTop: 16,
    marginBottom: 4,
    alignItems: 'center',
    elevation: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA500',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  trashButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginLeft: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  heartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginLeft: 10,
  },

});

export default ItineraryScreen;
