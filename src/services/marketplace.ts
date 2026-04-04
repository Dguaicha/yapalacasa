import { supabase } from './supabase'
import type { Offer, RegionKey, Restaurant, RestaurantCategory } from '../types/marketplace'

type ListingRow = {
  id: string
  title: string
  description: string | null
  original_price: number
  sale_price: number
  quantity_available: number
  pickup_start: string | null
  pickup_end: string | null
  image_url: string | null
  restaurants: Array<{
    id?: string | null
    name: string | null
    city: string | null
    address: string | null
    region: string | null
    description: string | null
    latitude: number | null
    longitude: number | null
    cover_image_url: string | null
    owner_id: string | null
    pickup_notes: string | null
  }> | null
}

function formatPickup(start: string | null, end: string | null) {
  if (!start || !end) return 'Horario por confirmar'
  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
}

function calculateDiscountLabel(originalPrice: number, salePrice: number) {
  const percentage = Math.round((1 - salePrice / originalPrice) * 100)
  return `${percentage}% menos`
}

function inferCategory(name: string, description: string, region: RegionKey): RestaurantCategory {
  const combined = `${name} ${description}`.toLowerCase()

  if (combined.includes('bakery') || combined.includes('pan') || combined.includes('bread')) {
    return 'Panaderia'
  }

  if (combined.includes('market') || combined.includes('super') || combined.includes('mercado') || combined.includes('grocery')) {
    return 'Mercado'
  }

  if (combined.includes('cafe') || combined.includes('coffee')) {
    return 'Cafe'
  }

  if (combined.includes('hueca') || combined.includes('esquina') || combined.includes('tradicional')) {
    return 'Huecas'
  }

  if (combined.includes('salad') || combined.includes('healthy') || combined.includes('veg')) {
    return 'Saludable'
  }

  if (combined.includes('burger') || combined.includes('pizza') || combined.includes('fast') || combined.includes('rapida')) {
    return 'Comida rapida'
  }

  if (region === 'Costa' || region === 'Sierra' || region === 'Oriente') {
    return 'Tipica'
  }

  return 'Comida rapida'
}

function buildTags(category: RestaurantCategory, region: RegionKey, offersCount: number) {
  return [category, region, offersCount > 1 ? 'Varias bolsas' : 'Última bolsa', offersCount > 2 ? 'Manana' : 'Hoy']
}

function estimateDistance(latitude: number, longitude: number) {
  const anchorLatitude = -0.1807
  const anchorLongitude = -78.4678
  const latitudeDistance = (latitude - anchorLatitude) * 111
  const longitudeDistance = (longitude - anchorLongitude) * 111

  return Number(Math.max(0.4, Math.sqrt(latitudeDistance ** 2 + longitudeDistance ** 2)).toFixed(1))
}

function inferOpenState(offers: Offer[]) {
  const pickup = offers[0]?.pickupWindow ?? 'Horario por confirmar'
  const match = pickup.match(/(\d{2}):(\d{2})/)

  if (!match) {
    return { isOpen: true, openLabel: 'Abierto', pickupSummary: `Recogida ${pickup}` }
  }

  const pickupHour = Number(match[1])
  const isOpen = pickupHour >= 10 && pickupHour <= 20

  return {
    isOpen,
    openLabel: isOpen ? 'Abierto' : 'Abre luego',
    pickupSummary: `Recogida ${pickup}`
  }
}

function estimateRating(offersCount: number, approximatePrice: number) {
  const baseline = 4.2 + Math.min(offersCount, 4) * 0.1 - Math.min(approximatePrice / 100, 0.2)
  return Number(Math.min(4.9, Math.max(4.1, baseline)).toFixed(1))
}

export async function fetchMarketplaceData() {
  const { data, error } = await supabase
    .from('listings')
    .select(
      `
        id,
        title,
        description,
        original_price,
        sale_price,
        quantity_available,
        pickup_start,
        pickup_end,
        image_url,
        restaurants (
          id,
          name,
          city,
          address,
          region,
          description,
          latitude,
          longitude,
          cover_image_url,
          owner_id,
          pickup_notes
        )
      `
    )
    .eq('is_active', true)
    .gt('quantity_available', 0)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  const listingRows = ((data as ListingRow[]) ?? []).filter(
    (item) => item.restaurants?.[0]?.name
  )

  const restaurantsMap = new Map<string, Restaurant>()

  listingRows.forEach((item) => {
    const restaurantInfo = item.restaurants?.[0]

    if (!restaurantInfo?.name || !restaurantInfo.city) return

    const offer: Offer = {
      id: item.id,
      title: item.title,
      description: item.description ?? 'Bolsa sorpresa preparada con excedentes del día.',
      originalPrice: Number(item.original_price),
      salePrice: Number(item.sale_price),
      quantityAvailable: item.quantity_available,
      pickupWindow: formatPickup(item.pickup_start, item.pickup_end),
      restaurantId: restaurantInfo.id ?? restaurantInfo.name,
      imageUrl: item.image_url,
      isActive: true
    }

    const existingRestaurant = restaurantsMap.get(offer.restaurantId)

    if (existingRestaurant) {
      existingRestaurant.offers.push(offer)
      return
    }

    restaurantsMap.set(offer.restaurantId, {
      id: offer.restaurantId,
      name: restaurantInfo.name,
      city: restaurantInfo.city,
      address: restaurantInfo.address ?? `${restaurantInfo.city}, Ecuador`,
      region: ((restaurantInfo.region as RegionKey | null) ?? 'Sierra') as RegionKey,
      description:
        restaurantInfo.description ??
        'Comercio aliado de Salvar con bolsas sorpresa disponibles para recoger hoy.',
      approximatePrice: offer.salePrice,
      discountLabel: calculateDiscountLabel(offer.originalPrice, offer.salePrice),
      latitude: Number(restaurantInfo.latitude ?? -1.8312),
      longitude: Number(restaurantInfo.longitude ?? -78.1834),
      coverImageUrl: restaurantInfo.cover_image_url,
      logoImageUrl: restaurantInfo.cover_image_url,
      ownerId: restaurantInfo.owner_id,
      pickupNotes: restaurantInfo.pickup_notes,
      category: inferCategory(
        restaurantInfo.name,
        restaurantInfo.description ?? item.description ?? '',
        ((restaurantInfo.region as RegionKey | null) ?? 'Sierra') as RegionKey
      ),
      tags: [],
      rating: 4.5,
      reviewCount: 0,
      distanceKm: 0,
      isOpen: true,
      openLabel: 'Abierto',
      pickupSummary: offer.pickupWindow,
      offers: [offer]
    })
  })

  return Array.from(restaurantsMap.values()).map((restaurant) => {
    const lowestOfferPrice = restaurant.offers.reduce(
      (lowestPrice, offer) => Math.min(lowestPrice, offer.salePrice),
      Infinity
    )
    const approximatePrice = Number.isFinite(lowestOfferPrice) ? lowestOfferPrice : restaurant.approximatePrice
    const category = inferCategory(restaurant.name, restaurant.description, restaurant.region)
    const { isOpen, openLabel, pickupSummary } = inferOpenState(restaurant.offers)

    return {
      ...restaurant,
      approximatePrice,
      category,
      tags: buildTags(category, restaurant.region, restaurant.offers.length),
      rating: estimateRating(restaurant.offers.length, approximatePrice),
      reviewCount: restaurant.offers.length * 37 + 18,
      distanceKm: estimateDistance(restaurant.latitude, restaurant.longitude),
      isOpen,
      openLabel,
      pickupSummary
    }
  })
}
