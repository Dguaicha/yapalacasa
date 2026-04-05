import React, { useState } from 'react'
import { View, Text, ScrollView, Platform } from 'react-native'
import { PrimaryButton } from './ui/PrimaryButton'
import { TextInputField } from './ui/TextInputField'
import { paymentService } from '../services/kushki'
import { colors } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

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
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  const isFormValid =
    cardNumber.length >= 13 &&
    expiryDate.length === 5 &&
    cvv.length >= 3 &&
    cardholderName.length > 0

  const handlePayment = async () => {
    if (!isFormValid) {
      onPaymentError('Please complete all payment details')
      return
    }

    setIsProcessing(true)

    try {
      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent(amount)

      if (!paymentIntent.success) {
        throw new Error(paymentIntent.error || 'Failed to create payment intent')
      }

      // For web, payment is typically handled by Stripe Hosted Form or Elements
      // This is a simplified flow - in production use Stripe.js Elements or Hosted Payment Form
      const result = await paymentService.processPayment(
        paymentIntent.clientSecret,
        'pm_web_test'
      )

      if (result.success) {
        onPaymentSuccess(paymentIntent.paymentIntentId || 'web_payment_success')
      } else {
        throw new Error(result.error || 'Payment failed')
      }
    } catch (error: any) {
      console.error('Payment error:', error)
      onPaymentError(error.message || 'Payment processing failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.md }}>
      <View style={{ gap: spacing.md }}>
        <Text style={[typography.body, { color: colors.textSecondary }]}>
          Información de Pago - Web Version
        </Text>

        <TextInputField
          placeholder="Nombre del titular"
          value={cardholderName}
          onChangeText={setCardholderName}
          editable={!isProcessing}
          maxLength={50}
        />

        <TextInputField
          placeholder="Número de tarjeta (13-19 dígitos)"
          value={cardNumber}
          onChangeText={(text) => setCardNumber(text.replace(/\D/g, ''))}
          editable={!isProcessing}
          keyboardType="numeric"
          maxLength={19}
        />

        <View style={{ flexDirection: 'row', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <TextInputField
              placeholder="MM/AA"
              value={expiryDate}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, '')
                if (cleaned.length <= 4) {
                  if (cleaned.length === 2 && !text.includes('/')) {
                    setExpiryDate(cleaned + '/')
                  } else {
                    setExpiryDate(cleaned)
                  }
                }
              }}
              editable={!isProcessing}
              maxLength={5}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <TextInputField
              placeholder="CVC"
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
              editable={!isProcessing}
              maxLength={4}
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>

        <PrimaryButton
          onPress={handlePayment}
          disabled={!isFormValid || isProcessing}
          loading={isProcessing}
        >
          {isProcessing ? 'Procesando...' : `Pagar $${amount.toFixed(2)}`}
        </PrimaryButton>

        <Text style={[typography.caption, { color: colors.textSecondary, textAlign: 'center' }]}>
          Web: Use test card 4242 4242 4242 4242
        </Text>
      </View>
    </ScrollView>
  )
}
