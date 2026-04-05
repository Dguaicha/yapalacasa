import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { TextInputField } from '../components/ui/TextInputField'
import { useSession } from '../hooks/useSession'
import { supabase } from '../services/supabase'
import { getAuthRedirectUrl } from '../services/auth'
import { colors, typography } from '../theme'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginScreen() {
  const { session } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      router.replace('/inicio')
    }
  }, [session])

  async function handleLogin() {
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()

    setEmailError(null)
    setPasswordError(null)

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Ingresa un correo valido.')
      return
    }

    if (trimmedPassword.length < 6) {
      setPasswordError('La contrasena debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: trimmedPassword
    })

    setLoading(false)

    if (error) {
      Alert.alert('No se pudo iniciar sesion', error.message)
      return
    }

    router.replace('/inicio')
  }

  async function handleForgotPassword() {
    const trimmedEmail = email.trim().toLowerCase()

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setEmailError('Ingresa un correo valido para recuperar tu contrasena.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: getAuthRedirectUrl()
    })
    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
      return
    }

    Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada para restablecer tu contrasena.')
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Iniciar sesion" onNavigate={() => router.replace('/onboarding')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.subtitle}>
          Entra para reservar bolsas cerca de ti.
        </Text>

        <View style={styles.card}>
          <TextInputField
            autoCapitalize="none"
            error={emailError}
            keyboardType="email-address"
            label="Correo"
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            value={email}
          />
          <TextInputField
            autoCapitalize="none"
            error={passwordError}
            label="Contrasena"
            onChangeText={setPassword}
            placeholder="Tu contrasena"
            secureTextEntry
            value={password}
          />
          <Pressable onPress={handleForgotPassword}>
            <Text allowFontScaling style={styles.forgotText}>
              Olvide mi contrasena
            </Text>
          </Pressable>
          <PrimaryButton
            title={loading ? 'Ingresando...' : 'Iniciar sesion'}
            onPress={handleLogin}
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
  },
  forgotText: {
    ...typography.caption,
    color: colors.primary
  }
})
