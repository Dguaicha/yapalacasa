import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'

import type { Offer, Restaurant } from '../types/marketplace'

const CART_STORAGE_KEY = '@salvar:cart:v1'

type CartItem = {
  offer: Offer
  restaurant: Pick<Restaurant, 'id' | 'name' | 'city'>
}

type CartContextValue = {
  items: CartItem[]
  addToCart: (offer: Offer, restaurant: Pick<Restaurant, 'id' | 'name' | 'city'>) => Promise<void>
  removeFromCart: (offerId: string) => Promise<void>
  clearCart: () => Promise<void>
  total: number
  isLoading: boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar carrito desde AsyncStorage al iniciar
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as CartItem[]
          // Validar que sea un array con la estructura correcta
          if (Array.isArray(parsed) && parsed.every((item) => item?.offer?.id)) {
            setItems(parsed)
          }
        }
      } catch (error) {
        console.warn('Error loading cart from storage:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [])

  // Guardar carrito en AsyncStorage cada vez que cambie
  useEffect(() => {
    if (!isLoading) {
      const saveCart = async () => {
        try {
          await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        } catch (error) {
          console.warn('Error saving cart to storage:', error)
        }
      }

      saveCart()
    }
  }, [items, isLoading])

  const value = useMemo<CartContextValue>(() => {
    const total = items.reduce((sum, item) => sum + item.offer.salePrice, 0)

    return {
      items,
      isLoading,
      addToCart: async (offer, restaurant) => {
        setItems((currentItems) => {
          if (currentItems.some((item) => item.offer.id === offer.id)) {
            // Ya está en el carrito, no hacer nada
            return currentItems
          }
          return [...currentItems, { offer, restaurant }]
        })
      },
      removeFromCart: async (offerId) => {
        setItems((currentItems) => currentItems.filter((item) => item.offer.id !== offerId))
      },
      clearCart: async () => {
        setItems([])
        await AsyncStorage.removeItem(CART_STORAGE_KEY)
      },
      total
    }
  }, [items, isLoading])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider.')
  }

  return context
}
