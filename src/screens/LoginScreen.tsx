import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { TextInputField } from '../components/ui/TextInputField'
import { useSession } from '../hooks/useSession'
import { sendEmailOtp } from '../services/auth'
import { colors, typography } from '../theme'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginScreen() {
  const { session } = useSession()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      router.replace('/inicio')
    }
  }, [session])

  async function handleSendLink() {
    const normalizedEmail = email.trim().toLowerCase()

    setEmailError(null)

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setEmailError('Ingresa un correo valido.')
      return
    }

    setLoading(true)
    const { error } = await sendEmailOtp(normalizedEmail, { shouldCreateUser: false })
    setLoading(false)

    if (error) {
      Alert.alert('No se pudo enviar el enlace', error.message)
      return
    }

    Alert.alert(
      'Revisa tu correo',
      'Te enviamos un enlace seguro para iniciar sesion y confirmar tu acceso.'
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Iniciar sesion" onNavigate={() => router.replace('/onboarding')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.subtitle}>
          Entra con tu correo. Te enviaremos un enlace seguro de acceso.
        </Text>

        <View style={styles.card}>
          <TextInputField
            autoCapitalize="none"
            autoComplete="email"
            error={emailError}
            keyboardType="email-address"
            label="Correo"
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            value={email}
            editable={!loading}
          />

          <PrimaryButton
            title={loading ? 'Enviando enlace...' : 'Enviar enlace de acceso'}
            onPress={handleSendLink}
            disabled={loading}
          />
        </View>

        <SecondaryButton title="Crear cuenta" onPress={() => router.push('/register')} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 4
  },
  content: {
    padding: 16,
    gap: 12
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  }
})
