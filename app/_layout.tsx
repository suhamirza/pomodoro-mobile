import {
  Montserrat_100Thin,
  Montserrat_200ExtraLight,
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { ShareTech_400Regular } from '@expo-google-fonts/share-tech';
import { Sniglet_800ExtraBold } from '@expo-google-fonts/sniglet';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { SettingsProvider } from '@/contexts/SettingsContext';
import { useColorScheme } from '@/hooks/useColorScheme';



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    ShareTech_400Regular,
    Sniglet_800ExtraBold,
  });

  if (!loaded) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#251023' 
      }} />
    );
  }

  return (
    <SettingsProvider>
      <View style={{ flex: 1, backgroundColor: '#251023' }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#251023' }
          }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </View>
    </SettingsProvider>
  );
}
