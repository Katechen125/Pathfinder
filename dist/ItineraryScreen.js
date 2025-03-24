import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

// Import the fetchPlaces function from Services/API
import { fetchPlaces } from '../Services/API.ts';
const ItineraryScreen = ({
  route
}) => {
  const {
    destination
  } = route.params; // Extract destination parameter 
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getPlacesData = async () => {
      try {
        const data = await fetchPlaces(destination); // Call fetchPlaces function with destination
        setPlaces(data); // Update data
      } catch (error) {
        console.error('Error fetching places:', error); // Log errors if API call fails
      } finally {
        setLoading(false); // Set loading state to false after API call completes
      }
    };
    getPlacesData(); // Call getPlacesData when destination changes
  }, [destination]);
  if (loading) {
    return /*#__PURE__*/React.createElement(View, {
      style: styles.container
    }, /*#__PURE__*/React.createElement(ActivityIndicator, {
      size: "large",
      color: "#0000ff"
    }));
  }
  return /*#__PURE__*/React.createElement(View, {
    style: styles.container
  }, /*#__PURE__*/React.createElement(Text, {
    style: styles.title
  }, "Places in ", destination), places.length > 0 ? places.map(place => /*#__PURE__*/React.createElement(Text, {
    key: place.place_id,
    style: styles.place
  }, place.name)) : /*#__PURE__*/React.createElement(Text, null, "No places found for this destination."));
};

// Define styles for the Itinerary screen 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  place: {
    fontSize: 18,
    color: '#555',
    marginVertical: 5
  }
});
export default ItineraryScreen;
