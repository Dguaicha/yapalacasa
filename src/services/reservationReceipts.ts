import AsyncStorage from '@react-native-async-storage/async-storage'

import type { ReservationRecord } from './reservations'

const CACHE_PREFIX = '@salvar:reservation-receipts:v1:'

function getCacheKey(userId: string) {
  return `${CACHE_PREFIX}${userId}`
}

export async function getCachedReservationReceipts(userId: string) {
  try {
    const raw = await AsyncStorage.getItem(getCacheKey(userId))
    if (!raw) return []

    const parsed = JSON.parse(raw) as ReservationRecord[]
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item) => item?.id && item?.pickupCode)
  } catch {
    return []
  }
}

export async function setCachedReservationReceipts(userId: string, reservations: ReservationRecord[]) {
  const minimalReceipts = reservations.map((reservation) => ({
    ...reservation
  }))

  await AsyncStorage.setItem(getCacheKey(userId), JSON.stringify(minimalReceipts))
}

export async function upsertCachedReservationReceipt(userId: string, reservation: ReservationRecord) {
  const current = await getCachedReservationReceipts(userId)
  const next = [reservation, ...current.filter((item) => item.id !== reservation.id)]

  await setCachedReservationReceipts(userId, next)
}

export async function removeCachedReservationReceipt(userId: string, reservationId: string) {
  const current = await getCachedReservationReceipts(userId)
  await setCachedReservationReceipts(
    userId,
    current.filter((item) => item.id !== reservationId)
  )
}
