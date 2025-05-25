import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

// Constants defined outside component to ensure they never change
const DEFAULT_WORK_TIME = 25 * 60; // 25 minutes in seconds
const DEFAULT_SHORT_BREAK = 5 * 60; // 5 minutes
const DEFAULT_LONG_BREAK = 15 * 60; // 15 minutes

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_WORK_TIME);
  const [shortBreak] = useState(DEFAULT_SHORT_BREAK);
  const [longBreak] = useState(DEFAULT_LONG_BREAK);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      Vibration.vibrate([500, 500, 500]);
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (isWorkTime) {
      setPomodoroCount(count => count + 1);
      if (pomodoroCount === 3) { // After 4 pomodoros, take a long break
        setTimeLeft(DEFAULT_LONG_BREAK);
        setPomodoroCount(0);
      } else {
        setTimeLeft(DEFAULT_SHORT_BREAK);
      }
    } else {
      setTimeLeft(DEFAULT_WORK_TIME); // Always reset to default 25 minutes
    }
    setIsWorkTime(!isWorkTime);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };  const resetTimer = () => {
    // First, stop any active timer
    setIsActive(false);
    
    // Reset all states at once
    setTimeLeft(DEFAULT_WORK_TIME);
    setIsWorkTime(true);
    setPomodoroCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const adjustTime = (minutes: number) => {
    // Only allow adjustments during work time
    if (!isWorkTime) return;

    const newTime = timeLeft + (minutes * 60);
    if (newTime >= 0 && newTime <= DEFAULT_WORK_TIME) {
      setTimeLeft(newTime);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.status}>
          {isWorkTime ? 'Focus Time' : 'Break Time'}
        </Text>
      </View>
      
      <View style={styles.timerRow}>
        <TouchableOpacity 
          style={[styles.adjustButton, { backgroundColor: Colors[colorScheme].secondary }]}
          onPress={() => adjustTime(-2)}>
          <Text style={styles.adjustButtonText}>-</Text>
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Text style={[
            styles.timer,
            { color: Colors[colorScheme].text }
          ]}>
            {formatTime(timeLeft)}
          </Text>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${100 * (1 - timeLeft / (isWorkTime ? DEFAULT_WORK_TIME : (pomodoroCount === 0 ? DEFAULT_LONG_BREAK : DEFAULT_SHORT_BREAK)))}%`, backgroundColor: Colors[colorScheme].accent }]} />
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.adjustButton, { backgroundColor: Colors[colorScheme].secondary }]}
          onPress={() => adjustTime(2)}>
          <Text style={styles.adjustButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].primary }]}
          onPress={toggleTimer}>
          <ThemedText style={styles.buttonText}>
            {isActive ? 'Pause' : 'Start'}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].secondary }]}
          onPress={resetTimer}>
          <ThemedText style={styles.buttonText}>Reset</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor:
                  index < pomodoroCount
                    ? Colors[colorScheme].accent
                    : Colors[colorScheme].secondary,
              },
            ]}
          />
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 32,
    padding: 12,
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  status: {
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 0,
    marginBottom: 0,
  },
  timerContainer: {
    borderWidth: 5,
    borderColor: Colors.light.primary,
    borderRadius: 120,
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    backgroundColor: 'rgba(255, 192, 203, 0.05)',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
  },
  timer: {
    fontSize: 52,
    fontWeight: '300',
    textAlign: 'center',
    letterSpacing: 2,
    includeFontPadding: false,
    lineHeight: 56,
  },
  adjustButton: {
    width: 28,
    height: 28,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  adjustButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '300',
    includeFontPadding: false,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 96,
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  progressContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
    opacity: 0.9,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 1,
    elevation: 1,
  },
  progressBarWrapper: {
    width: '40%',
    alignSelf: 'center',
    marginTop: 5,
  },
  progressBarBackground: {
    width: '100%',
    height: 2,
    borderRadius: 3,
    backgroundColor: Colors.light.secondary,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 2,
    borderRadius: 3,
    backgroundColor: Colors.light.accent,
  },
});
