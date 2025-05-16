import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedItem {
  id: string;
  type: 'flight' | 'hotel' | 'activity';
  data: any;
  date: string;
}

// User Management
const USER_KEY = '@current_user';
const getItineraryKey = (username: string) => `@itinerary_${username}`;

export const setCurrentUser = async (username: string) => {
  await AsyncStorage.setItem(USER_KEY, username);
};

export const getCurrentUser = async (): Promise<string | null> => {
  return AsyncStorage.getItem(USER_KEY);
};

export const registerUser = async (username: string, password: string) => {
  await AsyncStorage.setItem(`@user_${username}`, password);
};

export const loginUser = async (username: string, password: string) => {
  const storedPass = await AsyncStorage.getItem(`@user_${username}`);
  return storedPass === password;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(USER_KEY);
};

// Itinerary Management
export const saveItinerary = async (username: string, items: SavedItem[]) => {
  try {
    await AsyncStorage.setItem(getItineraryKey(username), JSON.stringify(items));
  } catch (error) {
    console.error('Error saving itinerary:', error);
    throw error;
  }
};

export const loadItinerary = async (username: string): Promise<SavedItem[]> => {
  try {
    const data = await AsyncStorage.getItem(getItineraryKey(username));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading itinerary:', error);
    return [];
  }
};

export const addToItinerary = async (item: SavedItem) => {
  const username = await getCurrentUser();
  if (!username) throw new Error('Not logged in');
  
  const current = await loadItinerary(username);
  if (!current.some(i => i.id === item.id && i.type === item.type)) {
    await saveItinerary(username, [...current, item]);
  }
};

export const deleteFromItinerary = async (username: string, id: string) => {
    if (!username) throw new Error('Not logged in');
    
    const currentItems = await loadItinerary(username);
    const updatedItems = currentItems.filter(item => item.id !== id);
    await saveItinerary(username, updatedItems);
    return updatedItems;
  };

  const getExpenseKey = (username: string) => `@expenses_${username}`;

export const saveExpenses = async (username: string, expenses: any) => {
  await AsyncStorage.setItem(getExpenseKey(username), JSON.stringify(expenses));
};

export const loadExpenses = async (username: string) => {
  const data = await AsyncStorage.getItem(getExpenseKey(username));
  return data ? JSON.parse(data) : { expenses: [], limit: '' };
};
