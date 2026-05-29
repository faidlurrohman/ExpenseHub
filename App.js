import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { darkTheme, lightTheme, theme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AppContent() {
  const { themeMode, isLoaded, updateTheme } = useSettings();

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // (Opsional: hapus kondisi ini kalau mau selalu follow system)
      const checkAutoSync = async () => {
        const saved = await AsyncStorage.getItem('app_theme');

        if (!saved && colorScheme) {
          updateTheme(colorScheme);
        }
      };

      checkAutoSync();
    });

    return () => subscription.remove();
  }, [updateTheme]);

  if (!isLoaded) return null;

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}
