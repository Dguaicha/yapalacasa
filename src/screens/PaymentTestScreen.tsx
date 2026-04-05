import React, { useState } from 'react'
import { View, Text, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StackHeader } from '../components/ui/StackHeader'
import { PaymentForm } from '../components/PaymentForm'
import { colors } from '../theme/colors'
import { spacing } from '../theme/spacing'
import { typography } from '../theme/typography'

export default function PaymentTestScreen() {
  const [paymentResult, setPaymentResult] = useState<string>('')

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setPaymentResult(`✅ Payment successful! Payment Intent: ${paymentIntentId}`)
    Alert.alert('Success', 'Payment completed successfully!')
  }

  const handlePaymentError = (error: string) => {
    setPaymentResult(`❌ Payment failed: ${error}`)
    Alert.alert('Error', `Payment failed: ${error}`)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StackHeader title="Payment Test" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.lg }}>
        <View style={{ gap: spacing.lg }}>
          <View style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={[typography.title, { color: colors.text, textAlign: 'center' }]}>
              Test Payment System
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center' }]}>
              This is a test of the Stripe payment integration.{'\n'}
              Use test card: 4242 4242 4242 4242
            </Text>
          </View>

          <View style={{
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border
          }}>
            <PaymentForm
              amount={25.99}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </View>

          {paymentResult && (
            <View style={{
              backgroundColor: paymentResult.includes('✅') ? colors.success + '20' : colors.error + '20',
              borderRadius: 8,
              padding: spacing.md,
              borderWidth: 1,
              borderColor: paymentResult.includes('✅') ? colors.success : colors.error
            }}>
              <Text style={[typography.body, {
                color: paymentResult.includes('✅') ? colors.success : colors.error,
                textAlign: 'center'
              }]}>
                {paymentResult}
              </Text>
            </View>
          )}

          <View style={{ gap: spacing.sm }}>
            <Text style={[typography.title, { color: colors.text }]}>
              Test Cards
            </Text>
            <Text style={[typography.body, { color: colors.textSecondary }]}>
              • 4242 4242 4242 4242 - Success{'\n'}
              • 4000 0000 0000 0002 - Declined{'\n'}
              • Any future expiry date{'\n'}
              • Any 3-digit CVV
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}