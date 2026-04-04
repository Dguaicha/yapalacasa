import { Pressable, Text } from 'react-native'

import { typography } from '../../theme'

type Props = {
  title: string
  onPress: () => void
  disabled?: boolean
  className?: string
  accessibilityLabel?: string
  loading?: boolean
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  className = '',
  accessibilityLabel,
  loading = false
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      disabled={disabled || loading}
      onPress={onPress}
      className={`min-h-[48px] rounded-xl bg-primary items-center justify-center px-6 active:opacity-90 ${disabled || loading ? 'bg-primary/60' : ''} ${className}`}
    >
      <Text allowFontScaling style={[typography.button, { color: '#FFFFFF' }]}>
        {loading ? 'Procesando...' : title}
      </Text>
    </Pressable>
  )
}
