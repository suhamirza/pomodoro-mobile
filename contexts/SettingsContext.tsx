import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type SettingsContextType = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  toggleSound: () => void;
  toggleVibration: () => void;
  updateFocusTime: (minutes: number) => void;
  updateShortBreakTime: (minutes: number) => void;
  updateLongBreakTime: (minutes: number) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [focusTime, setFocusTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings when they change
  useEffect(() => {
    saveSettings();
  }, [soundEnabled, vibrationEnabled, focusTime, shortBreakTime, longBreakTime]);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setSoundEnabled(parsed.soundEnabled);
        setVibrationEnabled(parsed.vibrationEnabled);
        setFocusTime(parsed.focusTime);
        setShortBreakTime(parsed.shortBreakTime);
        setLongBreakTime(parsed.longBreakTime);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify({
        soundEnabled,
        vibrationEnabled,
        focusTime,
        shortBreakTime,
        longBreakTime,
      }));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleSound = () => setSoundEnabled(prev => !prev);
  const toggleVibration = () => setVibrationEnabled(prev => !prev);

  const value = {
    soundEnabled,
    vibrationEnabled,
    focusTime,
    shortBreakTime,
    longBreakTime,
    toggleSound,
    toggleVibration,
    updateFocusTime: setFocusTime,
    updateShortBreakTime: setShortBreakTime,
    updateLongBreakTime: setLongBreakTime,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
