import { Pressable, StyleSheet, Text, View } from 'react-native'

import type { Offer } from '../../types/marketplace'
import { colors, typography } from '../../theme'

type Props = {
  offer: Offer
  onPress?: () => void
  actionLabel?: string
}

export function OfferCard({ offer, onPress, actionLabel = 'Ver detalle' }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${offer.title}. ${actionLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text allowFontScaling style={styles.badgeText}>
            {offer.quantityAvailable} disponibles
          </Text>
        </View>
        <Text allowFontScaling style={styles.price}>
          ${offer.salePrice.toFixed(2)}
        </Text>
      </View>
      <Text allowFontScaling style={styles.title}>
        {offer.title}
      </Text>
      <Text allowFontScaling numberOfLines={2} style={styles.description}>
        {offer.description}
      </Text>
      <View style={styles.footer}>
        <Text allowFontScaling style={styles.pickup}>
          Recogida {offer.pickupWindow}
        </Text>
        <Text allowFontScaling style={styles.action}>
          {actionLabel}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10
  },
  cardPressed: {
    opacity: 0.96
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badge: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  badgeText: {
    ...typography.micro,
    color: colors.primary,
    fontWeight: '700'
  },
  price: {
    ...typography.title,
    fontWeight: '700',
    color: colors.success
  },
  title: {
    ...typography.title,
    fontWeight: '600',
    color: colors.text
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  pickup: {
    ...typography.caption,
    color: colors.text
  },
  action: {
    ...typography.caption,
    color: colors.primary
  }
})
