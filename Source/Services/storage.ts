import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedItem } from './types';

const ITINERARY_KEY = '@itinerary';

export const saveItinerary = async (items: SavedItem[]) => {
    try {
        await AsyncStorage.setItem(ITINERARY_KEY, JSON.stringify(items));
    } catch (error) {
        console.error('Error saving itinerary:', error);
    }
};

export const loadItinerary = async (): Promise<SavedItem[]> => {
    try {
        const data = await AsyncStorage.getItem(ITINERARY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading itinerary:', error);
        return [];
    }
};

export const deleteFromItinerary = async (id: string) => {
    try {
        const currentItems = await loadItinerary();
        const updatedItems = currentItems.filter(item => item.id !== id);
        await saveItinerary(updatedItems);
        return updatedItems;
    } catch (error) {
        console.error('Error deleting item:', error);
        return [];
    }
};