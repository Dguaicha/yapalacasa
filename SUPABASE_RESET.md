# Supabase reset

Use this when you create a brand new Supabase project for this app.

If you already have an older Salvar database, rerun the same SQL file to add the restaurant owner, media, and business dashboard fields introduced in the latest version.

1. In Supabase, open `SQL Editor`.
2. Run [supabase/setup.sql](/C:/Users/dguai/projects/salvar/supabase/setup.sql).
3. In `Authentication > Providers > Email`, make sure email/password auth is enabled.
4. In `Authentication > URL Configuration`, set these values:
   `Site URL`: your deployed web domain, for example `https://app.salvar.ec`
   `Redirect URLs`: add your deployed callback URL plus local dev values such as `https://app.salvar.ec/auth/callback`, `http://localhost:8081/auth/callback`, and `salvar://auth/callback`
5. Copy the new project URL and anon key into [.env](/C:/Users/dguai/projects/salvar/.env).
   The URL must be the exact `https://<project-ref>.supabase.co` value from `Settings > API`.
6. Fully stop Expo and start it again so the new env vars are picked up.

What this script creates:

- `profiles` for auth-linked user data
- `restaurants`
- `listings`
- `reservations`
- `restaurant-media` storage bucket for cover images
- RLS policies for reads and user-scoped reservation access
- RLS policies so restaurant owners can edit their own profile and offers
- `handle_new_user()` trigger so signup can create a profile row
- `reserve_listing()` so quantity decreases safely when a user reserves
- `cancel_reservation()` para clientes
- `complete_reservation()` para restaurantes
- Seed data so the marketplace is not empty
