import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Text, useTheme } from 'react-native-paper';

// Mapping Icon
const getIconName = (routeName, focused) => {
  switch (routeName) {
    case 'HomeTab':
      return focused ? 'home' : 'home-outline';
    case 'SettingsTab':
      return focused ? 'cog' : 'cog-outline';
    default:
      return 'circle-outline';
  }
};

export default function Tabbar({ state, descriptors, navigation }) {
  const theme = useTheme();

  return (
    <View>
      {/* Main Bar Background */}
      <View style={[styles.bar, { backgroundColor: theme.colors.surface }]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Warna dinamis
          const activeColor = theme.colors.primary;
          const inactiveColor = theme.colors.onSurfaceDisabled;

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              {/* Container Icon & Label */}
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  position: 'relative',
                }}
              >
                {/* Icon */}
                <Icon
                  name={getIconName(route.name, isFocused)}
                  size={26}
                  color={isFocused ? activeColor : inactiveColor}
                  style={isFocused ? { transform: [{ scale: 1.1 }] } : {}}
                />

                {/* Label */}
                <Text
                  variant="bodySmall"
                  style={{
                    color: isFocused ? activeColor : inactiveColor,
                    fontFamily: 'Inter-Bold',
                  }}
                >
                  {label}
                </Text>

                {/* Indicator Line (Muncul hanya jika aktif) */}
                {isFocused && (
                  <View
                    style={[styles.indicator, { backgroundColor: activeColor }]}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around', // Agar icon tersebar rata
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
