import { useCallback, useEffect, useState } from 'react'

import { fetchMarketplaceData } from '../services/marketplace'
import type { Restaurant } from '../types/marketplace'

export function useMarketplace() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const nextRestaurants = await fetchMarketplaceData()
      setRestaurants(nextRestaurants)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el marketplace.')
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { restaurants, loading, error, refresh }
}
