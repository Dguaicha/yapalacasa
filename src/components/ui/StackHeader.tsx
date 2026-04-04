import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'

import { colors, typography } from '../../theme'

type Props = {
  title: string
  variant?: 'back' | 'close'
  onNavigate?: () => void
  right?: ReactNode
}

export function StackHeader({ title, variant = 'back', onNavigate, right }: Props) {
  const handlePress = () => {
    if (onNavigate) {
      onNavigate()
      return
    }
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/inicio')
    }
  }

  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={variant === 'close' ? 'Cerrar' : 'Volver'}
        onPress={handlePress}
        hitSlop={12}
        style={{ padding: 4, marginLeft: -4 }}
      >
        <Ionicons
          name={variant === 'close' ? 'close' : 'arrow-back'}
          size={24}
          color={colors.text}
        />
      </Pressable>
      <Text allowFontScaling numberOfLines={1} style={[typography.navTitle, { marginLeft: 12, flex: 1 }]}>
        {title}
      </Text>
      {right}
    </View>
  )
}
