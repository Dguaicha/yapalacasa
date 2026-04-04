import { useCallback, useEffect, useState } from 'react'

import type { Restaurant } from '../types/marketplace'
import { fetchMyRestaurant } from '../services/business'

export function useBusiness() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const nextRestaurant = await fetchMyRestaurant()
      setRestaurant(nextRestaurant)
    } catch (err) {
      setRestaurant(null)
      setError(err instanceof Error ? err.message : 'No se pudo cargar tu restaurante.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { restaurant, loading, error, refresh }
}
