// Import Axios for making HTTP requests
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyBnYEWI8a36nAJDsONKSt9UeMseVvqAlYI';
const USE_MOCK_DATA = false; // Set to false when API is working correctly

// Mock data for development when APIs fail
export const MOCK_PLACES = [
  {
    id: 'mock1',
    name: 'Chapultepec Castle',
    address: 'Bosque de Chapultepec, Mexico City',
    photoReference: undefined,
    location: { lat: 19.4204, lng: -99.1824 }
  },
  {
    id: 'mock2',
    name: 'Frida Kahlo Museum',
    address: 'Londres 247, Mexico City',
    photoReference: undefined,
    location: { lat: 19.3550, lng: -99.1627 }
  },
  {
    id: 'mock3',
    name: 'Chichen Itza',
    address: 'Yucatan, Mexico',
    photoReference: undefined,
    location: { lat: 20.6843, lng: -88.5677 }
  }
];

const MOCK_VISA_REQUIREMENTS: { [key: string]: string } = {
  // NORTH AMERICA
  'United_States-Mexico': 'No visa required (180 days)',
  'Canadian-Mexico': 'No visa required (180 days)',
  'United_States-France': 'Visa-free (90/180 days)',
  'Canadian-France': 'Visa-free (90/180 days)',
  'Mexican-France': 'Schengen visa required',

  // EUROPE
  'German-Mexico': 'No visa required (180 days)',
  'French-Mexico': 'No visa required (180 days)',
  'Italian-Mexico': 'No visa required (180 days)',
  'British-Mexico': 'No visa required (180 days)',
  'Spanish-Mexico': 'No visa required (180 days)',

  'German-France': 'Visa-free (EU citizen)',
  'British-France': 'Visa-free (90/180 days)',
  'American-France': 'Visa-free (90/180 days)',
  'Chinese-France': 'Schengen visa required',

  // ASIA
  'Japanese-Mexico': 'No visa required (180 days)',
  'South_Korean-Mexico': 'No visa required (180 days)',
  'Chinese-Mexico': 'FMM Tourist Card required on arrival',
  'Indian-Mexico': 'eVisa available',

  'Japanese-United_States': 'Visa Waiver Program (ESTA)',
  'South_Korean-United_States': 'Visa Waiver Program (ESTA)',
  'Chinese-United_States': 'B1/B2 Visa required',

  // OCEANIA
  'Australian-Mexico': 'No visa required (180 days)',
  'Australian-United_States': 'Visa Waiver Program (ESTA)',
  'Australian-France': 'Visa-free (90/180 days)',

  // SOUTH AMERICA
  'Brazilian-Mexico': 'No visa required (180 days)',
  'Argentine-Mexico': 'No visa required (90 days)',
  'Brazilian-United_States': 'B1/B2 Visa required',
  'Argentine-United_States': 'B1/B2 Visa required',

  // MIDDLE EAST
  'Saudi-United_States': 'B1/B2 Visa required',
  'Turkish-United_States': 'B1/B2 Visa required',
  'Saudi-France': 'Schengen visa required',

  // AFRICA
  'South_African-Mexico': 'No visa required (180 days)',
  'South_African-United_States': 'B1/B2 Visa required',

  // COMMON VISA-FREE ZONES
  'French-Germany': 'Visa-free (EU citizen)',
  'Italian-Spain': 'Visa-free (EU citizen)',

  // VISA WAIVER PROGRAM COUNTRIES
  'British-United_States': 'ESTA required',
  'French-United_States': 'ESTA required',
  'German-United_States': 'ESTA required',
  'Italian-United_States': 'ESTA required',
  'Spanish-United_States': 'ESTA required',

  // COMMON VISA-REQUIRED
  'Indian-France': 'Schengen visa required',
  'Chinese-Germany': 'Schengen visa required',
  'Russian-United_States': 'B1/B2 Visa required',
  'Indonesian-France': 'Schengen visa required',

  // SPECIAL CASES
  'American-Canada': 'Visa-free (6 months)',
  'Canadian-United_States': 'Visa-free (6 months)',
  'Mexican-Canada': 'eVisa required',
  'Brazilian-France': 'Visa-free (90/180 days)',

  'default': 'Visa requirements not supported in this version. Contact embassy.'
};

