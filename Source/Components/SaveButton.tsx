import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SaveButtonProps {
  onPress: () => void;
  label?: string;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onPress, label = "Save" }) => (
  <TouchableOpacity 
    style={styles.button} 
    onPress={onPress}
    testID="save-button"
  >
    <Icon name="bookmark" size={18} color="white" />
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginVertical: 8,
  },
  label: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default SaveButton;
