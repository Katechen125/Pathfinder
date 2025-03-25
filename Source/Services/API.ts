
// Import Axios for making HTTP requests
import axios from 'axios';
import { Location } from './types';

const GOOGLE_API_KEY = 'AIzaSyCh-1Bp6v9plbHSvKy9o8BzI0r8_T6JxW4'; 
const RAPIDAPI_KEY = '3291d89115msh17e746463fdcbf7p1f2149jsn063e6793ddc3'; 


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


export const getPhotoUrl = (photoReference: string) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${GOOGLE_API_KEY}`;
};


export const searchFlights = async (origin: string, destination: string, date: string) => {
  try {
    const response = await axios.get('https://sky-scanner3.p.rapidapi.com/flights/search-roundtrip', {
      params: {
        fromEntityId: origin,
        toEntityId: destination,
        date,
      },
      headers: {
        'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    return response.data.flights.map((flight: any) => ({
      id: flight.id,
      airline: flight.airline,
      price: flight.price,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
    }));
  } catch (error) {
    console.error('Error fetching flights:', error);
    return [];
  }
};

export const searchLocations = async (query: string): Promise<Location[]> => {
  try {
    const response = await axios.get('https://sky-scanner3.p.rapidapi.com/locations/search', {
      params: { query },
      headers: {
        'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });
    return response.data.data.map((location: any) => ({
      id: location.entityId,
      type: location.entityType,
      name: location.name
    }));
  } catch (error) {
    console.error('Location search error:', error);
    return [];
  }
};

export const searchHotels = async (locationId: string) => {
  try {
    const response = await axios.get('https://sky-scanner3.p.rapidapi.com/hotels/search', {
      params: {
        entityId: locationId,
        checkin: "2025-03-25",  
        checkout: "2025-03-30",
        adults: "1"
      },
      headers: {
        'x-rapidapi-host': 'sky-scanner3.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    return response.data.data.hotels.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      price: hotel.priceForDisplay,
      rating: hotel.starRating,
      address: hotel.address?.addressLine1 || 'Address not available'
    }));
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
};

export const searchActivities = async (location: string) => {
  try {
    const response = await axios.get('https://real-time-tripadvisor-scraper-api.p.rapidapi.com/tripadvisor_restaurants_search_v2', {
      params: {
        location
      },
      headers: {
        'x-rapidapi-host': 'real-time-tripadvisor-scraper-api.p.rapidapi.com',
        'x-rapidapi-key': RAPIDAPI_KEY,
      },
    });

    const { data } = response;
    return {
      activities: data.results.map((activity: any) => ({
        id: activity.id,
        name: activity.name,
        description: activity.description || 'No description available',
        rating: activity.rating || 'N/A',
        address: activity.address || 'Address not available',
      })),
      nextCursor: data.pageInfo?.endCursor || null,
    };
  } catch (error) {
    console.error('Error fetching activities:', error);
    return { activities: [], nextCursor: null };
  }
};
