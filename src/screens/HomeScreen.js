import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList } from 'react-native';
import {
  FAB,
  Card,
  List,
  IconButton,
  Divider,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getExpenses, getProfile } from '../storage/expenseStorage';
import { formatCurrency } from '../utils/formatCurrency';
import { format } from 'date-fns';
import { trackScreenView } from '../utils/analytics';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

export default function HomeScreen() {
  const { language, currency } = useSettings();
  const t = translations[language];
  const theme = useTheme();
  const [expenses, setExpenses] = useState([]);
  const [profile, setProfile] = useState({ name: 'User', budget: 0 });
  const nav = useNavigation();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      trackScreenView('home_screen');
    }, []),
  );

  const loadData = async () => {
    const [e, p] = await Promise.all([getExpenses(), getProfile()]);
    setExpenses(e);
    setProfile(p);
  };

  const total = expenses?.reduce((s, i) => s + (i?.amount || 0), 0);
  const budget = profile?.budget || 0;
  const pct = budget > 0 ? Math?.min((total / budget) * 100, 100) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={{ margin: 16, marginBottom: 0 }}>
        <Card.Content>
          <Text variant="bodyLarge" style={{ color: theme.colors.caption }}>
            Halo, {profile.name} 👋
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.caption }}>
            {t.total}
          </Text>
          <Text
            variant="displaySmall"
            style={{
              color: theme.colors.primary,
              marginVertical: 8,
            }}
          >
            {formatCurrency(total, currency)}
          </Text>

          {budget > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.caption, marginBottom: 6 }}
              >
                {t.budget}: {formatCurrency(budget, currency)} (
                {Math.round(pct)}%)
              </Text>
              <ProgressBar
                progress={pct / 100}
                color={pct < 75 ? theme.colors.primary : theme.colors.error}
                style={{ height: 8, borderRadius: 4 }}
              />
            </View>
          )}
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={{ margin: 16, marginBottom: 0 }}>
        {t.recent}
      </Text>
      <FlatList
        data={expenses.slice(0, 15)}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.merchant || '-'}
            description={`${formatCurrency(item.amount, currency)} • ${
              item.category
            }`}
            left={props => <List.Icon {...props} icon="cash" />}
            titleStyle={{ fontSize: 15, fontWeight: '500' }}
            descriptionStyle={{ color: theme.colors.caption }}
          />
        )}
        ItemSeparatorComponent={() => <Divider inset />}
        ListEmptyComponent={
          <Text
            variant="bodyMedium"
            style={{
              textAlign: 'center',
              marginTop: 40,
              color: theme.colors.caption,
            }}
          >
            {t.empty}
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <FAB
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          backgroundColor: theme.colors.primary,
          borderRadius: 999,
        }}
        color={theme.colors.onPrimary}
        icon="plus"
        onPress={() => nav.navigate('AddExpense', { refresh: loadData })}
      />
    </View>
  );
}
