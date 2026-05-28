import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SettingsScreen from '../screens/SettingsScreen';
import BootSplash from 'react-native-bootsplash';
import { trackScreenView } from '../utils/analytics';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer
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
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#0F172A',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{ title: 'Tambah' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Pengaturan' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
