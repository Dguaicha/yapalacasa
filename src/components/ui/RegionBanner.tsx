import Svg, { Circle, Path, Rect } from 'react-native-svg'
import { StyleSheet, Text, View } from 'react-native'

import type { RegionKey } from '../../types/marketplace'
import { colors, typography } from '../../theme'

type Props = {
  title: RegionKey
  dishes: string
}

function RegionIcon({ region }: { region: RegionKey }) {
  const fill =
    region === 'Costa'
      ? colors.costa
      : region === 'Sierra'
        ? colors.sierra
        : region === 'Oriente'
          ? colors.oriente
          : colors.galapagos

  if (region === 'Costa') {
    return (
      <Svg width={52} height={52} viewBox="0 0 52 52">
        <Circle cx="26" cy="26" r="20" fill={fill} opacity="0.25" />
        <Path d="M15 28C21 18 31 18 37 28" stroke={fill} strokeWidth="4" strokeLinecap="round" />
        <Path d="M18 33H34" stroke={fill} strokeWidth="4" strokeLinecap="round" />
      </Svg>
    )
  }

  if (region === 'Sierra') {
    return (
      <Svg width={52} height={52} viewBox="0 0 52 52">
        <Rect x="9" y="11" width="34" height="30" rx="15" fill={fill} opacity="0.25" />
        <Circle cx="19" cy="25" r="4" fill={fill} />
        <Circle cx="27" cy="23" r="4" fill={fill} />
        <Circle cx="34" cy="28" r="4" fill={fill} />
      </Svg>
    )
  }

  if (region === 'Oriente') {
    return (
      <Svg width={52} height={52} viewBox="0 0 52 52">
        <Path d="M13 32C20 14 34 14 39 32" fill={fill} opacity="0.25" />
        <Path d="M16 31H36" stroke={fill} strokeWidth="4" strokeLinecap="round" />
        <Path d="M22 18L30 18" stroke={fill} strokeWidth="4" strokeLinecap="round" />
      </Svg>
    )
  }

  return (
    <Svg width={52} height={52} viewBox="0 0 52 52">
      <Circle cx="26" cy="26" r="18" fill={fill} opacity="0.25" />
      <Path d="M15 30C20 21 32 21 37 30" stroke={fill} strokeWidth="4" strokeLinecap="round" />
      <Circle cx="26" cy="25" r="3" fill={fill} />
    </Svg>
  )
}

export function RegionBanner({ title, dishes }: Props) {
  const background =
    title === 'Costa'
      ? '#FFF0E6'
      : title === 'Sierra'
        ? '#FCF4D6'
        : title === 'Oriente'
          ? '#EEF7EA'
          : '#EAF6FD'

  return (
    <View style={[styles.card, { backgroundColor: background }]}>
      <RegionIcon region={title} />
      <View style={styles.copy}>
        <Text allowFontScaling style={styles.title}>
          {title}
        </Text>
        <Text allowFontScaling style={styles.dishes}>
          {dishes}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    borderRadius: 22,
    padding: 16,
    gap: 10
  },
  copy: {
    gap: 4
  },
  title: {
    ...typography.body,
    fontWeight: '700'
  },
  dishes: {
    ...typography.caption,
    color: colors.textSecondary
  }
})
