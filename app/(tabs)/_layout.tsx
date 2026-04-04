import { Ionicons } from '@expo/vector-icons'
import { Tabs, router } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { useSession } from '../../src/hooks/useSession'
import { colors } from '../../src/theme'

export default function TabsLayout() {
  const { session, loading } = useSession()

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/onboarding')
    }
  }, [loading, session])

  if (loading || !session) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    )
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.ecuadorRed,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 58,
          paddingTop: 6,
          paddingBottom: 6
        },
        tabBarIcon: ({ color, size }) => {
          const iconByRoute: Record<string, keyof typeof Ionicons.glyphMap> = {
            inicio: 'home',
            explorar: 'restaurant',
            mapa: 'map',
            perfil: 'person'
          }

          return <Ionicons color={color} name={iconByRoute[route.name]} size={size} />
        }
      })}
    >
      <Tabs.Screen name="inicio" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="explorar" options={{ title: 'Explorar' }} />
      <Tabs.Screen name="mapa" options={{ title: 'Mapa' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  }
})
