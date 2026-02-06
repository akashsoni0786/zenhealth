import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  sessionReminders: true,
  healthTips: true,
  promotionalEmails: false,

  // Privacy
  profileVisibility: 'public',
  showActivityStatus: true,
  shareHealthData: false,
  allowAnalytics: true,
  twoFactorEnabled: false,

  // Preferences
  theme: 'light',
  language: 'en',
  measurementUnit: 'metric',

  // Health
  dailyGoalReminders: true,
  weeklyReports: true,
  achievementAlerts: true
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage on initial render
    const savedSettings = localStorage.getItem('stayfit_settings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('stayfit_settings', JSON.stringify(settings));
  }, [settings]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (settings.theme === 'dark') {
      root.classList.add('dark-theme');
      body.classList.add('dark-theme');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark-theme');
      body.classList.remove('dark-theme');
    } else if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark-theme');
        body.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
        body.classList.remove('dark-theme');
      }
    }
  }, [settings.theme]);

  // Listen for system theme changes when using 'system' preference
  useEffect(() => {
    if (settings.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const root = document.documentElement;
      const body = document.body;
      if (e.matches) {
        root.classList.add('dark-theme');
        body.classList.add('dark-theme');
      } else {
        root.classList.remove('dark-theme');
        body.classList.remove('dark-theme');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const updateMultipleSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('stayfit_settings');
  };

  // Helper functions for measurement conversions
  const convertWeight = (kg) => {
    if (settings.measurementUnit === 'imperial') {
      return { value: (kg * 2.20462).toFixed(1), unit: 'lb' };
    }
    return { value: kg.toFixed(1), unit: 'kg' };
  };

  const convertHeight = (cm) => {
    if (settings.measurementUnit === 'imperial') {
      const inches = cm / 2.54;
      const feet = Math.floor(inches / 12);
      const remainingInches = Math.round(inches % 12);
      return { value: `${feet}'${remainingInches}"`, unit: '' };
    }
    return { value: cm.toFixed(0), unit: 'cm' };
  };

  const convertDistance = (km) => {
    if (settings.measurementUnit === 'imperial') {
      return { value: (km * 0.621371).toFixed(2), unit: 'mi' };
    }
    return { value: km.toFixed(2), unit: 'km' };
  };

  // Language labels
  const languageLabels = {
    en: 'English',
    hi: 'हिंदी',
    es: 'Español',
    fr: 'Français'
  };

  const value = {
    settings,
    updateSetting,
    updateMultipleSettings,
    resetSettings,
    convertWeight,
    convertHeight,
    convertDistance,
    languageLabels,
    isDarkMode: settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;
