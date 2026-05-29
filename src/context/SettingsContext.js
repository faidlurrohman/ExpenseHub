import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('system'); // 'system', 'light', or 'dark'
  const [language, setLanguage] = useState('id');
  const [currency, setCurrency] = useState('IDR');
  const [isLoaded, setIsLoaded] = useState(false);

  const getSystemColorScheme = () => {
    const colorScheme = Appearance.getColorScheme();

    return colorScheme === 'dark' ? 'dark' : 'light';
  };

  const resolveTheme = mode => {
    if (mode === 'system') {
      return getSystemColorScheme();
    }

    return mode;
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [storedTheme, storedLang, storedCurrency] = await Promise.all([
          AsyncStorage.getItem('app_theme'),
          AsyncStorage.getItem('app_lang'),
          AsyncStorage.getItem('app_currency'),
        ]);

        if (storedTheme) {
          setThemeMode(storedTheme);
        } else {
          const colorScheme = Appearance.getColorScheme();

          if (colorScheme) {
            setThemeMode('system');
          } else {
            setThemeMode('light');
          }
        }

        if (storedLang) {
          setLanguage(storedLang);
        }

        if (storedCurrency) {
          setCurrency(storedCurrency);
        }
      } catch (e) {
        console.error('Load settings error', e);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  const updateTheme = async mode => {
    setThemeMode(mode);
    await AsyncStorage.setItem('app_theme', mode);
  };

  const updateLang = async lang => {
    setLanguage(lang);
    await AsyncStorage.setItem('app_lang', lang);
  };

  const updateCurrency = async curr => {
    setCurrency(curr);
    await AsyncStorage.setItem('app_currency', curr);
  };

  return (
    <SettingsContext.Provider
      value={{
        themeMode,
        language,
        currency,
        isLoaded,
        updateTheme,
        updateLang,
        updateCurrency,
        resolveTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
