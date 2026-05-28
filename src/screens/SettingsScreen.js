import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Divider, List } from 'react-native-paper';
import {
  saveProfile,
  getProfile,
  getExpenses,
} from '../storage/expenseStorage';
import { trackBudgetSet, trackDataExport } from '../utils/analytics';

export default function SettingsScreen() {
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
    Alert.alert('Tersimpan', 'Pengaturan diperbarui');
  };

  const exportData = async () => {
    const data = await getExpenses();
    await trackDataExport('json');
    Alert.alert(
      'Export Data',
      `Salin data ini untuk backup:\n\n${JSON.stringify(data)}`,
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil & Budget</Text>
      <TextInput
        mode="outlined"
        label="Nama"
        value={profile.name}
        onChangeText={t => setProfile(p => ({ ...p, name: t }))}
        style={styles.inp}
      />
      <TextInput
        mode="outlined"
        label="Budget Bulanan (Rp)"
        keyboardType="numeric"
        value={profile.budget}
        onChangeText={t => setProfile(p => ({ ...p, budget: t }))}
        style={styles.inp}
      />

      <Button
        mode="contained"
        onPress={save}
        loading={loading}
        style={styles.btn}
      >
        SIMPAN PERUBAHAN
      </Button>

      <Divider style={styles.div} />
      <List.Item
        title="Export Data (JSON)"
        description="Salin data manual untuk backup"
        onPress={exportData}
        right={props => <List.Icon {...props} icon="download" />}
      />
      <Text style={styles.warn}>
        ⚠️ Data tersimpan lokal. Jika aplikasi di-uninstall, data akan hilang.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  inp: { marginBottom: 12, backgroundColor: '#FFF' },
  btn: { marginTop: 8, paddingVertical: 6 },
  div: { marginVertical: 24 },
  warn: { marginTop: 16, color: '#94A3B8', fontSize: 12 },
});
