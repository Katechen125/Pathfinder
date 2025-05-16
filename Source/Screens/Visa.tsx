import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { checkVisaRequirements } from '../Services/API';
import Icon from 'react-native-vector-icons/FontAwesome';

const FLAG_URL = (country: string) =>
  `https://flagcdn.com/w40/${country.toLowerCase().replace(/_/g, '').slice(0, 2)}.png`;

const NATIONALITIES = [
  { label: "United States", value: "United_States", flag: "us" },
  { label: "United Kingdom", value: "British", flag: "gb" },
  { label: "Canada", value: "Canadian", flag: "ca" },
  { label: "Australia", value: "Australian", flag: "au" },
  { label: "Germany", value: "German", flag: "de" },
  { label: "France", value: "French", flag: "fr" },
  { label: "India", value: "Indian", flag: "in" },
  { label: "China", value: "Chinese", flag: "cn" },
  { label: "Japan", value: "Japanese", flag: "jp" },
  { label: "Brazil", value: "Brazilian", flag: "br" },
  { label: "Mexico", value: "Mexican", flag: "mx" },
  { label: "Russia", value: "Russian", flag: "ru" },
  { label: "Italy", value: "Italian", flag: "it" },
  { label: "Spain", value: "Spanish", flag: "es" },
  { label: "South Korea", value: "South_Korean", flag: "kr" },
  { label: "South Africa", value: "South_African", flag: "za" },
  { label: "Turkey", value: "Turkish", flag: "tr" },
  { label: "Argentina", value: "Argentine", flag: "ar" },
  { label: "Indonesia", value: "Indonesian", flag: "id" },
  { label: "Saudi Arabia", value: "Saudi", flag: "sa" },
];

const DESTINATIONS = [
  { label: "France", flag: "fr" },
  { label: "United States", flag: "us" },
  { label: "United Kingdom", flag: "gb" },
  { label: "Italy", flag: "it" },
  { label: "Spain", flag: "es" },
  { label: "Germany", flag: "de" },
  { label: "Turkey", flag: "tr" },
  { label: "Mexico", flag: "mx" },
  { label: "Thailand", flag: "th" },
  { label: "China", flag: "cn" },
  { label: "Japan", flag: "jp" },
  { label: "Russia", flag: "ru" },
  { label: "India", flag: "in" },
  { label: "Brazil", flag: "br" },
  { label: "Australia", flag: "au" },
  { label: "Canada", flag: "ca" },
  { label: "Greece", flag: "gr" },
  { label: "Egypt", flag: "eg" },
  { label: "South Africa", flag: "za" },
  { label: "UAE", flag: "ae" },
];

const getStatus = (requirement: string) => {
  if (/no visa required/i.test(requirement)) return { label: "No Visa Required", color: "#4CAF50", icon: "check-circle" };
  if (/visa required/i.test(requirement) || /required/i.test(requirement)) return { label: "Visa Required", color: "#e17055", icon: "times-circle" };
  return { label: "Info", color: "#0984e3", icon: "info-circle" };
};

const VisaScreen = () => {
  const [nationality, setNationality] = useState(NATIONALITIES[0].value);
  const [destination, setDestination] = useState(DESTINATIONS[0].label);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [openNat, setOpenNat] = useState(false);
  const [openDest, setOpenDest] = useState(false);

  const nationalityObj = NATIONALITIES.find(n => n.value === nationality);
  const destinationObj = DESTINATIONS.find(d => d.label === destination);

  const handleCheckVisa = async () => {
    setLoading(true);
    try {
      const requirement = await checkVisaRequirements(nationality, destination);
      setResult(requirement);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch visa requirements');
    } finally {
      setLoading(false);
    }
  };

  const status = result ? getStatus(result) : null;


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
        style={styles.bgImage}
        resizeMode="cover"
      />
      <View style={styles.card}>
        <Text style={styles.label}>Your Nationality</Text>
        <View style={[styles.pickerRow, Platform.OS === 'ios' && { zIndex: openNat ? 2 : 1 }]}>
          {nationalityObj && (
            <Image source={{ uri: FLAG_URL(nationalityObj.flag) }} style={styles.flag} />
          )}
          <RNPickerSelect
            value={nationality}
            onValueChange={setNationality}
            items={NATIONALITIES.map(n => ({
              label: n.label,
              value: n.value,
              key: n.value
            }))}
            style={pickerSelectStyles}
            onOpen={() => { setOpenNat(true); setOpenDest(false); }}
            onClose={() => setOpenNat(false)}
            Icon={() => <Icon name="chevron-down" size={18} color="#2196F3" />}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Destination Country</Text>
        <View style={[styles.pickerRow, Platform.OS === 'ios' && { zIndex: openDest ? 2 : 1 }]}>
          {destinationObj && (
            <Image source={{ uri: FLAG_URL(destinationObj.flag) }} style={styles.flag} />
          )}
          <RNPickerSelect
            value={destination}
            onValueChange={setDestination}
            items={DESTINATIONS.map(d => ({
              label: d.label,
              value: d.label,
              key: d.label
            }))}
            style={pickerSelectStyles}
            onOpen={() => { setOpenDest(true); setOpenNat(false); }}
            onClose={() => setOpenDest(false)}
            Icon={() => <Icon name="chevron-down" size={18} color="#2196F3" />}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#b2bec3' }]}
          onPress={handleCheckVisa}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="search" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Check Requirements</Text>
            </>
          )}
        </TouchableOpacity>

        {result ? (
          <View style={[styles.resultBox, status && { borderColor: status.color }]}>
            <View style={styles.resultHeader}>
              <Icon name={status?.icon || "info-circle"} size={26} color={status?.color} style={{ marginRight: 8 }} />
              <Text style={[styles.statusChip, { backgroundColor: status?.color + '22', color: status?.color }]}>
                {status?.label}
              </Text>
            </View>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f8fb',
    alignItems: 'center',
    paddingBottom: 40,
  },
  bgImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 240,
    width: '100%',
    opacity: 0.16,
    zIndex: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 18,
    alignSelf: 'center',
    zIndex: 2,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    width: '92%',
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
    marginBottom: 30,
    alignItems: 'stretch',
    zIndex: 2,
    marginTop: 60,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 6,
    marginTop: 10,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e3eaf4',
    paddingHorizontal: 8,
    minHeight: 48,
  },
  flag: {
    width: 32,
    height: 22,
    borderRadius: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e3eaf4',
    backgroundColor: '#f5f5f5',
  },
  divider: {
    height: 1,
    backgroundColor: '#e3eaf4',
    marginVertical: 12,
    borderRadius: 1,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    marginTop: 18,
    marginBottom: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  resultBox: {
    backgroundColor: '#f8fbff',
    borderRadius: 12,
    padding: 18,
    marginTop: 18,
    borderWidth: 2,
    borderColor: '#2196F3',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusChip: {
    fontWeight: 'bold',
    fontSize: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 2,
  },
  resultText: {
    fontSize: 16,
    color: '#2d3436',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 6,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    flex: 1,
    paddingRight: 40
  },
  iconContainer: {
    top: Platform.OS === 'android' ? 18 : 14,
    right: 12,
  },
  placeholder: {
    color: '#888',
    fontSize: 16,
  },
});

export default VisaScreen;
