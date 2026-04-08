create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null,
  email text unique,
  phone text,
  phone_verified boolean not null default false,
  phone_verified_at timestamptz,
  role text not null default 'customer' check (role in ('customer', 'restaurant_owner', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid unique references auth.users (id) on delete set null,
  name text not null,
  city text,
  address text,
  region text check (region in ('Costa', 'Sierra', 'Oriente', 'Galapagos')),
  description text,
  latitude numeric(9, 6),
  longitude numeric(9, 6),
  cover_image_url text,
  pickup_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  title text not null,
  description text,
  original_price numeric(10, 2) not null check (original_price > 0),
  sale_price numeric(10, 2) not null check (sale_price > 0 and sale_price <= original_price),
  quantity_available integer not null default 0 check (quantity_available >= 0),
  pickup_start time,
  pickup_end time,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists role text not null default 'customer';
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists phone_verified boolean not null default false;
alter table public.profiles add column if not exists phone_verified_at timestamptz;
alter table public.restaurants add column if not exists owner_id uuid references auth.users (id) on delete set null;
alter table public.restaurants add column if not exists address text;
alter table public.restaurants add column if not exists region text;
alter table public.restaurants add column if not exists description text;
alter table public.restaurants add column if not exists latitude numeric(9, 6);
alter table public.restaurants add column if not exists longitude numeric(9, 6);
alter table public.restaurants add column if not exists cover_image_url text;
alter table public.restaurants add column if not exists pickup_notes text;
alter table public.listings add column if not exists image_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_role_check'
  ) then
    alter table public.profiles
    add constraint profiles_role_check check (role in ('customer', 'restaurant_owner', 'admin'));
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'restaurants_region_check'
  ) then
    alter table public.restaurants
    add constraint restaurants_region_check check (region in ('Costa', 'Sierra', 'Oriente', 'Galapagos'));
  end if;
end
$$;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  total_price numeric(10, 2) not null check (total_price >= 0),
  status text not null default 'reserved' check (status in ('reserved', 'completed', 'cancelled')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_id text,
  payment_method text,
  amount_paid numeric(10, 2),
  paid_at timestamptz,
  completed_at timestamptz,
  pickup_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)),
  reserved_at timestamptz not null default now()
);

create unique index if not exists reservations_one_active_per_listing_user_idx
on public.reservations (listing_id, user_id)
where status = 'reserved';

create unique index if not exists restaurants_owner_id_unique_idx
on public.restaurants (owner_id)
where owner_id is not null;

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.listings enable row level security;
alter table public.reservations enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;

drop policy if exists "Anyone can view restaurants" on public.restaurants;
create policy "Anyone can view restaurants"
on public.restaurants
for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can view active listings" on public.listings;
create policy "Anyone can view active listings"
on public.listings
for select
to anon, authenticated
using (true);

drop policy if exists "Restaurant owners can insert own restaurant" on public.restaurants;
create policy "Restaurant owners can insert own restaurant"
on public.restaurants
for insert
to authenticated
with check ((select auth.uid()) = owner_id);

drop policy if exists "Restaurant owners can update own restaurant" on public.restaurants;
create policy "Restaurant owners can update own restaurant"
on public.restaurants
for update
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

drop policy if exists "Restaurant owners can insert own listings" on public.listings;
create policy "Restaurant owners can insert own listings"
on public.listings
for insert
to authenticated
with check (
  exists (
    select 1
    from public.restaurants
    where restaurants.id = restaurant_id
      and restaurants.owner_id = (select auth.uid())
  )
);

drop policy if exists "Restaurant owners can update own listings" on public.listings;
create policy "Restaurant owners can update own listings"
on public.listings
for update
to authenticated
using (
  exists (
    select 1
    from public.restaurants
    where restaurants.id = restaurant_id
      and restaurants.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.restaurants
    where restaurants.id = restaurant_id
      and restaurants.owner_id = (select auth.uid())
  )
);

drop policy if exists "Restaurant owners can delete own listings" on public.listings;
create policy "Restaurant owners can delete own listings"
on public.listings
for delete
to authenticated
using (
  exists (
    select 1
    from public.restaurants
    where restaurants.id = restaurant_id
      and restaurants.owner_id = (select auth.uid())
  )
);

