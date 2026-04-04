import { router, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

import { LogoSalvar } from '../components/branding/LogoSalvar'
import { OfferCard } from '../components/ui/OfferCard'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { useCart } from '../context/CartContext'
import { useMarketplace } from '../hooks/useMarketplace'
import { colors, typography } from '../theme'
import { getBestOffer } from '../utils/marketplace'

export function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { restaurants, loading } = useMarketplace()
  const { addToCart } = useCart()
  const restaurant = restaurants.find((item) => item.id === id)

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    )
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={[styles.centered, styles.padded]}>
        <Text allowFontScaling style={styles.emptyTitle}>
          No encontramos este negocio.
        </Text>
        <PrimaryButton title="Volver al inicio" onPress={() => router.push('/inicio')} className="mt-4 w-full" />
      </SafeAreaView>
    )
  }

  const bestOffer = getBestOffer(restaurant)

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.toolbar}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text allowFontScaling numberOfLines={1} style={styles.toolbarTitle}>
          {restaurant.name}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroWrap}>
          {restaurant.coverImageUrl ? (
            <Image source={{ uri: restaurant.coverImageUrl }} style={styles.hero} resizeMode="cover" />
          ) : (
            <View style={[styles.hero, styles.heroPlaceholder]}>
              <LogoSalvar size={80} />
            </View>
          )}
          <View style={styles.heroBadges}>
            <View style={styles.badgeNeutral}>
              <Text allowFontScaling style={styles.badgeNeutralText}>
                {restaurant.category}
              </Text>
            </View>
            <View style={[styles.badgeState, restaurant.isOpen ? styles.badgeOpen : styles.badgeClosed]}>
              <Text allowFontScaling style={styles.badgeStateText}>
                {restaurant.isOpen ? 'Abierto' : 'Cerrado'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text allowFontScaling style={styles.restName}>
            {restaurant.name}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={15} color="#C9A227" />
            <Text allowFontScaling style={styles.ratingValue}>
              {restaurant.rating.toFixed(1)}
            </Text>
            <Text allowFontScaling style={styles.ratingMeta}>
              ({restaurant.reviewCount} reseñas)
            </Text>
            <Text allowFontScaling style={styles.dot}>
              ·
            </Text>
            <Text allowFontScaling style={styles.ratingMeta}>
              {restaurant.distanceKm.toFixed(1)} km
            </Text>
          </View>

          <Text allowFontScaling style={styles.description}>
            {restaurant.description}
          </Text>

          <View style={styles.cards}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardHead}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
                <Text allowFontScaling style={styles.infoLabel}>
                  Dirección
                </Text>
              </View>
              <Text allowFontScaling style={styles.infoValue}>
                {restaurant.address}
              </Text>
              <Text allowFontScaling style={styles.infoHint}>
                {restaurant.pickupNotes || 'Muestra tu reserva al recoger.'}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHead}>
                <Ionicons name="time-outline" size={18} color={colors.primary} />
                <Text allowFontScaling style={styles.infoLabel}>
                  Horario de recogida
                </Text>
              </View>
              <Text allowFontScaling style={styles.infoValue}>
                {restaurant.pickupSummary}
              </Text>
            </View>
          </View>

          <View style={styles.ctaBlock}>
            <PrimaryButton
              title="Añadir mejor bolsa"
              loading={false}
              onPress={() => {
                if (!bestOffer) return
                addToCart(bestOffer, {
                  id: restaurant.id,
                  name: restaurant.name,
                  city: restaurant.city
                })
                Alert.alert('Añadido', 'La bolsa sorpresa fue añadida al carrito.')
              }}
            />
            <SecondaryButton title="Ver mi carrito" onPress={() => router.push('/carrito')} />
          </View>

          <View style={styles.offersHead}>
            <Text allowFontScaling style={styles.offersTitle}>
              Bolsas disponibles
            </Text>
            <Text allowFontScaling style={styles.offersSub}>
              Elige una bolsa para rescatar.
            </Text>
          </View>

          {restaurant.offers.length === 0 ? (
            <View style={styles.emptyOffers}>
              <Text allowFontScaling style={styles.emptyOffersText}>
                No hay bolsas activas hoy.
              </Text>
            </View>
          ) : (
            restaurant.offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                actionLabel="Añadir"
                onPress={() => {
                  addToCart(offer, {
                    id: restaurant.id,
                    name: restaurant.name,
                    city: restaurant.city
                  })
                  Alert.alert('Añadido', 'La bolsa fue añadida al carrito.')
                }}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface
  },
  padded: {
    padding: 24
  },
  emptyTitle: {
    ...typography.title,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 16
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface
  },
  backBtn: {
    padding: 4,
    marginLeft: -4
  },
  toolbarTitle: {
    ...typography.navTitle,
    flex: 1,
    marginLeft: 12
  },
  scroll: {
    paddingBottom: 40
  },
  heroWrap: {
    position: 'relative'
  },
  hero: {
    width: '100%',
    height: 224
  },
  heroPlaceholder: {
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroBadges: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8
  },
  badgeNeutral: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  badgeNeutralText: {
    ...typography.micro,
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  badgeState: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999
  },
  badgeOpen: {
    backgroundColor: 'rgba(46, 125, 50, 0.92)'
  },
  badgeClosed: {
    backgroundColor: 'rgba(183, 28, 28, 0.92)'
  },
  badgeStateText: {
    ...typography.micro,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  section: {
    padding: 24
  },
  restName: {
    ...typography.heading1,
    fontSize: 26,
    lineHeight: 32
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
    gap: 4
  },
  ratingValue: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.text
  },
  ratingMeta: {
    ...typography.caption,
    color: colors.textSecondary
  },
  dot: {
    ...typography.caption,
    color: colors.textSecondary,
    marginHorizontal: 2
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 16,
    lineHeight: 23
  },
  cards: {
    gap: 14,
    marginTop: 24,
    marginBottom: 8
  },
  infoCard: {
    backgroundColor: colors.muted,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border
  },
  infoCardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6
  },
  infoLabel: {
    ...typography.overline,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600'
  },
  infoHint: {
    ...typography.caption,
    marginTop: 6,
    fontStyle: 'italic'
  },
  ctaBlock: {
    gap: 12,
    marginTop: 8
  },
  offersHead: {
    marginTop: 32,
    marginBottom: 12
  },
  offersTitle: {
    ...typography.heading2
  },
  offersSub: {
    ...typography.caption,
    marginTop: 4
  },
  emptyOffers: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    backgroundColor: colors.muted
  },
  emptyOffersText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center'
  }
})
