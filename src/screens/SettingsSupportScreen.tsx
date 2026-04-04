import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { colors, typography } from '../theme'

const supportItems = [
  {
    title: 'Centro de ayuda',
    detail: 'Problemas con recogida, cancelaciones o reembolsos.',
    icon: 'help-circle-outline' as const,
    action: async () => {
      await Linking.openURL('https://salvar-help.example.com')
    }
  },
  {
    title: 'Contactar soporte',
    detail: 'Canal directo para incidencias de la app.',
    icon: 'mail-outline' as const,
    action: async () => {
      await Linking.openURL('mailto:soporte@salvar.app')
    }
  },
  {
    title: 'Llamar por teléfono',
    detail: 'Habla directamente con nuestro equipo.',
    icon: 'call-outline' as const,
    action: async () => {
      await Linking.openURL('tel:+1234567890')
    }
  },
  {
    title: 'Preguntas frecuentes',
    detail: 'Respuestas rapidas sobre reservas y pagos.',
    icon: 'chatbubbles-outline' as const,
    action: async () => {
      await Linking.openURL('https://salvar-help.example.com/faq')
    }
  }
] as const

export function SettingsSupportScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Atención al cliente" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.subtitle}>
          Estamos aquí para ayudarte. Elige el modo de contacto que prefieras.
        </Text>

        <View style={styles.list}>
          {supportItems.map((item, index) => (
            <Pressable
              key={item.title}
              style={[
                styles.listItem,
                index < supportItems.length - 1 ? styles.listItemBorder : null
              ]}
              onPress={item.action}
            >
              <Ionicons name={item.icon} size={24} color={colors.primary} style={styles.icon} />
              <View style={styles.copy}>
                <Text allowFontScaling style={styles.itemTitle}>
                  {item.title}
                </Text>
                <Text allowFontScaling style={styles.itemDetail}>
                  {item.detail}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textSecondary}
                style={styles.chevron}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.contactCard}>
          <Text allowFontScaling style={styles.contactTitle}>
            Informacion de contacto
          </Text>
          <View style={styles.contactInfo}>
            <Text allowFontScaling style={styles.contactLabel}>
              Email:
            </Text>
            <Text allowFontScaling style={styles.contactValue}>
              soporte@salvar.app
            </Text>
          </View>
          <View style={styles.contactInfo}>
            <Text allowFontScaling style={styles.contactLabel}>
              Telefono:
            </Text>
            <Text allowFontScaling style={styles.contactValue}>
              +1 (234) 567-890
            </Text>
          </View>
          <View style={styles.contactInfo}>
            <Text allowFontScaling style={styles.contactLabel}>
              Horario:
            </Text>
            <Text allowFontScaling style={styles.contactValue}>
              Lunes - Viernes: 9:00 AM - 6:00 PM
            </Text>
          </View>
        </View>

        <Pressable
          onPress={async () => {
            await Linking.openURL('https://salvar-help.example.com')
          }}
          style={styles.webLinkButton}
        >
          <Ionicons name="globe-outline" size={20} color="#FFFFFF" />
          <Text allowFontScaling style={styles.webLinkText}>
            Visita nuestro portal web
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 16 },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: 8 },
  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden'
  },
  listItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  icon: {
    flexShrink: 0
  },
  copy: {
    flex: 1,
    gap: 3
  },
  itemTitle: {
    ...typography.body,
    fontWeight: '700'
  },
  itemDetail: {
    ...typography.caption,
    color: colors.textSecondary
  },
  chevron: {
    flexShrink: 0
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  contactTitle: {
    ...typography.body,
    fontWeight: '700',
    marginBottom: 4
  },
  contactInfo: {
    gap: 4
  },
  contactLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text
  },
  contactValue: {
    ...typography.body,
    color: colors.primary
  },
  webLinkButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 16
  },
  webLinkText: {
    ...typography.body,
    fontWeight: '600',
    color: '#FFFFFF'
  }
})
