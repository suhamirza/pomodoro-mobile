import { PomodoroTimer } from '@/components/PomodoroTimer';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Pomodoro',
          headerStyle: {
            backgroundColor: Colors[colorScheme].background,
          },
          headerTintColor: Colors[colorScheme].primary,
        }} 
      />
      <PomodoroTimer />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
