
// Import Axios for making HTTP requests
import axios from 'axios';

const GOOGLE_API_KEY = 'AIzaSyCh-1Bp6v9plbHSvKy9o8BzI0r8_T6JxW4'; 
const RAPIDAPI_KEY = '3291d89115msh17e746463fdcb7p1f2149jsn063e6793ddc3'; 

// Fetch top attractions using Google Places API
export const fetchPlaces = async (country: string) => {
  try {
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

// Get photo URL for a place
export const getPhotoUrl = (photoReference: string) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
};

// Search for flights using Flights Scraper API on RapidAPI
export const searchFlights = async (origin: string, destination: string, date: string) => {
  const options = {
    method: 'GET',
    url: 'https://skyscanner3.p.rapidapi.com/flights',
    params: {
      origin, 
      destination, // Destination airport code 
      date, // Departure date in "YYYY-MM-DD" format
    },
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'skyscanner3.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    
    // Process and return flight data
    return response.data.flights.map((flight: any) => ({
      price: flight.price,
      airline: flight.airline,
      departureTime: flight.departure_time,
      arrivalTime: flight.arrival_time,
      duration: flight.duration,
    }));
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
};
