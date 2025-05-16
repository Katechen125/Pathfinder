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
      title: eventTitle || 'Travel Event',
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
      <View style={styles.header}>
        <Icon name="calendar" size={24} color="#2196F3" style={styles.headerIcon} />
        <Text style={styles.headerText}>Travel Calendar</Text>
      </View>

      <View style={styles.calendarCard}>
        <Calendar
          markedDates={selectedDates}
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
              <Icon name="calendar-plus-o" size={20} color="#2196F3" /> New Event
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
                onPress={addEventToCalendar}
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
};

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
  }
});

export default CalendarScreen;

