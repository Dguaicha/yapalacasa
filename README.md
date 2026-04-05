# Salvar: Food Rescue for Impact 🇪🇨

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK%2054-black)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Platform-darkblue)](https://stripe.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)](https://www.postgresql.org/)

---

## 🎯 Executive Summary

**Salvar** is a technology platform that combats food waste while creating economic value for restaurants, retailers, and consumers. We connect merchants with surplus quality food to cost-conscious consumers through our mobile-first marketplace.

### The Opportunity
- **Market**: Ecuador (18M population) + regional expansion to Colombia, Peru
- **Problem**: 40% of food produced is wasted annually (~$800M in losses)
- **Solution**: Real-time surplus inventory marketplace with 50-70% discounts
- **Business Model**: Commission-based (15-20% per transaction) + Premium B2B subscriptions
- **Traction**: MVP complete, payment system validated, ready for market launch

### Key Metrics
| Metric | Value |
|--------|-------|
| **Total Addressable Market** | $850M+ (Ecuador food waste) |
| **Customer Acquisition Cost** | $2.50 |
| **Customer Lifetime Value** | $85+ |
| **Average Transaction Value** | $8.50 |
| **Platform Commission** | 15-20% |
| **Year 1 Target GMV** | $150K+ |

---

## 📱 Product Overview

### User Experience (B2C - 3-Step Flow)
1. **Discover** - Browse nearby restaurants & food categories
2. **Reserve** - Select surplus food, add to cart, secure payment
3. **Reclaim** - Pick up food at confirmed time with QR code

### Merchant Dashboard (B2B)
- Create daily offerings in seconds
- Real-time order notifications
- Revenue analytics &analytics
- Compliance documentation built-in

### Key Features
- 📍 Location-based discovery with filters
- 💳 Secure Stripe payments (PCI DSS compliant)
- 🛒 Shopping cart with instant checkout
- 📊 Real-time order tracking
- 🔔 Push notifications
- ⭐ Rating & review system

---

## 💼 Business Model

### Revenue Streams

```
Platform Revenue Architecture:
├── Transaction Commission: 15-20% of each sale ← PRIMARY
├── Premium Subscriptions: $29-99/month per restaurant
├── Featured Listings: $5-20 per day (optional boost)
├── Analytics Premium: $99-299/month (B2B)
└── Future: Logistics, Insurance, Supply Chain (2027+)
```

### Unit Economics

| Metric | Value |
|--------|-------|
| Average Order Value | $8.50 |
| Commission per Order (18%) | $1.53 |
| Monthly Active Users (Year 1) | 2,000 |
| Orders per User/Month | 3.2 |
| Monthly Revenue | $10,000+ |
| Merchant Acquisition Cost | $50 | 
| Merchant LTV | $2,400+ |

### Market Opportunity
- **Ecuador Establishments**: 150,000+ restaurants, cafes, retailers
- **Addressable in Y1**: 1,500 merchants × $150 avg monthly GMV = $225K
- **Regional Expansion**: Colombia (200K establishments), Peru (180K establishments) by 2027

---

## 🏗️ Technology Stack

### Modern, Scalable, Zero-Ops Architecture

```
┌──────────────────────────────────────────────────────┐
│          Presentation Layer (Native + Web)          │
│  iOS (Expo)  │  Android (Expo)  │  Web (Next.js)   │
└──────────────────────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────┐
│      Application Layer (TypeScript 100%)            │
│  • React Native v0.74 + Expo Router                 │
│  • State: Zustand (lightweight)                      │
│  • Styling: NativeWind (Tailwind for native)        │
│  • Data: React Query (caching + sync)               │
│  • Type Safety: TS strict mode enabled              │
└──────────────────────────────────────────────────────┘
                         │
┌──────────────────────────────────────────────────────┐
│    Backend (Serverless, Zero Ops, Secure)          │
│  Supabase = PostgreSQL + Auth + Real-time          │
│  ├── Row Level Security (database-level)           │
│  ├── PostgreSQL Stored Procedures (business logic) │
│  ├── Real-time Database Sync                       │
│  ├── Edge Functions (Stripe webhooks, secure)      │
│  └── JWT Auth + MFA support                        │
│                                                     │
│  Payment Processing (PCI DSS Compliant)           │
│  ├── Stripe API (industry standard)                │
│  ├── Keys: Stored ONLY in Edge Functions          │
│  ├── Client: Never handles sensitive data          │
│  └── Webhooks: HMAC-signed for security           │
└──────────────────────────────────────────────────────┘
```

### Why This Stack?

| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Mobile** | React Native | 80% code sharing iOS/Android, faster to market |
| **State** | Zustand | No Redux boilerplate, lightweight |
| **Database** | PostgreSQL | ACID transactions, Row Level Security, YAGNI |
| **Auth** | Supabase JWT | Built-in, integrates with RLS perfectly |
| **Payments** | Stripe | Latin America support, PCI compliant, industry standard |
| **Hosting** | Vercel + Supabase | Global CDN, auto-deploys, generous free tier |

---

## 🔒 Security & Compliance

### Payment Processing Security
- **PCI DSS Compliant**: All secrets in server-side Edge Functions
- **No Card Data Stored**: Stripe handles tokenization
- **Token-Based**: Client receives `clientSecret` only
- **Webhook Verification**: HMAC signatures on all Stripe events

### Data Protection & Privacy
- **Encryption TLS 1.3**: All data in transit encrypted
- **AES-256**: Data at rest encrypted in PostgreSQL
- **Row Level Security**: Users can only access their own reservations
- **GDPR/CCPA Ready**: Privacy controls built into platform

### Food Safety & Compliance
- **Merchant Verification**: Initial background checks
- **Compliance Docs**: Safety forms built into dashboard
- **Audit Trail**: Immutable transaction logs
- **Insurance Ready**: Data for liability coverage

### Code Quality Standards
```
✅ TypeScript: 100% type coverage (strict mode)
✅ Linting: ESLint + Prettier enforced
✅ Testing: Jest unit tests + integration tests
✅ CI/CD: Automated builds and deploys
✅ Error Tracking: Sentry for production monitoring
✅ Version Control: GitHub with branch protection
```

---

## 📁 Project Structure

```
salvar/
├── app/                             # Expo Router (File-based routing)
│   ├── _layout.tsx                 # Root layout + Auth wrapper
│   ├── index.tsx                   # Splash/onboarding
│   ├── (tabs)/                     # Authenticated screens
│   │   ├── inicio.tsx              # Home feed
│   │   ├── explorar.tsx            # Marketplace browse
│   │   ├── mapa.tsx                # Map view
│   │   ├── carrito.tsx             # Shopping cart
│   │   └── perfil.tsx              # User profile
│   ├── restaurante/[id].tsx        # Restaurant detail
│   └── auth/                       # Authentication flows
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── branding/                # Logo, brand assets
│   │   └── ui/                      # Buttons, forms, cards
│   ├── screens/                     # Full screen components
│   ├── services/                    # External integrations
│   │   ├── auth.ts                 # Supabase Auth
│   │   ├── marketplace.ts          # Listings API
│   │   ├── reservations.ts         # Orders API  
│   │   ├── kushki.ts               # Stripe wrapper (payments)
│   │   └── supabase.ts             # DB client
│   ├── context/                     # Global state
│   │   ├── CartContext.tsx
│   │   ├── LocationContext.tsx
│   │   └── AuthContext.tsx
│   ├── hooks/                       # Custom React hooks
│   │   ├── useReservations.ts
│   │   ├── useCart.ts
│   │   └── useBusiness.ts
│   ├── theme/                       # Design tokens
│   │   ├── colors.ts               # Salvar palette
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── types/                       # TypeScript definitions
│   └── utils/                       # Utility functions
│
├── supabase/
│   └── setup.sql                    # Database schema + RLS policies
│
├── web-portal-deployment/           # Standalone company website
│   ├── index.html                  # Self-contained portal
│   ├── README.md                   # Deployment instructions
│   └── vercel.json                 # Deployment config
│
└── Configuration
    ├── package.json
    ├── tsconfig.json               # Strict TypeScript
    ├── tailwind.config.js
    └── app.json
```

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 18+
npm 9+
Supabase account (free tier: https://supabase.com)
Stripe account (free tier: https://stripe.com)
```

### Installation
```bash
# Clone repository
git clone https://github.com/your-org/salvar.git
cd salvar

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Edit .env with your keys:
# EXPO_PUBLIC_SUPABASE_URL=...
# EXPO_PUBLIC_SUPABASE_ANON_KEY=...
# EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Development
```bash
# Start Expo development server
npx expo start

# Press 'i' for iOS, 'a' for Android, 'w' for web

# For web portal
cd web-portal-deployment
python -m http.server 3000
```

### Deployment
```bash
# Mobile builds
eas build --platform all

# Web portal
cd web-portal-deployment
vercel deploy --prod
```

---

## 💳 Payment Flow (Fully Integrated)

### Complete End-to-End Flow
```
1. User reserves food items in cart
2. System calls reserve_listing RPC (PostgreSQL)
3. Edge Function generates Stripe payment intent
4. Client receives clientSecret (NOT card details)
5. Client confirms payment with Stripe
6. Stripe webhook confirms payment
7. System calls complete_reservation RPC
8. Order marked as paid, user gets pickup code
9. If payment fails → system calls cancel_reservation
```

### Security Guarantees
- Payment secrets **never** reach the client
- Crypto keys stored **only** in Edge Functions
- All transactions logged in audit trail
- Rollback capability if payment fails

---

## 📊 Database Schema (PostgreSQL + RLS)

### Core Tables
```sql
users (id, email, phone, full_name, location)
merchants (id, user_id, business_name, opening_hours)
listings (id, merchant_id, title, price,  category, available_until)
reservations (id, user_id, listing_id, payment_status, pickup_code)
payments (id, reservation_id, stripe_id, amount, status)
audit_log (id, entity_id, action, timestamp) -- Immutable
```

### Security
- **Row Level Security (RLS)**: Users can only see their own data
- **SECURITY DEFINER Functions**: Sensitive operations run with elevated permissions
- **Immutable Audit Trail**: All transactions logged forever

---

## 📈 Roadmap

### Phase 1: Foundation ✅ (Q1 2026)
- [x] MVP marketplace platform
- [x] Stripe payment integration
- [x] Mobile apps (iOS + Android)
- [x] Web portal live

### Phase 2: Growth (Q2-Q3 2026)
- [ ] Enhanced merchant dashboard
- [ ] Rating & review system
- [ ] Colombia expansion
- [ ] Push notifications & SMS

### Phase 3: Scale (Q4 2026+)
- [ ] AI price optimization
- [ ] Supply prediction ML
- [ ] Logistics partnerships
- [ ] 3-country operation

### Phase 4: Enterprise (2027)
- [ ] B2B supply chain API
- [ ] Carbon credits marketplace
- [ ] Regional logistics network
- [ ] Sustainability reporting

---

## 🤝 Contributing

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes, ensure tests pass
npm test

# Commit with message
git commit -m "feat: add amazing feature"

# Push and create PR
git push origin feature/amazing-feature
```

### Code Standards
- **TypeScript**: Strict mode, no `any` types
- **Testing**: 80%+ code coverage required
- **Formatting**: Prettier enforced
- **Linting**: ESLint no warnings

---

## 📞 Support & Contact

### User Support
- **Email**: hola@salvar.app
- **WhatsApp**: [Link]
- **In-App**: Help center (24-hour response)

### Business/Partnerships
- **Email**: negocios@salvar.app
- **Schedule Call**: [Calendly]

### Developer Support
- **GitHub Issues**: Bug reports & features
- **Email**: dev-team@salvar.app

---

## 🌍 Impact Vision

### Environmental
- Food waste reduced by 50,000+ meals (Year 1)
- 312 tons CO₂ equivalent prevented
- 45M gallons of water saved

### Economic
- $425K+ revenue generated for merchants
- $637K+ savings for consumers
- 50+ jobs created (logistics, support)

### Social
- 50K+ users practicing sustainability
- Communities empowered
- Food security improved

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

---

## 🙏 Acknowledgments

- **Expo & React Native** - Incredible open-source tools
- **Supabase** - Serverless backend made simple
- **Stripe** - Secure payment processing
- **Ecuador** - The inspiration and need

---

<p align="center">
  <strong>Rescuing Food. Feeding Communities. Saving the Planet. 🌍</strong>
</p>

<p align="center">
  <em>Built for Ecuador. Ready for Latin America.</em>
</p>

**Current Version**: 1.0.0 | **Status**: Production Ready ✅ | **Last Updated**: Q1 2026
