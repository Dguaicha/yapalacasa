import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { RefreshControl, Pressable, ScrollView, Text, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LogoSalvar } from '../components/branding/LogoSalvar'
import { RestaurantCard } from '../components/ui/RestaurantCard'
import { useUserLocation } from '../context/LocationContext'
import { useMarketplace } from '../hooks/useMarketplace'
import { foodCategoryData, filterRestaurants } from '../utils/marketplace'
import type { RestaurantCategory } from '../types/marketplace'
import { colors, typography } from '../theme'
import { EncebolladoArt, CuyArt, BolonArt, CevicheArt, ConchasArt } from '../components/ui/EcuadorianArt'

export function HomeScreen() {
  const { anchor, ready: locationReady } = useUserLocation()
  const { restaurants, loading, refresh, error } = useMarketplace()

  const params = useLocalSearchParams<{
    distance?: string
    category?: string
    pickupDay?: string
    open?: string
    minRating?: string
    priceTier?: string
  }>()

  const filters = useMemo(
    () => ({
      maxDistanceKm: Number(params.distance) || 99,
      category: (params.category || 'All') as RestaurantCategory | 'All',
      pickupDay: (params.pickupDay || 'all') as 'all' | 'today' | 'tomorrow',
      onlyOpen: params.open === '1',
      minRating: Number(params.minRating) || 0,
      priceTier: Number(params.priceTier) || 0
    }),
    [params]
  )

  const userCoords =
    anchor && locationReady
      ? { latitude: anchor.latitude, longitude: anchor.longitude }
      : undefined

  const filteredRestaurants = useMemo(
    () => filterRestaurants(restaurants, filters, userCoords),
    [restaurants, filters, userCoords]
  )

  const lowStockRestaurant = useMemo(
    () => restaurants.find((r) => r.offers.some((o) => o.quantityAvailable > 0 && o.quantityAvailable <= 3)),
    [restaurants]
  )

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row h-[3px]">
        <View className="flex-1 bg-ecuadorYellow" />
        <View className="flex-1 bg-ecuadorBlue" />
        <View className="flex-1 bg-ecuadorRed" />
      </View>

      <ScrollView
        contentContainerClassName="pb-10"
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <View className="absolute top-20 left-[-20] opacity-[0.03] rotate-12">
          <BolonArt size={200} color={colors.primary} />
        </View>
        <View className="absolute top-60 right-[-40] opacity-[0.03] -rotate-12">
          <CevicheArt size={250} color={colors.primary} />
        </View>
        <View className="absolute bottom-20 left-10 opacity-[0.03]">
          <ConchasArt size={180} color={colors.primary} />
        </View>

        <View className="px-4 py-3 flex-row justify-between items-center bg-white/80 gap-3">
          <Pressable
            onPress={() => router.push('/ubicacion')}
            className="flex-row items-center flex-1 min-w-0"
            style={{ flexShrink: 1 }}
          >
            <View className="min-w-0 flex-1">
              <Text
                className="text-text-secondary uppercase"
                style={{ fontSize: 11, lineHeight: 14, fontWeight: '600', letterSpacing: 0.4 }}
              >
                Entrega cerca de
              </Text>
              <View className="flex-row items-center min-w-0 mt-0.5">
                <Text
                  numberOfLines={1}
                  className="font-semibold text-text min-w-0"
                  style={{ fontSize: 15, lineHeight: 20, flexShrink: 1 }}
                >
                  {anchor?.label ?? 'Elegir ubicación'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} style={{ marginLeft: 2, flexShrink: 0 }} />
              </View>
            </View>
          </Pressable>
          <View style={{ flexShrink: 0 }}>
            <LogoSalvar size={32} />
          </View>
        </View>

        {lowStockRestaurant ? (
          <View className="bg-ecuadorRed/5 px-4 py-2.5 flex-row items-center">
            <Ionicons name="flash" size={14} color={colors.ecuadorRed} />
            <Text style={[typography.caption, { flex: 1, fontWeight: '700', color: colors.ecuadorRed }]}>
              ¡Rescata rápido! Solo quedan {lowStockRestaurant.offers[0].quantityAvailable} bolsas en{' '}
              {lowStockRestaurant.name}
            </Text>
          </View>
        ) : null}

        <View className="mt-6 px-4">
          <View className="flex-row items-center mb-3 ml-1">
            <View className="h-1 w-1 rounded-full bg-ecuadorYellow mr-1" />
            <View className="h-1 w-1 rounded-full bg-ecuadorBlue mr-1" />
            <View className="h-1 w-1 rounded-full bg-ecuadorRed mr-2" />
            <Text
              className="text-text-secondary uppercase"
              style={{ fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.6 }}
            >
              Categorías
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-x-5">
            {foodCategoryData.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => router.setParams({ category: cat.id })}
                className="items-center"
              >
                <View className="w-[72px] h-[72px] rounded-[24px] bg-muted overflow-hidden mb-1.5 shadow-sm border border-border">
                  <Image source={cat.image} className="w-full h-full" resizeMode="cover" />
                </View>
                <Text style={[typography.caption, { fontWeight: '600', color: colors.text }]}>{cat.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="px-4 mt-8">
          <View className="bg-text rounded-[32px] p-6 overflow-hidden flex-row items-center shadow-lg">
            <View className="flex-1 z-10">
              <Text style={[typography.heading2, { color: '#FFFFFF', fontSize: 24, lineHeight: 30, letterSpacing: -0.4 }]}>
                ¡Rescata sabor{'\n'}y ahorra hoy!
              </Text>
              <Text style={[typography.caption, { color: 'rgba(255,255,255,0.72)', marginTop: 8 }]}>
                Bolsas sorpresa desde $3.50
              </Text>
              <Pressable
                className="self-start px-5 py-2 rounded-full mt-5 bg-ecuadorRed"
                onPress={() => router.push('/explorar')}
              >
                <Text style={[typography.micro, { color: '#FFFFFF', fontWeight: '700', letterSpacing: 0.4 }]}>
                  Ver ofertas
                </Text>
              </Pressable>
            </View>
            <View className="absolute right-[-20] top-[-10] opacity-20 rotate-12">
              <EncebolladoArt size={140} color="#FFFFFF" />
            </View>
          </View>
        </View>

        <View className="px-4 mt-8 flex-row items-start gap-3">
          <View className="flex-1 min-w-0" style={{ flexShrink: 1 }}>
            <Text style={[typography.heading2, { letterSpacing: -0.35 }]}>Recomendados</Text>
            <Text numberOfLines={1} style={[typography.caption, { marginTop: 4, fontWeight: '500' }]}>
              Cerca de mí
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/filtros')}
            className="bg-muted rounded-full flex-row items-center border border-border"
            style={{
              flexShrink: 0,
              paddingHorizontal: 14,
              paddingVertical: 10,
              marginTop: 2
            }}
          >
            <Ionicons name="options-outline" size={16} color={colors.text} />
            <Text style={[typography.caption, { marginLeft: 6, fontWeight: '700', color: colors.text }]}>Filtros</Text>
          </Pressable>
        </View>

        <View className="px-4 mt-6">
          {error ? (
            <View className="bg-surface rounded-3xl p-6 border border-border items-center">
              <Text style={[typography.title, { fontWeight: '700' }]}>Error de conexión</Text>
              <Text style={[typography.caption, { marginTop: 6, textAlign: 'center' }]}>{error}</Text>
            </View>
          ) : filteredRestaurants.length === 0 ? (
            <View className="bg-white rounded-3xl p-10 items-center border border-border">
              <CuyArt size={80} color={colors.ecuadorRed} />
              <Text style={[typography.title, { fontWeight: '700', marginTop: 16 }]}>Sin resultados</Text>
              <Text style={[typography.caption, { textAlign: 'center', marginTop: 8, paddingHorizontal: 24 }]}>
                No encontramos negocios con estos filtros. Prueba ampliar la distancia o ajustar ubicación.
              </Text>
            </View>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() => router.push(`/restaurante/${restaurant.id}`)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
