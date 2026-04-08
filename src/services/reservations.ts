import { supabase } from './supabase'
import {
  removeCachedReservationReceipt,
  setCachedReservationReceipts,
  upsertCachedReservationReceipt
} from './reservationReceipts'

export type ReservationRecord = {
  id: string
  pickupCode: string
  status: 'reserved' | 'completed' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  totalPrice: number
  reservedAt: string
  paidAt: string | null
  paymentMethod: string | null
  listingId: string
  listingTitle: string
  pickupStart: string | null
  pickupEnd: string | null
  restaurantName: string
  restaurantCity: string
}

type ReservationRow = {
  id: string
  pickup_code: string
  status: 'reserved' | 'completed' | 'cancelled'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method: string | null
  paid_at: string | null
  total_price: number
  reserved_at: string
  listings:
    | {
        id: string
        title: string | null
        pickup_start: string | null
        pickup_end: string | null
        restaurants:
          | {
              name: string | null
              city: string | null
            }
          | Array<{
              name: string | null
              city: string | null
            }>
          | null
      }
    | Array<{
        id: string
        title: string | null
        pickup_start: string | null
        pickup_end: string | null
        restaurants:
          | {
              name: string | null
              city: string | null
            }
          | Array<{
              name: string | null
              city: string | null
            }>
          | null
      }>
    | null
}

function normalizeReservation(row: ReservationRow): ReservationRecord {
  const listing = Array.isArray(row.listings) ? row.listings[0] : row.listings
  const restaurant = Array.isArray(listing?.restaurants)
    ? listing?.restaurants[0]
    : listing?.restaurants

  return {
    id: row.id,
    pickupCode: row.pickup_code,
    status: row.status,
    paymentStatus: row.payment_status,
    totalPrice: Number(row.total_price),
    reservedAt: row.reserved_at,
    paidAt: row.paid_at,
    paymentMethod: row.payment_method,
    listingId: listing?.id ?? '',
    listingTitle: listing?.title ?? 'Oferta sin titulo',
    pickupStart: listing?.pickup_start ?? null,
    pickupEnd: listing?.pickup_end ?? null,
    restaurantName: restaurant?.name ?? 'Restaurante',
    restaurantCity: restaurant?.city ?? 'Ecuador'
  }
}

async function fetchReservationById(reservationId: string, userId: string) {
  const { data, error } = await supabase
    .from('reservations')
    .select(
      `
        id,
        pickup_code,
        status,
        payment_status,
        payment_method,
        paid_at,
        total_price,
        reserved_at,
        listings (
          id,
          title,
          pickup_start,
          pickup_end,
          restaurants (
            name,
            city
          )
        )
      `
    )
    .eq('id', reservationId)
    .eq('user_id', userId)
    .single()

  if (error) throw error

  return normalizeReservation(data as ReservationRow)
}

export async function fetchMyReservations() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Debes iniciar sesion.')
  }

  const { data, error } = await supabase
    .from('reservations')
    .select(
      `
        id,
        pickup_code,
        status,
        payment_status,
        payment_method,
        paid_at,
        total_price,
        reserved_at,
        listings (
          id,
          title,
          pickup_start,
          pickup_end,
          restaurants (
            name,
            city
          )
        )
      `
    )
    .eq('user_id', user.id)
    .order('reserved_at', { ascending: false })

  if (error) throw error

  const reservations = ((data as ReservationRow[]) ?? []).map(normalizeReservation)
  await setCachedReservationReceipts(user.id, reservations)

  return reservations
}

export async function fetchMerchantReservations() {
  const restaurantQuery = await supabase
    .from('reservations')
    .select(
      `
        id,
        pickup_code,
        status,
        payment_status,
        payment_method,
        paid_at,
        total_price,
        reserved_at,
        listings!inner (
          id,
          title,
          pickup_start,
          pickup_end,
          restaurants!inner (
            name,
            city
          )
        )
      `
    )
    .order('reserved_at', { ascending: false })

  if (restaurantQuery.error) throw restaurantQuery.error

  return ((restaurantQuery.data as ReservationRow[]) ?? []).map(normalizeReservation)
}

export async function reserveListing(listingId: string) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Debes iniciar sesion.')
  }

  const { data, error } = await supabase.rpc('reserve_listing', {
    target_listing_id: listingId
  })

  if (error) throw error

  if (data?.id) {
    const reservation = await fetchReservationById(data.id as string, user.id)
    await upsertCachedReservationReceipt(user.id, reservation)
  }

  return data as { id: string } | null
}

export async function cancelMyReservation(reservationId: string) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { error } = await supabase.rpc('cancel_reservation', {
    target_reservation_id: reservationId
  })

  if (error) throw error

  if (user) {
    await removeCachedReservationReceipt(user.id, reservationId)
  }
}

export async function redeemMerchantReservation(reservationId: string, pickupCode: string) {
  const { error } = await supabase.rpc('redeem_reservation', {
    target_reservation_id: reservationId,
    provided_pickup_code: pickupCode
  })

  if (error) throw error
}
