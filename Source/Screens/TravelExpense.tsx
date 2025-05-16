import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getCurrentUser, saveExpenses, loadExpenses } from '../Services/storage';

interface Expense {
  id: string;
  name: string;
  amount: number;
  color: string;
}

const categories = [
  { name: 'Food', color: '#FF6384', icon: 'cutlery' },
  { name: 'Transport', color: '#36A2EB', icon: 'bus' },
  { name: 'Accommodation', color: '#FFCE56', icon: 'bed' },
  { name: 'Activities', color: '#4BC0C0', icon: 'ticket' },
  { name: 'Other', color: '#8E44AD', icon: 'ellipsis-h' }
];

const ExpenseScreen = () => {
  const [limit, setLimit] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const loadData = async () => {
      const username = await getCurrentUser();
      if (!username) return;
      
      const data = await loadExpenses(username);
      setExpenses(data.expenses);
      setLimit(data.limit);
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      const username = await getCurrentUser();
      if (!username) return;
      
      await saveExpenses(username, { expenses, limit });
    };
    saveData();
  }, [expenses, limit]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const parsedLimit = parseFloat(limit) || 0;
  const remaining = parsedLimit - totalSpent;
  const progressPercentage = parsedLimit > 0 ? Math.min((totalSpent / parsedLimit) * 100, 100) : 0;

  const categoryTotals = categories.map(cat => {
    const total = expenses
      .filter(e => e.name === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      ...cat,
      total,
      percentage: totalSpent > 0 ? (total / totalSpent) * 100 : 0
    };
  }).filter(cat => cat.total > 0);


  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 600,
      useNativeDriver: false
    }).start();
  }, [progressPercentage]);

  const addExpense = () => {
    if (!amount || !limit) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const parsedAmount = parseFloat(amount);
    const parsedLimit = parseFloat(limit);

    if (isNaN(parsedAmount) || isNaN(parsedLimit)) {
      Alert.alert('Error', 'Please enter valid numbers');
      return;
    }

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    if (total + parsedAmount > parsedLimit) {
      Alert.alert('Limit Exceeded!', 'This expense would exceed your budget limit.');
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        name: category,
        amount: parsedAmount,
        color: categories.find(c => c.name === category)!.color
      }
    ]);
    setAmount('');
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  useEffect(() => {
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const parsedLimit = parseFloat(limit);

    if (!isNaN(parsedLimit) && total > parsedLimit * 0.9 && total < parsedLimit) {
      Alert.alert('Warning', 'You\'re approaching your budget limit!');
    }
  }, [expenses, limit]);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        <Icon name="money" size={24} color="#4CAF50" /> Travel Budget Tracker
      </Text>

      <View style={styles.budgetCard}>
        <Text style={styles.label}>Set Budget Limit:</Text>
        <View style={styles.inputRow}>
          <Icon name="usd" size={18} color="#2196F3" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Enter your total budget"
            keyboardType="numeric"
            value={limit}
            onChangeText={setLimit}
            style={styles.input}
            maxLength={10}
          />
        </View>
      </View>

      <View style={styles.expenseForm}>
        <Text style={styles.label}>Add New Expense:</Text>
        <View style={styles.inputRow}>
          <Icon
            name={categories.find(c => c.name === category)?.icon || 'tag'}
            size={20}
            color={categories.find(c => c.name === category)?.color || '#888'}
            style={{ marginRight: 8 }}
          />
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
            style={styles.picker}
            dropdownIconColor="#2196F3"
          >
            {categories.map(c => (
              <Picker.Item key={c.name} label={c.name} value={c.name} />
            ))}
          </Picker>
        </View>
        <View style={styles.inputRow}>
          <Icon name="plus" size={18} color="#4CAF50" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Enter Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
            maxLength={10}
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addExpense}
        >
          <Icon name="plus-circle" size={18} color="white" />
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {parsedLimit > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Budget Usage</Text>
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              })
            }]}>
              <View style={styles.progressSegments}>
                {categoryTotals.map((cat, index) => (
                  <View
                    key={cat.name}
                    style={{
                      flex: cat.percentage / 100,
                      backgroundColor: cat.color,
                      borderRightWidth: index === categoryTotals.length - 1 ? 0 : 2,
                      borderRightColor: '#fff'
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total Budget:</Text>
            <Text style={styles.budgetAmount}>${parsedLimit.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Total Spent:</Text>
            <Text style={styles.spentAmount}>${totalSpent.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Remaining:</Text>
            <Text style={[
              styles.remainingAmount,
              remaining < 0 ? styles.negative : {},
              remaining === 0 ? styles.zero : {}
            ]}>
              ${remaining.toFixed(2)}
            </Text>
          </View>
          {remaining < 0 && (
            <View style={styles.overBudgetChip}>
              <Icon name="exclamation-triangle" size={16} color="#fff" />
              <Text style={styles.overBudgetText}>Over Budget!</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.expensesList}>
        <Text style={styles.listTitle}>Your Expenses</Text>
        {expenses.length === 0 ? (
          <Text style={styles.emptyText}>No expenses added yet</Text>
        ) : (
          expenses.map(expense => (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={[styles.categoryDot, { backgroundColor: expense.color }]} />
              <Text style={styles.expenseName}>{expense.name}</Text>
              <Text style={styles.expenseAmount}>${expense.amount.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteExpense(expense.id)}
              >
                <Icon name="trash" size={16} color="#f44336" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2196F3',
    letterSpacing: 0.5
  },
  budgetCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  expenseForm: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
    color: '#2d3436'
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  input: {
    flex: 1,
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f8f9fa'
  },
  picker: {
    flex: 1,
    minHeight: 45,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    marginLeft: 7,
    fontSize: 16,
    fontWeight: 'bold'
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2196F3'
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  budgetAmount: {
    fontWeight: '600',
    color: '#2196F3'
  },
  spentAmount: {
    fontWeight: '600',
    color: '#f44336'
  },
  remainingAmount: {
    fontWeight: '600',
    color: '#4CAF50'
  },
  negative: {
    color: '#f44336'
  },
  zero: {
    color: '#FF9800'
  },
  progressContainer: {
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginVertical: 10,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden'
  },
  progressSegments: {
    flexDirection: 'row',
    height: '100%',
    width: '100%'
  },
  overBudgetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
  },
  overBudgetText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14
  },
  expensesList: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2196F3'
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    marginVertical: 20
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0'
  },
  categoryDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 10
  },
  expenseName: {
    flex: 1,
    fontWeight: '500',
    color: '#222'
  },
  expenseAmount: {
    fontWeight: '600',
    marginRight: 10,
    color: '#2d3436'
  },
  deleteButton: {
    padding: 8
  }
});

export default ExpenseScreen;
