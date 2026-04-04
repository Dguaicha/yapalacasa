import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { RestaurantCard } from '../components/ui/RestaurantCard'
import { useMarketplace } from '../hooks/useMarketplace'
import { colors, typography } from '../theme'

export function MapScreen() {
  const { restaurants } = useMarketplace()

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text allowFontScaling style={styles.title}>
            Mapa
          </Text>
          <Text allowFontScaling style={styles.copy}>
            En web mostramos los mismos negocios cercanos en formato lista.
          </Text>
        </View>

        {restaurants.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text allowFontScaling style={styles.emptyTitle}>
              No hay negocios para mostrar.
            </Text>
            <Text allowFontScaling style={styles.emptyCopy}>
              Cuando haya restaurantes activos apareceran aqui.
            </Text>
          </View>
        ) : (
          restaurants.map((restaurant) => (
            <View key={restaurant.id} style={styles.cardWrap}>
              <RestaurantCard
                restaurant={restaurant}
                onPress={() => router.push(`/restaurante/${restaurant.id}`)}
              />
              <Pressable
                onPress={() => router.push(`/restaurante/${restaurant.id}`)}
                style={styles.mapLink}
              >
                <Text allowFontScaling style={styles.mapLinkText}>
                  Abrir negocio
                </Text>
              </Pressable>
            </View>
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
  cardWrap: {
    gap: 8
  },
  mapLink: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border
  },
  mapLinkText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700'
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
