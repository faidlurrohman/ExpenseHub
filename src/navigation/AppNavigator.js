import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BootSplash from 'react-native-bootsplash';
import { trackScreenView } from '../utils/analytics';
import BottomNavigator from './BottomNavigator';

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
      <BottomNavigator />
    </NavigationContainer>
  );
}
