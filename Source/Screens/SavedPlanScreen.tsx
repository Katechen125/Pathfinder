import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation} from '@react-navigation/native';
import { RootStackParamList, Place } from '../Services/types';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
    route: RouteProp<RootStackParamList, 'SavedPlansScreen'>;
  }

const SavedPlansScreen: React.FC<Props> = ({ route}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { savedPlans } = route.params;

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Saved Plans</Text>
    <FlatList
      data={savedPlans}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={styles.planContainer}
          onPress={() => navigation.navigate('MapScreen', { places: [item] })}
        >
          <Text style={styles.planName}>{item.name}</Text>
          <Text style={styles.planAddress}>{item.address}</Text>
        </TouchableOpacity>
      )}
    />
  </View>
);
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 20 
},
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
},
  planContainer: {
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  planAddress: {
    fontSize: 14,
    color: '#666',
  },
});

export default SavedPlansScreen;
