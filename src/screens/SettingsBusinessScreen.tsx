import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { colors, typography } from '../theme'

export function SettingsBusinessScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Tu negocio" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text allowFontScaling style={styles.body}>
            Desde aqui puedes crear o gestionar tu negocio de comida para publicar bolsas sorpresa dentro de Salvar.
          </Text>
        </View>

        <Pressable onPress={() => router.push('/negocio')} style={styles.primaryAction}>
          <Text allowFontScaling style={styles.primaryText}>
            Ir al panel de negocio
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push('/negocio/editar')} style={styles.secondaryAction}>
          <Text allowFontScaling style={styles.secondaryText}>
            Editar datos del negocio
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  body: {
    ...typography.body,
    color: colors.text
  },
  primaryAction: {
    minHeight: 46,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  primaryText: {
    ...typography.button,
    color: '#FFFFFF'
  },
  secondaryAction: {
    minHeight: 46,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'
  },
  secondaryText: {
    ...typography.button,
    color: colors.text
  }
})
