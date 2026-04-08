import { useState, useEffect } from 'react'
import { Alert, Pressable, ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

import { FlagStripe } from '../components/ui/FlagStripe'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { StackHeader } from '../components/ui/StackHeader'
import { TextInputField } from '../components/ui/TextInputField'
import { useSession } from '../hooks/useSession'
import { supabase } from '../services/supabase'
import { colors } from '../theme'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SettingsAccountScreen() {
  const { session, loading: sessionLoading } = useSession()
  const [email, setEmail] = useState('')
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Sync email when session loads
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email)
    }
  }, [session])

  async function handleDeleteAccount() {
    Alert.alert(
      'Eliminar cuenta',
      'Esta accion es permanente y eliminara todos tus datos. Estar seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true)
            try {
              await supabase.auth.signOut()
              Alert.alert(
                'Solicitud registrada',
                'Cerramos tu sesion. Para eliminar la cuenta por completo durante la beta, escribe a soporte@salvar.app.'
              )
              router.replace('/onboarding')
            } catch (error: any) {
              await supabase.auth.signOut()
              Alert.alert('Sesion cerrada', 'Para eliminar tu cuenta completamente, contacta a soporte@salvar.app')
              router.replace('/onboarding')
            } finally {
              setDeleting(false)
            }
          }
        }
      ]
    )
  }

  if (sessionLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator color={colors.primary} />
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <FlagStripe />
      <StackHeader title="Cuenta" />
      <ScrollView contentContainerClassName="p-6 gap-y-6">
        <Text className="text-sm text-text-secondary leading-relaxed">
          Gestiona tu informacion de acceso y seguridad.
        </Text>

        {/* Email Section */}
        <View className="bg-surface p-5 rounded-3xl border border-border shadow-sm">
          <Text className="text-xs font-bold text-text-secondary uppercase mb-4 tracking-widest">
            Correo Electronico
          </Text>
          <TextInputField
            label="Direccion de correo"
            value={email}
            onChangeText={setEmail}
            placeholder="tu.correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PrimaryButton
            title="Actualizar correo"
            loading={loadingEmail}
            onPress={async () => {
              const nextEmail = email.trim().toLowerCase()
              if (!EMAIL_REGEX.test(nextEmail)) {
                Alert.alert('Correo invalido', 'Por favor ingresa un correo electronico valido.')
                return
              }
              try {
                setLoadingEmail(true)
                const { error } = await supabase.auth.updateUser({ email: nextEmail })
                if (error) throw error
                Alert.alert('Confirmacion enviada', 'Revisa tu bandeja de entrada para confirmar el cambio.')
              } catch (error: any) {
                Alert.alert('Error', error.message || 'No se pudo actualizar el correo.')
              } finally {
                setLoadingEmail(false)
              }
            }}
            className="mt-2"
          />
        </View>

        <View className="bg-surface p-5 rounded-3xl border border-border shadow-sm">
          <Text className="text-xs font-bold text-text-secondary uppercase mb-4 tracking-widest">
            Estado de verificacion
          </Text>
          <View className="gap-y-3">
            <Text className="text-sm text-text-secondary leading-relaxed">
              {session?.user?.email_confirmed_at
                ? 'Tu correo esta verificado y tu cuenta puede reservar bolsas.'
                : 'Debes confirmar el enlace que te enviamos por correo antes de poder reservar.'}
            </Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View className="mt-4">
          <Pressable 
            onPress={handleDeleteAccount}
            disabled={deleting}
            className="bg-error/5 p-4 rounded-2xl border border-error/20 items-center"
          >
            <Text className="text-error font-bold text-sm">
              {deleting ? 'Eliminando...' : 'Eliminar mi cuenta'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
