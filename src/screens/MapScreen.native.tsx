import { useEffect, useMemo, useState } from 'react'
import { router } from 'expo-router'
import MapView, { Marker } from 'react-native-maps'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RestaurantCard } from '../components/ui/RestaurantCard'
import { useUserLocation } from '../context/LocationContext'
import { useMarketplace } from '../hooks/useMarketplace'
import { colors, typography } from '../theme'

export function MapScreen() {
  const { restaurants } = useMarketplace()
  const { anchor } = useUserLocation()
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(restaurants[0]?.id ?? null)

  useEffect(() => {
    if (!selectedRestaurantId && restaurants[0]) {
      setSelectedRestaurantId(restaurants[0].id)
    }
  }, [restaurants, selectedRestaurantId])

  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedRestaurantId) ?? restaurants[0],
    [restaurants, selectedRestaurantId]
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text allowFontScaling style={styles.title}>
            Mapa
          </Text>
          <Text allowFontScaling style={styles.copy}>
            Toca un punto para ver el negocio y abrir su ficha.
          </Text>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude:
              selectedRestaurant?.latitude ?? anchor?.latitude ?? -0.2299,
            longitude:
              selectedRestaurant?.longitude ?? anchor?.longitude ?? -78.5249,
            latitudeDelta: 0.35,
            longitudeDelta: 0.35
          }}
        >
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude
              }}
              description={restaurant.address}
              onPress={() => setSelectedRestaurantId(restaurant.id)}
              onCalloutPress={() => router.push(`/restaurante/${restaurant.id}`)}
              pinColor={restaurant.id === selectedRestaurant?.id ? colors.ecuadorRed : '#6C7A89'}
              title={restaurant.name}
            />
          ))}
        </MapView>

        {selectedRestaurant ? (
          <View style={styles.panel}>
            <RestaurantCard
              restaurant={selectedRestaurant}
              onPress={() => router.push(`/restaurante/${selectedRestaurant.id}`)}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickList}
            >
              {restaurants.map((restaurant) => {
                const isSelected = restaurant.id === selectedRestaurant.id

                return (
                  <Pressable
                    key={restaurant.id}
                    onPress={() => setSelectedRestaurantId(restaurant.id)}
                    style={[styles.quickChip, isSelected ? styles.quickChipActive : null]}
                  >
                    <Text allowFontScaling style={[styles.quickChipText, isSelected ? styles.quickChipTextActive : null]}>
                      {restaurant.name}
                    </Text>
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.emptyPanel}>
            <Text allowFontScaling style={styles.emptyTitle}>
              Todavia no hay puntos en el mapa.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    padding: 16,
    gap: 10
  },
  header: {
    gap: 2
  },
  title: {
    ...typography.heading2
  },
  copy: {
    ...typography.caption,
    color: colors.textSecondary
  },
  map: {
    height: 280,
    borderRadius: 20
  },
  panel: {
    flex: 1,
    gap: 10
  },
  quickList: {
    gap: 8,
    paddingRight: 8
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border
  },
  quickChipActive: {
    backgroundColor: colors.ecuadorRed,
    borderColor: colors.ecuadorRed
  },
  quickChipText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.text
  },
  quickChipTextActive: {
    color: '#FFFFFF'
  },
  emptyPanel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14
  },
  emptyTitle: {
    ...typography.body,
    fontWeight: '700'
  }
})
