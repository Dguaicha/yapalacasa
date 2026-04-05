import { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { colors, typography } from '../theme'

const NOTIFICATIONS_KEY = '@salvar:notifications:v1'

type NotificationSettings = {
  announcements: boolean
  pickupReminders: boolean
}

const defaultSettings: NotificationSettings = {
  announcements: true,
  pickupReminders: true
}

const announcementItems = [
  'Nueva recompensa disponible para tu proxima recogida.',
  'Nuevos negocios aliados pueden publicar bolsas para hoy y manana.',
  'Las notificaciones se enfocan en reservas, anuncios y cambios importantes.'
]

export function SettingsNotificationsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [pickupRemindersEnabled, setPickupRemindersEnabled] = useState(true)
  const [loading, setLoading] = useState(true)

  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as NotificationSettings
          setNotificationsEnabled(parsed.announcements)
          setPickupRemindersEnabled(parsed.pickupReminders)
        }
      } catch (error) {
        console.warn('Failed to load notification settings:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  // Save settings to storage
  const saveSettings = async (key: keyof NotificationSettings, value: boolean) => {
    const newSettings: NotificationSettings = {
      announcements: key === 'announcements' ? value : notificationsEnabled,
      pickupReminders: key === 'pickupReminders' ? value : pickupRemindersEnabled
    }
    
    if (key === 'announcements') setNotificationsEnabled(value)
    if (key === 'pickupReminders') setPickupRemindersEnabled(value)
    
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newSettings))
    } catch (error) {
      console.warn('Failed to save notification settings:', error)
    }
  }

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
            <Switch 
              value={notificationsEnabled} 
              onValueChange={(value) => saveSettings('announcements', value)} 
            />
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
            <Switch 
              value={pickupRemindersEnabled} 
              onValueChange={(value) => saveSettings('pickupReminders', value)} 
            />
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
