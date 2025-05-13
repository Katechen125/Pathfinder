import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as AddCalendarEvent from 'react-native-add-calendar-event';

const CalendarScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  const addEventToCalendar = () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date first');
      return;
    }

    const eventConfig = {
      title: eventTitle || 'New Event',
      startDate: `${selectedDate}T10:00:00.000Z`,
      endDate: `${selectedDate}T11:00:00.000Z`,
      notes: eventDescription || 'Added from Pathfinder App'
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        if (eventInfo.action === 'SAVED') {
          Alert.alert('Success', 'Event added to calendar');
        }
        setShowAddEvent(false);
      })
      .catch(error => {
        console.log('Error creating event:', error);
        Alert.alert('Error', 'Failed to add event to calendar');
      });
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={selectedDates}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
          const newDates = {
            [day.dateString]: { selected: true, marked: true }
          };
          setSelectedDates(newDates);
        }}
        current={selectedDate}
        theme={{
          todayTextColor: '#2196F3',
          selectedDayBackgroundColor: '#4CAF50'
        }}
      />

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
        animationType="slide"
        onRequestClose={() => setShowAddEvent(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Event</Text>
            <Text style={styles.modalLabel}>Date: {selectedDate}</Text>

            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={eventTitle}
              onChangeText={setEventTitle}
            />

            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Description"
              value={eventDescription}
              onChangeText={setEventDescription}
              multiline
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowAddEvent(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addEventToCalendar}
              >
                <Text style={styles.buttonText}>Add to Calendar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
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
    elevation: 5
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center'
  },
  cancelButton: {
    backgroundColor: '#f44336'
  },
  saveButton: {
    backgroundColor: '#4CAF50'
  },
  buttonText: {
    color: 'white',
    fontWeight: '600'
  }
});

export default CalendarScreen;
