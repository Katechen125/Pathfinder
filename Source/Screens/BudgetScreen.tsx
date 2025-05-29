import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../Services/types';

type BudgetCard = {
  label: string;
  screen: 'ExpenseTracker' | 'CurrencyConverter';
  icon: string;
  image: any;
};

const cards: BudgetCard[] = [
  {
    label: 'Expense Tracker',
    screen: 'ExpenseTracker',
    icon: 'calculator',
    image: { uri: 'https://cdn.pixabay.com/photo/2020/02/04/23/08/chart-4819676_1280.jpg' }
  },
  {
    label: 'Currency Converter',
    screen: 'CurrencyConverter',
    icon: 'exchange',
    image: { uri: 'https://cdn.pixabay.com/photo/2018/12/09/09/37/money-3864576_1280.jpg' }
  }
];

const BudgetScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity
          key={card.label}
          style={[styles.card, index === 0 ? styles.firstCard : null]} 
          onPress={() => navigation.navigate(card.screen)}
        >
          <Image source={card.image} style={styles.cardImage} />
          <View style={styles.cardOverlay}>
            <Icon name={card.icon} size={38} color="#fff" style={{ marginBottom: 10 }} />
            <Text style={styles.cardText}>{card.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 0,
    paddingTop: 16, 
  },
  card: {
    width: '92%',
    aspectRatio: 1.4,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: '#fff',
    marginVertical: 8,
    alignSelf: 'center',
  },
  firstCard: {
    marginTop: 8,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.32)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  cardText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default  BudgetScreen;

