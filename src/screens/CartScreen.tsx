import { useState } from 'react'
import { router } from 'expo-router'
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { useCart } from '../context/CartContext'
import { supabase } from '../services/supabase'
import { kushkiService } from '../services/kushki'
import { cancelMyReservation } from '../services/reservations'
import { colors, typography } from '../theme'

export function CartScreen() {
  const { items, removeFromCart, clearCart, total, isLoading } = useCart()
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Añade una bolsa antes de confirmar la reserva.')
      return
    }

    setLoading(true)

    const reservations: Array<{ id: string; amount: number; title: string }> = []

    try {
      for (const item of items) {
        const { data, error } = await supabase.rpc('reserve_listing', {
          target_listing_id: item.offer.id
        })

        if (error) {
          throw new Error(`Error reservando ${item.offer.title}: ${error.message}`)
        }

        if (data && data.id) {
          reservations.push({
            id: data.id,
            amount: item.offer.salePrice,
            title: item.offer.title
          })
        }
      }

      const tokenResult = await kushkiService.generateToken(total)
      if (!tokenResult.success) {
        throw new Error('Error al crear el pago.')
      }

      const paymentResult = await kushkiService.confirmPayment(reservations, tokenResult.token)
      if (!paymentResult.success) {
        // If some reservations were completed before the failure, we need to handle them
        if (paymentResult.completedReservations && paymentResult.completedReservations.length > 0) {
          console.error('Partial payment success - some reservations completed:', paymentResult.completedReservations)
        }
        throw new Error(paymentResult.error || 'Error al procesar el pago.')
      }

      await clearCart()
      Alert.alert('Pago exitoso', 'Tu reserva está confirmada. Puedes verla en Mis reservas.', [
        { text: 'Ver mis reservas', onPress: () => router.replace('/mis-reservas') }
      ])
    } catch (err: unknown) {
      if (reservations.length > 0) {
        await Promise.allSettled(
          reservations.map((reservation) => cancelMyReservation(reservation.id))
        )
      }
      Alert.alert('Error en el checkout', err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlagStripe />
      <StackHeader title="Mi carrito" variant="close" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text allowFontScaling style={styles.lead}>
          Revisa tu pedido antes de pagar.
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text allowFontScaling style={styles.emptyTitle}>
              Tu carrito está vacío
            </Text>
            <Text allowFontScaling style={styles.emptyBody}>
              Explora negocios cercanos y rescata una bolsa sorpresa.
            </Text>
            <PrimaryButton title="Explorar" onPress={() => router.replace('/explorar')} className="w-full" />
          </View>
        ) : (
          <>
            <View style={styles.list}>
              {items.map((item) => (
                <View key={item.offer.id} style={styles.itemCard}>
                  <View style={styles.itemTop}>
                    <View style={styles.itemText}>
                      <Text allowFontScaling style={styles.itemTitle}>
                        {item.offer.title}
                      </Text>
                      <Text allowFontScaling style={styles.itemMeta}>
                        {item.restaurant.name} · {item.restaurant.city}
                      </Text>
                    </View>
                    <Text allowFontScaling style={styles.itemPrice}>
                      ${item.offer.salePrice.toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.pickupRow}>
                    <Text allowFontScaling style={styles.pickupText}>
                      Recogida {item.offer.pickupWindow}
                    </Text>
                  </View>

                  <SecondaryButton
                    title="Eliminar"
                    onPress={async () => {
                      await removeFromCart(item.offer.id)
                    }}
                    className="min-h-[44px] h-[44px]"
                  />
                </View>
              ))}
            </View>

            <View style={styles.summary}>
              <Text allowFontScaling style={styles.summaryLabel}>
                Total a pagar
              </Text>
              <Text allowFontScaling style={styles.summaryAmount}>
                ${total.toFixed(2)}
              </Text>

              <View style={styles.trustRow}>
                <View style={styles.trustDot} />
                <Text allowFontScaling style={styles.trustCopy}>
                  Pago seguro con Kushki. No guardamos los datos de tu tarjeta.
                </Text>
              </View>

              <PrimaryButton title="Pagar con tarjeta" onPress={handleCheckout} loading={loading} className="w-full" />
            </View>
          </>
        )}
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
    gap: 16
  },
  lead: {
    ...typography.body,
    marginBottom: 4
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8
  },
  emptyTitle: {
    ...typography.title,
    fontWeight: '700',
    marginBottom: 8,
    color: colors.text
  },
  emptyBody: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: 20
  },
  list: {
    gap: 12
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  itemText: {
    flex: 1,
    minWidth: 0
  },
  itemTitle: {
    ...typography.title,
    fontWeight: '600',
    color: colors.text
  },
  itemMeta: {
    ...typography.caption,
    marginTop: 4
  },
  itemPrice: {
    ...typography.title,
    fontWeight: '700',
    color: colors.success,
    flexShrink: 0
  },
  pickupRow: {
    backgroundColor: colors.muted,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  pickupText: {
    ...typography.micro,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  },
  summary: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    gap: 12
  },
  summaryLabel: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary
  },
  summaryAmount: {
    ...typography.heading1,
    fontSize: 32,
    lineHeight: 38,
    color: colors.primary,
    marginBottom: 8
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 4
  },
  trustDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginTop: 5
  },
  trustCopy: {
    ...typography.caption,
    flex: 1,
    fontStyle: 'italic',
    lineHeight: 19
  }
})
