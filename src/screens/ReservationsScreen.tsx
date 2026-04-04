import { Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { useReservations } from '../hooks/useReservations'
import { cancelMyReservation } from '../services/reservations'
import { colors, typography } from '../theme'

function formatPickup(start: string | null, end: string | null) {
  if (!start || !end) return 'Horario por confirmar'
  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
}

function formatStatus(status: string) {
  if (status === 'reserved') return 'Reservada'
  if (status === 'completed') return 'Completada'
  if (status === 'cancelled') return 'Cancelada'
  return status
}

export function ReservationsScreen() {
  const { reservations, loading, refresh } = useReservations('customer')
  const activeReservations = reservations.filter((reservation) => reservation.status === 'reserved')

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Mis reservas" />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Text allowFontScaling style={styles.lead}>
          Consulta horario, código y estado.
        </Text>

        <View style={styles.summaryCard}>
          <Text allowFontScaling style={styles.summaryNumber}>
            {reservations.length}
          </Text>
          <Text allowFontScaling style={styles.summaryText}>
            Reservas totales
          </Text>
          <Text allowFontScaling style={styles.summarySubtext}>
            {activeReservations.length} pendientes de recogida
          </Text>
        </View>

        {reservations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text allowFontScaling style={styles.emptyTitle}>
              Aun no tienes reservas.
            </Text>
            <Text allowFontScaling style={styles.emptyCopy}>
              Cuando confirmes una bolsa aparecera aqui.
            </Text>
          </View>
        ) : (
          reservations.map((reservation) => (
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
              <Text allowFontScaling style={styles.price}>
                ${reservation.totalPrice.toFixed(2)}
              </Text>
              {reservation.status === 'reserved' ? (
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
