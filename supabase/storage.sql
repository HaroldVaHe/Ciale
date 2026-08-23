-- ============================================================
-- CIALÉ — Fase 4: Storage para imágenes de productos
-- Ejecutar UNA vez en el SQL Editor (re-ejecutable).
-- Bucket público de solo lectura para anónimos;
-- usuarios autenticados (el admin) pueden subir/editar/borrar.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  4194304, -- 4 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads product images"
  on storage.objects;
create policy "Public reads product images"
  on storage.objects for select to public
  using (bucket_id = 'product-images');

drop policy if exists "Authenticated uploads product images"
  on storage.objects;
create policy "Authenticated uploads product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated updates product images"
  on storage.objects;
create policy "Authenticated updates product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images')
  with check (bucket_id = 'product-images');

drop policy if exists "Authenticated deletes product images"
  on storage.objects;
create policy "Authenticated deletes product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images');
