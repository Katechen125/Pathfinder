import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, Button, Alert} from 'react-native';
import { checkVisaRequirements } from '../Services/API';
import { Picker } from '@react-native-picker/picker';

const NATIONALITIES = [
    { label: "United States", value: "United_States" },
    { label: "United Kingdom", value: "British" },
    { label: "Canada", value: "Canadian" },
    { label: "Australia", value: "Australian" },
    { label: "Germany", value: "German" },
    { label: "France", value: "French" },
    { label: "India", value: "Indian" },
    { label: "China", value: "Chinese" },
    { label: "Japan", value: "Japanese" },
    { label: "Brazil", value: "Brazilian" },
    { label: "Mexico", value: "Mexican" },
    { label: "Russia", value: "Russian" },
    { label: "Italy", value: "Italian" },
    { label: "Spain", value: "Spanish" },
    { label: "South Korea", value: "South_Korean" },
    { label: "South Africa", value: "South_African" },
    { label: "Turkey", value: "Turkish" },
    { label: "Argentina", value: "Argentine" },
    { label: "Indonesia", value: "Indonesian" },
    { label: "Saudi Arabia", value: "Saudi" },
  ];
  
  const DESTINATIONS = [
    "France",
    "United States",
    "United Kingdom",
    "Italy",
    "Spain",
    "Germany",
    "Turkey",
    "Mexico",
    "Thailand",
    "China",
    "Japan",
    "Russia",
    "India",
    "Brazil",
    "Australia",
    "Canada",
    "Greece",
    "Egypt",
    "South Africa",
    "UAE",
  ];
  
  const VisaScreen = () => {
    const [nationality, setNationality] = useState(NATIONALITIES[0].value);
    const [destination, setDestination] = useState(DESTINATIONS[0]);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
  
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
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Your Nationality:</Text>
        <Picker
          selectedValue={nationality}
          onValueChange={setNationality}
          style={styles.picker}
        >
          {NATIONALITIES.map(n => (
            <Picker.Item key={n.value} label={n.label} value={n.value} />
          ))}
        </Picker>
  
        <Text style={styles.label}>Destination Country:</Text>
        <Picker
          selectedValue={destination}
          onValueChange={setDestination}
          style={styles.picker}
        >
          {DESTINATIONS.map(d => (
            <Picker.Item key={d} label={d} value={d} />
          ))}
        </Picker>
  
        <Button 
          title="Check Requirements" 
          onPress={handleCheckVisa} 
          disabled={loading}
        />
  
        {result ? (
          <Text style={styles.result}>
            Visa Requirement: {result}
          </Text>
        ) : null}
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 16, marginVertical: 10 },
    picker: { backgroundColor: '#f5f5f5', borderRadius: 8, marginBottom: 20 },
    result: { marginTop: 20, fontSize: 18, textAlign: 'center' }
  });
  
  export default VisaScreen;
  