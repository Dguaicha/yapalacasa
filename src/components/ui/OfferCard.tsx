import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import type { Offer } from '../../types/marketplace'
import { colors, theme, typography } from '../../theme'

type Props = {
  offer: Offer
  onPress?: () => void
  actionLabel?: string
}

export function OfferCard({ offer, onPress, actionLabel = 'Ver detalle' }: Props) {
  const lowStock = offer.quantityAvailable > 0 && offer.quantityAvailable <= 3

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${offer.title}. ${actionLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed ? styles.cardPressed : null]}
    >
      <View style={styles.topRow}>
        <View style={[styles.stockPill, lowStock ? styles.stockPillUrgent : styles.stockPillCalm]}>
          <Text allowFontScaling style={[styles.stockText, lowStock ? styles.stockTextUrgent : styles.stockTextCalm]}>
            {lowStock ? `Quedan ${offer.quantityAvailable}` : `${offer.quantityAvailable} disponibles`}
          </Text>
        </View>

        <View style={styles.priceWrap}>
          <Text allowFontScaling style={styles.priceLabel}>
            al recoger
          </Text>
          <Text allowFontScaling style={styles.price}>
            ${offer.salePrice.toFixed(2)}
          </Text>
        </View>
      </View>

      <Text allowFontScaling numberOfLines={2} style={styles.title}>
        {offer.title}
      </Text>

      <Text allowFontScaling numberOfLines={2} style={styles.description}>
        {offer.description}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.pickupChip}>
          <Ionicons name="time-outline" size={13} color={colors.primary} />
          <Text allowFontScaling numberOfLines={1} style={styles.pickupText}>
            {offer.pickupWindow}
          </Text>
        </View>

        <View style={styles.actionChip}>
          <Text allowFontScaling style={styles.action}>
            {actionLabel}
          </Text>
          <Ionicons name="arrow-forward" size={14} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...theme.shadows.card
  },
  cardPressed: {
    opacity: 0.97,
    transform: [{ scale: 0.996 }]
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10
  },
  stockPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  stockPillUrgent: {
    backgroundColor: colors.errorSoft
  },
  stockPillCalm: {
    backgroundColor: colors.surfaceAlt
  },
  stockText: {
    ...typography.micro,
    fontWeight: '700',
    letterSpacing: 0.35
  },
  stockTextUrgent: {
    color: colors.error
  },
  stockTextCalm: {
    color: colors.primaryPressed
  },
  priceWrap: {
    alignItems: 'flex-end'
  },
  priceLabel: {
    ...typography.micro,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.45
  },
  price: {
    ...typography.title,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2
  },
  title: {
    ...typography.title,
    fontWeight: '700',
    color: colors.text
  },
  description: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 2
  },
  pickupChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primaryMuted,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  pickupText: {
    ...typography.micro,
    color: colors.primaryPressed,
    fontWeight: '700',
    flexShrink: 1
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  action: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700'
  }
})
