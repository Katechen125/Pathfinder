import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity, Alert, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Icon name="exchange" size={28} color="#2196F3" style={{ marginRight: 10 }} />
          <Text style={styles.title}>Currency Converter</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Amount</Text>
          <View style={styles.inputRow}>
            <Text style={styles.currencyFlag}>{base?.flag}</Text>
            <TextInput
              style={styles.input}
              placeholder={`Enter amount in ${base?.name}`}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholderTextColor="#888"
            />
          </View>
          <TouchableOpacity
            style={styles.hideKeyboardButton}
            onPress={() => Keyboard.dismiss()}
          >
            <Text style={styles.hideKeyboardText}>Hide Keyboard</Text>
          </TouchableOpacity>
          <View style={styles.pickerRow}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>From</Text>
              <Picker
                selectedValue={baseCurrency}
                style={styles.picker}
                onValueChange={setBaseCurrency}
                dropdownIconColor="#2196F3"
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
              <Text style={styles.pickerLabel}>To</Text>
              <Picker
                selectedValue={targetCurrency}
                style={styles.picker}
                onValueChange={setTargetCurrency}
                dropdownIconColor="#2196F3"
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
        </View>

        <View style={styles.resultCard}>
          {loading ? (
            <ActivityIndicator size="large" color="#2196F3" />
          ) : (
            <>
              {rate > 0 && (
                <Text style={styles.conversionRate}>
                  <Icon name="info-circle" size={16} color="#2196F3" /> 1 {baseCurrency} = {rate} {targetCurrency}
                </Text>
              )}
              <Text style={styles.resultText}>
                {amount || '0'} {baseCurrency} =
              </Text>
              <Text style={styles.resultAmount}>
                {converted} {targetCurrency}
              </Text>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#f4f8fb',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 18,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  currencyFlag: {
    fontSize: 22,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 18,
    color: '#2c3e50',
    backgroundColor: 'transparent',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  pickerWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#e3eaf4',
    overflow: 'hidden',
  },
  pickerLabel: {
    fontSize: 15,
    color: '#7f8c8d',
    paddingLeft: 10,
    marginTop: 4,
  },
  picker: {
    width: '100%',
    color: '#2c3e50',
    backgroundColor: 'transparent',
    minHeight: 44,
  },
  swapButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 22,
    elevation: 3,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    alignItems: 'center',
    marginTop: 10,
  },
  conversionRate: {
    fontSize: 16,
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 10,
  },
  resultText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 5,
    fontWeight: '500'
  },
  resultAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
    marginTop: 2,
  },
  hideKeyboardButton: {
    alignSelf: 'flex-end',
    marginTop: 6,
    marginBottom: 10,
    backgroundColor: '#2196F3',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  hideKeyboardText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  
});

export default CurrencyConverterScreen;
