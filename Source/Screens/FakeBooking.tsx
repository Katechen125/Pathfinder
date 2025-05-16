import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: any;
  type: 'flight' | 'hotel' | 'activity';
}

const FakeBooking: React.FC<Props> = ({ visible, onClose, onConfirm, item, type }) => {
  if (!item) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>
            {type === 'flight' ? item.airline : item.name}
          </Text>

          {type === 'flight' && (
            <>
              <Text style={styles.detail}>Flight #: {item.flightNumber}</Text>
              <Text style={styles.detail}>Departure: {item.departureDate}</Text>
              <Text style={styles.detail}>Price: €{item.price}</Text>
            </>
          )}

          {type === 'hotel' && (
            <>
              <Text style={styles.detail}>Price/Night: €{item.price}</Text>
              <Text style={styles.detail}>Rating: {item.rating}/5</Text>
              <Text style={styles.detail}>Address: {item.address}</Text>
            </>
          )}

          {type === 'activity' && (
            <>
              <Text style={styles.detail}>Category: {item.category}</Text>
              <Text style={styles.detail}>Rating: {item.rating}/5</Text>
              <Text style={styles.detail}>Address: {item.address}</Text>
            </>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={onClose}>
              <Icon name="times" size={16} color="white" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.confirmButton]} onPress={onConfirm}>
              <Icon name="check" size={16} color="white" />
              <Text style={styles.buttonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 15,
  },
});

export default FakeBooking;
