import { Pressable, Text } from 'react-native'

import { colors, typography } from '../../theme'

type Props = {
  title: string
  onPress: () => void
  className?: string
  accessibilityLabel?: string
}

export function SecondaryButton({ title, onPress, className = '', accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      onPress={onPress}
      className={`min-h-[48px] rounded-xl border border-primary bg-surface items-center justify-center px-6 active:bg-muted ${className}`}
    >
      <Text allowFontScaling style={[typography.button, { color: colors.primary }]}>
        {title}
      </Text>
    </Pressable>
  )
}
