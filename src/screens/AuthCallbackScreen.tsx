import { router } from 'expo-router'
import * as Linking from 'expo-linking'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { getAuthCallbackParams } from '../services/auth'
import { supabase } from '../services/supabase'
import { colors, typography } from '../theme'

export function AuthCallbackScreen() {
  const incomingUrl = Linking.useURL()
  const [message, setMessage] = useState('Confirmando tu cuenta...')

  useEffect(() => {
    let mounted = true

    async function handleCallback() {
      try {
        const { accessToken, code, refreshToken, tokenHash, type } =
          getAuthCallbackParams(incomingUrl)

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        } else if (tokenHash && type) {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type
          })
          if (error) throw error
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
          if (error) throw error
        } else {
          throw new Error('El enlace de verificación es inválido o expiró.')
        }

        if (!mounted) return

        setMessage('Cuenta confirmada. Entrando a Salvar...')
        router.replace('/inicio')
      } catch (error) {
        if (!mounted) return

        setMessage(error instanceof Error ? error.message : 'No pudimos confirmar tu cuenta.')
        setTimeout(() => {
          router.replace('/login')
        }, 1500)
      }
    }

    handleCallback()

    return () => {
      mounted = false
    }
  }, [incomingUrl])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text allowFontScaling style={styles.title}>
          Validando acceso
        </Text>
        <Text allowFontScaling style={styles.copy}>
          {message}
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 14
  },
  title: {
    ...typography.heading2
  },
  copy: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center'
  }
})
