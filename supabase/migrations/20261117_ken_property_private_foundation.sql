-- STAGING FIRST: private owner-scoped property storage. No production data.
create schema if not exists ken_property;
revoke all on schema ken_property from public, anon, authenticated;
create table ken_property.properties (
 id uuid primary key default gen_random_uuid(),
 owner_user_id uuid not null references auth.users(id),
 property_label text not null check (length(trim(property_label)) between 1 and 160),
 property_kind text not null check (property_kind in ('shoplot','residential','other')),
 created_at timestamptz not null default now(),
 unique (owner_user_id,id)
);
create table ken_property.rent_periods (
 id uuid primary key default gen_random_uuid(),
 owner_user_id uuid not null references auth.users(id),
 property_id uuid not null,
 rental_month date not null check (extract(day from rental_month)=1),
 amount_due numeric(14,2) not null check (amount_due>=0),
 currency text not null default 'MYR' check (currency='MYR'),
 created_at timestamptz not null default now(),
 foreign key(owner_user_id,property_id) references ken_property.properties(owner_user_id,id),
 unique(owner_user_id,property_id,rental_month),
 unique(owner_user_id,id)
);
create table ken_property.rent_receipts (
 id uuid primary key default gen_random_uuid(),
 owner_user_id uuid not null references auth.users(id),
 rent_period_id uuid not null,
 amount_received numeric(14,2) not null check(amount_received>0),
 received_on date not null,
 source_document_id uuid,
 review_state text not null default 'pending' check(review_state in ('pending','verified','rejected')),
 created_at timestamptz not null default now(),
 foreign key(owner_user_id,rent_period_id) references ken_property.rent_periods(owner_user_id,id)
);
alter table ken_property.properties enable row level security;
alter table ken_property.rent_periods enable row level security;
alter table ken_property.rent_receipts enable row level security;
alter table ken_property.properties force row level security;
alter table ken_property.rent_periods force row level security;
alter table ken_property.rent_receipts force row level security;
create policy owner_read on ken_property.properties for select to authenticated using ((select auth.uid())=owner_user_id);
create policy owner_read on ken_property.rent_periods for select to authenticated using ((select auth.uid())=owner_user_id);
create policy owner_read on ken_property.rent_receipts for select to authenticated using ((select auth.uid())=owner_user_id);
revoke all on all tables in schema ken_property from public, anon, authenticated;
