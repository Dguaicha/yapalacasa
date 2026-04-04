import type { ImageSourcePropType } from 'react-native'

import type { Restaurant, RestaurantCategory, RegionKey } from '../types/marketplace'

export const restaurantCategories: Array<RestaurantCategory | 'All'> = [
  'All',
  'Comida rapida',
  'Panaderia',
  'Tipica',
  'Huecas',
  'Cafe',
  'Mercado',
  'Saludable',
  'Supermercado'
]

export const foodCategoryData: Array<{ id: string; label: string; image: ImageSourcePropType }> = [
  { id: 'Tipica', label: 'Típica', image: require('../../assets/categories/tipica.png') },
  { id: 'Huecas', label: 'Huecas', image: require('../../assets/categories/huecas.png') },
  { id: 'Panaderia', label: 'Panadería', image: { uri: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=200&h=200' } },
  { id: 'Comida rapida', label: 'Rápida', image: { uri: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=200&h=200' } },
  { id: 'Cafe', label: 'Café', image: { uri: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&h=200' } },
  { id: 'Mercado', label: 'Mercado', image: { uri: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&h=200' } }
]

export const priceTiers = [
  { label: '$', value: 1, maxPrice: 5 },
  { label: '$$', value: 2, maxPrice: 10 },
  { label: '$$$', value: 3, maxPrice: 999 }
] as const

export type MarketplaceFilters = {
  maxDistanceKm: number
  onlyOpen: boolean
  category: RestaurantCategory | 'All'
  pickupDay: 'all' | 'today' | 'tomorrow'
  minRating?: number
  priceTier?: number // 1, 2, or 3
}

// Distance Calculation (Haversine Formula)
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export function filterRestaurants(restaurants: Restaurant[], filters: MarketplaceFilters, userLocation?: { latitude: number, longitude: number }) {
  return restaurants
    .map(restaurant => {
      // If user location is provided, recalculate distance
      if (userLocation) {
        const distance = calculateDistance(
          userLocation.latitude, 
          userLocation.longitude, 
          restaurant.latitude, 
          restaurant.longitude
        );
        return { ...restaurant, distanceKm: distance };
      }
      return restaurant;
    })
    .filter((restaurant) => {
      const matchesDistance = restaurant.distanceKm <= (filters.maxDistanceKm || 99)
      const matchesOpen = !filters.onlyOpen || restaurant.isOpen
      const matchesCategory = filters.category === 'All' || restaurant.category === filters.category
      const matchesRating = !filters.minRating || restaurant.rating >= filters.minRating
      
      let matchesPrice = true
      if (filters.priceTier) {
        if (filters.priceTier === 1) matchesPrice = restaurant.approximatePrice <= 5
        else if (filters.priceTier === 2) matchesPrice = restaurant.approximatePrice > 5 && restaurant.approximatePrice <= 10
        else if (filters.priceTier === 3) matchesPrice = restaurant.approximatePrice > 10
      }
      
      const hasTomorrowTag = restaurant.tags.includes('Manana')
      const matchesPickupDay =
        filters.pickupDay === 'all' ||
        (filters.pickupDay === 'today' && !hasTomorrowTag) ||
        (filters.pickupDay === 'tomorrow' && hasTomorrowTag)

      return matchesDistance && matchesOpen && matchesCategory && matchesPickupDay && matchesRating && matchesPrice
    })
    .sort((a, b) => a.distanceKm - b.distanceKm); // Proximity sorting by default
}

export function getBestOffer(restaurant: Restaurant) {
  if (!restaurant.offers || restaurant.offers.length === 0) return null
  return restaurant.offers.reduce((bestOffer, offer) => {
    if (!bestOffer || offer.salePrice < bestOffer.salePrice) {
      return offer
    }
    return bestOffer
  }, restaurant.offers[0])
}
