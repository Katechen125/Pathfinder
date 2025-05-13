
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './Source/Services/types';

// Import screens for the app 
import HomeScreen from './Source/Screens/HomeScreen';
import PlacesScreen from './Source/Screens/PlacesScreen';
import MapScreen from './Source/Screens/MapScreen';
import FlightsScreen from './Source/Screens/FlightScreen';
import ItineraryScreen from './Source/Screens/ItineraryScreen';
import HotelsScreen from './Source/Screens/HotelsScreen';
import ActivitiesScreen from './Source/Screens/ActivitiesScreen';
import VisaScreen from './Source/Screens/Visa';
import CalendarScreen from './Source/Screens/CalendarScreen';
import ExpenseScreen from './Source/Screens/TravelExpense';
import CurrencyConverterScreen from './Source/Screens/CurrencyConverterScreen';


// Create a stack navigator for managing screen transitions
const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="PlacesToGo" component={PlacesScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Flights" component={FlightsScreen} />
        <Stack.Screen name="Itinerary" component={ItineraryScreen} />
        <Stack.Screen name="Hotels" component={HotelsScreen} />
        <Stack.Screen name="Activities" component={ActivitiesScreen} />
        <Stack.Screen name="Visa" component={VisaScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="ExpenseTracker" component={ExpenseScreen} />
        <Stack.Screen name="CurrencyConverter" component={CurrencyConverterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;


