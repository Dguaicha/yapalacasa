import { Ionicons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'
import { RefreshControl, Pressable, ScrollView, Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Image } from 'expo-image'

import { LogoSalvar } from '../components/branding/LogoSalvar'
import { RestaurantCard } from '../components/ui/RestaurantCard'
import { useUserLocation } from '../context/LocationContext'
import { useMarketplace } from '../hooks/useMarketplace'
import { foodCategoryData, filterRestaurants } from '../utils/marketplace'
import type { RestaurantCategory } from '../types/marketplace'
import { colors, theme, typography } from '../theme'
import { EncebolladoArt, CuyArt } from '../components/ui/EcuadorianArt'

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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.flagStripe}>
        <View style={[styles.flagSegment, { backgroundColor: colors.ecuadorYellow }]} />
        <View style={[styles.flagSegment, { backgroundColor: colors.ecuadorBlue }]} />
        <View style={[styles.flagSegment, { backgroundColor: colors.ecuadorRed }]} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.push('/ubicacion')}
            style={styles.locationButton}
          >
            <Text allowFontScaling style={styles.locationLabel}>
              Recoge cerca de
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={15} color={colors.primary} />
              <Text numberOfLines={1} allowFontScaling style={styles.locationValue}>
                {anchor?.label ?? 'Elegir ubicacion'}
              </Text>
              <Ionicons name="chevron-forward" size={15} color={colors.primary} />
            </View>
          </Pressable>

          <View style={styles.logoWrap}>
            <LogoSalvar size={34} />
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text allowFontScaling style={styles.eyebrow}>
              Marketplace de comida rescatada
            </Text>
            <Text allowFontScaling style={styles.heroTitle}>
              Reserva bolsas sorpresa de calidad y paga al recoger
            </Text>
            <Text allowFontScaling style={styles.heroBody}>
              Seleccionamos ofertas cercanas con mejor ahorro, retiro claro y stock visible.
            </Text>

            <View style={styles.heroMetaRow}>
              <View style={styles.heroPill}>
                <Text allowFontScaling style={styles.heroPillText}>
                  Desde $3.50
                </Text>
              </View>
              <View style={styles.heroPillMuted}>
                <Text allowFontScaling style={styles.heroPillMutedText}>
                  Quito y Guayaquil beta
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.heroArtWrap}>
            <View style={styles.heroArtHalo} />
            <EncebolladoArt size={112} color={colors.primary} />
          </View>
        </View>

        {lowStockRestaurant ? (
          <View style={styles.alertRow}>
            <Ionicons name="flash" size={14} color={colors.error} />
            <Text allowFontScaling style={styles.alertText}>
              Quedan pocas bolsas en {lowStockRestaurant.name}
            </Text>
          </View>
        ) : null}

        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleBlock}>
            <Text allowFontScaling style={styles.sectionEyebrow}>
              Explora rapido
            </Text>
            <Text allowFontScaling style={styles.sectionTitle}>
              Categorias
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
          style={styles.categoriesScroll}
        >
          {foodCategoryData.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => router.setParams({ category: cat.id })}
                style={styles.categoryCard}
            >
              <View style={styles.categoryImageWrap}>
                <Image source={cat.image} style={styles.categoryImage} contentFit="cover" cachePolicy="memory-disk" />
              </View>
              <Text allowFontScaling numberOfLines={1} style={styles.categoryLabel}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.resultsHeader}>
          <View style={styles.sectionTitleBlock}>
            <Text allowFontScaling style={styles.sectionEyebrow}>
              Seleccion para hoy
            </Text>
            <Text allowFontScaling style={styles.sectionTitle}>
              Recomendados
            </Text>
          </View>

          <Pressable onPress={() => router.push('/filtros')} style={styles.filterButton}>
            <Ionicons name="options-outline" size={16} color={colors.text} />
            <Text allowFontScaling style={styles.filterButtonText}>
              Filtros
            </Text>
          </Pressable>
        </View>

        <View style={styles.resultsMeta}>
          <Text allowFontScaling style={styles.resultsMetaText}>
            {filteredRestaurants.length} lugares con retiro cercano
          </Text>
        </View>

        <View style={styles.resultsList}>
          {error ? (
            <View style={styles.feedbackCard}>
              <Text allowFontScaling style={styles.feedbackTitle}>
                Error de conexion
              </Text>
              <Text allowFontScaling style={styles.feedbackBody}>
                {error}
              </Text>
            </View>
          ) : filteredRestaurants.length === 0 ? (
            <View style={styles.feedbackCard}>
              <CuyArt size={72} color={colors.error} />
              <Text allowFontScaling style={[styles.feedbackTitle, { marginTop: 14 }]}>
                Sin resultados
              </Text>
              <Text allowFontScaling style={styles.feedbackBody}>
                Prueba ampliar la distancia o cambiar la categoria para ver mas opciones.
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  flagStripe: {
    flexDirection: 'row',
    height: 3
  },
  flagSegment: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 28
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  locationButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    ...theme.shadows.card
  },
  locationLabel: {
    ...typography.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4
  },
  locationValue: {
    ...typography.title,
    color: colors.text,
    fontWeight: '600',
    flex: 1
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 18,
    borderRadius: 28,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...theme.shadows.card
  },
  heroCopy: {
    flex: 1
  },
  eyebrow: {
    ...typography.micro,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  heroTitle: {
    ...typography.heading2,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.5,
    color: colors.text,
    marginTop: 8
  },
  heroBody: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 18
  },
  heroMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14
  },
  heroPill: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  heroPillText: {
    ...typography.micro,
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 0.35
  },
  heroPillMuted: {
    backgroundColor: colors.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  heroPillMutedText: {
    ...typography.micro,
    color: colors.primaryPressed,
    fontWeight: '700'
  },
  heroArtWrap: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroArtHalo: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryMuted
  },
  alertRow: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.errorSoft,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  alertText: {
    ...typography.caption,
    color: colors.error,
    fontWeight: '700',
    flex: 1
  },
  sectionHeader: {
    marginTop: 26,
    paddingHorizontal: 16
  },
  sectionTitleBlock: {
    minWidth: 0
  },
  sectionEyebrow: {
    ...typography.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  sectionTitle: {
    ...typography.heading2,
    color: colors.text,
    marginTop: 4
  },
  categoriesScroll: {
    marginTop: 14
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12
  },
  categoryCard: {
    width: 90
  },
  categoryImageWrap: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...theme.shadows.card
  },
  categoryImage: {
    width: '100%',
    height: '100%'
  },
  categoryLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center'
  },
  resultsHeader: {
    marginTop: 28,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  filterButtonText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '700'
  },
  resultsMeta: {
    paddingHorizontal: 16,
    marginTop: 6
  },
  resultsMetaText: {
    ...typography.caption,
    color: colors.textSecondary
  },
  resultsList: {
    paddingHorizontal: 16,
    marginTop: 14
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border
  },
  feedbackTitle: {
    ...typography.title,
    color: colors.text,
    fontWeight: '700'
  },
  feedbackBody: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 18
  }
})
