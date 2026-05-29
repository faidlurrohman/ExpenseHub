import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { translations } from '../utils/translations';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useTheme } from 'react-native-paper';
import { useSettings } from '../context/SettingsContext';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
  const { language } = useSettings();
  const theme = useTheme();
  const t = translations[language];

  return (
    <Tab.Navigator
      screenOptions={({ route, ...rest }) => ({
        tabBarIcon: ({ color, size }) => {
          const name =
            route.name === 'HomeTab' ? 'cash-multiple' : 'cog-outline';
          return <Icon name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        tabBarLabelPosition: 'below-icon',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Bold',
        },

        headerTintColor: theme.colors.onSurface,
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 0,
          shadowOpacity: 0,
        },
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
