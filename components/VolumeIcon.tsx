import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface VolumeIconProps {
  size?: number;
  color?: string;
}

export function VolumeIcon({ size = 20, color = '#fff' }: VolumeIconProps) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="white">
        <Path
          d="M12 5L8 8H4v8h4l4 3V5z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M17 8a6 6 0 0 1 0 8M15 11a2 2 0 0 1 0 2"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}
