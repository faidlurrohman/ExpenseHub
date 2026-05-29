import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Chip, Text, useTheme } from 'react-native-paper';
import { addExpense } from '../storage/expenseStorage';
import { useNavigation } from '@react-navigation/native';
import { trackExpenseAdded } from '../utils/analytics';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

const CATS = [
  'food',
  'transport',
  'shopping',
  'entertainment',
  'bills',
  'other',
];

export default function AddExpenseScreen() {
  const { language, currency } = useSettings();
  const t = translations[language];
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState(t.food);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert(t.error, t.invalidAmount);
      return;
    }

    setLoading(true);
    try {
      await addExpense({
        amount: parseFloat(amount),
        merchant,
        category,
        date: new Date().toISOString(),
      });

      await trackExpenseAdded(parseFloat(amount), category, merchant);

      Alert.alert(t.success, t.saved);
      nav.goBack();
    } catch (error) {
      Alert.alert(t.error, t.failedSave);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text
        variant="labelLarge"
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        {t.amount}
      </Text>
      <TextInput
        mode="outlined"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="0"
      />

      <Text
        variant="labelLarge"
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        {t.merchant}
      </Text>
      <TextInput
        mode="outlined"
        value={merchant}
        onChangeText={setMerchant}
        placeholder={t.merchant}
      />
      <Text
        variant="labelLarge"
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        {t.category}
      </Text>

      <View style={styles.chips}>
        {CATS.map(c => (
          <Chip
            key={c}
            mode="flat"
            compact
            // selected={category === c}
            onPress={() => setCategory(c)}
            selectedColor={
              category === c
                ? theme.colors.onPrimary
                : theme.colors.onSurfaceVariant
            }
            style={{
              marginBottom: 8,
              marginRight: 8,
              backgroundColor:
                category === c
                  ? theme.colors.primary
                  : theme.colors.surfaceDisabled,
            }}
          >
            {t?.[c]}
          </Chip>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        style={styles.btn}
      >
        {t.save}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  btn: { marginTop: 32, paddingVertical: 6 },
});
