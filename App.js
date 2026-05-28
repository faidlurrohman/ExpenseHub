import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { darkTheme, lightTheme, theme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider, useSettings } from './src/context/SettingContext';

function AppContent() {
  const { themeMode, isLoaded } = useSettings();

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
