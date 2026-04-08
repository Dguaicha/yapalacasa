import { router, useLocalSearchParams } from 'expo-router'
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'

import { LogoSalvar } from '../components/branding/LogoSalvar'
import { OfferCard } from '../components/ui/OfferCard'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { useCart } from '../context/CartContext'
import { useMarketplace } from '../hooks/useMarketplace'
import { colors, theme, typography } from '../theme'
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
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text allowFontScaling numberOfLines={1} style={styles.toolbarTitle}>
          {restaurant.name}
        </Text>
        <View style={styles.toolbarSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.heroShell}>
          <View style={styles.heroWrap}>
            {restaurant.coverImageUrl ? (
              <Image source={{ uri: restaurant.coverImageUrl }} style={styles.hero} contentFit="cover" cachePolicy="memory-disk" />
            ) : (
              <View style={[styles.hero, styles.heroPlaceholder]}>
                <LogoSalvar size={76} />
              </View>
            )}

            <View style={styles.heroScrim} />

            <View style={styles.heroTopBadges}>
              <View style={styles.heroCategoryBadge}>
                <Text allowFontScaling style={styles.heroCategoryText}>
                  {restaurant.category}
                </Text>
              </View>
              <View style={[styles.heroStateBadge, restaurant.isOpen ? styles.heroStateOpen : styles.heroStateClosed]}>
                <Text allowFontScaling style={styles.heroStateText}>
                  {restaurant.openLabel}
                </Text>
              </View>
            </View>

            <View style={styles.heroBottomRow}>
              <View style={styles.heroPriceCard}>
                <Text allowFontScaling style={styles.heroPriceLabel}>
                  mejor bolsa desde
                </Text>
                <Text allowFontScaling style={styles.heroPriceValue}>
                  ${restaurant.approximatePrice.toFixed(2)}
                </Text>
              </View>

              <View style={styles.heroRatingBadge}>
                <Ionicons name="star" size={13} color={colors.highlight} />
                <Text allowFontScaling style={styles.heroRatingText}>
                  {restaurant.rating.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text allowFontScaling style={styles.restName}>
            {restaurant.name}
          </Text>

          <Text allowFontScaling style={styles.subMeta}>
            {restaurant.city} · {restaurant.distanceKm.toFixed(1)} km · {restaurant.discountLabel}
          </Text>

          <Text allowFontScaling style={styles.description}>
            {restaurant.description}
          </Text>

          <View style={styles.signalRow}>
            <View style={styles.signalChip}>
              <Ionicons name="time-outline" size={14} color={colors.primary} />
              <Text allowFontScaling style={styles.signalText}>
                {restaurant.pickupSummary}
              </Text>
            </View>

            <View style={styles.signalChip}>
              <Ionicons name="wallet-outline" size={14} color={colors.primary} />
              <Text allowFontScaling style={styles.signalText}>
                Pagas al recoger
              </Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoCard}>
              <View style={styles.infoCardHead}>
                <Ionicons name="location-outline" size={18} color={colors.primary} />
                <Text allowFontScaling style={styles.infoLabel}>
                  Direccion
                </Text>
              </View>
              <Text allowFontScaling style={styles.infoValue}>
                {restaurant.address}
              </Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoCardHead}>
                <Ionicons name="receipt-outline" size={18} color={colors.primary} />
                <Text allowFontScaling style={styles.infoLabel}>
                  Retiro
                </Text>
              </View>
              <Text allowFontScaling style={styles.infoValue}>
                {restaurant.pickupNotes || 'Muestra tu codigo de reserva al recoger.'}
              </Text>
            </View>
          </View>

          <View style={styles.ctaBlock}>
            <PrimaryButton
              title="Anadir mejor bolsa"
              loading={false}
              onPress={() => {
                if (!bestOffer) return
                addToCart(bestOffer, {
                  id: restaurant.id,
                  name: restaurant.name,
                  city: restaurant.city
                })
                Alert.alert('Anadido', 'La mejor bolsa fue anadida al carrito.')
              }}
            />
            <SecondaryButton title="Ver mi carrito" onPress={() => router.push('/carrito')} />
          </View>

          <View style={styles.offersHead}>
            <View>
              <Text allowFontScaling style={styles.offersEyebrow}>
                Seleccion disponible
              </Text>
              <Text allowFontScaling style={styles.offersTitle}>
                Bolsas activas
              </Text>
            </View>
            <Text allowFontScaling style={styles.offersSub}>
              {restaurant.offers.length} opciones
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
                actionLabel="Anadir"
                onPress={() => {
                  addToCart(offer, {
                    id: restaurant.id,
                    name: restaurant.name,
                    city: restaurant.city
                  })
                  Alert.alert('Anadido', 'La bolsa fue anadida al carrito.')
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
    backgroundColor: colors.background
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background
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
    backgroundColor: colors.background
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  toolbarTitle: {
    ...typography.navTitle,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8
  },
  toolbarSpacer: {
    width: 40
  },
  scroll: {
    paddingBottom: 36
  },
  heroShell: {
    paddingHorizontal: 16,
    paddingTop: 6
  },
  heroWrap: {
    position: 'relative',
    borderRadius: 28,
    overflow: 'hidden',
    ...theme.shadows.card
  },
  hero: {
    width: '100%',
    height: 272
  },
  heroPlaceholder: {
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.18)'
  },
  heroTopBadges: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  heroCategoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  heroCategoryText: {
    ...typography.micro,
    color: colors.text,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.45
  },
  heroStateBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  heroStateOpen: {
    backgroundColor: 'rgba(47, 107, 59, 0.92)'
  },
  heroStateClosed: {
    backgroundColor: 'rgba(220, 38, 38, 0.92)'
  },
  heroStateText: {
    ...typography.micro,
    color: colors.textInverse,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.45
  },
  heroBottomRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12
  },
  heroPriceCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minWidth: 128
  },
  heroPriceLabel: {
    ...typography.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.45
  },
  heroPriceValue: {
    ...typography.heading2,
    color: colors.primary,
    marginTop: 4
  },
  heroRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  heroRatingText: {
    ...typography.micro,
    color: colors.text,
    fontWeight: '700'
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 18
  },
  restName: {
    ...typography.heading1,
    fontSize: 28,
    lineHeight: 34
  },
  subMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 6
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 14,
    lineHeight: 23
  },
  signalRow: {
    gap: 10,
    marginTop: 18
  },
  signalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  signalText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
    flexShrink: 1
  },
  infoGrid: {
    gap: 12,
    marginTop: 18
  },
  infoCard: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border
  },
  infoCardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  infoLabel: {
    ...typography.overline,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600'
  },
  ctaBlock: {
    gap: 12,
    marginTop: 20
  },
  offersHead: {
    marginTop: 30,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12
  },
  offersEyebrow: {
    ...typography.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  offersTitle: {
    ...typography.heading2,
    marginTop: 4
  },
  offersSub: {
    ...typography.caption,
    color: colors.textSecondary
  },
  emptyOffers: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong,
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    backgroundColor: colors.surface
  },
  emptyOffersText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center'
  }
})
