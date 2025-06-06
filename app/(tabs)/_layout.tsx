import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          marginBottom: 10,
        },
        tabBarActiveTintColor: Colors[colorScheme].primary,
        tabBarInactiveTintColor: Colors[colorScheme].secondary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'pomodoro',
          headerStyle: {
            backgroundColor: Colors[colorScheme].background,
            minHeight: 120,
          },
          headerBackground: () => (
            <View style={{
              flex: 1,
              minHeight: 80,
              backgroundColor: Colors[colorScheme].background,
              borderBottomWidth: 0.5,
              borderBottomColor: Colors[colorScheme].secondary + '80',
              shadowColor: Colors[colorScheme].primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 15,
            }} />
          ),
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '400',
            letterSpacing: 2,
            textTransform: 'lowercase',
            color: '#FFFFFF',
            fontFamily: 'Montserrat_600SemiBold',
            textShadowColor: Colors[colorScheme].primary,
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 6,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'settings',
          headerStyle: {
            backgroundColor: Colors[colorScheme].background,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '400',
            letterSpacing: 2,
            textTransform: 'lowercase',
            color: '#FFFFFF',
            fontFamily: 'Montserrat_400Regular',
            textShadowColor: Colors[colorScheme].primary,
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 6,
          },
          headerTitleAlign: 'center',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size ?? 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