drop policy if exists "Users can view own reservations" on public.reservations;
create policy "Users can view own reservations"
on public.reservations
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Restaurant owners can view reservations for owned listings" on public.reservations;
create policy "Restaurant owners can view reservations for owned listings"
on public.reservations
for select
to authenticated
using (
  exists (
    select 1
    from public.listings
    join public.restaurants on restaurants.id = listings.restaurant_id
    where listings.id = listing_id
      and restaurants.owner_id = (select auth.uid())
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, phone, phone_verified, phone_verified_at, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, new.phone, 'usuario'), '@', 1)),
    new.email,
    new.phone,
    new.phone_confirmed_at is not null,
    new.phone_confirmed_at,
    'customer'
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    phone = excluded.phone,
    phone_verified = excluded.phone_verified,
    phone_verified_at = excluded.phone_verified_at,
    role = case
      when public.profiles.role = 'admin' then public.profiles.role
      else excluded.role
    end;

  return new;
end;
$$;

create or replace function public.sync_profile_role_from_restaurant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  affected_user_id uuid := coalesce(new.owner_id, old.owner_id);
  has_restaurant boolean := false;
begin
  if affected_user_id is null then
    return coalesce(new, old);
  end if;

  select exists (
    select 1
    from public.restaurants
    where owner_id = affected_user_id
  ) into has_restaurant;

  update public.profiles
  set role = case
    when role = 'admin' then role
    when has_restaurant then 'restaurant_owner'
    else 'customer'
  end
  where id = affected_user_id;

  return coalesce(new, old);
end;
$$;

create or replace function public.reserve_listing(target_listing_id uuid)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  selected_listing public.listings%rowtype;
  created_reservation public.reservations%rowtype;
begin
  if current_user_id is null then
    raise exception 'You must be signed in to reserve a bag.';
  end if;

  if not exists (
    select 1
    from auth.users
    where id = current_user_id
      and email_confirmed_at is not null
  ) then
    raise exception 'Debes verificar tu correo antes de reservar.';
  end if;

  begin
    update public.listings
    set quantity_available = quantity_available - 1
    where id = target_listing_id
      and is_active is true
      and quantity_available > 0
    returning * into selected_listing;

    if not found then
      select *
      into selected_listing
      from public.listings
      where id = target_listing_id;

      if not found then
        raise exception 'Listing not found.';
      end if;

      if selected_listing.is_active is not true then
        raise exception 'This bag is no longer active.';
      end if;

      raise exception 'This bag is sold out.';
    end if;

    insert into public.reservations (listing_id, user_id, total_price)
    values (target_listing_id, current_user_id, selected_listing.sale_price)
    returning * into created_reservation;
  exception
    when unique_violation then
      if exists (
        select 1
        from public.reservations
        where listing_id = target_listing_id
          and user_id = current_user_id
          and status = 'reserved'
      ) then
        raise exception 'You already reserved this bag.';
      end if;

      raise;
  end;

  return created_reservation;
end;
$$;

grant execute on function public.reserve_listing(uuid) to authenticated;

create or replace function public.cancel_reservation(target_reservation_id uuid)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_reservation public.reservations%rowtype;
begin
  if current_user_id is null then
    raise exception 'You must be signed in to cancel a reservation.';
  end if;

  select *
  into target_reservation
  from public.reservations
  where id = target_reservation_id
  for update;

  if not found then
    raise exception 'Reservation not found.';
  end if;

  if target_reservation.user_id <> current_user_id then
    raise exception 'You can only cancel your own reservation.';
  end if;

  if target_reservation.status <> 'reserved' then
    raise exception 'Only reserved orders can be cancelled.';
  end if;

  update public.reservations
  set status = 'cancelled'
  where id = target_reservation_id
  returning * into target_reservation;

  update public.listings
  set quantity_available = quantity_available + 1
  where id = target_reservation.listing_id;

  return target_reservation;
end;
$$;

grant execute on function public.cancel_reservation(uuid) to authenticated;

create or replace function public.complete_reservation(target_reservation_id uuid)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'complete_reservation is deprecated. Use redeem_reservation with the pickup code.';
end;
$$;

grant execute on function public.complete_reservation(uuid) to authenticated;

drop function if exists public.complete_reservation_after_payment(uuid);