export const MOCK_HOTELS = [
  {
    id: 'hotel1',
    name: 'Luxury Resort',
    price: 200,
    rating: 4.5,
    address: 'Beachfront Avenue',
    location: { lat: 19.4326, lng: -99.1332 }
  },
];


export const MOCK_ACTIVITIES = [
  {
    id: 'mock-activity-1',
    name: 'Guided City Tour',
    address: 'Main Square',
    rating: 4.8,
    category: 'Tour',
    description: 'Explore the city with a local guide',
    location: { lat: 19.4326, lng: -99.1332 }
  }
];

const mockGeocode = (address: string) => {
  console.log('Using mock geocoding');
  return address.toLowerCase().includes('mexico') ?
    { lat: 19.4326, lng: -99.1332 } :
    { lat: 48.8566, lng: 2.3522 };
};

const placeMapper = (place: any) => ({
  id: place.place_id,
  name: place.name,
  address: place.formatted_address,
  photoReference: place.photos?.[0]?.photo_reference || undefined,
  location: place.geometry.location,
});

const hotelMapper = (item: any) => ({
  id: item.properties.place_id,
  name: item.properties.name,
  price: item.properties.price || Math.floor(Math.random() * 200) + 50,
  rating: item.properties.rank?.rating || 4,
  address: item.properties.formatted,
  location: {
    lat: item.properties.lat,
    lng: item.properties.lon
  }
});

const activityMapper = (item: any) => ({
  id: item.properties.place_id,
  name: item.properties.name,
  address: item.properties.formatted,
  rating: item.properties.rank?.rating || 4,
  category: item.properties.categories?.[0] || 'activity',
  description: item.properties.description,
  location: {
    lat: item.properties.lat,
    lng: item.properties.lon
  }
});

export const geocodeLocation = async (address: string) => {
  try {
    if (USE_MOCK_DATA) return mockGeocode(address);

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`,
      { timeout: 10000 }
    );

    if (!response.data?.results?.[0]) {
      throw new Error('No results found');
    }

    return {
      lat: response.data.results[0].geometry.location.lat,
      lng: response.data.results[0].geometry.location.lng,
      address: response.data.results[0].formatted_address
    };

  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      ...mockGeocode(address),
      address: 'Approximate location'
    };
  }
};

export const fetchPlaces = async (query: string) => {
  try {
    if (USE_MOCK_DATA) return MOCK_PLACES;

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`
    );

    return response.data.results?.map(placeMapper) || MOCK_PLACES;
  } catch (error) {
    console.error('Places API error:', error);
    return MOCK_PLACES;
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
    if (USE_MOCK_DATA) return MOCK_HOTELS;

    const response = await axios.get(
      'https://api.geoapify.com/v2/places', {
      params: {
        categories: 'accommodation',
        filter: `circle:${lng},${lat},5000`,
        limit: 20,
        apiKey: '5b0ee5455a234d0da7bd056f40cd7d63'
      }
    }
    );

    return response.data.features.map(hotelMapper);
  } catch (error) {
    console.error('Hotels error:', error);
    return MOCK_HOTELS;
  }
};

export const searchActivities = async (lat: number, lng: number) => {
  try {
    if (USE_MOCK_DATA) return MOCK_ACTIVITIES;

    const response = await axios.get(
      'https://api.geoapify.com/v2/places', {
      params: {
        categories: 'entertainment,tourism',
        filter: `circle:${lng},${lat},5000`,
        limit: 20,
        apiKey: '5b0ee5455a234d0da7bd056f40cd7d63'
      }
    }
    );

    return response.data.features.map(activityMapper);
  } catch (error) {
    console.error('Activities error:', error);
    return MOCK_ACTIVITIES;
  }
};

export const checkVisaRequirements = async (
  nationality: string,
  destination: string
) => {
  const key = `${nationality}-${destination.replace(/ /g, '_')}`;

  return MOCK_VISA_REQUIREMENTS[key] || MOCK_VISA_REQUIREMENTS['default'];
};
