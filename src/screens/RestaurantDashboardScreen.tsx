import { router } from 'expo-router'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useMemo, useState } from 'react'

import { FlagStripe } from '../components/ui/FlagStripe'
import { StackHeader } from '../components/ui/StackHeader'
import { PrimaryButton } from '../components/ui/PrimaryButton'
import { SecondaryButton } from '../components/ui/SecondaryButton'
import { useReservations } from '../hooks/useReservations'
import { TextInputField } from '../components/ui/TextInputField'
import { useBusiness } from '../hooks/useBusiness'
import {
  createOfferForMyRestaurant,
  deleteOfferForMyRestaurant,
  toggleOfferStatus,
  updateOfferForMyRestaurant
} from '../services/business'
import { redeemMerchantReservation } from '../services/reservations'
import { colors, typography } from '../theme'
import type { Offer } from '../types/marketplace'

type OfferDraft = {
  title: string
  description: string
  originalPrice: string
  salePrice: string
  quantityAvailable: string
  pickupStart: string
  pickupEnd: string
}

const emptyDraft: OfferDraft = {
  title: '',
  description: '',
  originalPrice: '',
  salePrice: '',
  quantityAvailable: '',
  pickupStart: '18:00',
  pickupEnd: '20:00'
}

function toDraft(offer?: Offer | null): OfferDraft {
  if (!offer) return emptyDraft

  const [pickupStart = '18:00', pickupEnd = '20:00'] = offer.pickupWindow.split(' - ')

  return {
    title: offer.title,
    description: offer.description,
    originalPrice: String(offer.originalPrice),
    salePrice: String(offer.salePrice),
    quantityAvailable: String(offer.quantityAvailable),
    pickupStart,
    pickupEnd
  }
}

function normalizeStatus(status: string) {
  if (status === 'reserved') return 'Pendiente de retiro'
  if (status === 'completed') return 'Retirada y cobrada'
  if (status === 'cancelled') return 'Cancelada'
  return status
}

function normalizePayment(status: string) {
  if (status === 'pending') return 'Cobro pendiente en local'
  if (status === 'paid') return 'Cobrada'
  if (status === 'failed') return 'Revisar soporte'
  if (status === 'refunded') return 'Reembolsada'
  return status
}

