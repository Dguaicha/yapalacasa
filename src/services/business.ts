import type { Offer, RegionKey, Restaurant } from '../types/marketplace'
import { supabase } from './supabase'

type RestaurantRow = {
  id: string
  owner_id: string | null
  name: string | null
  city: string | null
  address: string | null
  region: string | null
  description: string | null
  latitude: number | null
  longitude: number | null
  cover_image_url: string | null
  pickup_notes: string | null
  listings:
    | Array<{
        id: string
        title: string
        description: string | null
        original_price: number
        sale_price: number
        quantity_available: number
        pickup_start: string | null
        pickup_end: string | null
        is_active: boolean
        image_url: string | null
      }>
    | null
}

type RestaurantFormInput = {
  address: string
  city: string
  description: string
  latitude: string
  longitude: string
  name: string
  pickupNotes: string
  region: RegionKey
}

function formatPickup(start: string | null, end: string | null) {
  if (!start || !end) return 'Horario por confirmar'
  return `${start.slice(0, 5)} - ${end.slice(0, 5)}`
}

function toRestaurantModel(row: RestaurantRow): Restaurant {
  const offers: Offer[] = (row.listings ?? []).map((listing) => ({
    id: listing.id,
    title: listing.title,
    description: listing.description ?? 'Oferta lista para rescate.',
    originalPrice: Number(listing.original_price),
    salePrice: Number(listing.sale_price),
    quantityAvailable: listing.quantity_available,
    pickupWindow: formatPickup(listing.pickup_start, listing.pickup_end),
    restaurantId: row.id,
    imageUrl: listing.image_url,
    isActive: listing.is_active
  }))

  const firstOffer = offers[0]

  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name ?? 'Mi restaurante',
    city: row.city ?? 'Quito',
    address: row.address ?? 'Direccion por confirmar',
    region: ((row.region as RegionKey | null) ?? 'Sierra') as RegionKey,
    description: row.description ?? 'Describe aqui tu propuesta de valor.',
    approximatePrice: firstOffer?.salePrice ?? 0,
    discountLabel:
      firstOffer && firstOffer.originalPrice > 0
        ? `${Math.round((1 - firstOffer.salePrice / firstOffer.originalPrice) * 100)}% menos`
        : 'Sin ofertas activas',
    latitude: Number(row.latitude ?? -0.1952),
    longitude: Number(row.longitude ?? -78.4905),
    coverImageUrl: row.cover_image_url,
    logoImageUrl: row.cover_image_url,
    pickupNotes: row.pickup_notes,
    category: 'Tipica',
    tags: ['Tipica', 'Perfil de negocio'],
    rating: 4.6,
    reviewCount: 84,
    distanceKm: 1.2,
    isOpen: true,
    openLabel: 'Abierto',
    pickupSummary: firstOffer ? `Recogida ${firstOffer.pickupWindow}` : 'Horario por confirmar',
    offers
  }
}

export async function fetchMyRestaurant() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Debes iniciar sesion.')
  }

  const { data, error } = await supabase
    .from('restaurants')
    .select(
      `
        id,
        owner_id,
        name,
        city,
        address,
        region,
        description,
        latitude,
        longitude,
        cover_image_url,
        pickup_notes,
        listings (
          id,
          title,
          description,
          original_price,
          sale_price,
          quantity_available,
          pickup_start,
          pickup_end,
          is_active,
          image_url
        )
      `
    )
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  return toRestaurantModel(data as RestaurantRow)
}

export async function saveMyRestaurant(input: RestaurantFormInput) {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Debes iniciar sesion.')
  }

  const payload = {
    owner_id: user.id,
    name: input.name.trim(),
    city: input.city.trim(),
    address: input.address.trim(),
    region: input.region,
    description: input.description.trim(),
    latitude: Number(input.latitude),
    longitude: Number(input.longitude),
    pickup_notes: input.pickupNotes.trim()
  }

  const { data, error } = await supabase
    .from('restaurants')
    .upsert(payload, {
      onConflict: 'owner_id'
    })
    .select(
      `
        id,
        owner_id,
        name,
        city,
        address,
        region,
        description,
        latitude,
        longitude,
        cover_image_url,
        pickup_notes,
        listings (
          id,
          title,
          description,
          original_price,
          sale_price,
          quantity_available,
          pickup_start,
          pickup_end,
          is_active,
          image_url
        )
      `
    )
    .single()

  if (error) throw error

  return toRestaurantModel(data as RestaurantRow)
}

