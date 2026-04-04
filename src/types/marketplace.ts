export type RegionKey = 'Costa' | 'Sierra' | 'Oriente' | 'Galapagos'

export type RestaurantCategory =
  | 'Comida rapida'
  | 'Panaderia'
  | 'Tipica'
  | 'Supermercado'
  | 'Cafe'
  | 'Saludable'
  | 'Huecas'
  | 'Mercado'

export type PriceTier = '$' | '$$' | '$$$'

export type Offer = {
  id: string
  title: string
  description: string
  originalPrice: number
  salePrice: number
  quantityAvailable: number
  pickupWindow: string
  restaurantId: string
  imageUrl?: string | null
  isActive?: boolean
}

export type Restaurant = {
  id: string
  name: string
  city: string
  address: string
  region: RegionKey
  description: string
  approximatePrice: number
  discountLabel: string
  latitude: number
  longitude: number
  coverImageUrl?: string | null
  logoImageUrl?: string | null
  ownerId?: string | null
  pickupNotes?: string | null
  category: RestaurantCategory
  tags: string[]
  rating: number
  reviewCount: number
  distanceKm: number
  isOpen: boolean
  openLabel: string
  pickupSummary: string
  offers: Offer[]
}
