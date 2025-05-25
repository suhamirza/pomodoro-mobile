import { Colors } from '@/constants/Colors';
import { useSettings } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as Device from 'expo-device';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutAnimation, Modal, Text, TouchableOpacity, Vibration, View } from 'react-native';

import { styles } from './PomodoroTimer.styles';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { VolumeIcon } from './VolumeIcon';

// Constants defined outside component to ensure they never change
const DEFAULT_WORK_TIME = 25 * 60; // 25 minutes in seconds
const DEFAULT_SHORT_BREAK = 5 * 60; // 5 minutes
const DEFAULT_LONG_BREAK = 15 * 60; // 15 minutes

const AMBIENT_SOUNDS = {
  rain: {
    source: require('../assets/sounds/rain.mp3'),
    icon: '🌧️',
    label: 'Rain',
  },
  jazz: {
    source: require('../assets/sounds/jazz.mp3'),
    icon: '🎷',
    label: 'Jazz',
  },
} as const;

export function PomodoroTimer() {
  const {
    soundEnabled,
    vibrationEnabled,
    focusTime,
    shortBreakTime,
    longBreakTime,
  } = useSettings();

  // Update DEFAULT times to use settings
  const workTime = focusTime * 60;
  const shortBreakDuration = shortBreakTime * 60;
  const longBreakDuration = longBreakTime * 60;

  const [timeLeft, setTimeLeft] = useState(workTime);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [ambientSound, setAmbientSound] = useState<keyof typeof AMBIENT_SOUNDS | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const ambientSoundRef = useRef<Audio.Sound | null>(null);
  const fadeAnims = {
    timer: useRef(new Animated.Value(0)).current,
    progress: useRef(new Animated.Value(0)).current,
    controls: useRef(new Animated.Value(0)).current,
    audioPlayer: useRef(new Animated.Value(0)).current
  };

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

  // Update audio initialization
  useEffect(() => {
    async function initSound() {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
    initSound();
  }, []);

  // Add cleanup effect for audio and volume controls
  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });

    return () => {
      if (ambientSoundRef.current) {
        try {
          ambientSoundRef.current.stopAsync().then(() => {
            ambientSoundRef.current?.unloadAsync();
          });
        } catch (error) {
          console.log('Error cleaning up audio:', error);
        }
      }
    };
  }, []);

  const toggleAmbientSound = async (type: keyof typeof AMBIENT_SOUNDS | null) => {
    try {
      // First cleanup any existing sound
      if (ambientSoundRef.current) {
        const status = await ambientSoundRef.current.getStatusAsync();
        if (status.isLoaded) {
          await ambientSoundRef.current.stopAsync();
          await ambientSoundRef.current.unloadAsync();
        }
        ambientSoundRef.current = null;
        setIsAudioPlaying(false);
      }

      // If clicking the same sound or no sound, just stop here
      if (!type || type === ambientSound) {
        setAmbientSound(null);
        return;
      }

      // Load and play new sound
      if (isSoundEnabled) {
        const { sound } = await Audio.Sound.createAsync(
          AMBIENT_SOUNDS[type].source,
          { 
            isLooping: true,  // This ensures the sound loops
            volume,
            shouldPlay: true,
          },
          (status) => {
            // This callback ensures the sound keeps playing
            if (status.isLoaded && !status.isPlaying && isAudioPlaying) {
              sound.playAsync();
            }
          }
        );

        ambientSoundRef.current = sound;
        setAmbientSound(type);
        setIsAudioPlaying(true);
      }
    } catch (error) {
      console.error('Error with ambient sound:', error);
      setAmbientSound(null);
      setIsAudioPlaying(false);
    }
  };

  const toggleAudioPlayback = async () => {
    if (!ambientSoundRef.current || !ambientSound) return;
    
    try {
      const status = await ambientSoundRef.current.getStatusAsync();
      if (!status.isLoaded) {
        throw new Error('Sound not loaded');
      }

      if (status.isPlaying) {
        await ambientSoundRef.current.pauseAsync();
        setIsAudioPlaying(false);
      } else {
        await ambientSoundRef.current.playAsync();
        setIsAudioPlaying(true);
      }
    } catch (error) {
      console.log('Error toggling playback:', error);
      // Reset state on error
      setIsAudioPlaying(false);
    }
  };

  const handleVolumeChange = async (value: number) => {
    // Round to nearest 5%
    const roundedValue = Math.round(value * 20) / 20;
    // Ensure value is between 0 and 1
    const clampedValue = Math.max(0, Math.min(1, roundedValue));
    setVolume(clampedValue);
    if (ambientSoundRef.current) {
      try {
        await ambientSoundRef.current.setVolumeAsync(clampedValue);
      } catch (error) {
        console.log('Error setting volume:', error);
      }
    }
  };

  // Add volume button handler
  useEffect(() => {
    if (Device.osName === 'iOS') {
      Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
      });
    } else {
      Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    }
    
    // Remove the volume listener code since it's not supported
  }, []);

  const playCompletionSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/bell.mp3')
      );
      await sound.playAsync();
      // Cleanup after playing
      sound.setOnPlaybackStatusUpdate(status => {
        if ('isLoaded' in status && status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing completion sound:', error);
    }
  };

  const handleTimerComplete = () => {
    if (vibrationEnabled) {
      Vibration.vibrate([500, 500, 500]);
    }
    
    if (soundEnabled) {
      playCompletionSound();
    }

    if (isWorkTime) {
      setPomodoroCount(count => count + 1);
      const nextCount = pomodoroCount + 1;
      if (nextCount === 4) {
        setTimeLeft(longBreakDuration);
        setPomodoroCount(0);
      } else {
        setTimeLeft(shortBreakDuration);
      }
    } else {
      setTimeLeft(workTime);
    }
    setIsWorkTime(!isWorkTime);
    // Keep timer running
    setIsActive(true);
  };
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };  const resetTimer = () => {
    // First, stop any active timer
    setIsActive(false);
    
    // Reset all states at once
    setTimeLeft(workTime);
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
    if (newTime >= 0 && newTime <= workTime) {
      setTimeLeft(newTime);
    }
  };

  const renderVolumeSlider = () => {
    if (!Slider) {
      console.warn('Slider component not available');
      return null;
    }

    return (
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.volumeSlider}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={handleVolumeChange}
          minimumTrackTintColor={Colors[colorScheme].primary}
          maximumTrackTintColor={Colors[colorScheme].secondary + '40'}
          thumbTintColor={Colors[colorScheme].primary}
        />
      </View>
    );
  };

  const toggleMinimized = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsMinimized(!isMinimized);
  };

  // Add this effect to update timer when settings change
  useEffect(() => {
    if (!isActive) {
      // Only update time if timer is not running
      if (isWorkTime) {
        setTimeLeft(focusTime * 60);
      } else {
        setTimeLeft(pomodoroCount === 3 ? longBreakTime * 60 : shortBreakTime * 60);
      }
    }
  }, [focusTime, shortBreakTime, longBreakTime]);

  // Reset and play animations when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset animation values
      fadeAnims.timer.setValue(0);
      fadeAnims.progress.setValue(0);
      fadeAnims.controls.setValue(0);
      fadeAnims.audioPlayer.setValue(0);

      // Play animations
      Animated.stagger(150, [
        Animated.timing(fadeAnims.timer, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnims.progress, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnims.controls, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnims.audioPlayer, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[styles.timerRow, { opacity: fadeAnims.timer }]}>
        <TouchableOpacity 
          style={[styles.adjustButton, { backgroundColor: Colors[colorScheme].secondary }]}
          onPress={() => adjustTime(-2)}>
          <Text style={styles.adjustButtonText}>-</Text>
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <ThemedText type="subtitle" style={styles.timerStatus}>
            {isWorkTime ? 'Focus Time' : 'Break Time'}
          </ThemedText>
          <Text style={[
            styles.timer,
            { color: Colors[colorScheme].text }
          ]}>
            {formatTime(timeLeft)}
          </Text>
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${100 * (1 - timeLeft / (isWorkTime ? workTime : (pomodoroCount === 0 ? longBreakDuration : shortBreakDuration)))}%`, backgroundColor: Colors[colorScheme].accent }]} />
            </View>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.adjustButton, { backgroundColor: Colors[colorScheme].secondary }]}
          onPress={() => adjustTime(2)}>
          <Text style={styles.adjustButtonText}>+</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[
        styles.progressContainer,
        { opacity: fadeAnims.progress }
      ]}>
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
      </Animated.View>

      <Animated.View style={[
        styles.controlsRow,
        { 
          opacity: fadeAnims.controls,
          transform: [{
            translateY: fadeAnims.controls.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })
          }]
        }
      ]}>
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
      </Animated.View>

      <Animated.View style={[
        styles.bottomContainer,
        {
          opacity: fadeAnims.audioPlayer,
          transform: [{
            translateY: fadeAnims.audioPlayer.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            })
          }],
          height: isMinimized ? 60 : 140 // Static height based on state
        }
      ]}>
        <TouchableOpacity
          style={styles.musicSelector}
          onPress={() => isMinimized ? setIsMinimized(false) : setIsMenuVisible(true)}
          activeOpacity={0.8}>
          <View style={styles.musicInfo}>
            <Text style={[styles.iconText, { fontSize: 24 }]}>
              {ambientSound ? AMBIENT_SOUNDS[ambientSound].icon : '♫'}
            </Text>
            <Text style={styles.musicLabel, {color: '#fff', fontSize: 16}}>
              {ambientSound ? AMBIENT_SOUNDS[ambientSound].label : 'Choose Music'}
            </Text>
          </View>
          <View style={styles.musicControls}>
            <TouchableOpacity
              style={[styles.playButton, !ambientSound && { opacity: 0.5 }]}
              onPress={(e) => {
                e.stopPropagation();
                toggleAudioPlayback();
              }}
              disabled={!ambientSound}>
              <Text style={styles.playButtonText, { color: '#fff' }}>
                {isAudioPlaying ? '❙❙' : '▶'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggleMinimized}
              style={styles.dropdownButton}>
              <Text style={styles.dropdownText}>▼</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {!isMinimized && (
          <View style={styles.volumeContainer}>
            <View style={styles.volumeRow}>
              <VolumeIcon size={18} color="#fff" />
              {renderVolumeSlider()}
              <ThemedText style={[styles.iconText, { opacity: 0.7, fontSize: 14, color: '#fff'}]}>
                {Math.round(volume * 100)}%
              </ThemedText>
            </View>
          </View>
        )}

        <Modal
          visible={isMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsMenuVisible(false)}>
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1} 
            onPress={() => setIsMenuVisible(false)}>
            <View 
              style={[
                styles.soundMenu,
                { 
                  backgroundColor: '#2c1120',
                  borderWidth: 1,
                  borderColor: Colors[colorScheme].primary + '70',
                }
              ]}>
              <ThemedText style={styles.menuTitle}>Choose Your Ambience</ThemedText>
              <ThemedText style={styles.menuSubtitle}>Select a sound to enhance your focus</ThemedText>
              <View style={styles.menuDivider} />
              {Object.entries(AMBIENT_SOUNDS).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.menuItem,
                    {
                      backgroundColor: '#2c1120',
                      borderColor: Colors[colorScheme].primary + '70',
                      borderWidth: 1,
                    },
                    ambientSound === key && [
                      styles.selectedMenuItem,
                      { 
                        backgroundColor: '#421a31',
                        borderColor: Colors[colorScheme].primary,
                        borderWidth: 1.5,
                      }
                    ],
                  ]}
                  onPress={() => {
                    toggleAmbientSound(key as keyof typeof AMBIENT_SOUNDS);
                    setIsMenuVisible(false);
                  }}>
                  <ThemedText style={[styles.menuItemIcon, { fontSize: 28 }]}>{value.icon}</ThemedText>
                  <ThemedText style={[styles.menuItemLabel, { fontFamily: 'Montserrat_400Regular' }]}>{value.label}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </Animated.View>
    </ThemedView>
  );
}

// Styles moved to PomodoroTimer.styles.ts
