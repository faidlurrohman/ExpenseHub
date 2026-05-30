import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, useTheme } from 'react-native-paper';
import { darkTheme, lightTheme } from './src/theme';
import AppNavigator from './src/navigation/AppNavigator';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import {
  Appearance,
  Platform,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { trackScreenView } from './src/utils/analytics';

const useNativeDriver = Platform.OS !== 'web';

function ThemedBootSplash({ theme, onAnimationEnd }) {
  const opacity = useRef(new Animated.Value(1));
  const scale = useRef(new Animated.Value(1));
  const translateY = useRef(new Animated.Value(0));

  const { container, logo /*, brand */ } = BootSplash.useHideAnimation({
    manifest: require('./src/assets/image/bootsplash/manifest.json'),
    logo: require('./src/assets/image/bootsplash/logo.png'),
    // darkLogo: require("../assets/bootsplash/dark-logo.png"),
    // brand: require("../assets/bootsplash/brand.png"),
    // darkBrand: require("../assets/bootsplash/dark-brand.png"),
    statusBarTranslucent: true,
    navigationBarTranslucent: true,
    animate: () => {
      const { height } = Dimensions.get('window');

      Animated.stagger(250, [
        Animated.spring(translateY.current, {
          useNativeDriver,
          toValue: -50,
        }),
        Animated.spring(translateY.current, {
          useNativeDriver,
          toValue: height,
        }),
      ]).start();

      Animated.timing(opacity.current, {
        useNativeDriver,
        toValue: 0,
        duration: 300,
        delay: 350,
      }).start(async () => {
        await trackScreenView('app_launch');
        onAnimationEnd();
      });
    },
  });

  return (
    <Animated.View
      {...container}
      style={[
        container.style,
        { opacity: opacity.current, backgroundColor: theme.colors.background },
      ]}
    >
      <Animated.Image
        {...logo}
        style={[
          logo.style,
          {
            transform: [
              { scale: scale.current },
              { translateY: translateY.current },
            ],
          },
        ]}
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

  if (!isLoaded) {
    return null;
  }

  const theme = actualTheme === 'dark' ? darkTheme : lightTheme;
  const barStyle = theme.dark ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={barStyle} translucent={true} />
      <PaperProvider theme={theme}>
        <AppNavigator />

        {splashVisible && (
          <ThemedBootSplash
            theme={theme}
            onAnimationEnd={() => {
              setSplashVisible(false);
            }}
          />
        )}
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
