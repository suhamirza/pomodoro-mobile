import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './ThemedText';

export function TimerSettings({ hideTitle = false }: { hideTitle?: boolean }) {
  const colorScheme = useColorScheme() ?? 'light';
  const [focusMinutes, setFocusMinutes] = useState('25');
  const [shortBreakMinutes, setShortBreakMinutes] = useState('5');
  const [longBreakMinutes, setLongBreakMinutes] = useState('15');

  return (
    <View style={styles.container}>
      {!hideTitle && (
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>
      )}
      
      <View style={styles.settingGroup}>
        <View style={styles.settingRow}>
          <ThemedText style={styles.label}>Focus Time</ThemedText>
          <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme].secondary }]}>
            <TextInput
              style={[styles.input, { color: '#FFFFFF' }]}
              value={focusMinutes}
              onChangeText={setFocusMinutes}
              keyboardType="number-pad"
              maxLength={3}
              placeholder="25"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
            <ThemedText style={styles.unit}>min</ThemedText>
          </View>
        </View>

        <View style={styles.settingRow}>
          <ThemedText style={styles.label}>Short Break</ThemedText>
          <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme].secondary }]}>
            <TextInput
              style={[styles.input, { color: '#FFFFFF' }]}
              value={shortBreakMinutes}
              onChangeText={setShortBreakMinutes}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="5"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
            <ThemedText style={styles.unit}>min</ThemedText>
          </View>
        </View>

        <View style={styles.settingRow}>
          <ThemedText style={styles.label}>Long Break</ThemedText>
          <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme].secondary }]}>
            <TextInput
              style={[styles.input, { color: '#FFFFFF' }]}
              value={longBreakMinutes}
              onChangeText={setLongBreakMinutes}
              keyboardType="number-pad"
              maxLength={2}
              placeholder="15"
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
            <ThemedText style={styles.unit}>min</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '300',
    letterSpacing: 1,
    marginBottom: 24,
    textAlign: 'center',
    color: Colors.light.primary,
  },
  settingGroup: {
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 1,
    color: Colors.light.accent,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 60,
    backgroundColor: Colors.light.lightAccent,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    fontSize: 14,
    fontWeight: '300',
    paddingVertical: 2,
    minWidth: 28,
    textAlign: 'center',
    color: Colors.light.darkAccent,
  },
  unit: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '300',
    opacity: 0.8,
    color: Colors.light.accent,
  },
});
