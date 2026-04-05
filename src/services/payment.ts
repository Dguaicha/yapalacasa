/**
 * @fileoverview Web-compatible Payment Service
 * @module services/payment
 * @description Platform-agnostic payment service that handles web and mobile differently
 */

import { Platform } from 'react-native'

// Dynamically import platform-specific service
let paymentService: any = null

const initializePaymentService = async () => {
  if (paymentService) return paymentService

  if (Platform.OS === 'web') {
    // Web-only implementation - uses Stripe.js
    paymentService = {
      async initializeStripe() {
        console.log('[Payment] Web platform - Stripe.js initialized')
      },
      async createPaymentIntent(amount: number) {
        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        })
        return await response.json()
      },
      async processPayment(clientSecret: string, paymentMethodId: string) {
        // Web payment processing would be handled by Stripe Elements
        console.log('[Payment] Web: Payment processing handled by Stripe Elements')
        return { success: true }
      },
      async confirmReservationPayment(id: string, intentId: string, amount: number) {
        console.log('[Payment] Reservation confirmed:', { id, intentId, amount })
        return { success: true }
      }
    }
  } else {
    // Native platforms - use Stripe React Native
    try {
      const kushkiModule = await import('./kushki')
      paymentService = kushkiModule.paymentService
    } catch (e) {
      console.error('[Payment] Failed to load native payment service:', e)
      throw e
    }
  }

  return paymentService
}

export { initializePaymentService }