export function RestaurantDashboardScreen() {
  const { restaurant, loading, refresh } = useBusiness()
  const { reservations, refresh: refreshReservations } = useReservations('merchant')
  const [draft, setDraft] = useState<OfferDraft>(emptyDraft)
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [pickupCodes, setPickupCodes] = useState<Record<string, string>>({})

  const reservedCount = useMemo(
    () => reservations.filter((reservation) => reservation.status === 'reserved').length,
    [reservations]
  )

  const completedCount = useMemo(
    () => reservations.filter((reservation) => reservation.status === 'completed').length,
    [reservations]
  )

  async function handleSaveOffer() {
    if (!restaurant) {
      router.push('/negocio/editar')
      return
    }

    try {
      setSaving(true)

      if (editingOfferId) {
        await updateOfferForMyRestaurant(editingOfferId, draft)
      } else {
        await createOfferForMyRestaurant(draft)
      }

      setDraft(emptyDraft)
      setEditingOfferId(null)
      await refresh()
      Alert.alert(
        editingOfferId ? 'Oferta actualizada' : 'Oferta creada',
        'Los cambios ya estan disponibles en tu panel y en el marketplace.'
      )
    } catch (error) {
      Alert.alert(
        editingOfferId ? 'No se pudo actualizar la oferta' : 'No se pudo crear la oferta',
        error instanceof Error ? error.message : 'Error inesperado.'
      )
    } finally {
      setSaving(false)
    }
  }

  function handleEditOffer(offer: Offer) {
    setEditingOfferId(offer.id)
    setDraft(toDraft(offer))
  }

  function handleCancelEditing() {
    setEditingOfferId(null)
    setDraft(emptyDraft)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlagStripe />
      <StackHeader title="Panel de negocio" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text allowFontScaling style={styles.screenLead}>
          Gestiona perfil, ofertas activas y retiros de la beta con pago en local.
        </Text>

        {restaurant ? (
          <>
            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text allowFontScaling style={styles.metricValue}>
                  {restaurant.offers.length}
                </Text>
                <Text allowFontScaling style={styles.metricLabel}>
                  Ofertas
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text allowFontScaling style={styles.metricValue}>
                  {reservedCount}
                </Text>
                <Text allowFontScaling style={styles.metricLabel}>
                  Pendientes
                </Text>
              </View>
              <View style={styles.metricCard}>
                <Text allowFontScaling style={styles.metricValue}>
                  {completedCount}
                </Text>
                <Text allowFontScaling style={styles.metricLabel}>
                  Retiradas
                </Text>
              </View>
            </View>

            <View style={styles.metricSummary}>
              <Text allowFontScaling style={styles.metricTitle}>
                {restaurant.name}
              </Text>
              <Text allowFontScaling style={styles.metricCopy}>
                {restaurant.city} - {restaurant.region}
              </Text>
              <Text allowFontScaling style={styles.metricCopy}>
                {restaurant.address}
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.metricSummary}>
            <Text allowFontScaling style={styles.metricTitle}>
              Crea primero tu perfil de restaurante
            </Text>
            <Text allowFontScaling style={styles.metricCopy}>
              Una vez guardado, aqui podras publicar ofertas, revisar pedidos y gestionar tu operacion.
            </Text>
            <PrimaryButton
              title="Configurar restaurante"
              onPress={() => router.push('/negocio/editar')}
            />
          </View>
        )}

        <View style={styles.formCard}>
          <Text allowFontScaling style={styles.sectionTitle}>
            {editingOfferId ? 'Editar oferta' : 'Nueva oferta'}
          </Text>
          <TextInputField
            label="Titulo"
            value={draft.title}
            onChangeText={(value) => setDraft((current) => ({ ...current, title: value }))}
          />
          <TextInputField
            label="Descripcion"
            value={draft.description}
            onChangeText={(value) => setDraft((current) => ({ ...current, description: value }))}
          />
          <TextInputField
            label="Precio original"
            value={draft.originalPrice}
            onChangeText={(value) => setDraft((current) => ({ ...current, originalPrice: value }))}
          />
          <TextInputField
            label="Precio Salvar"
            value={draft.salePrice}
            onChangeText={(value) => setDraft((current) => ({ ...current, salePrice: value }))}
          />
          <TextInputField
            label="Cantidad disponible"
            value={draft.quantityAvailable}
            onChangeText={(value) => setDraft((current) => ({ ...current, quantityAvailable: value }))}
          />
          <TextInputField
            label="Hora inicio recogida"
            value={draft.pickupStart}
            onChangeText={(value) => setDraft((current) => ({ ...current, pickupStart: value }))}
          />
          <TextInputField
            label="Hora fin recogida"
            value={draft.pickupEnd}
            onChangeText={(value) => setDraft((current) => ({ ...current, pickupEnd: value }))}
          />
          <PrimaryButton
            title={saving ? 'Guardando...' : editingOfferId ? 'Guardar cambios' : 'Publicar oferta'}
            onPress={handleSaveOffer}
            disabled={saving || loading}
          />
          {editingOfferId ? (
            <SecondaryButton title="Cancelar edicion" onPress={handleCancelEditing} />
          ) : null}
        </View>

        {restaurant?.offers.map((offer) => (
          <View key={offer.id} style={styles.offerCard}>
            <Text allowFontScaling style={styles.offerTitle}>
              {offer.title}
            </Text>
            <Text allowFontScaling style={styles.offerMeta}>
              ${offer.salePrice.toFixed(2)} - {offer.pickupWindow}
            </Text>
            <Text allowFontScaling style={styles.offerMeta}>
              Cantidad {offer.quantityAvailable} - {offer.isActive ? 'Activa' : 'Pausada'}
            </Text>
            <View style={styles.actionsRow}>
              <View style={styles.actionButton}>
                <PrimaryButton title="Editar" onPress={() => handleEditOffer(offer)} className="w-full" />
              </View>
              <View style={styles.actionButton}>
                <SecondaryButton
                  title={offer.isActive ? 'Pausar' : 'Activar'}
                  onPress={async () => {
                    try {
                      await toggleOfferStatus(offer.id, Boolean(offer.isActive))
                      await refresh()
                    } catch (error) {
                      Alert.alert(
                        'No se pudo actualizar',
                        error instanceof Error ? error.message : 'Error inesperado.'
                      )
                    }
                  }}
                  className="w-full"
                />
              </View>
            </View>
            <SecondaryButton
              title="Eliminar oferta"
              onPress={() =>
                Alert.alert(
                  'Eliminar oferta',
                  'Esta accion quitara la oferta del panel. Solo debe hacerse si ya no la necesitas.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Eliminar',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          await deleteOfferForMyRestaurant(offer.id)
                          if (editingOfferId === offer.id) {
                            handleCancelEditing()
                          }
                          await refresh()
                        } catch (error) {
                          Alert.alert(
                            'No se pudo eliminar',
                            error instanceof Error ? error.message : 'Error inesperado.'
                          )
                        }
                      }
                    }
                  ]
                )
              }
            />
          </View>
        ))}

        <View style={styles.formCard}>
          <Text allowFontScaling style={styles.sectionTitle}>
            Reservas recibidas
          </Text>
          {reservations.length === 0 ? (
            <Text allowFontScaling style={styles.offerMeta}>
              Aun no tienes reservas confirmadas.
            </Text>
          ) : (
            reservations.map((reservation) => (
              <View key={reservation.id} style={styles.reservationCard}>
                <Text allowFontScaling style={styles.offerTitle}>
                  {reservation.listingTitle}
                </Text>
                <Text allowFontScaling style={styles.offerMeta}>
                  Codigo {reservation.pickupCode}
                </Text>
                <Text allowFontScaling style={styles.offerMeta}>
                  Estado {normalizeStatus(reservation.status)}
                </Text>
                <Text allowFontScaling style={styles.offerMeta}>
                  Pago {normalizePayment(reservation.paymentStatus)}
                </Text>
                <Text allowFontScaling style={styles.offerMeta}>
                  Total ${reservation.totalPrice.toFixed(2)}
                </Text>
                {reservation.status === 'reserved' ? (
                  <>
                    <TextInputField
                      label="Codigo entregado por el cliente"
                      value={pickupCodes[reservation.id] ?? ''}
                      onChangeText={(value) =>
                        setPickupCodes((current) => ({
                          ...current,
                          [reservation.id]: value.toUpperCase()
                        }))
                      }
                      autoCapitalize="characters"
                    />
                    <PrimaryButton
                      title="Confirmar retiro y cobro"
                      onPress={async () => {
                        try {
                          await redeemMerchantReservation(
                            reservation.id,
                            pickupCodes[reservation.id] ?? ''
                          )
                          setPickupCodes((current) => ({
                            ...current,
                            [reservation.id]: ''
                          }))
                          await refreshReservations()
                        } catch (error) {
                          Alert.alert(
                            'No se pudo actualizar',
                            error instanceof Error ? error.message : 'Error inesperado.'
                          )
                        }
                      }}
                    />
                  </>
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 20,
    gap: 16
  },
  screenLead: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 4
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 22,
    padding: 16,
    gap: 4
  },
  metricValue: {
    ...typography.heading2,
    color: colors.primary
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary
  },
  metricSummary: {
    backgroundColor: '#FFF2DF',
    borderRadius: 24,
    padding: 18,
    gap: 8
  },
  metricTitle: {
    ...typography.heading2,
    color: colors.primary
  },
  metricCopy: {
    ...typography.caption,
    color: colors.text
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border
  },
  sectionTitle: {
    ...typography.heading2
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border
  },
  offerTitle: {
    ...typography.body,
    fontWeight: '700'
  },
  offerMeta: {
    ...typography.caption,
    color: colors.textSecondary
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10
  },
  actionButton: {
    flex: 1
  },
  reservationCard: {
    backgroundColor: '#FFF8F1',
    borderRadius: 18,
    padding: 14,
    gap: 8
  }
})