create or replace function public.redeem_reservation(
  target_reservation_id uuid,
  provided_pickup_code text
)
returns public.reservations
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_reservation public.reservations%rowtype;
  owner_matches boolean;
  normalized_pickup_code text := upper(trim(coalesce(provided_pickup_code, '')));
begin
  if current_user_id is null then
    raise exception 'You must be signed in to redeem a reservation.';
  end if;

  select *
  into target_reservation
  from public.reservations
  where id = target_reservation_id
  for update;

  if not found then
    raise exception 'Reservation not found.';
  end if;

  select exists (
    select 1
    from public.listings
    join public.restaurants on restaurants.id = listings.restaurant_id
    where listings.id = target_reservation.listing_id
      and restaurants.owner_id = current_user_id
  ) into owner_matches;

  if owner_matches is not true then
    raise exception 'Only the restaurant owner can redeem this reservation.';
  end if;

  if normalized_pickup_code = '' then
    raise exception 'Pickup code is required.';
  end if;

  if target_reservation.pickup_code <> normalized_pickup_code then
    raise exception 'Pickup code does not match this reservation.';
  end if;

  if target_reservation.status <> 'reserved' then
    raise exception 'Only reserved orders can be redeemed.';
  end if;

  update public.reservations
  set
    status = 'completed',
    payment_status = 'paid',
    payment_method = 'pay_on_pickup',
    amount_paid = target_reservation.total_price,
    paid_at = coalesce(target_reservation.paid_at, now()),
    completed_at = now()
  where id = target_reservation_id
  returning * into target_reservation;

  return target_reservation;
end;
$$;

grant execute on function public.redeem_reservation(uuid, text) to authenticated;

