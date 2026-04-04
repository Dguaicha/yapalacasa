import React from 'react'
import { View, ViewProps } from 'react-native'
import Svg, { Path, Circle, Ellipse } from 'react-native-svg'

import { colors } from '../../theme'

type SvgArtProps = {
  size?: number
  color?: string
}

interface BowlArtProps extends ViewProps {
  size?: number
  color?: string
}

export const EncebolladoArt = ({ size = 100, color = colors.primary, ...props }: BowlArtProps) => (
  <View {...props}>
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M10 50 Q50 90 90 50 L80 40 Q50 30 20 40 Z" fill={color} opacity="0.8" />
      <Circle cx="50" cy="45" r="15" fill={color} opacity="0.6" />
      <Path d="M35 35 Q50 20 65 35" stroke={color} strokeWidth="2" fill="none" />
    </Svg>
  </View>
)

export const CevicheArt = ({ size = 100, color = colors.secondary }: SvgArtProps) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path d="M20 60 Q50 95 80 60" fill={color} opacity="0.7" />
    <Circle cx="40" cy="40" r="8" fill={colors.ecuadorRed} />
    <Circle cx="60" cy="45" r="8" fill={colors.ecuadorRed} />
    <Path d="M15 50 Q50 65 85 50" stroke={color} strokeWidth="3" fill="none" />
  </Svg>
)

export const BolonArt = ({ size = 100, color = colors.ecuadorYellow }: SvgArtProps) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="35" fill={color} />
    <Path d="M30 40 Q50 60 70 40" stroke="rgba(0,0,0,0.1)" strokeWidth="4" fill="none" />
    <Path d="M40 30 Q50 20 60 30" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" />
  </Svg>
)

export const CuyArt = ({ size = 100, color = colors.ecuadorRed }: SvgArtProps) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Ellipse cx="50" cy="60" rx="40" ry="20" fill={color} opacity="0.8" />
    <Circle cx="80" cy="45" r="10" fill={color} />
    <Path d="M20 60 L10 70 M30 75 L25 85" stroke={color} strokeWidth="4" />
  </Svg>
)

export const ConchasArt = ({ size = 100, color = colors.primary }: SvgArtProps) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path d="M50 80 Q10 70 15 30 Q50 10 85 30 Q90 70 50 80" fill={color} opacity="0.6" />
    <Path d="M50 80 L50 20 M35 75 L45 25 M65 75 L55 25" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
  </Svg>
)
