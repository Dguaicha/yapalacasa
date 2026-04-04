import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { logger } from '../services/logger'

const STORAGE_KEY = '@salvar/user_anchor_v1'

export type UserAnchor = {
  latitude: number
  longitude: number
  label: string
}

type LocationContextValue = {
  anchor: UserAnchor | null
  ready: boolean
  setAnchor: (next: UserAnchor) => Promise<void>
  refreshFromGps: () => Promise<{ ok: boolean; message?: string }>
  geocodeAddress: (address: string) => Promise<{ ok: boolean; message?: string }>
}

const LocationContext = createContext<LocationContextValue | null>(null)

async function reverseLabel(latitude: number, longitude: number): Promise<string> {
  try {
    const places = await Location.reverseGeocodeAsync({ latitude, longitude })
    const p = places[0]
    if (!p) return 'Mi ubicación'
    const parts = [p.street, p.district, p.city, p.region].filter(Boolean)
    return parts.length ? parts.slice(0, 3).join(', ') : 'Mi ubicación'
  } catch {
    return 'Mi ubicación'
  }
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [anchor, setAnchorState] = useState<UserAnchor | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as UserAnchor
          if (
            typeof parsed.latitude === 'number' &&
            typeof parsed.longitude === 'number' &&
            typeof parsed.label === 'string'
          ) {
            if (!cancelled) setAnchorState(parsed)
            if (!cancelled) setReady(true)
            return
          }
        }

        const perm = await Location.requestForegroundPermissionsAsync()
        if (perm.status !== 'granted' || cancelled) {
          if (!cancelled) setReady(true)
          return
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        })
        if (cancelled) return

        const latitude = pos.coords.latitude
        const longitude = pos.coords.longitude
        const label = await reverseLabel(latitude, longitude)
        const next: UserAnchor = { latitude, longitude, label }
        setAnchorState(next)
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (error) {
        logger.warn('Failed to initialize location', error)
      } finally {
        if (!cancelled) setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  const setAnchor = useCallback(async (next: UserAnchor) => {
    setAnchorState(next)
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const refreshFromGps = useCallback(async () => {
    try {
      const perm = await Location.requestForegroundPermissionsAsync()
      if (perm.status !== 'granted') {
        return { ok: false, message: 'Activa el permiso de ubicación en ajustes del teléfono.' }
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      })
      const latitude = pos.coords.latitude
      const longitude = pos.coords.longitude
      const label = await reverseLabel(latitude, longitude)
      await setAnchor({ latitude, longitude, label })
      return { ok: true }
    } catch (error) {
      logger.error('Failed to refresh GPS location', error)
      return { ok: false, message: 'No pudimos obtener tu ubicación. Intenta de nuevo.' }
    }
  }, [setAnchor])

  const geocodeAddress = useCallback(
    async (address: string) => {
      const trimmed = address.trim()
      if (!trimmed) {
        return { ok: false, message: 'Escribe una dirección o barrio en Ecuador.' }
      }
      try {
        const results = await Location.geocodeAsync(`${trimmed}, Ecuador`)
        const first = results[0]
        if (!first) {
          return { ok: false, message: 'No encontramos esa dirección. Prueba con ciudad y barrio.' }
        }
        const latitude = first.latitude
        const longitude = first.longitude
        const label = trimmed.length > 42 ? `${trimmed.slice(0, 39)}…` : trimmed
        await setAnchor({ latitude, longitude, label })
        return { ok: true }
      } catch {
        return { ok: false, message: 'No pudimos ubicar esa dirección.' }
      }
    },
    [setAnchor]
  )

  const value = useMemo<LocationContextValue>(
    () => ({
      anchor,
      ready,
      setAnchor,
      refreshFromGps,
      geocodeAddress
    }),
    [anchor, ready, setAnchor, refreshFromGps, geocodeAddress]
  )

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useUserLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) {
    throw new Error('useUserLocation debe usarse dentro de LocationProvider.')
  }
  return ctx
}
