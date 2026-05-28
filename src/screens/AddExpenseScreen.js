import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Chip, Text } from 'react-native-paper';
import { addExpense } from '../storage/expenseStorage';
import { useNavigation } from '@react-navigation/native';
import { trackExpenseAdded } from '../utils/analytics';

const CATS = ['🍔 Makanan', '🚗 Transport', '🛒 Belanja', '📦 Lainnya'];

export default function AddExpenseScreen() {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('🍔 Makanan');
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Nominal tidak valid');
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

      Alert.alert('Sukses', 'Data tersimpan');
      nav.goBack();
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert('Gagal', 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
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
        Nominal (Rp)
      </Text>
      <TextInput
        mode="outlined"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="0"
        style={styles.inp}
      />

      <Text
        variant="labelLarge"
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        Tempat / Merchant
      </Text>
      <TextInput
        mode="outlined"
        value={merchant}
        onChangeText={setMerchant}
        placeholder="Contoh: Indomaret"
        style={styles.inp}
      />

      <Text
        variant="labelLarge"
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        Kategori
      </Text>
      <View style={styles.chips}>
        {CATS.map(c => (
          <Chip
            key={c}
            selected={category === c}
            onPress={() => setCategory(c)}
            style={{ marginBottom: 8, marginRight: 8 }}
          >
            {c}
          </Chip>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        style={styles.btn}
      >
        SIMPAN
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  inp: { backgroundColor: '#FFF' },
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  btn: { marginTop: 32, paddingVertical: 6 },
});
