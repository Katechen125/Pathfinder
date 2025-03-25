import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity,Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList} from '../Services/types';
import { searchActivities } from '../Services/API';

interface Props {
  route: RouteProp<RootStackParamList, 'ActivitiesScreen'>;
}

const ActivitiesScreen: React.FC<Props> = ({ route }) => {
  const {location} = route.params;
  const [activities, setActivities] = useState<any[]>([]);
  const [savedActivities, setSavedActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      const { activities: fetchedActivities, nextCursor } = await searchActivities(location);
      setActivities(fetchedActivities);
      setNextCursor(nextCursor);
      setLoading(false);
    };

    fetchActivities();
  }, [location]);

  const loadMoreActivities = async () => {
    if (!nextCursor) return;

    const { activities: moreActivities, nextCursor: newCursor } = await searchActivities(location);
    setActivities((prev) => [...prev, ...moreActivities]);
    setNextCursor(newCursor);
  };

  const saveActivity = (activity: any) => {
    setSavedActivities((prev) => [...prev, activity]);
    Alert.alert(`Activity saved!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Things to Do in {location}</Text>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Rating: {item.rating}/5</Text>
            <Text>Address: {item.address}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={() => saveActivity(item)}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.detailsButton]} onPress={() => Alert.alert('More details coming soon!')}>
                <Text style={styles.buttonText}>Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListFooterComponent={
          nextCursor ? (
            <TouchableOpacity style={styles.loadMoreButton} onPress={loadMoreActivities}>
              <Text style={styles.loadMoreText}>Load More</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: '40%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  detailsButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadMoreButton: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#0984e3',
    borderRadius: 8,
    marginTop: 10,
  },
  loadMoreText: {
    color: '#fff',
    fontWeight:'bold'
},
});

export default ActivitiesScreen;