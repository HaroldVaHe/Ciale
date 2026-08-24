-- ============================================================
-- CIALÉ — Parche: políticas RLS de pedidos (Fase 6)
-- La BD actual no tiene la política de inserción anónima que
-- permite al checkout guardar el pedido antes de abrir WhatsApp.
-- Ejecutar UNA vez en el SQL Editor (re-ejecutable, no toca datos).
-- ============================================================

-- Visitantes anónimos pueden CREAR pedidos (checkout sin cuenta)
drop policy if exists "Anyone creates orders" on public.orders;
create policy "Anyone creates orders"
  on public.orders for insert
  with check (true);

-- El staff (admin autenticado) lee y gestiona todos los pedidos
drop policy if exists "Staff manages orders" on public.orders;
create policy "Staff manages orders"
  on public.orders for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);

-- Ítems: mismo par — anónimos crean, staff lee/gestiona
drop policy if exists "Anyone creates order items" on public.order_items;
create policy "Anyone creates order items"
  on public.order_items for insert
  with check (true);

drop policy if exists "Staff manages order items" on public.order_items;
create policy "Staff manages order items"
  on public.order_items for all
  using ((select auth.uid()) is not null)
  with check ((select auth.uid()) is not null);
