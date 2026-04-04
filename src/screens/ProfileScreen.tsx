import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { useSession } from '../hooks/useSession'
import { colors, typography } from '../theme'

export function ProfileScreen() {
  const { session } = useSession()
  const userName = session?.user?.user_metadata?.name ?? 'Mi cuenta'
  const email = session?.user?.email ?? 'sin-correo@salvar.app'

  return (
    <SafeAreaView style={styles.safe}>
      <FlagStripe />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.avatar}>
              <Text allowFontScaling style={styles.avatarLetter}>
                {userName.slice(0, 1).toUpperCase()}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/configuracion' as any)}
              style={styles.iconBtn}
              hitSlop={8}
            >
              <Ionicons name="settings-outline" size={22} color={colors.text} />
            </Pressable>
          </View>
          <Text allowFontScaling style={styles.name}>
            {userName}
          </Text>
          <Text allowFontScaling style={styles.email}>
            {email}
          </Text>
        </View>

        <View style={styles.links}>
          <Pressable style={styles.linkRow} onPress={() => router.push('/mis-reservas')}>
            <Text allowFontScaling style={styles.linkLabel}>
              Mis reservas
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.linkRow} onPress={() => router.push('/carrito')}>
            <Text allowFontScaling style={styles.linkLabel}>
              Mi carrito
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
          <Pressable style={styles.linkRow} onPress={() => router.push('/ubicacion')}>
            <Text allowFontScaling style={styles.linkLabel}>
              Ubicación para entregas
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.about}>
          <Text allowFontScaling style={styles.aboutTitle}>
            Sobre Salvar
          </Text>
          <Text allowFontScaling style={styles.aboutTag}>
            Alimentar personas. Preservar valor. Reducir desperdicio.
          </Text>
          <Text allowFontScaling style={styles.aboutBody}>
            Salvar conecta excedentes alimentarios de calidad con quienes los necesitan, reduciendo desperdicio y
            apoyando a la comunidad ecuatoriana.
          </Text>
        </View>
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
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.ecuadorBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarLetter: {
    ...typography.heading2,
    color: '#FFFFFF',
    fontSize: 22
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    ...typography.heading2,
    color: colors.text
  },
  email: {
    ...typography.body,
    marginTop: 6
  },
  links: {
    gap: 10
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  linkLabel: {
    ...typography.title,
    fontWeight: '600',
    color: colors.text
  },
  about: {
    backgroundColor: colors.muted,
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10
  },
  aboutTitle: {
    ...typography.title,
    fontWeight: '700',
    color: colors.text
  },
  aboutTag: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
    fontStyle: 'italic'
  },
  aboutBody: {
    ...typography.caption,
    lineHeight: 20
  }
})
