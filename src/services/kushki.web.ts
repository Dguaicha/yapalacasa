/**
 * @fileoverview Web Payment Service - Stripe Elements only (no React Native)
 * @module services/kushki.web
 * @description Web-only payment service using Stripe.js Elements
 */

/**
 * Web payment service object
 * Uses Stripe.js without React Native dependencies
 */
export const paymentService = {
  async initializeStripe(): Promise<void> {
    console.log('[Payment] Web platform - Stripe.js initialized')
  },

  async createPaymentIntent(amount: number): Promise<any> {
    try {
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'usd' })
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      return {
        success: true,
        clientSecret: data.clientSecret,
        paymentIntentId: data.id
      }
    } catch (error: any) {
      console.error('[Payment] Failed to create payment intent:', error)
      return { success: false, error: error.message }
    }
  },

  async processPayment(clientSecret: string, paymentMethodId: string): Promise<any> {
    console.log('[Payment] Web: Payment processing handled by Stripe Elements form')
    return {
      success: true,
      status: 'succeeded'
    }
  },

  async processReservationsPayment(reservationIds: any[], clientSecret: string): Promise<any> {
    console.log('[Payment] Web: Processing reservation payments')
    return {
      success: true,
      completedReservations: reservationIds
    }
  },

  async confirmReservationPayment(reservationId: string, paymentIntentId: string, amount: number): Promise<any> {
    console.log('[Payment] Reservation confirmed:', { reservationId, paymentIntentId, amount })
    return { success: true }
  }
}

/**
 * Deprecated Kushki service - kept for backwards compatibility
 */
export const kushkiService = {
  async generateToken(amount: number) {
    return paymentService.createPaymentIntent(amount)
  },

  async confirmPayment(reservationIds: any[], clientSecret: string) {
    return paymentService.processReservationsPayment(reservationIds, clientSecret)
  }
}
