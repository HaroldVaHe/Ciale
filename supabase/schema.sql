-- ============================================================
-- CIALÉ — Fase 2: Fundación Supabase
-- Schema: categorías, productos, pedidos y items de pedido
-- Ejecutar en el SQL Editor de tu proyecto Supabase.
-- ============================================================

-- ---------- Tablas ----------

create table if not exists public.categories (
  id         text primary key,
  label      text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id          text primary key,            -- slug estable (ej: 'coral'); coincide con los ids del carrito actual
  category_id text references public.categories (id),
  name        text not null,
  description text not null default '',
  price       integer not null check (price >= 0),  -- COP, sin decimales
  image       text not null default '',
  gradient    text not null default '',
  tags        text[] not null default '{}',
  variants    jsonb not null default '[]', -- [{ id, name, color, hex }]
  sort_order  integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category_id);
create index if not exists products_active_idx   on public.products (is_active);

create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  status           text not null default 'nuevo'
                   check (status in ('nuevo','confirmado','enviado','entregado','cancelado')),
  customer_name    text,
  customer_phone   text,
  delivery_address text,
  notes            text,
  total            bigint not null default 0 check (total >= 0),  -- COP
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_slug text,                       -- snapshot: sin FK para preservar el histórico si se borra el producto
  product_name text not null,
  variant_name text,
  quantity     integer not null check (quantity > 0),
  unit_price   integer not null check (unit_price >= 0),  -- COP al momento del pedido
  created_at   timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items (order_id);

-- ---------- updated_at automático ----------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- ---------- Row Level Security ----------

alter table public.categories  enable row level security;
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Catálogo público: cualquiera puede leer categorías
drop policy if exists "Catalog reads categories" on public.categories;
create policy "Catalog reads categories"
  on public.categories for select
  using (true);

-- Catálogo público: solo productos activos; staff ve todo
drop policy if exists "Anyone reads active products" on public.products;
create policy "Anyone reads active products"
  on public.products for select
  using (is_active or (select auth.uid()) is not null);

-- Gestión de catálogo solo para usuarios autenticados (admin, Fases 4-5)
drop policy if exists "Authenticated manages products" on public.products;
create policy "Authenticated manages products"
  on public.products for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

drop policy if exists "Authenticated manages categories" on public.categories;
create policy "Authenticated manages categories"
  on public.categories for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Pedidos: el público puede crearlos (checkout Fase 6); solo staff los lee/gestiona
drop policy if exists "Anyone creates orders" on public.orders;
create policy "Anyone creates orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Staff manages orders" on public.orders;
create policy "Staff manages orders"
  on public.orders for select
  using ((select auth.uid()) is not null);

drop policy if exists "Anyone creates order items" on public.order_items;
create policy "Anyone creates order items"
  on public.order_items for insert
  with check (true);

drop policy if exists "Staff reads order items" on public.order_items;
create policy "Staff reads order items"
  on public.order_items for select
  using ((select auth.uid()) is not null);
