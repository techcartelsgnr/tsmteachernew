import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DarkColors, LightColors, setTheme } from '../theme/theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // 🔑 important

  /* ================= INIT ================= */

  useEffect(() => {
    initTheme();
  }, []);

  /* ================= SYSTEM LISTENER ================= */

  useEffect(() => {

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {

      // ❌ DO NOTHING if user already selected theme
      if (isLoaded) return;

      const isDark = colorScheme === 'dark';
      setIsDarkMode(isDark);
      setTheme(isDark);

    });

    return () => subscription.remove();

  }, [isLoaded]);

  /* ================= INIT FUNCTION ================= */

  const initTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('app_theme');

      if (savedTheme !== null) {
        const dark = savedTheme === 'dark';

        setIsDarkMode(dark);
        setTheme(dark);

        setIsLoaded(true); // 🔑 user preference exists
      } else {
        const systemTheme = Appearance.getColorScheme();
        const dark = systemTheme === 'dark';

        setIsDarkMode(dark);
        setTheme(dark);

        setIsLoaded(false); // 🔑 follow system
      }

    } catch (e) {
      console.log('Theme init error:', e);
    }
  };

  /* ================= TOGGLE ================= */

  const toggleThemeMode = async () => {

    const newDarkMode = !isDarkMode;

    setIsDarkMode(newDarkMode);
    setTheme(newDarkMode);

    setIsLoaded(true); // 🔥 lock user preference

    try {
      await AsyncStorage.setItem(
        'app_theme',
        newDarkMode ? 'dark' : 'light'
      );
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleTheme: toggleThemeMode,
        colors: isDarkMode ? DarkColors : LightColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};