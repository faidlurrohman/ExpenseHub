import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import {
  FAB,
  Card,
  List,
  IconButton,
  Divider,
  ProgressBar,
  Text,
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getExpenses, getProfile } from '../storage/expenseStorage';
import { formatCurrency } from '../utils/formatCurrency';
import { format } from 'date-fns';
import { trackScreenView } from '../utils/analytics';

export default function HomeScreen({ navigation }) {
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState({ name: 'User', budget: 0 });

  // Reload data setiap layar muncul
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, []),
  );

  // Track screen view untuk analytics
  useFocusEffect(
    React.useCallback(() => {
      trackScreenView('home_screen');
    }, []),
  );

  const loadData = async () => {
    const [e, p] = await Promise.all([getExpenses(), getProfile()]);
    setExpenses(e);
    setProfile(p);
  };

  const totalSpent = expenses.reduce((sum, i) => sum + (i.amount || 0), 0);
  const budget = profile.budget || 0;
  const percent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="bodyLarge" style={{ color: '#64748B' }}>
            Halo, {profile.name} 👋
          </Text>
          <Text variant="bodyMedium" style={{ color: '#64748B' }}>
            Total Pengeluaran
          </Text>
          <Text
            variant="displaySmall"
            style={{
              color: '#0F172A',
              marginVertical: 8,
            }}
          >
            {formatCurrency(totalSpent)}
          </Text>

          {budget > 0 && (
            <View style={styles.budgetBox}>
              <Text
                variant="bodySmall"
                style={{ color: '#64748B', marginBottom: 6 }}
              >
                Budget: {formatCurrency(budget)}
              </Text>
              <ProgressBar
                progress={percent / 100}
                color="#4F46E5"
                style={{ height: 8, borderRadius: 4 }}
              />
            </View>
          )}
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={{ margin: 16, marginBottom: 0 }}>
        Riwayat
      </Text>
      <FlatList
        data={expenses.slice(0, 15)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.merchant || 'Tanpa Nama'}
            description={`${formatCurrency(item.amount)} • ${item.category}`}
            left={props => <List.Icon {...props} icon="cash" />}
            titleStyle={{ fontSize: 15, fontWeight: '500' }}
            descriptionStyle={{ color: '#64748B' }}
          />
        )}
        ItemSeparatorComponent={() => <Divider inset />}
        ListEmptyComponent={
          <Text
            variant="bodyMedium"
            style={{ textAlign: 'center', marginTop: 40, color: '#94A3B8' }}
          >
            Belum ada pengeluaran 📭
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddExpense')}
      />
      <IconButton
        icon="cog-outline"
        size={28}
        style={styles.settBtn}
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  card: { margin: 16, marginBottom: 0 },
  budgetBox: { marginTop: 8 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4F46E5',
  },
  settBtn: { position: 'absolute', right: 8, top: 12 },
});
