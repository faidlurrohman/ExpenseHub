import React, { useMemo } from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { trackScreenView } from '../utils/analytics';
import BottomNavigator from './BottomNavigator';
import { DefaultTheme, useTheme } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import { useSettings } from '../context/SettingsContext';
import { translations } from '../utils/translations';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const theme = useTheme();
  const { language } = useSettings();
  const t = translations[language];

  const navTheme = useMemo(() => {
    const isDark = theme.dark;
    return {
      ...(isDark ? DarkTheme : DefaultTheme),
      colors: {
        ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.onSurface,
        border: theme.colors.outline,
        primary: theme.colors.primary,
      },
    };
  }, [theme]);

  return (
    <NavigationContainer
      theme={navTheme}
      onReady={async () => {
        const isVisible = await BootSplash.isVisible();

        if (isVisible) {
          await new Promise(resolve => setTimeout(resolve, 100));
          await BootSplash.hide({ fade: true });
          await trackScreenView('app_launch');
        }
      }}
      onStateChange={async state => {
        if (state) {
          const currentRoute = state.routes[state.index];
          await trackScreenView(currentRoute.name);
        }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={BottomNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{
            title: t.add,
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
