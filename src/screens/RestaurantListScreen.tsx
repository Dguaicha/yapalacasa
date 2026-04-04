import { router } from 'expo-router'
import { useMemo } from 'react'
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RestaurantCard } from '../components/ui/RestaurantCard'
import { useUserLocation } from '../context/LocationContext'
import { useMarketplace } from '../hooks/useMarketplace'
import { colors, typography } from '../theme'
import { calculateDistance } from '../utils/marketplace'

export function RestaurantListScreen() {
  const { restaurants, loading, refresh } = useMarketplace()
  const { anchor } = useUserLocation()

  const sortedRestaurants = useMemo(() => {
    if (!anchor) return restaurants
    return [...restaurants]
      .map((r) => ({
        ...r,
        distanceKm: calculateDistance(anchor.latitude, anchor.longitude, r.latitude, r.longitude)
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
  }, [restaurants, anchor])

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <View style={styles.header}>
          <Text allowFontScaling style={styles.title}>
            Explorar
          </Text>
          <Text allowFontScaling style={styles.copy}>
            Cerca de mí
          </Text>
        </View>

        {sortedRestaurants.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text allowFontScaling style={styles.emptyTitle}>
              No hay negocios visibles ahora mismo.
            </Text>
            <Text allowFontScaling style={styles.emptyCopy}>
              Cuando existan publicaciones activas aparecerán aquí.
            </Text>
          </View>
        ) : (
          sortedRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => router.push(`/restaurante/${restaurant.id}`)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 16,
    gap: 12
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
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyTitle: {
    ...typography.body,
    fontWeight: '700'
  },
  emptyCopy: {
    ...typography.caption,
    color: colors.textSecondary
  }
})
