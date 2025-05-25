import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FF69B4',
    fontFamily: 'Montserrat_400Regular',
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FF69B4',
    fontFamily: 'Montserrat_600SemiBold',
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    color: '#FF1493',
    fontFamily: 'Montserrat_700Bold',
  },
  subtitle: {
    fontSize: 20,
    color: '#FF69B4',
    fontFamily: 'Montserrat_500Medium',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#FF69B4',
  },
});
