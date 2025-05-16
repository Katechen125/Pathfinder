import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, Coordinates } from '../Services/types';
import { searchActivities } from '../Services/API';
import Icon from 'react-native-vector-icons/FontAwesome';
import FakeBooking from '../Screens/FakeBooking';
import { addToItinerary } from '../Services/storage';

interface Props {
  route: RouteProp<RootStackParamList, 'Activities'>;
}

interface Activity {
  id: string;
  name: string;
  description?: string;
  rating: number | string;
  address?: string;
}

const ActivitiesScreen: React.FC<Props> = ({ route }) => {
  const { location } = route.params;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { lat, lng } = location;
        const activitiesData = await searchActivities(lat, lng);
        setActivities(activitiesData);
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [location]);

  const handleBook = async () => {
    if (!selectedActivity) return;
    await addToItinerary({
      id: selectedActivity.id,
      type: 'activity',
      data: selectedActivity,
      date: new Date().toISOString(),
    });
    setShowBookingModal(false);
    Alert.alert('Booking Successful', 'Your activity has been added to your itinerary!');
  };

  const loadMoreActivities = async () => {
    if (!nextCursor) return;
    try {
      const { lat, lng } = location;
      const moreActivities = await searchActivities(lat, lng);
      setActivities(prev => [...prev, ...moreActivities]);
    } catch (error) {
      console.error('Error loading more activities:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading activities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Icon name="ticket" size={28} color="#2196F3" style={styles.headerIcon} />
        <Text style={styles.header}>Things to Do</Text>
      </View>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Icon name="exclamation-circle" size={36} color="#bbb" />
            <Text style={styles.emptyText}>No activities found in this area</Text>
          </View>
        }
        ListFooterComponent={
          nextCursor ? (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreActivities}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>

            <View style={styles.detailsRow}>
              <Icon name="star" size={16} color="#FF9800" />
              <Text style={styles.rating}>{item.rating}/5</Text>

              <Icon name="map-marker" size={16} color="#4CAF50" style={styles.addressIcon} />
              <Text style={styles.address}>{item.address || 'Address not available'}</Text>
            </View>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => {
                setSelectedActivity(item);
                setShowBookingModal(true);
              }}
            >
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <FakeBooking
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleBook}
        item={selectedActivity}
        type="activity"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#2196F3',
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  headerIcon: {
    marginHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2d3436',
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    color: '#FF9800',
    marginRight: 20,
  },
  addressIcon: {
    marginLeft: 20,
  },
  address: {
    fontSize: 14,
    color: '#4CAF50',
    flexShrink: 1,
  },
  description: {
    fontSize: 14,
    color: '#636e72',
    marginBottom: 12,
    lineHeight: 20,
  },
  detailsButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 40,
    opacity: 0.7,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  loadMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 8,
    marginTop: 10,
    marginHorizontal: 16,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ActivitiesScreen;

