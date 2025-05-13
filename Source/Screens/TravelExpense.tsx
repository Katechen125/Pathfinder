import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Expense {
  id: string;
  name: string;
  amount: number;
  color: string;
}

const categories = [
  { name: 'Food', color: '#FF6384' },
  { name: 'Transport', color: '#36A2EB' },
  { name: 'Accommodation', color: '#FFCE56' },
  { name: 'Activities', color: '#4BC0C0' },
  { name: 'Other', color: '#8E44AD' }
];

const ExpenseScreen = () => {
  const [limit, setLimit] = useState('');
  const [category, setCategory] = useState(categories[0].name);
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const parsedLimit = parseFloat(limit) || 0;
  const remaining = parsedLimit - totalSpent;
  const progressPercentage = Math.min((totalSpent / parsedLimit) * 100, 100);

  const categoryTotals = categories.map(cat => {
    const total = expenses
      .filter(e => e.name === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);
    return {
      ...cat,
      total,
      percentage: total > 0 ? (total / totalSpent) * 100 : 0
    };
  }).filter(cat => cat.total > 0);

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

    setExpenses([...expenses, {
      id: Date.now().toString(),
      name: category,
      amount: parsedAmount,
      color: categories.find(c => c.name === category)!.color
    }]);
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
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Travel Budget Tracker</Text>

      <View style={styles.budgetCard}>
        <Text style={styles.label}>Set Budget Limit:</Text>
        <TextInput
          placeholder="Enter your total budget"
          keyboardType="numeric"
          value={limit}
          onChangeText={setLimit}
          style={styles.input}
        />
      </View>

      <View style={styles.expenseForm}>
        <Text style={styles.label}>Add New Expense:</Text>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.picker}
        >
          {categories.map(c => (
            <Picker.Item key={c.name} label={c.name} value={c.name} />
          ))}
        </Picker>
        <TextInput
          placeholder="Enter Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={addExpense}
        >
          <Icon name="plus" size={16} color="white" />
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {parsedLimit > 0 && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Budget Usage</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progressPercentage}%` }]}>
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
            </View>
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
              remaining < 0 ? styles.negative : {}
            ]}>${remaining.toFixed(2)}</Text>
          </View>
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
    textAlign: 'center'
  },
  budgetCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2
  },
  expenseForm: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500'
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15
  },
  picker: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8
  },
  addButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 16
  },
  summaryCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10
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
  progressContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 10,
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressSegments: {
    flexDirection: 'row',
    height: '100%',
    width: '100%'
  },
  expensesList: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10
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
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  expenseName: {
    flex: 1
  },
  expenseAmount: {
    fontWeight: '500',
    marginRight: 10
  },
  deleteButton: {
    padding: 8
  }
});

export default ExpenseScreen;
