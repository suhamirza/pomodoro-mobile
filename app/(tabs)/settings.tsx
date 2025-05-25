import { ThemedView } from '@/components/ThemedView';
import { TimerSettings } from '@/components/TimerSettings';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}> 
      <TimerSettings hideTitle />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
