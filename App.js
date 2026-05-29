import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { darkTheme, lightTheme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { Appearance, Platform, Animated, Dimensions } from 'react-native';
import BootSplash from 'react-native-bootsplash';

const useNativeDriver = Platform.OS !== 'web';

function ThemedBootSplash() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [opacity] = useState(() => new Animated.Value(1));
  const [translateY] = useState(() => new Animated.Value(0));

  const { container, logo /*, brand */ } = BootSplash.useHideAnimation({
    manifest: require('./src/assets/image/bootsplash/manifest.json'),

    logo: require('./src/assets/image/bootsplash/logo.png'),
    // darkLogo: require("../assets/bootsplash/dark-logo.png"),
    // brand: require("../assets/bootsplash/brand.png"),
    // darkBrand: require("../assets/bootsplash/dark-brand.png"),

    // statusBarTranslucent: true,
    // navigationBarTranslucent: true,

    animate: () => {
      const { height } = Dimensions.get('window');

      Animated.stagger(250, [
        Animated.spring(translateY, {
          useNativeDriver,
          toValue: -50,
        }),
        Animated.spring(translateY, {
          useNativeDriver,
          toValue: height,
        }),
      ]).start();

      Animated.timing(opacity, {
        useNativeDriver,
        toValue: 0,
        duration: 150,
        delay: 350,
      }).start();
      // .start(() => {
      //   onAnimationEnd();
      // });
    },
  });

  return (
    <Animated.View
      {...container}
      style={[
        container.style,
        { opacity, backgroundColor: theme.colors.background },
      ]}
    >
      <Animated.Image
        {...logo}
        style={[logo.style, { transform: [{ translateY }] }]}
      />

      {/* <Animated.Image {...brand} style={[brand.style, { opacity }]} /> */}
    </Animated.View>
  );
}

function AppContent() {
  const { themeMode, isLoaded, resolveTheme } = useSettings();
  const [actualTheme, setActualTheme] = useState('light');
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const updateActualTheme = () => {
      const resolved = resolveTheme(themeMode);
      setActualTheme(resolved);
    };

    updateActualTheme();

    const subscription = Appearance.addChangeListener(() => {
      if (themeMode === 'system') {
        updateActualTheme();
      }
    });

    return () => subscription.remove();
  }, [themeMode, resolveTheme]);

  useEffect(() => {
    if (isLoaded) {
      BootSplash.hide({ fade: true }).then(() => {
        setSplashVisible(false);
      });
    }
  }, [isLoaded]);

  if (!isLoaded) {
    return <ThemedBootSplash />;
  }

  const theme = actualTheme === 'dark' ? darkTheme : lightTheme;

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
