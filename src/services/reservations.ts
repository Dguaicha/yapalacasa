import { supabase } from './supabase'

export type ReservationRecord = {
  id: string
  pickupCode: string
  status: 'reserved' | 'completed' | 'cancelled'
  totalPrice: number
  reservedAt: string
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
    totalPrice: Number(row.total_price),
    reservedAt: row.reserved_at,
    listingId: listing?.id ?? '',
    listingTitle: listing?.title ?? 'Oferta sin titulo',
    pickupStart: listing?.pickup_start ?? null,
    pickupEnd: listing?.pickup_end ?? null,
    restaurantName: restaurant?.name ?? 'Restaurante',
    restaurantCity: restaurant?.city ?? 'Ecuador'
  }
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

  return ((data as ReservationRow[]) ?? []).map(normalizeReservation)
}

export async function fetchMerchantReservations() {
  const restaurantQuery = await supabase
    .from('reservations')
    .select(
      `
        id,
        pickup_code,
        status,
        total_price,
        reserved_at,
        listings!inner (
          id,
          title,
          pickup_start,
          pickup_end,
          restaurants!inner (
            name,
            city,
            owner_id
          )
        )
      `
    )
    .order('reserved_at', { ascending: false })

  if (restaurantQuery.error) throw restaurantQuery.error

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Debes iniciar sesion.')
  }

  const filteredRows = ((restaurantQuery.data as any[]) ?? []).filter((row) => {
    const listing = Array.isArray(row.listings) ? row.listings[0] : row.listings
    const restaurant = Array.isArray(listing?.restaurants)
      ? listing?.restaurants[0]
      : listing?.restaurants

    return restaurant?.owner_id === user.id
  })

  return filteredRows.map((row) => normalizeReservation(row as ReservationRow))
}

export async function cancelMyReservation(reservationId: string) {
  const { error } = await supabase.rpc('cancel_reservation', {
    target_reservation_id: reservationId
  })

  if (error) throw error
}

export async function completeMerchantReservation(reservationId: string) {
  const { error } = await supabase.rpc('complete_reservation', {
    target_reservation_id: reservationId
  })

  if (error) throw error
}
