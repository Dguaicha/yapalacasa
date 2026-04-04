import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, Text, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'

import { FlagStripe } from '../components/ui/FlagStripe'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { TextInputField } from '../components/ui/TextInputField'
import { useBusiness } from '../hooks/useBusiness'
import { saveMyRestaurant, uploadRestaurantCover } from '../services/business'
import type { RegionKey } from '../types/marketplace'

const regionOptions: RegionKey[] = ['Costa', 'Sierra', 'Oriente', 'Galapagos']

export function RestaurantEditScreen() {
  const { restaurant, refresh } = useBusiness()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [pickupNotes, setPickupNotes] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [region, setRegion] = useState<RegionKey>('Sierra')
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!restaurant) return

    setName(restaurant.name)
    setDescription(restaurant.description)
    setCity(restaurant.city)
    setAddress(restaurant.address)
    setPickupNotes(restaurant.pickupNotes ?? '')
    setLatitude(String(restaurant.latitude))
    setLongitude(String(restaurant.longitude))
    setRegion(restaurant.region)
    setImageUri(restaurant.coverImageUrl ?? null)
  }, [restaurant])

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Debes permitir acceso a fotos para subir imágenes.')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      mediaTypes: ['images'],
      quality: 0.8
    })

    if (!result.canceled) {
      setImageUri(result.assets[0]?.uri ?? null)
    }
  }

  async function handleSave() {
    if (!name.trim() || !description.trim() || !city.trim() || !address.trim()) {
      Alert.alert('Faltan datos', 'Completa nombre, descripción, ciudad y dirección.')
      return
    }

    if (!Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
      Alert.alert('Ubicación inválida', 'Ingresa una latitud y longitud válidas.')
      return
    }

    try {
      setSaving(true)
      const savedRestaurant = await saveMyRestaurant({
        name,
        description,
        city,
        address,
        pickupNotes,
        latitude,
        longitude,
        region
      })

      if (imageUri && imageUri !== savedRestaurant.coverImageUrl && !imageUri.startsWith('http')) {
        await uploadRestaurantCover(imageUri)
      }

      await refresh()
      Alert.alert('Restaurante guardado', 'Tu perfil comercial ya está listo para mostrar ofertas.')
      router.back()
    } catch (error) {
      Alert.alert(
        'No se pudo guardar',
        error instanceof Error ? error.message : 'Error inesperado.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlagStripe />
      {/* Header with Close Button */}
      <View className="px-4 py-4 flex-row items-center justify-between border-b border-border">
        <Text className="text-xl font-bold text-text">Editar restaurante</Text>
        <Pressable onPress={() => router.back()} className="p-1">
          <Ionicons name="close" size={28} color="#1A1C1E" />
        </Pressable>
      </View>

      <ScrollView contentContainerClassName="p-6 gap-y-6">
        <View className="bg-surface p-5 rounded-3xl border border-border shadow-sm">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-44 rounded-2xl mb-4" />
          ) : (
            <View className="w-full h-44 rounded-2xl bg-muted items-center justify-center mb-4 border border-dashed border-border">
              <Text className="text-text-secondary font-bold text-xs uppercase">Portada del restaurante</Text>
            </View>
          )}

          <SecondaryButton title="Seleccionar portada" onPress={handlePickImage} className="mb-6" />

          <View className="gap-y-4">
            <TextInputField label="Nombre del restaurante" value={name} onChangeText={setName} />
            <TextInputField label="Descripción" value={description} onChangeText={setDescription} multiline numberOfLines={3} />
            <TextInputField label="Ciudad" value={city} onChangeText={setCity} />
            <TextInputField label="Dirección" value={address} onChangeText={setAddress} />
            <TextInputField label="Notas de recogida" value={pickupNotes} onChangeText={setPickupNotes} />
            <View className="flex-row gap-x-4">
              <View className="flex-1">
                <TextInputField label="Latitud" value={latitude} onChangeText={setLatitude} keyboardType="numeric" />
              </View>
              <View className="flex-1">
                <TextInputField label="Longitud" value={longitude} onChangeText={setLongitude} keyboardType="numeric" />
              </View>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-3 ml-1">Región</Text>
            <View className="flex-row flex-wrap gap-2">
              {regionOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setRegion(option)}
                  className={`px-4 py-2 rounded-xl border ${region === option ? 'bg-primary border-primary' : 'bg-white border-border'}`}
                >
                  <Text className={`text-xs font-bold ${region === option ? 'text-white' : 'text-text'}`}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <PrimaryButton
          title={saving ? 'Guardando...' : 'Guardar cambios'}
          onPress={handleSave}
          disabled={saving}
          loading={saving}
          className="shadow-sm"
        />
      </ScrollView>
    </SafeAreaView>
  )
}
