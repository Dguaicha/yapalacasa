#!/usr/bin/env node

/**
 * SALVAR APP - Environment Check Script
 *
 * Run this to see what keys you currently have configured
 * Usage: node check-env.js
 */

console.log('🔍 SALVAR APP - ENVIRONMENT CHECK')
console.log('=====================================\n')

// Check Supabase keys
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

console.log('📊 SUPABASE CONFIGURATION:')
console.log(`URL: ${supabaseUrl ? '✅ Configured' : '❌ Missing'}`)
console.log(`Key: ${supabaseKey ? '✅ Configured' : '❌ Missing'}`)

if (supabaseUrl) {
  console.log(`   Full URL: ${supabaseUrl}`)
}
if (supabaseKey) {
  console.log(`   Key starts with: ${supabaseKey.substring(0, 20)}...`)
}

console.log('\n💳 STRIPE CONFIGURATION:')
const stripeKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
console.log(`Publishable Key: ${stripeKey ? '✅ Configured' : '❌ Missing (using test key)'}`)

if (stripeKey) {
  console.log(`   Key starts with: ${stripeKey.substring(0, 20)}...`)
  console.log(`   Environment: ${stripeKey.includes('pk_live_') ? '🟢 PRODUCTION' : '🟡 TEST'}`)
} else {
  console.log('   Using: pk_test_your_key_here (TEST MODE)')
}

console.log('\n📋 WHAT TO DO NEXT:')
if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Fix Supabase keys first!')
  console.log('   1. Go to https://supabase.com/dashboard')
  console.log('   2. Select your project')
  console.log('   3. Go to Settings → API')
  console.log('   4. Copy URL and anon key')
  console.log('   5. Create .env file with:')
  console.log('      EXPO_PUBLIC_SUPABASE_URL=your_url')
  console.log('      EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key')
}

if (!stripeKey || stripeKey.includes('your_key_here')) {
  console.log('❌ Get Stripe keys!')
  console.log('   1. Go to https://dashboard.stripe.com/apikeys')
  console.log('   2. Create account if needed')
  console.log('   3. Copy publishable key (pk_live_...)')
  console.log('   4. Add to .env file:')
  console.log('      EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key')
}

if (supabaseUrl && supabaseKey && stripeKey && !stripeKey.includes('your_key_here')) {
  console.log('✅ Everything looks good!')
  console.log('   Ready to test with real payments')
}

console.log('\n🚀 QUICK START:')
console.log('1. Fix any missing keys above')
console.log('2. Run: npx expo start --web')
console.log('3. Open: http://localhost:8084')
console.log('4. Test payments: http://localhost:8084/payment-test')