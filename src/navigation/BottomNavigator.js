import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { translations } from '../utils/translations';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from 'react-native-paper';
import { useSettings } from '../context/SettingContext';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { language } = useSettings();
  const theme = useTheme();
  const t = translations[language];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === 'HomeTab' ? 'cash-multiple' : 'cog-outline';
          return <Icon name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        headerTintColor: theme.colors.onSurface,
        headerStyle: { backgroundColor: 'transparent', elevation: 0 },
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: t.home }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{ title: t.settings }}
      />
    </Tab.Navigator>
  );
}
