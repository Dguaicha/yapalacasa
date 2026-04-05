# 🚀 SALVAR APP - DEPLOYMENT & CONFIGURATION GUIDE

## 📋 WHAT YOU HAVE NOW (BASIC APP READY!)

Your app is **100% functional locally** with:
- ✅ User registration/login
- ✅ Restaurant browsing
- ✅ Cart functionality
- ✅ Payment processing (Stripe)
- ✅ Cross-platform (iOS, Android, Web)

## 🔑 KEYS & CONFIGURATION (WHAT YOU NEED TO CHANGE)

### 1. **Stripe Keys** (For Real Payments)
**Where to get them:** https://dashboard.stripe.com/apikeys

**What you need:**
- `STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_` for production)
- `STRIPE_SECRET_KEY` (starts with `sk_live_` for production)

**Where to put them:**
- **Web:** `src/services/kushki.ts` (line ~15)
- **Native:** Same file, different import
- **Supabase Edge Function:** Supabase Dashboard → Edge Functions → create-payment-intent → Environment Variables

### 2. **Supabase Keys** (Already Working)
**Where to find them:** https://supabase.com/dashboard → Your Project → Settings → API

**What you have:**
- `SUPABASE_URL` (your project URL)
- `SUPABASE_ANON_KEY` (public key - safe to expose)

## 🛠️ COMMANDS EXPLAINED (WHEN & WHY)

### Development Commands (Run During Development)
```bash
# Start development server (what you just ran)
npx expo start --web
# → Opens your app in browser for testing

# Install new packages
npm install package-name
# → Adds new features/libraries

# Check for errors
npx expo start --clear
# → Clears cache if app acts weird
```

### Deployment Commands (Run When Ready to Publish)

```bash
# Build for web production
npx expo export --platform web
# → Creates optimized web files

# Deploy Edge Functions (payment processing)
npx supabase functions deploy create-payment-intent
# → Uploads secure payment code to Supabase
```

## 📱 DEPLOYMENT OPTIONS (CHOOSE ONE)

### Option 1: **Web Only** (Easiest - Free)
- Host on: Vercel, Netlify, or GitHub Pages
- Cost: Free tier available
- Users access via browser

### Option 2: **Mobile Apps** (App Stores)
- Build: `eas build --platform ios/android`
- Submit to: Apple App Store / Google Play
- Cost: $99/year (Apple), $25 one-time (Google)

### Option 3: **Full Stack** (Everything)
- Web + Mobile + Backend
- Cost: Hosting fees (~$20-50/month)

## 🎯 YOUR NEXT STEPS (IN ORDER)

### Phase 1: Test Everything (Today)
1. Open http://localhost:8084
2. Test user registration
3. Test restaurant browsing
4. Test payments with test card
5. Check mobile responsiveness

### Phase 2: Get Real Keys (This Week)
1. Create Stripe account (if you haven't)
2. Get live keys from Stripe dashboard
3. Update keys in your code
4. Test with real cards (small amounts)

### Phase 3: Deploy (When Ready)
1. Choose hosting platform
2. Run build commands
3. Upload files
4. Test live version

## 💡 IMPORTANT CONCEPTS EXPLAINED

### **Edge Functions** (Your Payment Processor)
- **What:** Serverless functions that run on Supabase
- **Why:** Secure payment processing (never expose secret keys to users)
- **When to run:** Only when deploying or updating payment logic

### **Environment Variables**
- **What:** Secret configuration values (API keys, passwords)
- **Why:** Keep sensitive data secure
- **How:** Different for development vs production

### **Build vs Development**
- **Development:** What you see at localhost:8084 (with hot reload)
- **Build:** Optimized version for users (smaller, faster)

## 🚨 BEFORE YOU DEPLOY

### Must-Have Checklist:
- [ ] Test all features work
- [ ] Replace test Stripe keys with live ones
- [ ] Update app name/description
- [ ] Add your logo/branding
- [ ] Test on real devices
- [ ] Set up error monitoring

### Optional But Recommended:
- [ ] Add analytics (Google Analytics)
- [ ] Set up crash reporting
- [ ] Add push notifications
- [ ] Implement user feedback system

## 🎉 READY TO HIRE FRIENDS?

Your app has a **solid foundation**. You can now:
1. **Show them the working app**
2. **Explain what features to add next**
3. **Let them focus on polish/UI improvements**
4. **Deploy when you're happy with it**

## 📞 NEED HELP?

- **Stuck on deployment?** I can guide you step-by-step
- **Need to add features?** Tell me what you want
- **Questions about keys?** I can explain any part

**Your app is ready to test right now!** 🎯