import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
];

const CurrencyConverterScreen = () => {
  const [amount, setAmount] = useState('');
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [converted, setConverted] = useState('');
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!amount) {
      setConverted('');
      setRate(0);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );
      const newRate = response.data.rates[targetCurrency];
      setRate(newRate);
      setConverted((parseFloat(amount) * newRate).toFixed(2));
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch exchange rates');
      setConverted('');
      setRate(0);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
    setConverted('');
    setRate(0);
  };

  useEffect(() => {
    convert();
  }, [baseCurrency, targetCurrency, amount]);

  const base = CURRENCIES.find(c => c.code === baseCurrency);
  const target = CURRENCIES.find(c => c.code === targetCurrency);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>
      <View style={styles.inputRow}>
        <Text style={styles.currencyFlag}>{base?.flag}</Text>
        <TextInput
          style={styles.input}
          placeholder={`Amount in ${base?.name}`}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholderTextColor="#666"
        />
      </View>
      <View style={styles.pickerRow}>
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>From:</Text>
          <Picker
            selectedValue={baseCurrency}
            style={styles.picker}
            onValueChange={setBaseCurrency}
          >
            {CURRENCIES.map(currency => (
              <Picker.Item 
                key={currency.code} 
                label={`${currency.flag} ${currency.code} - ${currency.name}`} 
                value={currency.code} 
              />
            ))}
          </Picker>
        </View>
        <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
          <Icon name="exchange" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.pickerWrapper}>
          <Text style={styles.pickerLabel}>To:</Text>
          <Picker
            selectedValue={targetCurrency}
            style={styles.picker}
            onValueChange={setTargetCurrency}
          >
            {CURRENCIES.map(currency => (
              <Picker.Item 
                key={currency.code} 
                label={`${currency.flag} ${currency.code} - ${currency.name}`} 
                value={currency.code} 
              />
            ))}
          </Picker>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <View style={styles.resultContainer}>
          {rate > 0 && (
            <Text style={styles.conversionRate}>
              1 {baseCurrency} = {rate} {targetCurrency}
            </Text>
          )}
          <Text style={styles.resultText}>
            {amount || '0'} {baseCurrency} =
          </Text>
          <Text style={styles.resultAmount}>
            {converted} {targetCurrency}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2c3e50',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 2,
  },
  currencyFlag: {
    fontSize: 22,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: '#2c3e50',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  pickerWrapper: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#7f8c8d',
    paddingLeft: 10,
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  swapButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 2,
  },
  conversionRate: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 5,
  },
  resultAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#27ae60',
  },
});

export default CurrencyConverterScreen;
