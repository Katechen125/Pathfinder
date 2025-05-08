// Import Axios for making HTTP requests
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyBnYEWI8a36nAJDsONKSt9UeMseVvqAlYI';
const USE_MOCK_DATA = true; // Set to false when API is working correctly

// Mock data for development when APIs fail
const MOCK_PLACES = [
  {
    id: 'mock1',
    name: 'Chapultepec Castle',
    address: 'Bosque de Chapultepec, Mexico City',
    photoReference: null,
    location: { lat: 19.4204, lng: -99.1824 }
  },
  {
    id: 'mock2',
    name: 'Frida Kahlo Museum',
    address: 'Londres 247, Mexico City',
    photoReference: null,
    location: { lat: 19.3550, lng: -99.1627 }
  },
  {
    id: 'mock3',
    name: 'Chichen Itza',
    address: 'Yucatan, Mexico',
    photoReference: null,
    location: { lat: 20.6843, lng: -88.5677 }
  }
];

export const geocodeLocation = async (address: string) => {
  try {
    // Return mock data if enabled
    if (USE_MOCK_DATA) {
      console.log('Using mock geocoding data for:', address);
      return address.toLowerCase().includes('mexico') ? 
        { lat: 19.4326, lng: -99.1332 } : 
        { lat: 48.8566, lng: 2.3522 };
    }
    
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`,
      { timeout: 10000 }
    );
    
    if (response.data?.results?.[0]?.geometry?.location) {
      return response.data.results[0].geometry.location;
    } else {
      console.log('Empty or invalid geocoding response:', response.data);
      return null;
    }
  } catch (error) {
    console.error('Geocoding error details:', error);
    return null;
  }
};

export const fetchPlaces = async (country: string) => {
  try {
    // Return mock data if enabled
    if (USE_MOCK_DATA) {
      console.log('Using mock places data for:', country);
      return MOCK_PLACES;
    }
    
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=top+attractions+in+${encodeURIComponent(country)}&key=${GOOGLE_API_KEY}`
    );
    
    if (!response.data?.results) {
      throw new Error('Invalid API response');
    }

    return response.data.results.map((place: any) => ({
      id: place.place_id,
      name: place.name,
      address: place.formatted_address,
      photoReference: place.photos?.[0]?.photo_reference || null,
      location: place.geometry.location,
    }));
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
};

export const getPhotoUrl = (photoReference: string) => {
  // Return a placeholder image if no reference or mock mode
  if (!photoReference || USE_MOCK_DATA) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
};


export const searchLocations = async (query: string) => {
  if (USE_MOCK_DATA) {
    return [
      { id: 'mock1', name: 'Mexico City, Mexico' },
      { id: 'mock2', name: 'Cancun, Mexico' }
    ];
  }
  
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&key=${GOOGLE_API_KEY}`
  );
  return response.data.predictions.map((p: any) => ({
    id: p.place_id,
    name: p.description
  }));
};


export const searchFlights = async (origin: string, destination: string, date: string) => {
  try {
    return Array(5).fill(null).map((_, i) => ({
      id: `FL${i}`,
      airline: i % 2 === 0 ? 'Air France' : 'Lufthansa',
      price: Math.floor(Math.random() * 500) + 200,
      departureDate: date || '2024-03-15',
      flightNumber: `FL${Math.floor(Math.random() * 1000)}`
    }));
  } catch (error) {
    console.error('Flights error:', error);
    return [];
  }
};

export const searchHotels = async (lat: number, lng: number) => {
  try {
  const response = await axios.get(
      'https://api.geoapify.com/v2/places',
      {
      params: {
      categories: 'accommodation.hotel',
      filter: `circle:${lng},${lat},5000`, // 5km radius
      limit: 20,
      apiKey: 'f078a3ebd9a64978bb0fc1d6c81c8ce7'
      }
  }
  );
  
  return response.data.features.map((item: any) => ({
        id: item.properties.place_id,
        name: item.properties.name,
        price: Math.floor(Math.random() * 200) + 50, // Mock price
        rating: item.properties.rating || 4,
        address: item.properties.formatted
  }));
        } catch (error) {
        console.error('Hotels error:', error);
        return [];
        }
        };
  
  export const searchActivities = async (lat: number, lng: number) => {
  try {
      const response = await axios.get(
      'https://api.geoapify.com/v2/places',
      {
      params: {
      categories: 'tourism,entertainment',
      filter: `circle:${lng},${lat},5000`,
      limit: 20,
      apiKey: 'f078a3ebd9a64978bb0fc1d6c81c8ce7'
  }
  }
  );
  
  return response.data.features.map((item: any) => ({
        id: item.properties.place_id,
        name: item.properties.name,
        address: item.properties.formatted,
        rating: item.properties.rating || 4,
        category: item.properties.categories[0]
        }));
        } catch (error) {
        console.error('Activities error:', error);
        return [];
  }
  };


