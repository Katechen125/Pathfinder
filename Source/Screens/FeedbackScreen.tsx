import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const FeedbackScreen: React.FC = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!feedback.trim()) {
      Alert.alert('Please enter your feedback.');
      return;
    }
    Alert.alert('Thank you!', 'Your feedback has been submitted.');
    setFeedback('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>We value your feedback!</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your feedback here..."
        value={feedback}
        onChangeText={setFeedback}
        multiline
        numberOfLines={5}
        textAlignVertical="top"
        placeholderTextColor="#555"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Feedback</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#2196F3', textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 25,
    padding: 18,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#FF9800',
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default FeedbackScreen;