type OfferInput = {
  description: string
  imageUrl?: string | null
  originalPrice: string
  pickupEnd: string
  pickupStart: string
  quantityAvailable: string
  salePrice: string
  title: string
}

function validateOfferInput(input: OfferInput) {
  if (!input.title.trim()) {
    throw new Error('Ingresa un titulo para la oferta.')
  }

  if (!input.description.trim()) {
    throw new Error('Ingresa una descripcion para la oferta.')
  }

  const originalPrice = Number(input.originalPrice)
  const salePrice = Number(input.salePrice)
  const quantityAvailable = Number(input.quantityAvailable)

  if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
    throw new Error('El precio original debe ser mayor a cero.')
  }

  if (!Number.isFinite(salePrice) || salePrice <= 0) {
    throw new Error('El precio Salvar debe ser mayor a cero.')
  }

  if (salePrice > originalPrice) {
    throw new Error('El precio Salvar no puede ser mayor que el precio original.')
  }

  if (!Number.isInteger(quantityAvailable) || quantityAvailable < 1) {
    throw new Error('La cantidad disponible debe ser un numero entero mayor a cero.')
  }

  if (!/^\d{2}:\d{2}$/.test(input.pickupStart) || !/^\d{2}:\d{2}$/.test(input.pickupEnd)) {
    throw new Error('Usa formato de hora HH:MM.')
  }
}

export async function createOfferForMyRestaurant(input: OfferInput) {
  validateOfferInput(input)

  const restaurant = await fetchMyRestaurant()

  if (!restaurant) {
    throw new Error('Primero guarda tu restaurante.')
  }

  const { error } = await supabase.from('listings').insert({
    restaurant_id: restaurant.id,
    title: input.title.trim(),
    description: input.description.trim(),
    original_price: Number(input.originalPrice),
    sale_price: Number(input.salePrice),
    quantity_available: Number(input.quantityAvailable),
    pickup_start: input.pickupStart,
    pickup_end: input.pickupEnd,
    image_url: input.imageUrl ?? null,
    is_active: true
  })

  if (error) throw error
}

export async function updateOfferForMyRestaurant(offerId: string, input: OfferInput) {
  validateOfferInput(input)

  const { error } = await supabase
    .from('listings')
    .update({
      title: input.title.trim(),
      description: input.description.trim(),
      original_price: Number(input.originalPrice),
      sale_price: Number(input.salePrice),
      quantity_available: Number(input.quantityAvailable),
      pickup_start: input.pickupStart,
      pickup_end: input.pickupEnd,
      image_url: input.imageUrl ?? null
    })
    .eq('id', offerId)

  if (error) throw error
}

export async function toggleOfferStatus(offerId: string, isActive: boolean) {
  const { error } = await supabase
    .from('listings')
    .update({ is_active: !isActive })
    .eq('id', offerId)

  if (error) throw error
}

export async function deleteOfferForMyRestaurant(offerId: string) {
  const { error } = await supabase.from('listings').delete().eq('id', offerId)

  if (error) throw error
}

async function fileToArrayBuffer(uri: string) {
  const response = await fetch(uri)
  return await response.arrayBuffer()
}

export async function uploadRestaurantCover(uri: string) {
  const restaurant = await fetchMyRestaurant()

  if (!restaurant?.ownerId) {
    throw new Error('Primero crea tu restaurante.')
  }

  const fileBuffer = await fileToArrayBuffer(uri)
  const filePath = `${restaurant.ownerId}/cover-${Date.now()}.jpg`

  const { error: uploadError } = await supabase.storage
    .from('restaurant-media')
    .upload(filePath, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    })

  if (uploadError) throw uploadError

  const {
    data: { publicUrl }
  } = supabase.storage.from('restaurant-media').getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('restaurants')
    .update({ cover_image_url: publicUrl })
    .eq('id', restaurant.id)

  if (updateError) throw updateError

  return publicUrl
}
