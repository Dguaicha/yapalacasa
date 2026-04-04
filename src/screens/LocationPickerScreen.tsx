import { router } from 'expo-router'
import { useState } from 'react'
import { Alert, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { StackHeader } from '../components/ui/StackHeader'
import { TextInputField } from '../components/ui/TextInputField'
import { useUserLocation } from '../context/LocationContext'
import { colors, typography } from '../theme'

export function LocationPickerScreen() {
  const { anchor, refreshFromGps, geocodeAddress } = useUserLocation()
  const [address, setAddress] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)

  async function onUseGps() {
    setGpsLoading(true)
    const result = await refreshFromGps()
    setGpsLoading(false)
    if (result.ok) {
      Alert.alert('Listo', 'Actualizamos tu zona de búsqueda.')
    } else if (result.message) {
      Alert.alert('Ubicación', result.message)
    }
  }

  async function onApplyAddress() {
    setGeoLoading(true)
    const result = await geocodeAddress(address)
    setGeoLoading(false)
    if (result.ok) {
      Alert.alert('Listo', 'Actualizamos tu zona de búsqueda.')
    } else if (result.message) {
      Alert.alert('Dirección', result.message)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlagStripe />
      <StackHeader title="Tu ubicación" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}>
        <Text allowFontScaling style={{ ...typography.body, color: colors.textSecondary }}>
          Por defecto usamos tu posición para mostrar lo más cercano primero. Si quieres pedir para otra
          persona o zona, indica una dirección en Ecuador.
        </Text>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: colors.border,
            gap: 6
          }}
        >
          <Text allowFontScaling style={{ ...typography.caption, color: colors.textSecondary, fontWeight: '700' }}>
            Ubicación activa
          </Text>
          <Text allowFontScaling style={{ ...typography.body, fontWeight: '600', color: colors.text }}>
            {anchor?.label ?? 'Aún sin ubicación'}
          </Text>
          {anchor ? (
            <Text allowFontScaling style={{ ...typography.caption, color: colors.textSecondary }}>
              {anchor.latitude.toFixed(4)}, {anchor.longitude.toFixed(4)}
            </Text>
          ) : null}
        </View>

        <PrimaryButton title="Usar mi ubicación actual" onPress={onUseGps} loading={gpsLoading} />

        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 4 }} />

        <Text allowFontScaling style={[typography.overline, { textTransform: 'none', letterSpacing: 0 }]}>
          Otra dirección en Ecuador
        </Text>
        <TextInputField
          label="Dirección, barrio o ciudad"
          placeholder="Ej: La Mariscal, Quito"
          value={address}
          onChangeText={setAddress}
        />
        <PrimaryButton title="Usar esta dirección" onPress={onApplyAddress} loading={geoLoading} />
        <SecondaryButton title="Cancelar" onPress={() => router.back()} />
      </ScrollView>
    </SafeAreaView>
  )
}
