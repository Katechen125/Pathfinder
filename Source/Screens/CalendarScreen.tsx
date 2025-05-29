import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SavedItem, loadItinerary, getCurrentUser, CustomEvent, loadCustomEvents, addCustomEvent, deleteCustomEvent, deleteFromItinerary } from '../Services/storage';
import uuid from 'react-native-uuid';
import { useIsFocused } from '@react-navigation/native';

const CalendarScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [bookings, setBookings] = useState<SavedItem[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [username, setUsername] = useState<string | null>(null);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    const user = await getCurrentUser();
    if (!user) {
      Alert.alert('Login Required', 'Please log in to view your calendar');
      return;
    }
    setUsername(user);
    const customEvts = await loadCustomEvents(user);
    setCustomEvents(customEvts);
    const itinerary = await loadItinerary(user);
    setBookings(itinerary);
  };

  const getMarkedDates = () => {
    const marks: any = {};
    [...bookings, ...customEvents].forEach(item => {
      const date = item.date;
      marks[date] = marks[date] || { marked: true, dots: [{ color: '#2196F3' }] };
    });
    if (selectedDate) {
      marks[selectedDate] = { ...(marks[selectedDate] || {}), selected: true, selectedColor: '#2196F3' };
    }
    return marks;
  };

  const eventsForSelectedDate = [
    ...bookings.filter(item => item.date === selectedDate),
    ...customEvents.filter(item => item.date === selectedDate)
  ];

  const handleAddCustomEvent = async () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date first');
      return;
    }
    if (!eventTitle.trim()) {
      Alert.alert('Error', 'Event title is required');
      return;
    }
    try {
      await addCustomEvent({
        id: uuid.v4().toString(),
        title: eventTitle,
        description: eventDescription,
        date: selectedDate,
      });
      setEventTitle('');
      setEventDescription('');
      setShowAddEvent(false);
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to add event');
    }
  };

  const handleDelete = async (id: string, isCustomEvent: boolean) => {
    if (!username) return;

    try {
      if (isCustomEvent) {
        await deleteCustomEvent(username, id);
      } else {
        await deleteFromItinerary(username, id);
      }
      await loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to delete item');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="calendar" size={24} color="#2196F3" style={styles.headerIcon} />
        <Text style={styles.headerText}>Travel Calendar</Text>
      </View>

      <View style={styles.calendarCard}>
        <Calendar
          markedDates={getMarkedDates()}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setSelectedDates({ [day.dateString]: { selected: true, selectedColor: '#2196F3' } });
          }}
          current={selectedDate}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#2d3436',
            selectedDayBackgroundColor: '#2196F3',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#2196F3',
            dayTextColor: '#2d3436',
            textDisabledColor: '#d9d9d9',
            arrowColor: '#2196F3',
            monthTextColor: '#2196F3',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14
          }}
        />
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.eventsTitle}>
          <Icon name="calendar-check-o" size={18} color="#2196F3" /> Events for {selectedDate || '...'}
        </Text>
        <FlatList
          data={eventsForSelectedDate}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No events for this date.</Text>
          }
          renderItem={({ item }) => {
            const isCustom = !('type' in item);

            return (
              <View style={styles.eventCard}>
                <View style={styles.eventContent}>
                  {!isCustom ? (
                    <>
                      <Text style={styles.eventTitle}>
                        {item.type.toUpperCase()}: {item.data.name || item.data.airline}
                      </Text>
                      <Text style={styles.eventDesc}>{item.data.description || ''}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.eventTitle}>Custom: {item.title}</Text>
                      <Text style={styles.eventDesc}>{item.description}</Text>
                    </>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDelete(item.id, isCustom)}
                >
                  <Icon name="trash-o" size={18} color="#f44336" />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (selectedDate) {
            setShowAddEvent(true);
          } else {
            Alert.alert('Select Date', 'Please select a date first');
          }
        }}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={showAddEvent}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddEvent(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              <Icon name="calendar-plus-o" size={20} color="#2196F3" /> New Custom Event
            </Text>

            <View style={styles.dateBadge}>
              <Icon name="calendar-check-o" size={16} color="#4CAF50" />
              <Text style={styles.dateText}>{selectedDate}</Text>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="pencil" size={18} color="#607D8B" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Event Title"
                placeholderTextColor="#888"
                value={eventTitle}
                onChangeText={setEventTitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="align-left" size={18} color="#607D8B" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Description"
                placeholderTextColor="#888"
                value={eventDescription}
                onChangeText={setEventDescription}
                multiline
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowAddEvent(false)}
              >
                <Icon name="times" size={16} color="white" />
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddCustomEvent}
              >
                <Icon name="check" size={16} color="white" />
                <Text style={styles.buttonText}>Add Event</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    padding: 16
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10
  },
  headerIcon: {
    marginRight: 12
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3'
  },
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  eventsSection: {
    marginTop: 20,
    flex: 1
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
  },
  eventDesc: {
    color: '#555',
    marginTop: 4
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 20,
    textAlign: 'center'
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 20
  },
  dateText: {
    color: '#2196F3',
    fontWeight: '500',
    marginLeft: 8
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e3eaf4'
  },
  inputIcon: {
    marginHorizontal: 12
  },
  input: {
    flex: 1,
    height: 48,
    color: '#2d3436',
    fontSize: 16,
    paddingVertical: 0
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    width: '48%',
    elevation: 2
  },
  cancelButton: {
    backgroundColor: '#f44336'
  },
  saveButton: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  eventContent: {
    flex: 1
  },
  deleteIcon: {
    padding: 8,
    marginLeft: 10
  },
});

export default CalendarScreen;


