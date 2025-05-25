import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from './ThemedText';

export function Splash() {
  const colorScheme = useColorScheme();
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const descAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequential animations
    Animated.sequence([
      // Logo animation
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Title animation
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Description animation
      Animated.timing(descAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Button animation
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    // Exit animations
    Animated.parallel([
      Animated.timing(logoAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(descAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/(tabs)');
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoAnim,
              transform: [
                { scale: logoAnim },
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: titleAnim,
              transform: [
                {
                  translateY: titleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}>
          <ThemedText style={styles.title}>pomello</ThemedText>
          <ThemedText style={styles.description}>
            Your personal productivity companion. Use the Pomodoro Technique to break your work into focused intervals, followed by refreshing breaks.
          </ThemedText>
        </Animated.View>

        <Animated.View
          style={{
            opacity: buttonAnim,
            transform: [
              {
                scale: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme].primary + '90' }]}
            onPress={handleStart}>
            <ThemedText style={styles.buttonText}>Start Focusing!</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#251023',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 240,
    marginBottom: 16,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Montserrat_700Bold',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 8,
    paddingBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Montserrat_400Regular',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#fff',
  },
});
