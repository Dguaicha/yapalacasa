# Salvar Beta Launch Checklist

## Product stance

- Launch model: reserve in app, pay on pickup
- Initial cities: Quito and Guayaquil
- Goal: validate demand, merchant onboarding, and operational discipline before online payments

## Before launch

### Backend

- Run `supabase/setup.sql` in the target project
- Verify RLS is enabled on all public tables
- Verify customer reservation reads work
- Verify merchant reservation reads only return owned listings
- Verify `redeem_reservation` requires the correct pickup code
- Verify role sync works when a restaurant is created

### App

- Confirm cart creates reservations without any payment flow
- Confirm customer can cancel a reserved order
- Confirm merchant can redeem only with the correct code
- Confirm reservation screen shows `Pagas al recoger`
- Confirm account deletion flow no longer references client-side admin APIs

### Operations

- Write the merchant beta script:
  - accept reservation
  - ask customer for pickup code
  - collect payment in person
  - redeem in dashboard
- Define no-show policy
- Define cancellation policy
- Define support contact process

### Legal and business

- Finish company registration
- Secure final business name
- Prepare terms, privacy, and refund policy
- Decide what payment methods merchants may accept during beta

## Metrics to track

- Reservations created
- Reservation cancellation rate
- Pickup completion rate
- No-show rate
- Merchant activation rate
- Repeat customers
- Time from reservation to pickup

## Next payment milestone

When the business entity is ready:

1. Add PayPhone as the first online payment option.
2. Keep server-owned payment status and reconciliation.
3. Introduce redirect or payment-link checkout first.
4. Revisit Kushki when operational volume and team capacity justify it.

## Security checks

- No Stripe dependencies in the client
- No simulated payment success paths
- No client-side updates that mark reservations as paid
- No user-supplied signup role assignment
- No merchant reservation filtering done only in the client

## Status

Repo aligned to beta-safe pay-on-pickup architecture.
