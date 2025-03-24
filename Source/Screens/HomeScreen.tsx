import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Travel Planner</Text>
      <Text style={styles.subtitle}>Choose a filter to get started:</Text>

      <Button
        title="Search by Country (Monaco)"
        onPress={() => navigation.navigate('Itinerary', { destination: 'Monaco' })}
      />
      <Button
        title="Search by City (Monte Carlo)"
        onPress={() => navigation.navigate('Itinerary', { destination: 'Monte Carlo' })}
      />
      <Button
        title="Search Attractions (Beaches in Monaco)"
        onPress={() => navigation.navigate('Itinerary', { destination: 'Beaches in Monaco' })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;

