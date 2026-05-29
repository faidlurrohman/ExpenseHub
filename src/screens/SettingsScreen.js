import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Divider,
  List,
  useTheme,
  Switch,
} from 'react-native-paper';
import {
  saveProfile,
  getProfile,
  getExpenses,
} from '../storage/expenseStorage';
import { trackBudgetSet, trackDataExport } from '../utils/analytics';
import { translations } from '../utils/translations';
import { useSettings } from '../context/SettingsContext';

export default function SettingsScreen() {
  const {
    themeMode,
    language,
    currency,
    updateTheme,
    updateLang,
    updateCurrency,
  } = useSettings();
  const t = translations[language];
  const theme = useTheme();
  const [profile, setProfile] = useState({ name: '', budget: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const p = await getProfile();
    setProfile({ name: p.name, budget: String(p.budget) });
  };

  const save = async () => {
    setLoading(true);
    await saveProfile({ name: profile.name, budget: Number(profile.budget) });

    if (profile.budget) {
      await trackBudgetSet(Number(profile.budget));
    }

    setLoading(false);
    Alert.alert(t.saved, t.updated);
  };

  const exportData = async () => {
    const data = await getExpenses();
    await trackDataExport('json');
    Alert.alert(t.export, `${t.copyData}\n\n${JSON.stringify(data)}`);
  };

  const cycleTheme = () => {
    let nextTheme;

    if (themeMode === 'system') {
      nextTheme = 'light';
    } else if (themeMode === 'light') {
      nextTheme = 'dark';
    } else {
      nextTheme = 'system';
    }

    updateTheme(nextTheme);
  };

  const getThemeDescription = () => {
    if (themeMode === 'system') {
      return t.system;
    }
    return themeMode === 'dark' ? t.dark : t.light;
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text variant="titleMedium" style={{ marginBottom: 20 }}>
        {t.profile}
      </Text>

      <Text
        variant="labelLarge"
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
        }}
      >
        {t.name}
      </Text>
      <TextInput
        mode="outlined"
        value={profile.name}
        onChangeText={t => setProfile(p => ({ ...p, name: t }))}
        style={{ marginBottom: 16 }}
      />
      <Text
        variant="labelLarge"
        style={{
          fontWeight: 'bold',
          marginBottom: 8,
        }}
      >
        {t.budget}
      </Text>
      <TextInput
        mode="outlined"
        keyboardType="numeric"
        value={profile.budget}
        onChangeText={t => setProfile(p => ({ ...p, budget: t }))}
        style={{ marginBottom: 16 }}
      />

      <Button
        mode="contained"
        onPress={save}
        loading={loading}
        style={styles.btn}
      >
        {t.save}
      </Button>

      <Divider style={styles.div} />

      <List.Item
        title={t.theme}
        description={getThemeDescription()}
        right={() => (
          <Switch value={themeMode === 'dark'} onValueChange={cycleTheme} />
        )}
      />
      <List.Item
        title={t.lang}
        description={language === 'id' ? t.indonesian : t.english}
        onPress={() => updateLang(language === 'id' ? 'en' : 'id')}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />
      <List.Item
        title={t.currency}
        description={currency === 'IDR' ? t.idr : t.usd}
        onPress={() => updateCurrency(currency === 'IDR' ? 'USD' : 'IDR')}
        right={props => <List.Icon {...props} icon="chevron-right" />}
      />

      <Divider style={styles.div} />
      <List.Item
        title={t.export}
        description={t.exportDesc}
        onPress={exportData}
        right={props => <List.Icon {...props} icon="download" />}
      />
      <Text
        style={{ marginVertical: 16, color: theme.colors.error, fontSize: 12 }}
      >
        {t.warn}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  btn: { marginTop: 8, paddingVertical: 6 },
  div: { marginVertical: 24 },
});
