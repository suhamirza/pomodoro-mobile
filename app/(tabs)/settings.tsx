import { Settings } from '@/components/Settings';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerTitle: () => (
            <Text
              style={{
                fontSize: 24,
                fontWeight: '400',
                letterSpacing: 2,
                textTransform: 'lowercase',
                color: '#FFFFFF',
                fontFamily: 'Montserrat_600SemiBold',
                textShadowColor: Colors[colorScheme].primary,
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 6,
              }}>
              Settings
            </Text>
          ),
          headerStyle: {
            backgroundColor: Colors[colorScheme].background, 
            borderBottomWidth: 0.5,
            borderBottomColor: Colors[colorScheme].secondary + '80',
          },
          headerTintColor: Colors[colorScheme].primary,
        }} 
      />
      <Settings key="settings" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
