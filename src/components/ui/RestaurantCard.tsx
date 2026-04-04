import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { colors, typography } from '../../theme'
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
          <Image source={{ uri: restaurant.coverImageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text allowFontScaling style={styles.placeholderText}>
              {restaurant.category}
            </Text>
          </View>
        )}

        <View style={styles.ratingBadge}>
          <Text allowFontScaling style={styles.ratingValue}>
            {restaurant.rating.toFixed(1)}
          </Text>
          <Ionicons name="star" size={11} color="#C9A227" />
          <Text allowFontScaling style={styles.reviewCount}>
            ({restaurant.reviewCount})
          </Text>
        </View>

        {quantity > 0 && quantity <= 3 ? (
          <View style={styles.stockBadge}>
            <Text allowFontScaling style={styles.stockBadgeText}>
              Solo {quantity} disponibles
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.titleBlock}>
            <Text allowFontScaling numberOfLines={1} style={styles.name}>
              {restaurant.name}
            </Text>
            <Text allowFontScaling style={styles.meta}>
              ${restaurant.approximatePrice.toFixed(2)} · {restaurant.category} ·{' '}
              {restaurant.distanceKm.toFixed(1)} km
            </Text>
          </View>
          <View style={styles.discountPill}>
            <Text allowFontScaling style={styles.discountText}>
              -{restaurant.discountLabel}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.timePill}>
            <Ionicons name="time-outline" size={13} color={colors.textSecondary} />
            <Text allowFontScaling style={styles.timeText}>
              {restaurant.pickupSummary}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <View style={[styles.dot, restaurant.isOpen ? styles.dotOpen : styles.dotClosed]} />
            <Text allowFontScaling style={styles.statusText}>
              {restaurant.isOpen ? 'Abierto' : 'Cerrado'}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2
  },
  cardPressed: {
    opacity: 0.96
  },
  imageWrap: {
    position: 'relative'
  },
  image: {
    width: '100%',
    height: 176
  },
  imagePlaceholder: {
    width: '100%',
    height: 176,
    backgroundColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    ...typography.overline,
    opacity: 0.4,
    textTransform: 'uppercase'
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  ratingValue: {
    ...typography.micro,
    fontSize: 12,
    lineHeight: 15,
    fontWeight: '700',
    color: colors.text
  },
  reviewCount: {
    ...typography.micro,
    fontSize: 10,
    lineHeight: 13,
    color: colors.textSecondary
  },
  stockBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.ecuadorRed,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8
  },
  stockBadgeText: {
    ...typography.micro,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  body: {
    padding: 16
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    lineHeight: 23,
    fontWeight: '700',
    color: colors.text
  },
  meta: {
    ...typography.caption,
    marginTop: 4,
    color: colors.textSecondary
  },
  discountPill: {
    backgroundColor: 'rgba(26, 58, 92, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    flexShrink: 0
  },
  discountText: {
    ...typography.micro,
    color: colors.primary,
    fontWeight: '700'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.muted,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
    maxWidth: '65%'
  },
  timeText: {
    ...typography.micro,
    flexShrink: 1,
    color: colors.textSecondary
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
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
    backgroundColor: colors.ecuadorRed
  },
  statusText: {
    ...typography.micro,
    color: colors.textSecondary
  }
})
