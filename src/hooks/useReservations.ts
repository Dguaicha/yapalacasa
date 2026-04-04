import { useCallback, useEffect, useState } from 'react'

import {
  fetchMerchantReservations,
  fetchMyReservations,
  type ReservationRecord
} from '../services/reservations'

export function useReservations(mode: 'customer' | 'merchant') {
  const [reservations, setReservations] = useState<ReservationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data =
        mode === 'merchant' ? await fetchMerchantReservations() : await fetchMyReservations()

      setReservations(data)
    } catch (err) {
      setReservations([])
      setError(err instanceof Error ? err.message : 'No se pudo cargar las reservas.')
    } finally {
      setLoading(false)
    }
  }, [mode])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { reservations, loading, error, refresh }
}