create table if not exists public.pickup_receipts (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations (id) on delete cascade,
  customer_user_id uuid not null references auth.users (id) on delete cascade,
  merchant_user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text,
  customer_email text,
  customer_phone text,
  listing_title text,
  restaurant_name text,
  amount_paid numeric(10, 2),
  delivered_via text not null default 'email',
  delivery_status text not null default 'pending',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.pickup_receipts enable row level security;

drop policy if exists "Users can view own pickup receipts" on public.pickup_receipts;
create policy "Users can view own pickup receipts"
on public.pickup_receipts
for select
to authenticated
using ((select auth.uid()) = customer_user_id);

drop policy if exists "Merchants can view own pickup receipts" on public.pickup_receipts;
create policy "Merchants can view own pickup receipts"
on public.pickup_receipts
for select
to authenticated
using ((select auth.uid()) = merchant_user_id);

create or replace function public.fetch_manager_todays_reservations(target_day date default (now() at time zone 'America/Guayaquil')::date)
returns table (
  reservation_id uuid,
  pickup_code text,
  status text,
  payment_status text,
  reserved_at timestamptz,
  total_price numeric,
  listing_title text,
  restaurant_name text,
  customer_name text,
  customer_phone text,
  customer_email text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'You must be signed in.';
  end if;

  return query
  select
    reservations.id,
    reservations.pickup_code,
    reservations.status,
    reservations.payment_status,
    reservations.reserved_at,
    reservations.total_price,
    listings.title,
    restaurants.name,
    profiles.name,
    profiles.phone,
    profiles.email
  from public.reservations
  join public.listings on listings.id = reservations.listing_id
  join public.restaurants on restaurants.id = listings.restaurant_id
  join public.profiles on profiles.id = reservations.user_id
  where restaurants.owner_id = current_user_id
    and (reservations.reserved_at at time zone 'America/Guayaquil')::date = target_day
    and reservations.status = 'reserved'
  order by reservations.reserved_at asc;
end;
$$;

grant execute on function public.fetch_manager_todays_reservations(date) to authenticated;

insert into storage.buckets (id, name, public)
values ('restaurant-media', 'restaurant-media', true)
on conflict (id) do nothing;

drop policy if exists "Restaurant media public read" on storage.objects;
create policy "Restaurant media public read"
on storage.objects
for select
to public
using (bucket_id = 'restaurant-media');

drop policy if exists "Restaurant owners can upload own media" on storage.objects;
create policy "Restaurant owners can upload own media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'restaurant-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Restaurant owners can update own media" on storage.objects;
create policy "Restaurant owners can update own media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'restaurant-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'restaurant-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
after update on auth.users
for each row execute procedure public.handle_new_user();

do $$
begin
  begin
    alter publication supabase_realtime add table public.reservations;
  exception
    when duplicate_object then null;
  end;
end
$$;

drop trigger if exists on_restaurant_role_sync on public.restaurants;
create trigger on_restaurant_role_sync
after insert or update or delete on public.restaurants
for each row execute procedure public.sync_profile_role_from_restaurant();

insert into public.restaurants (name, city)
select seed.name, seed.city
from (
  values
    ('Panaderia La Cumbre', 'Quito'),
    ('Cafe Malecon', 'Guayaquil'),
    ('Bistro Andino', 'Cuenca')
) as seed(name, city)
where not exists (
  select 1
  from public.restaurants existing
  where existing.name = seed.name
    and coalesce(existing.city, '') = coalesce(seed.city, '')
);

update public.restaurants
set
  address = case name
    when 'Panaderia La Cumbre' then 'La Mariscal, Quito'
    when 'Cafe Malecon' then 'Malecon 2000, Guayaquil'
    when 'Bistro Andino' then 'Centro historico, Cuenca'
    else coalesce(address, city)
  end,
  region = case name
    when 'Panaderia La Cumbre' then 'Sierra'
    when 'Cafe Malecon' then 'Costa'
    when 'Bistro Andino' then 'Sierra'
    else coalesce(region, 'Sierra')
  end,
  description = case name
    when 'Panaderia La Cumbre' then 'Panaderia de barrio con hornos tradicionales y bolsas de rescate.'
    when 'Cafe Malecon' then 'Cafe urbano con menu fresco y packs sorpresa para brunch y merienda.'
    when 'Bistro Andino' then 'Bistro de producto local con cajas rescue y cocina de temporada.'
    else coalesce(description, 'Comercio aliado de Salvar.')
  end,
  latitude = case name
    when 'Panaderia La Cumbre' then -0.195200
    when 'Cafe Malecon' then -2.189400
    when 'Bistro Andino' then -2.900500
    else coalesce(latitude, -1.831200)
  end,
  longitude = case name
    when 'Panaderia La Cumbre' then -78.490500
    when 'Cafe Malecon' then -79.883600
    when 'Bistro Andino' then -79.004500
    else coalesce(longitude, -78.183400)
  end,
  pickup_notes = coalesce(pickup_notes, 'Llega con tu codigo de reserva y muestra la pantalla de pedido.')
where name in ('Panaderia La Cumbre', 'Cafe Malecon', 'Bistro Andino');

insert into public.listings (
  restaurant_id,
  title,
  description,
  original_price,
  sale_price,
  quantity_available,
  pickup_start,
  pickup_end,
  is_active
)
select
  seed.restaurant_id,
  seed.title,
  seed.description,
  seed.original_price,
  seed.sale_price,
  seed.quantity_available,
  seed.pickup_start,
  seed.pickup_end,
  seed.is_active
from (
  values
    (
      (select id from public.restaurants where name = 'Panaderia La Cumbre' and city = 'Quito' limit 1),
      'Bolsa sorpresa de pan y bolleria',
      'Pan del dia, croissants y piezas dulces surtidas.',
      12.00,
      4.50,
      6,
      '18:00'::time,
      '20:00'::time,
      true
    ),
    (
      (select id from public.restaurants where name = 'Cafe Malecon' and city = 'Guayaquil' limit 1),
      'Pack brunch sorpresa',
      'Sandwiches, postres y bebida fria del dia.',
      16.00,
      5.75,
      4,
      '17:30'::time,
      '19:30'::time,
      true
    ),
    (
      (select id from public.restaurants where name = 'Bistro Andino' and city = 'Cuenca' limit 1),
      'Caja rescue market',
      'Frutas, verduras y productos listos para consumir.',
      18.00,
      6.90,
      5,
      '19:00'::time,
      '21:00'::time,
      true
    )
) as seed (
  restaurant_id,
  title,
  description,
  original_price,
  sale_price,
  quantity_available,
  pickup_start,
  pickup_end,
  is_active
)
where seed.restaurant_id is not null
  and not exists (
    select 1
    from public.listings existing
    where existing.title = seed.title
      and existing.restaurant_id = seed.restaurant_id
  );
  
