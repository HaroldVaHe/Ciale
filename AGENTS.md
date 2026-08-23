# AGENTS.md

## Project

CIALÉ — artisanal jewelry e-commerce storefront (Next.js 16 + React 19 + Tailwind v4).
Single-page app: all content lives on `/`. Navigation uses anchor links (`#catalogo`, etc.).
Checkout is via **WhatsApp** (no payment gateway).

## Structure

The Next.js app lives at the repo root.

```
supabase/
├── schema.sql    # Tablas + RLS (ejecutar en el SQL Editor del proyecto)
└── seed.sql      # 3 categorías + los 12 productos actuales (re-ejecutable)

src/
├── app/          # layout.tsx (server component: SEO metadata + JSON-LD), page.tsx,
│                 # globals.css, sitemap.ts, robots.ts
├── components/   # 10 client components, all "use client"
├── context/      # CartContext.tsx (React Context + localStorage)
├── data/         # products.ts (12 hardcoded products), faqs.ts (FAQ content)
├── hooks/        # useDialog.ts (dialog a11y: Escape, focus trap, scroll lock)
└── lib/
    ├── utils.ts     # cn, formatCOP, generateWhatsAppLink, WHATSAPP_NUMBER
    ├── catalogo.ts  # getCatalogo(): lee productos/categorías de Supabase con
    │                # fallback a data/products.ts; nunca lanza errores
    └── supabase/    # Fase 2: types.ts (Database), client.ts (browser),
                     # server.ts (cookies), isSupabaseConfigured()
```

## Commands

```bash
npm run dev        # Dev server (Turbopack)
npm run build      # Production build (use this to verify changes)
npm run lint       # ESLint
```

No test framework is configured. No typecheck script exists (use `npx tsc --noEmit`).

**npm quirk:** npm v11+ has a semver bug with `@tailwindcss/oxide`. If `npm install` fails with "Invalid Version", use `npx npm@10 install` as workaround.

## Key Conventions

- **Tailwind CSS v4**: No `tailwind.config.js`. Custom theme is in `src/app/globals.css` using `@theme inline` block.
- **Fonts**: Playfair Display (serif) + Inter (sans) loaded via `next/font/google` in layout.tsx. CSS variables: `--font-playfair`, `--font-inter`.
- **Colors**: Custom palette in `globals.css` (`cream`, `charcoal`, `coffee`, `nude`, `coral`, `gold`, `sage`, `border`).
- **Utility**: `cn()` from `clsx` + `tailwind-merge` in `lib/utils.ts`.
- **Currency**: Always use `formatCOP()` from utils. Locale is `es-CO`, currency COP.
- **WhatsApp number**: Centralized as `WHATSAPP_NUMBER` in `lib/utils.ts` (`573203039847`). Never hardcode it in components.
- **Cart key**: localStorage key is `ciale-cart`.

## Gotchas

- **FAQ dual source of truth**: FAQ answers live in `src/data/faqs.ts` and feed both the visible `FaqSection` accordion and the `FAQPage` JSON-LD in `layout.tsx`. Edit only `faqs.ts` — both consume it.
- **All client components**: Every component and even `page.tsx` is `"use client"`. Server components and API routes are not used despite App Router setup.
- **Env vars**: None required to run. When `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set they activate Supabase (Fase 2): `ProductGrid` carga el catálogo vía `getCatalogo()` (`lib/catalogo.ts`) desde la BD; sin ellas (o ante error/BD vacía) cae a los datos hardcodeados de `data/products.ts`. La tienda funciona en ambos escenarios. Optional `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` injects the GSC HTML-tag meta when set (DNS domain verification is the documented/recommended method). See `.env.example`.
- **Catalog dual source**: `data/products.ts` is the SSR/fallback snapshot (also feeds the static ItemList JSON-LD in layout.tsx). The live grid may come from Supabase once env vars are set. Keep the seed in sync when products change until Fase 4 admin CRUD replaces manual edits.
- **Personalization postponed**: Initial-engraving feature is not implemented. Its UI was removed (`PersonalizaSection`, nav links, `personalizable` filter/category, `customizable` product fields). Dormant plumbing kept intentionally for the future feature: `CartItem.initial` (`CartContext.tsx`) and the `initial` param of `generateWhatsAppLink` (`lib/utils.ts`). Do not advertise personalization anywhere until the real flow exists.
- **Locale**: All UI text is in Spanish (Colombian). `lang="es"`, OpenGraph `locale: "es_CO"`.
- **Product images**: WebP optimized (~11-16 KB each) in `public/products/`. Banner in `public/Banner.webp` (~100 KB). All images use `next/image`.
- **OG share image**: `public/og-image.jpg` (1200×630 JPEG, WhatsApp-safe). Regenerate with `node scripts/generate-og-image.mjs`. Don't use WebP for `og:image` — WhatsApp's crawler often fails to render it.
- **Recompression**: Run `node scripts/optimize-images.mjs` after adding new PNG images to `public/`.

## Roadmap — Fases de Desarrollo

### Fase 1: Frontend Storefront ✅
- Next.js 16 + React 19 + Tailwind v4
- 12 productos hardcoded con imágenes WebP optimizadas
- Carrito con localStorage
- Catálogo con filtros y búsqueda
- QuickViewModal con zoom magnifier
- Checkout vía WhatsApp
- Imágenes migradas a `next/image` (~450 KB total)
- Dark mode forzado a light
- Desplegado en Vercel

### Fase 2: Supabase Foundation 🟡
- [x] Diseñar schema de BD → `supabase/schema.sql` (categories, products, orders, order_items + RLS)
- [x] Seed inicial → `supabase/seed.sql` (3 categorías + los 12 productos, re-ejecutable)
- [x] Clientes tipados → `src/lib/supabase/` (browser + server con cookies, `isSupabaseConfigured()`)
- [x] Variables de entorno documentadas → `.env.example`
- [x] Crear proyecto en Supabase y ejecutar schema.sql + seed.sql (hecho, verificado en Table Editor)
- [ ] Setear env vars en `.env.local` y Vercel (`.env.local` local ya creado con placeholders)
- [x] Migrar el catálogo a lectura desde Supabase (con fallback a datos hardcodeados) → `lib/catalogo.ts`

### Fase 3: Admin Authentication
- Supabase Auth
- Página de login para admin (`/admin/login`)
- Rutas protegidas / middleware
- Gestión de sesión

### Fase 4: Product CRUD
- Dashboard de admin (`/admin`)
- Lista de productos
- Crear / editar / eliminar productos
- Subir imágenes a Supabase Storage

### Fase 5: Categories & Organization
- Gestión de categorías
- Ordenamiento y filtros en admin
- Tags

### Fase 6: Orders & Checkout
- Almacenamiento de pedidos en Supabase
- Vista de gestión de pedidos para admin
- Estados de pedido

### Fase 7: Polish & Production
- ~~SEO (meta tags, structured data, sitemap)~~ ✅ hecho adelantado (JSON-LD JewelryStore/WebSite/ItemList/FAQPage, OG/Twitter cards, sitemap.xml, robots.txt, FAQ visible para AEO)
- Analytics
- Auditoría de performance
- Error handling
- Testing final
