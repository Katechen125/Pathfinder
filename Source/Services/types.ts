export type RootStackParamList = {
  Welcome: undefined;
  Home: { destination: string };
  Map: {
    places: Place[];
    hotels?: Hotel[];
    activities?: Activity[];
    region?: MapRegion;
  };
  Flights: {
    origin: string;
    destination: string;
    date: string;
  };
  Itinerary: { savedPlans: Place[] };
  Hotels: { location: Coordinates };
  Activities: { location: Coordinates };
  Calendar: undefined;
  CurrencyConverter: undefined;
  Visa: undefined;
  ExpenseTracker: undefined;
  Booking: { destination: string; coordinates?: Coordinates };
  Budget: undefined;
  Login: undefined;
  BookingWebsite: undefined;
  Feedback: undefined;
};

export interface Place {
  id: string;
  name: string;
  address: string;
  photoReference?: string;
  location: { lat: number; lng: number };
  image?: string;
}

export interface Hotel {
  id: string;
  name: string;
  price: string;
  rating: number;
  address: string;
  image?: string;
  location?: Coordinates;
}

export interface Activity {
  id: string;
  name: string;
  category: string;
  rating: number;
  image?: string;
  location?: Coordinates;
  address?: string;
  description?: string;
}

export interface Flight {
  id: string;
  airline: string;
  price: number;
  departureDate: string;
  flightNumber: string;
  image?: string;
}

export interface Location {
  id: string;
  type: string;
  name: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  color: string;
}

export type SavedItemType = 'place' | 'hotel' | 'activity' | 'flight';

export interface SavedItem {
  id: string;
  type: SavedItemType;
  data: Place | Hotel | Activity | Flight;
  date?: string;
}
