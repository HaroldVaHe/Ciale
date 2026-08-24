-- ============================================================
-- CIALÉ — Reseñas de productos (testimonios reales)
-- Ejecutar UNA vez en el SQL Editor (re-ejecutable).
-- Lectura pública solo de reseñas publicadas;
-- el admin autenticado gestiona todo.
-- ============================================================

create table if not exists public.product_reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products(id) on delete cascade,
  author_name text not null,
  rating      int  not null check (rating between 1 and 5),
  comment     text,
  is_published boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_product_reviews_product
  on public.product_reviews (product_id);

alter table public.product_reviews enable row level security;

drop policy if exists "Anyone reads published reviews"
  on public.product_reviews;
create policy "Anyone reads published reviews"
  on public.product_reviews for select to public
  using (is_published = true);

drop policy if exists "Authenticated manages reviews"
  on public.product_reviews;
create policy "Authenticated manages reviews"
  on public.product_reviews for all to authenticated
  using (true)
  with check (true);
