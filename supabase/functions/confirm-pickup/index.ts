import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization') ?? '' },
      },
    })

    const adminClient = createClient(supabaseUrl, supabaseServiceRoleKey)

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser()

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { reservationId, pickupCode } = await req.json()

    if (!reservationId || !pickupCode) {
      throw new Error('reservationId and pickupCode are required')
    }

    const { error: redeemError } = await authClient.rpc('redeem_reservation', {
      target_reservation_id: reservationId,
      provided_pickup_code: pickupCode,
    })

    if (redeemError) {
      throw redeemError
    }

    const { data: reservation, error: reservationError } = await adminClient
      .from('reservations')
      .select(
        `
          id,
          user_id,
          total_price,
          paid_at,
          pickup_code,
          profiles!reservations_user_id_fkey (
            name,
            email,
            phone
          ),
          listings!reservations_listing_id_fkey (
            title,
            restaurants!listings_restaurant_id_fkey (
              name,
              owner_id
            )
          )
        `
      )
      .eq('id', reservationId)
      .single()

    if (reservationError || !reservation) {
      throw reservationError ?? new Error('Reservation not found after pickup confirmation')
    }

    const listing = Array.isArray(reservation.listings) ? reservation.listings[0] : reservation.listings
    const restaurant = Array.isArray(listing?.restaurants) ? listing?.restaurants[0] : listing?.restaurants
    const profile = Array.isArray(reservation.profiles) ? reservation.profiles[0] : reservation.profiles

    if (restaurant?.owner_id !== user.id) {
      throw new Error('You are not allowed to confirm pickup for this reservation')
    }

    const receiptPayload = {
      customerName: profile?.name ?? 'Cliente Salvar',
      customerEmail: profile?.email ?? null,
      customerPhone: profile?.phone ?? null,
      listingTitle: listing?.title ?? 'Bolsa sorpresa',
      restaurantName: restaurant?.name ?? 'Negocio aliado',
      totalPrice: Number(reservation.total_price ?? 0),
      paidAt: reservation.paid_at ?? new Date().toISOString(),
      pickupCode: reservation.pickup_code,
    }

    const { data: receiptRow, error: receiptError } = await adminClient
      .from('pickup_receipts')
      .insert({
        reservation_id: reservation.id,
        customer_user_id: reservation.user_id,
        merchant_user_id: user.id,
        customer_name: receiptPayload.customerName,
        customer_email: receiptPayload.customerEmail,
        customer_phone: receiptPayload.customerPhone,
        listing_title: receiptPayload.listingTitle,
        restaurant_name: receiptPayload.restaurantName,
        amount_paid: receiptPayload.totalPrice,
        delivered_via: receiptPayload.customerEmail ? 'email' : 'manual',
        delivery_status: receiptPayload.customerEmail ? 'pending' : 'manual_required',
      })
      .select('id')
      .single()

    if (receiptError) {
      throw receiptError
    }

    let receiptSent = false

    if (receiptPayload.customerEmail && Deno.env.get('RESEND_API_KEY')) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: Deno.env.get('PICKUP_RECEIPT_FROM_EMAIL') ?? 'Salvar <recibos@salvar.app>',
          to: [receiptPayload.customerEmail],
          subject: 'Recibo digital de retiro - Salvar',
          html: `
            <div style="font-family: Arial, sans-serif; color: #18212F;">
              <h2 style="color:#1E3A8A;">Retiro confirmado</h2>
              <p>Hola ${receiptPayload.customerName},</p>
              <p>Tu retiro fue confirmado correctamente.</p>
              <p><strong>Negocio:</strong> ${receiptPayload.restaurantName}</p>
              <p><strong>Bolsa:</strong> ${receiptPayload.listingTitle}</p>
              <p><strong>Total pagado:</strong> $${receiptPayload.totalPrice.toFixed(2)}</p>
              <p><strong>Codigo:</strong> ${receiptPayload.pickupCode}</p>
              <p>Gracias por rescatar comida con Salvar.</p>
            </div>
          `,
        }),
      })

      if (!resendResponse.ok) {
        const resendError = await resendResponse.text()
        await adminClient
          .from('pickup_receipts')
          .update({ delivery_status: `email_failed:${resendError.slice(0, 120)}` })
          .eq('id', receiptRow.id)
      } else {
        receiptSent = true
        await adminClient
          .from('pickup_receipts')
          .update({ delivery_status: 'sent', sent_at: new Date().toISOString() })
          .eq('id', receiptRow.id)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        receiptSent,
        receiptId: receiptRow.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
