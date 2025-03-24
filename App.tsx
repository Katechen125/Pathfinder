
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 

// Import screens for the app 
import HomeScreen from './Source/Screens/HomeScreen'; 
import ItineraryScreen from './Source/Screens/ItineraryScreen';

// Create a stack navigator for managing screen transitions
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Itinerary" component={ItineraryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


