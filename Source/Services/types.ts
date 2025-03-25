export type RootStackParamList = {
    Home: undefined;
    ItineraryScreen: { destination: string };
    MapScreen: { places: Place[] };
    FlightScreen: { 
      origin: string;
      destination: string;
      date: string;
    };
    SavedPlansScreen: { savedPlans: Place[] };
    HotelsScreen: { location?: string };
    ActivitiesScreen: { location: string };
  };

export interface Place {
    id: string;
    name: string;
    address: string;
    photoReference?: string;
    location: {
      lat: number;
      lng: number;
    };
  }

export interface Flight {
    airline?: string;
    price?: number;
    departureDate?: string;
  }

  export interface Hotel {
    id: string;
    name: string;
    price: string;
    rating: number;
    address: string;
  }
  
  export interface Activity {
    id: string;
    name: string;
    category: string;
    rating: number;
  }

  export interface Location {
    id: string;
    type: string;
    name: string;
  }
    