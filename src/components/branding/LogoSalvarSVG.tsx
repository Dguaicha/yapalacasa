import * as React from 'react'
import Svg, { Circle, G, Path, Text as SvgText } from 'react-native-svg'

type Props = {
  size?: number
  withWordmark?: boolean
  color?: string
}

export function LogoSalvarSVG({ size = 68, withWordmark = false, color = '#D4845F' }: Props) {
  if (withWordmark) {
    return (
      <Svg width={size * 1.2} height={size * 1.2} viewBox="0 0 240 100" fill="none">
        {/* Main logo icon */}
        <G>
          {/* Leaf background circle */}
          <Circle cx="30" cy="50" r="25" fill="#F5EBE0" />

          {/* Leaf shape */}
          <Path
            d="M30 20 Q40 30 40 50 Q40 70 30 80 Q20 70 20 50 Q20 30 30 20"
            fill={color}
          />

          {/* Inner leaf detail */}
          <Path
            d="M30 28 Q33 35 33 50 Q33 65 30 72"
            stroke="#FFFFFF"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Hand gesture - helping element */}
          <Path
            d="M45 60 L55 50 L60 55 M55 50 L50 45"
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        <SvgText x="75" y="60" fontSize="28" fontWeight="700" fill={color}>
          Salvar
        </SvgText>
      </Svg>
    )
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* Leaf background circle */}
      <Circle cx="50" cy="50" r="40" fill="#F5EBE0" />

      {/* Leaf shape */}
      <Path
        d="M50 15 Q65 30 65 50 Q65 75 50 85 Q35 75 35 50 Q35 30 50 15"
        fill={color}
      />

      {/* Inner leaf detail */}
      <Path
        d="M50 28 Q55 40 55 50 Q55 65 50 78"
        stroke="#FFFFFF"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Hand gesture - helping element */}
      <Path
        d="M70 65 L82 52 L90 60 M82 52 L72 42"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
