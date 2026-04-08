import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect, useMemo, useState } from 'react'
import { useNetInfo } from '@react-native-community/netinfo'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { useSession } from '../hooks/useSession'
import { useReservations } from '../hooks/useReservations'
import { getCachedReservationReceipts } from '../services/reservationReceipts'
import { cancelMyReservation } from '../services/reservations'
import { colors, typography } from '../theme'

function formatPickup(start: string | null, end: string | null) {
  if (!start || !end) return 'Horario por confirmar'
  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
}

function formatStatus(status: string) {
  if (status === 'reserved') return 'Reservada'
  if (status === 'completed') return 'Retirada'
  if (status === 'cancelled') return 'Cancelada'
  return status
}

function formatPaymentStatus(status: string) {
  if (status === 'pending') return 'Pagas al recoger'
  if (status === 'paid') return 'Pagada en local'
  if (status === 'refunded') return 'Reembolsada'
  if (status === 'failed') return 'Pago pendiente de soporte'
  return status
}

export function ReservationsScreen() {
  const netInfo = useNetInfo()
  const { session } = useSession()
  const { reservations, loading, refresh } = useReservations('customer')
  const [cachedReservations, setCachedReservations] = useState<typeof reservations>([])
  const isOffline = netInfo.isConnected === false || netInfo.isInternetReachable === false

  useEffect(() => {
    let mounted = true

    async function loadCachedReceipts() {
      if (!session?.user?.id) return

      const nextCached = await getCachedReservationReceipts(session.user.id)
      if (!mounted) return
      setCachedReservations(nextCached)
    }

    loadCachedReceipts()

    return () => {
      mounted = false
    }
  }, [session?.user?.id, reservations])

  const displayedReservations = useMemo(
    () => (isOffline ? cachedReservations : reservations),
    [cachedReservations, isOffline, reservations]
  )
  const activeReservations = displayedReservations.filter((reservation) => reservation.status === 'reserved')

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Mis reservas" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Text allowFontScaling style={styles.lead}>
          Consulta horario, codigo y estado de cada reserva.
        </Text>

        {isOffline ? (
          <View style={styles.offlineBanner}>
            <Text allowFontScaling style={styles.offlineTitle}>
              Sin conexion
            </Text>
            <Text allowFontScaling style={styles.offlineCopy}>
              Mostrando tus codigos guardados localmente para el retiro.
            </Text>
          </View>
        ) : null}

        <View style={styles.summaryCard}>
          <Text allowFontScaling style={styles.summaryNumber}>
            {displayedReservations.length}
          </Text>
          <Text allowFontScaling style={styles.summaryText}>
            Reservas totales
          </Text>
          <Text allowFontScaling style={styles.summarySubtext}>
            {activeReservations.length} pendientes de recogida
          </Text>
        </View>

        {displayedReservations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text allowFontScaling style={styles.emptyTitle}>
              Aun no tienes reservas.
            </Text>
            <Text allowFontScaling style={styles.emptyCopy}>
              Cuando confirmes una bolsa aparecera aqui con su codigo de retiro.
            </Text>
          </View>
        ) : (
          displayedReservations.map((reservation) => (
            <View key={reservation.id} style={styles.card}>
              <Text allowFontScaling style={styles.code}>
                Codigo {reservation.pickupCode}
              </Text>
              <Text allowFontScaling style={styles.listingTitle}>
                {reservation.listingTitle}
              </Text>
              <Text allowFontScaling style={styles.meta}>
                {reservation.restaurantName} · {reservation.restaurantCity}
              </Text>
              <Text allowFontScaling style={styles.meta}>
                Recogida {formatPickup(reservation.pickupStart, reservation.pickupEnd)}
              </Text>
              <Text allowFontScaling style={styles.meta}>
                Estado {formatStatus(reservation.status)}
              </Text>
              <Text allowFontScaling style={styles.meta}>
                Pago {formatPaymentStatus(reservation.paymentStatus)}
              </Text>
              <Text allowFontScaling style={styles.price}>
                ${reservation.totalPrice.toFixed(2)}
              </Text>
              {reservation.status === 'reserved' && !isOffline ? (
                <PrimaryButton
                  title="Cancelar reserva"
                  onPress={async () => {
                    try {
                      await cancelMyReservation(reservation.id)
                      await refresh()
                    } catch (error) {
                      Alert.alert(
                        'No se pudo cancelar',
                        error instanceof Error ? error.message : 'Error inesperado.'
                      )
                    }
                  }}
                />
              ) : null}
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
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border
  },
  lead: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 4
  },
  summaryCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 18,
    padding: 14,
    gap: 2
  },
  summaryNumber: {
    ...typography.heading2,
    color: colors.primary
  },
  summaryText: {
    ...typography.title,
    fontWeight: '600',
    color: colors.text
  },
  summarySubtext: {
    ...typography.caption,
    color: colors.textSecondary
  },
  offlineBanner: {
    backgroundColor: colors.primaryMuted,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border
  },
  offlineTitle: {
    ...typography.title,
    color: colors.primaryPressed,
    fontWeight: '700'
  },
  offlineCopy: {
    ...typography.caption,
    color: colors.primaryPressed,
    marginTop: 4
  },
  emptyTitle: {
    ...typography.title,
    fontWeight: '600',
    color: colors.text
  },
  emptyCopy: {
    ...typography.caption,
    color: colors.textSecondary
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border
  },
  code: {
    ...typography.micro,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4
  },
  listingTitle: {
    ...typography.title,
    fontWeight: '600',
    color: colors.text
  },
  meta: {
    ...typography.caption,
    color: colors.textSecondary
  },
  price: {
    ...typography.title,
    color: colors.success,
    fontWeight: '700'
  }
})
