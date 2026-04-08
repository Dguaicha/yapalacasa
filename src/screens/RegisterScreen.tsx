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

export function RegisterScreen() {
  const { session } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  useEffect(() => {
    if (session) {
      router.replace('/inicio')
    }
  }, [session])

  async function handleRegister() {
    const normalizedEmail = email.trim().toLowerCase()
    const nextErrors: Record<string, string | null> = {
      name: null,
      email: null
    }

    if (!name.trim()) nextErrors.name = 'Ingresa tu nombre.'
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      nextErrors.email = 'Ingresa un correo valido.'
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    setLoading(true)

    const { error } = await sendEmailOtp(normalizedEmail, {
      shouldCreateUser: true,
      name: name.trim(),
      email: normalizedEmail
    })

    setLoading(false)

    if (error) {
      Alert.alert('No se pudo crear la cuenta', error.message)
      return
    }

    Alert.alert(
      'Verifica tu correo',
      'Te enviamos un enlace para confirmar tu cuenta. Debes abrirlo antes de reservar.'
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Crear cuenta" onNavigate={() => router.replace('/onboarding')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.subtitle}>
          Crea tu cuenta con correo verificado para poder reservar bolsas sorpresa.
        </Text>

        <View style={styles.card}>
          <TextInputField
            error={errors.name}
            label="Nombre completo"
            onChangeText={setName}
            placeholder="Tu nombre"
            value={name}
            editable={!loading}
          />
          <TextInputField
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            keyboardType="email-address"
            label="Correo"
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            value={email}
            editable={!loading}
          />

          <PrimaryButton
            title={loading ? 'Enviando enlace...' : 'Crear cuenta y enviar enlace'}
            onPress={handleRegister}
            disabled={loading}
          />
        </View>

        <SecondaryButton title="Ya tengo cuenta" onPress={() => router.replace('/login')} />
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
