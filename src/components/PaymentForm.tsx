import React, { useState, useEffect } from 'react'
import { View, Alert, Platform } from 'react-native'
import { PrimaryButton } from './ui/PrimaryButton'
import { TextInputField } from './ui/TextInputField'
import { paymentService } from '../services/kushki'
import { cancelMyReservation } from '../services/reservations'
import { colors } from '../theme/colors'
import { spacing } from '../theme/spacing'

// Conditional imports for platform-specific components
let CardField: any = null
let useStripe: any = null

if (Platform.OS !== 'web') {
  try {
    const stripeNative = require('@stripe/stripe-react-native')
    CardField = stripeNative.CardField
    useStripe = stripeNative.useStripe
  } catch (e) {
    console.warn('Stripe native components not available')
  }
}

interface PaymentFormProps {
  amount: number
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
  reservationId?: string
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  reservationId
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState<{ complete?: boolean } | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  // Native Stripe hook (only for native platforms)
  const stripeHook = Platform.OS !== 'web' && useStripe ? useStripe() : null
  const { createPaymentMethod } = stripeHook || {}

  const isFormValid = Platform.OS === 'web'
    ? cardNumber.length >= 13 && expiryDate.length === 5 && cvv.length >= 3 && cardholderName.length > 0
    : cardDetails?.complete

  const handlePayment = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Please complete all payment details')
      return
    }

    setIsProcessing(true)

    try {
      let paymentMethodId: string

      if (Platform.OS === 'web') {
        // For web, we'll simulate payment method creation
        // In production, you'd integrate with Stripe Elements properly
        console.log('Web payment - using test payment method')
        paymentMethodId = 'pm_test_card' // Test payment method
      } else {
        // Native payment method creation
        const { paymentMethod, error: paymentMethodError } = await createPaymentMethod({
          paymentMethodType: 'Card',
          paymentMethodData: {
            billingDetails: {
              name: cardholderName
            }
          }
        })

        if (paymentMethodError) {
          throw new Error(paymentMethodError.message)
        }
        paymentMethodId = paymentMethod.id
      }

      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(amount)

      // Process payment
      const result = await paymentService.processPayment(
        paymentIntent.clientSecret,
        paymentMethodId
      )

      if (result.success) {
        // Update reservation if provided
        if (reservationId) {
          const confirmResult = await paymentService.confirmReservationPayment(
            reservationId,
            result.paymentIntentId,
            amount
          )

          if (!confirmResult.success) {
            // Payment succeeded but reservation completion failed
            // This is a critical error - try to cancel/rollback if possible
            if (confirmResult.paymentUpdated) {
              console.error('Payment succeeded but reservation completion failed')
              // Attempt to cancel the reservation since completion failed
              try {
                await cancelMyReservation(reservationId)
              } catch (cancelError) {
                console.error('Failed to rollback reservation after completion failure:', cancelError)
              }
            }
            throw new Error(
              confirmResult.error instanceof Error
                ? confirmResult.error.message
                : 'Error al confirmar la reserva después del pago'
            )
          }
        }

        onPaymentSuccess(result.paymentIntentId)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Payment error:', error)

      if (reservationId) {
        try {
          await cancelMyReservation(reservationId)
        } catch (cancelError) {
          console.warn('Failed to rollback reservation:', cancelError)
        }
      }

      onPaymentError(error instanceof Error ? error.message : String(error))
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const match = cleaned.match(/\d{1,4}/g)
    const formatted = match ? match.join(' ').substr(0, 19) : ''
    setCardNumber(formatted)
  }

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D+/g, '')
    if (cleaned.length >= 2) {
      setExpiryDate(cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4))
    } else {
      setExpiryDate(cleaned)
    }
  }

  if (Platform.OS === 'web') {
    // Web payment form
    return (
      <View style={{ gap: spacing.md }}>
        <TextInputField
          label="Nombre en la tarjeta"
          placeholder="Cardholder Name"
          value={cardholderName}
          onChangeText={setCardholderName}
        />
        <TextInputField
          label="Número de tarjeta"
          placeholder="Card Number"
          value={cardNumber}
          onChangeText={formatCardNumber}
          keyboardType="numeric"
          maxLength={19}
        />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <TextInputField
            label="Fecha"
            placeholder="MM/YY"
            value={expiryDate}
            onChangeText={formatExpiryDate}
            keyboardType="numeric"
            maxLength={5}
            style={{ flex: 1 }}
          />
          <TextInputField
            label="CVV"
            placeholder="CVV"
            value={cvv}
            onChangeText={(text) => setCvv(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={4}
            style={{ flex: 1 }}
            secureTextEntry
          />
        </View>

        <PrimaryButton
          title={isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
          onPress={handlePayment}
          disabled={isProcessing || !isFormValid}
        />
      </View>
    )
  }

  // Native payment form
  return (
    <View style={{ gap: spacing.md }}>
      <TextInputField
        label="Nombre en la tarjeta"
        placeholder="Cardholder Name"
        value={cardholderName}
        onChangeText={setCardholderName}
      />

      {CardField && (
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: colors.surface,
            textColor: colors.text,
            placeholderColor: colors.textSecondary,
            borderRadius: 8,
          }}
          style={{
            width: '100%',
            height: 50,
            marginVertical: spacing.sm,
          }}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails)
          }}
        />
      )}

      <PrimaryButton
        title={isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
        onPress={handlePayment}
        disabled={isProcessing || !isFormValid}
      />
    </View>
  )
}