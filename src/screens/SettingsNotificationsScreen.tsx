import { useState } from 'react'
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { colors, typography } from '../theme'

const announcementItems = [
  'Nueva recompensa disponible para tu proxima recogida.',
  'Nuevos negocios aliados pueden publicar bolsas para hoy y manana.',
  'Las notificaciones se enfocan en reservas, anuncios y cambios importantes.'
]

export function SettingsNotificationsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [pickupRemindersEnabled, setPickupRemindersEnabled] = useState(true)

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Notificaciones" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.copy}>
              <Text allowFontScaling style={styles.rowTitle}>
                Anuncios
              </Text>
              <Text allowFontScaling style={styles.rowDetail}>
                Recompensas, novedades y avisos importantes.
              </Text>
            </View>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
          </View>
          <View style={styles.row}>
            <View style={styles.copy}>
              <Text allowFontScaling style={styles.rowTitle}>
                Recordatorios de recogida
              </Text>
              <Text allowFontScaling style={styles.rowDetail}>
                Aviso antes de pasar por tu bolsa.
              </Text>
            </View>
            <Switch value={pickupRemindersEnabled} onValueChange={setPickupRemindersEnabled} />
          </View>
        </View>

        {announcementItems.map((item) => (
          <View key={item} style={styles.noteCard}>
            <Text allowFontScaling style={styles.noteText}>
              {item}
            </Text>
          </View>
        ))}
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
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  copy: {
    flex: 1,
    gap: 3
  },
  rowTitle: {
    ...typography.body,
    fontWeight: '700'
  },
  rowDetail: {
    ...typography.caption,
    color: colors.textSecondary
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  noteText: {
    ...typography.caption,
    color: colors.text
  }
})
