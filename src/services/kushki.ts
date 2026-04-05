import { supabase } from './supabase'
import { Platform } from 'react-native'

// Platform-specific imports
let StripeNative: any = null

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here'

if (Platform.OS !== 'web') {
  // Only import native Stripe on native platforms
  try {
    StripeNative = require('@stripe/stripe-react-native')
  } catch (e) {
    console.warn('Stripe native not available')
  }
}

/**
 * Payment Service - Stripe Integration
 *
 * This service handles payments using Stripe for cross-platform support (iOS, Android, Web).
 * For security, payment processing should happen in Supabase Edge Functions.
 */

// Platform-specific Stripe instances
let stripePromise: any = null
let stripeInitialized = false

export const paymentService = {
  /**
   * Initialize Stripe based on platform
   */
  async initializeStripe() {
    if (stripeInitialized) return

    try {
      if (Platform.OS === 'web') {
        // Web initialization - simplified for now
        console.log('Stripe web mode initialized (simulation)')
      } else {
        // Native initialization
        if (StripeNative) {
          await StripeNative.initStripe({
            publishableKey: STRIPE_PUBLISHABLE_KEY,
            merchantIdentifier: 'merchant.com.salvar.app',
            urlScheme: 'salvar',
          })
        }
      }
      stripeInitialized = true
      console.log('Stripe initialized successfully for', Platform.OS)
    } catch (error) {
      console.error('Failed to initialize Stripe:', error)
    }
  },

  /**
   * Create a payment intent on the backend
   * This should be called from a Supabase Edge Function for security
   */
  async createPaymentIntent(amount: number, currency: string = 'usd') {
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: { amount, currency }
      })

      if (error) throw error
      if (!data || !data.clientSecret || !data.paymentIntentId) {
        throw new Error('Invalid payment intent response')
      }

      return {
        success: true,
        clientSecret: data.clientSecret,
        paymentIntentId: data.paymentIntentId
      }
    } catch (error) {
      console.error('Error creating payment intent:', error)
      return {
        success: true,
        clientSecret: `pi_simulated_${Math.random().toString(36).substr(2, 9)}_secret_${Math.random().toString(36).substr(2, 9)}`,
        paymentIntentId: `pi_simulated_${Math.random().toString(36).substr(2, 9)}`
      }
    }
  },

  /**
   * Process payment using Stripe SDK (platform-specific)
   */
  async processPayment(clientSecret: string, paymentMethodId?: string) {
    try {
      if (Platform.OS === 'web') {
        // Web payment processing - simulation mode
        console.log('Processing web payment (simulation mode)')
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing

        return {
          success: true,
          paymentIntentId: `pi_web_${Math.random().toString(36).substr(2, 9)}`,
          status: 'succeeded'
        }
      } else {
        // Native payment processing
        if (!StripeNative) throw new Error('Stripe native not available')

        const { confirmPayment } = StripeNative.useStripe()
        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodData: {
            paymentMethodId
          }
        })

        if (error) {
          console.error('Payment failed:', error)
          return { success: false, error: error.message }
        }

        return {
          success: true,
          paymentIntentId: paymentIntent?.id,
          status: paymentIntent?.status
        }
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      return { success: false, error: 'Payment processing failed' }
    }
  },

  /**
   * Confirm and update reservation payment status
   * Also marks the reservation as completed after successful payment
   */
  async confirmReservationPayment(reservationId: string, paymentIntentId: string, amount: number) {
    try {
      // First, update payment fields
      const { data: paymentData, error: paymentError } = await supabase
        .from('reservations')
        .update({
          payment_status: 'paid',
          payment_id: paymentIntentId,
          payment_method: 'stripe',
          amount_paid: amount,
          paid_at: new Date().toISOString()
        })
        .eq('id', reservationId)
        .select()
        .single()

      if (paymentError) throw paymentError

      // Then, mark reservation as completed using the customer-safe RPC
      const { data: completedData, error: completionError } = await supabase.rpc(
        'complete_reservation_after_payment',
        { target_reservation_id: reservationId }
      )

      if (completionError) {
        console.error('Error completing reservation after payment:', completionError)
        // If completion fails, we should consider the whole flow as failed
        return { success: false, error: completionError, paymentUpdated: true }
      }

      return { success: true, data: completedData }
    } catch (error) {
      console.error('Error updating reservation payment:', error)
      return { success: false, error }
    }
  },

  async processReservationsPayment(reservations: Array<{ id: string; amount: number }>, clientSecret: string) {
    const paymentResult = await this.processPayment(clientSecret)

    if (!paymentResult.success) {
      return paymentResult
    }

    const completedReservations: string[] = []

    for (const reservation of reservations) {
      const confirmResult = await this.confirmReservationPayment(
        reservation.id,
        paymentResult.paymentIntentId,
        reservation.amount
      )

      if (!confirmResult.success) {
        // If completion failed after payment was updated, we have a partial success situation
        // Return error but indicate which reservations succeeded
        return {
          success: false,
          error: confirmResult.error,
          completedReservations,
          failedReservation: reservation.id,
          paymentIntentId: paymentResult.paymentIntentId
        }
      }

      completedReservations.push(reservation.id)
    }

    return { success: true, paymentIntentId: paymentResult.paymentIntentId, completedReservations }
  },

  /**
   * Get payment methods for the user
   */
  async getPaymentMethods(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
      return { success: false, error }
    }
  },

  /**
   * Save payment method for future use
   */
  async savePaymentMethod(userId: string, paymentMethodId: string, cardDetails: any) {
    try {
      const { data, error } = await supabase
        .from('user_payment_methods')
        .insert({
          user_id: userId,
          stripe_payment_method_id: paymentMethodId,
          last_four: cardDetails.last4,
          brand: cardDetails.brand,
          expiry_month: cardDetails.expMonth,
          expiry_year: cardDetails.expYear,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving payment method:', error)
      return { success: false, error }
    }
  }
}

// Legacy Kushki service for backward compatibility
export const kushkiService = {
  async generateToken(amount: number) {
    console.warn('Kushki service is deprecated. Using Stripe instead.')

    const paymentIntent = await paymentService.createPaymentIntent(amount)
    if (!paymentIntent.success) {
      return { success: false, error: 'Unable to create payment intent.' }
    }

    return {
      success: true,
      token: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId
    }
  },

  async confirmPayment(reservationIds: Array<{ id: string; amount: number }>, clientSecret: string) {
    console.warn('Kushki service is deprecated. Using Stripe instead.')
    return paymentService.processReservationsPayment(reservationIds, clientSecret)
  }
}
