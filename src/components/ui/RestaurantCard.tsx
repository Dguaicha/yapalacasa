import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'

import { colors, theme, typography } from '../../theme'
import type { Restaurant } from '../../types/marketplace'
import { getBestOffer } from '../../utils/marketplace'

type Props = {
  restaurant: Restaurant
  onPress: () => void
}

export function RestaurantCard({ restaurant, onPress }: Props) {
  const bestOffer = getBestOffer(restaurant)
  const quantity = bestOffer?.quantityAvailable ?? 0

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.imageWrap}>
        {restaurant.coverImageUrl ? (
          <Image source={{ uri: restaurant.coverImageUrl }} style={styles.image} contentFit="cover" cachePolicy="memory-disk" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text allowFontScaling style={styles.placeholderText}>
              {restaurant.category}
            </Text>
          </View>
        )}

        <View style={styles.imageScrim} />

        <View style={styles.topOverlayRow}>
          <View style={styles.cityChip}>
            <Ionicons name="location-outline" size={12} color={colors.textInverse} />
            <Text allowFontScaling numberOfLines={1} style={styles.cityChipText}>
              {restaurant.city}
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color={colors.highlight} />
            <Text allowFontScaling style={styles.ratingValue}>
              {restaurant.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={styles.bottomOverlayRow}>
          <View style={styles.priceBadge}>
            <Text allowFontScaling style={styles.priceLabel}>
              desde
            </Text>
            <Text allowFontScaling style={styles.priceValue}>
              ${restaurant.approximatePrice.toFixed(2)}
            </Text>
          </View>

          {quantity > 0 && quantity <= 3 ? (
            <View style={styles.stockBadge}>
              <Text allowFontScaling style={styles.stockBadgeText}>
                Quedan {quantity}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <View style={styles.titleBlock}>
            <Text allowFontScaling numberOfLines={1} style={styles.name}>
              {restaurant.name}
            </Text>
            <Text allowFontScaling numberOfLines={1} style={styles.subline}>
              {restaurant.category} · {restaurant.distanceKm.toFixed(1)} km
            </Text>
          </View>

          <View style={styles.discountPill}>
            <Text allowFontScaling style={styles.discountText}>
              {restaurant.discountLabel}
            </Text>
          </View>
        </View>

        <View style={styles.signalRow}>
          <View style={styles.signalChip}>
            <Ionicons name="time-outline" size={13} color={colors.primary} />
            <Text allowFontScaling numberOfLines={1} style={styles.signalText}>
              {restaurant.pickupSummary.replace('Recogida ', '')}
            </Text>
          </View>

          <View style={[styles.statusChip, restaurant.isOpen ? styles.statusChipOpen : styles.statusChipClosed]}>
            <View style={[styles.dot, restaurant.isOpen ? styles.dotOpen : styles.dotClosed]} />
            <Text allowFontScaling style={styles.statusText}>
              {restaurant.openLabel}
            </Text>
          </View>
        </View>

        <Text allowFontScaling numberOfLines={2} style={styles.description}>
          {restaurant.description}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...theme.shadows.card
  },
  cardPressed: {
    opacity: 0.97,
    transform: [{ scale: 0.996 }]
  },
  imageWrap: {
    position: 'relative'
  },
  image: {
    width: '100%',
    height: 196
  },
  imagePlaceholder: {
    width: '100%',
    height: 196,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    ...typography.overline,
    color: colors.textSecondary,
    opacity: 0.55
  },
  imageScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.16)'
  },
  topOverlayRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
  },
  bottomOverlayRow: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 10
  },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: theme.radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '68%'
  },
  cityChipText: {
    ...typography.micro,
    color: colors.textInverse,
    fontWeight: '700'
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: theme.radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  ratingValue: {
    ...typography.micro,
    color: colors.text,
    fontWeight: '700'
  },
  priceBadge: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 92
  },
  priceLabel: {
    ...typography.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  priceValue: {
    ...typography.title,
    color: colors.primary,
    fontWeight: '700'
  },
  stockBadge: {
    backgroundColor: colors.error,
    borderRadius: theme.radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  stockBadgeText: {
    ...typography.micro,
    color: colors.textInverse,
    fontWeight: '700',
    letterSpacing: 0.35,
    textTransform: 'uppercase'
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10
  },
  titleBlock: {
    flex: 1,
    minWidth: 0
  },
  name: {
    ...typography.title,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: colors.text
  },
  subline: {
    ...typography.caption,
    marginTop: 3,
    color: colors.textSecondary
  },
  discountPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexShrink: 0
  },
  discountText: {
    ...typography.micro,
    color: colors.primaryPressed,
    fontWeight: '700'
  },
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12
  },
  signalChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  signalText: {
    ...typography.micro,
    color: colors.primaryPressed,
    fontWeight: '700',
    flexShrink: 1
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  statusChipOpen: {
    backgroundColor: colors.successSoft
  },
  statusChipClosed: {
    backgroundColor: colors.errorSoft
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  dotOpen: {
    backgroundColor: colors.success
  },
  dotClosed: {
    backgroundColor: colors.error
  },
  statusText: {
    ...typography.micro,
    color: colors.text,
    fontWeight: '700'
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 10,
    lineHeight: 18
  }
})
