# Salvar

Salvar is a mobile-first surplus-food marketplace built for Ecuador. The current product is a beta for Quito and Guayaquil with a simple operational model:

1. Customers reserve bags in the app.
2. They pay when they pick up at the business.
3. The merchant redeems the order with the pickup code and records payment at handoff.

## Current stage

- Market entry: Quito and Guayaquil
- Payment model: pay on pickup
- Online payments: deferred
- Planned roadmap: PayPhone first, Kushki later

## Why the beta works

- It removes early payment-compliance risk while the company is being incorporated.
- It lets merchants onboard with less friction.
- It gives investors and partners a live product with real marketplace behavior.
- It preserves a clean migration path to online payments later.

## Architecture

### Frontend

- Expo Router
- React Native
- TypeScript
- NativeWind

### Backend

- Supabase Auth
- Supabase Postgres
- Row Level Security
- PostgreSQL RPC functions for reservation lifecycle

## Reservation lifecycle

### Customer flow

1. Browse active listings.
2. Add one or more bags to cart.
3. Confirm reservation.
4. Receive pickup code and pickup window.
5. Pay at the business when collecting the order.

### Merchant flow

1. Publish and manage offers.
2. Review incoming reservations.
3. Ask the customer for the pickup code at collection time.
4. Redeem the reservation in the dashboard.
5. The system marks the reservation as completed and paid on pickup.

## Security model

The app no longer treats the client as the source of truth for payment state.

### Implemented safeguards

- Reservation mutations happen through database RPC functions.
- Customers can only cancel their own reservations.
- Merchants can only view reservations tied to their own listings.
- Merchant redemption requires the reservation pickup code.
- Profile roles are not taken from user-supplied signup metadata.
- Restaurant-owner role is synced from actual restaurant ownership in the database.
- The client no longer contains Stripe or simulated-payment logic.
- The client no longer references admin auth deletion APIs.

### Key database functions

- `reserve_listing(uuid)`
- `cancel_reservation(uuid)`
- `redeem_reservation(uuid, text)`

## Data model

### Core tables

- `profiles`
- `restaurants`
- `listings`
- `reservations`

### Reservation fields

- `status`: `reserved | completed | cancelled`
- `payment_status`: `pending | paid | failed | refunded`
- `payment_method`
- `amount_paid`
- `paid_at`
- `completed_at`
- `pickup_code`

## Payments roadmap

### Now

- Cash, card terminal, transfer, or whatever the merchant already accepts at pickup
- No in-app card processing

### Next

- PayPhone redirect or payment links for the first compliant online flow in Ecuador

### Later

- Kushki when the business, operations, and team are ready for a stronger payment platform

## Project structure

```text
salvar/
├── app/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── screens/
│   ├── services/
│   ├── theme/
│   └── types/
├── supabase/
│   └── setup.sql
└── web-portal-deployment/
```

## Local development

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase project

### Run

```bash
npm install
npx expo start
```

### Environment

Create `.env` with:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## Operational notes

- Merchants should have a clear pickup script during beta.
- Customers should see that payment happens at collection time.
- Support should track no-shows, cancelled holds, and redeemed pickups.
- Before enabling online payments, keep payment state server-owned and callback-driven.

## Status

Beta architecture is live in code.
