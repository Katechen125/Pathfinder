
import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './Source/Services/types';

// Import screens for the app 
import HomeScreen from './Source/Screens/HomeScreen'; 
import ItineraryScreen from './Source/Screens/ItineraryScreen';
import MapScreen from './Source/Screens/MapScreen';
import FlightsScreen from './Source/Screens/FlightScreen';
import SavedPlansScreen from './Source/Screens/SavedPlanScreen';
import HotelsScreen from './Source/Screens/HotelsScreen';
import ActivitiesScreen from './Source/Screens/ActivitiesScreen';


// Create a stack navigator for managing screen transitions
const Stack = createStackNavigator<RootStackParamList>(); 

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ItineraryScreen" component={ItineraryScreen} />
        <Stack.Screen name="MapScreen" component={MapScreen} />
        <Stack.Screen name="FlightScreen" component={FlightsScreen} />
        <Stack.Screen name="SavedPlansScreen" component={SavedPlansScreen} />
        <Stack.Screen name="HotelsScreen" component={HotelsScreen} />
        <Stack.Screen name="ActivitiesScreen" component={ActivitiesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


