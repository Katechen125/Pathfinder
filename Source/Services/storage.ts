import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedItem {
  id: string;
  type: 'flight' | 'hotel' | 'activity' | 'place';
  data: any;
  date: string;
}

export interface CustomEvent {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
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
   
    if (item.type !== 'place') {

      const events = await loadCustomEvents(username);
      if (!events.some(ev => ev.id === item.id)) {
        await addCustomEvent({
          id: item.id,
          title:
            item.type === 'flight'
              ? (item.data as any).airline
              : (item.data as any).name,
          description: item.data.description || '',
          date: item.date,
        });
      }
    }
  }
};

export const deleteFromItinerary = async (username: string, id: string) => {
  if (!username) throw new Error('Not logged in');

  const currentItems = await loadItinerary(username);
  const updatedItems = currentItems.filter(item => item.id !== id);
  await saveItinerary(username, updatedItems);

  await deleteCustomEvent(username, id);

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

//calendar managment 
const getCustomEventsKey = (username: string) => `@custom_events_${username}`;

export const loadCustomEvents = async (username: string): Promise<CustomEvent[]> => {
  try {
    const data = await AsyncStorage.getItem(getCustomEventsKey(username));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading custom events:', error);
    return [];
  }
};

export const saveCustomEvents = async (username: string, events: CustomEvent[]) => {
  try {
    await AsyncStorage.setItem(getCustomEventsKey(username), JSON.stringify(events));
  } catch (error) {
    console.error('Error saving custom events:', error);
    throw error;
  }
};

export const addCustomEvent = async (event: CustomEvent) => {
  const username = await getCurrentUser();
  if (!username) throw new Error('Not logged in');
  const current = await loadCustomEvents(username);
  await saveCustomEvents(username, [...current, event]);
};

export const deleteCustomEvent = async (username: string, id: string) => {
  const current = await loadCustomEvents(username);
  const updated = current.filter(event => event.id !== id);
  await saveCustomEvents(username, updated);

  const currentItinerary = await loadItinerary(username);
  const updatedItinerary = currentItinerary.filter(item => item.id !== id);
  await saveItinerary(username, updatedItinerary);
};

//search history

const getSearchHistoryKey = (username: string) => `@past_searches_${username}`;

export const addPastSearch = async (searchTerm: string) => {
  const username = await getCurrentUser();
  if (!username) return;

  const key = getSearchHistoryKey(username);
  const currentSearches = await AsyncStorage.getItem(key);
  const searches = currentSearches ? JSON.parse(currentSearches) : [];

  if (!searches.includes(searchTerm.toLowerCase())) {
    searches.push(searchTerm.toLowerCase());
    await AsyncStorage.setItem(key, JSON.stringify(searches));
  }
};

export const getPastSearches = async (): Promise<string[]> => {
  const username = await getCurrentUser();
  if (!username) return [];

  const key = getSearchHistoryKey(username);
  const data = await AsyncStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const deletePastSearch = async (term: string) => {
  const username = await getCurrentUser();
  if (!username) return;
  const key = getSearchHistoryKey(username);
  const current = await AsyncStorage.getItem(key);
  const searches = current ? JSON.parse(current) : [];
  const updated = searches.filter((s: string) => s !== term.toLowerCase());
  await AsyncStorage.setItem(key, JSON.stringify(updated));
};
