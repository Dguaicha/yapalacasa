import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { useSession } from '../hooks/useSession'
import { supabase } from '../services/supabase'
import { colors, typography } from '../theme'

const settingsItems = [
  {
    title: 'Detalles de la cuenta',
    detail: 'Correo, contraseña, privacidad y eliminar cuenta.',
    route: '/configuracion/cuenta'
  },
  {
    title: 'Notificaciones',
    detail: 'Avisos, anuncios y recordatorios de recogida.',
    route: '/configuracion/notificaciones'
  },
  {
    title: 'Atención al cliente',
    detail: 'Ayuda, soporte y preguntas frecuentes.',
    route: '/configuracion/soporte'
  },
  {
    title: 'Registrar mi negocio',
    detail: 'Publica tu negocio de comida desde un solo lugar.',
    route: '/configuracion/negocio'
  }
] as const

export function SettingsScreen() {
  const { session } = useSession()
  const userName = session?.user?.user_metadata?.name ?? 'Mi cuenta'
  const email = session?.user?.email ?? 'sin-correo@salvar.app'

  return (
    <SafeAreaView style={styles.safe}>
      <FlagStripe />
      <StackHeader title="Configuración" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.profileCard}>
          <Text allowFontScaling style={styles.profileName}>
            {userName}
          </Text>
          <Text allowFontScaling style={styles.profileEmail}>
            {email}
          </Text>
        </View>

        <View style={styles.listCard}>
          {settingsItems.map((item, index) => (
            <Pressable
              key={item.title}
              onPress={() => router.push(item.route as any)}
              style={[styles.listRow, index < settingsItems.length - 1 && styles.listBorder]}
            >
              <View style={styles.listCopy}>
                <Text allowFontScaling style={styles.listTitle}>
                  {item.title}
                </Text>
                <Text allowFontScaling style={styles.listDetail}>
                  {item.detail}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.signOut}
          onPress={async () => {
            await supabase.auth.signOut()
            router.replace('/onboarding')
          }}
        >
          <Text allowFontScaling style={styles.signOutText}>
            Cerrar sesión
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface
  },
  scroll: {
    padding: 24,
    gap: 24
  },
  profileCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border
  },
  profileName: {
    ...typography.heading2,
    color: colors.text
  },
  profileEmail: {
    ...typography.body,
    marginTop: 6
  },
  listCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surface
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    gap: 16
  },
  listBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  listCopy: {
    flex: 1,
    minWidth: 0,
    gap: 4
  },
  listTitle: {
    ...typography.title,
    fontWeight: '600',
    color: colors.text
  },
  listDetail: {
    ...typography.caption,
    lineHeight: 19
  },
  signOut: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signOutText: {
    ...typography.button,
    color: '#FFFFFF'
  }
})
