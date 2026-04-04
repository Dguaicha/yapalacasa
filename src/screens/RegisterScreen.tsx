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
import { getAuthRedirectUrl } from '../services/auth'
import { supabase } from '../services/supabase'
import { colors, typography } from '../theme'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function RegisterScreen() {
  const { session } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  useEffect(() => {
    if (session) {
      router.replace('/inicio')
    }
  }, [session])

  async function handleRegister() {
    const nextErrors: Record<string, string | null> = {
      name: null,
      email: null,
      password: null
    }

    if (!name.trim()) nextErrors.name = 'Ingresa tu nombre.'
    if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
      nextErrors.email = 'Ingresa un correo valido.'
    }
    if (password.trim().length < 6) {
      nextErrors.password = 'La contrasena debe tener al menos 6 caracteres.'
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
      options: {
        data: {
          name: name.trim()
        },
        emailRedirectTo: getAuthRedirectUrl()
      }
    })

    setLoading(false)

    if (error) {
      Alert.alert('No se pudo crear la cuenta', error.message)
      return
    }

    Alert.alert('Cuenta creada', 'Revisa tu correo para confirmar la cuenta.')
    router.replace('/login')
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Crear cuenta" onNavigate={() => router.replace('/onboarding')} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.subtitle}>
          Crea tu cuenta para reservar bolsas sorpresa.
        </Text>

        <View style={styles.card}>
          <TextInputField
            error={errors.name}
            label="Nombre completo"
            onChangeText={setName}
            placeholder="Tu nombre"
            value={name}
          />
          <TextInputField
            autoCapitalize="none"
            error={errors.email}
            keyboardType="email-address"
            label="Correo"
            onChangeText={setEmail}
            placeholder="tu@correo.com"
            value={email}
          />
          <TextInputField
            autoCapitalize="none"
            error={errors.password}
            label="Contrasena"
            onChangeText={setPassword}
            placeholder="Crea una contrasena"
            secureTextEntry
            value={password}
          />
          <PrimaryButton
            title={loading ? 'Creando cuenta...' : 'Crear cuenta'}
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
