import { Colors } from '@/constants/Colors';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from './ThemedText';

export function Settings() {
  const {
    soundEnabled,
    setSoundEnabled,
    vibrationEnabled,
    setVibrationEnabled,
    isDarkMode,
    setIsDarkMode,
    focusTime,
    setFocusTime,
    shortBreakTime,
    setShortBreakTime,
    longBreakTime,
    setLongBreakTime,
  } = useSettings();

  const colorScheme = useColorScheme() ?? 'light';

  const renderSettingItem = (
    label: string,
    value: boolean,
    onToggle: (value: boolean) => void,
    description?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingHeader}>
        <ThemedText style={styles.settingLabel}>{label}</ThemedText>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ 
            false: Colors[colorScheme].secondary + '40',
            true: Colors[colorScheme].primary 
          }}
          thumbColor={Colors[colorScheme].text}
        />
      </View>
      {description && (
        <ThemedText style={styles.settingDescription}>
          {description}
        </ThemedText>
      )}
    </View>
  );

  const renderTimeSlider = (
    label: string,
    value: number,
    onValueChange: (value: number) => void,
    min: number,
    max: number
  ) => (
    <View style={styles.settingItem}>
      <ThemedText style={styles.settingLabel}>{label}</ThemedText>
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={min}
          maximumValue={max}
          value={value}
          onValueChange={(val) => onValueChange(Math.round(val))}
          step={1}
          minimumTrackTintColor={Colors[colorScheme].primary}
          maximumTrackTintColor={Colors[colorScheme].secondary + '40'}
          thumbTintColor={Colors[colorScheme].primary}
        />
        <ThemedText style={styles.sliderValue}>{value} min</ThemedText>
      </View>
    </View>
  );

  return (
    <View style={styles.content}>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Timer Settings</ThemedText>
        {renderTimeSlider('Focus Duration', focusTime, setFocusTime, 1, 60)}
        {renderTimeSlider('Short Break Duration', shortBreakTime, setShortBreakTime, 1, 30)}
        {renderTimeSlider('Long Break Duration', longBreakTime, setLongBreakTime, 1, 45)}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>General Settings</ThemedText>
        {renderSettingItem(
          'Sound',
          soundEnabled,
          setSoundEnabled,
          'Play sound when timer completes'
        )}
        {renderSettingItem(
          'Vibration',
          vibrationEnabled,
          setVibrationEnabled,
          'Vibrate when timer completes'
        )}
        {renderSettingItem(
          'Dark Mode',
          isDarkMode,
          setIsDarkMode,
          'Switch between light and dark themes'
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
  },
  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
    fontFamily: 'Montserrat_400Regular',
  },
  aboutButton: {
    marginTop: 'auto',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  aboutButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat_500Medium',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  sliderValue: {
    marginLeft: 16,
    width: 60,
  },
});
