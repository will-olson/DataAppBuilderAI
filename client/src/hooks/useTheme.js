import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';

const useTheme = () => {
  const [themeMode, setThemeMode] = useLocalStorage('theme-mode', 'system');
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    // Set initial value
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Get the actual theme to use (either stored preference or system)
  const actualTheme = themeMode === 'system' ? systemTheme : themeMode;

  const setTheme = useCallback((mode) => {
    if (['light', 'dark', 'system'].includes(mode)) {
      setThemeMode(mode);
    }
  }, [setThemeMode]);

  const toggleTheme = useCallback(() => {
    if (themeMode === 'system') {
      setThemeMode('light');
    } else if (themeMode === 'light') {
      setThemeMode('dark');
    } else {
      setThemeMode('system');
    }
  }, [themeMode, setThemeMode]);

  return {
    themeMode,
    actualTheme,
    systemTheme,
    setTheme,
    toggleTheme,
    isDark: actualTheme === 'dark',
    isLight: actualTheme === 'light'
  };
};

export default useTheme; 