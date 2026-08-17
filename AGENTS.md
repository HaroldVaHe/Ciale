# AGENTS.md

## Project

CIALÉ — artisanal jewelry e-commerce storefront (Next.js 16 + React 19 + Tailwind v4).
Single-page app: all content lives on `/`. Navigation uses anchor links (`#catalogo`, etc.).
Checkout is via **WhatsApp** (no payment gateway).

## Structure

The Next.js app lives at the repo root.

```
src/
├── app/          # layout.tsx, page.tsx (both "use client"), globals.css
├── components/   # 10 client components, all "use client"
├── context/      # CartContext.tsx (React Context + localStorage)
├── data/         # products.ts (12 hardcoded products)
└── lib/          # utils.ts (cn, formatCOP, generateWhatsAppLink)
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
- **WhatsApp number**: Hardcoded as `573203039847` in `ProductCard.tsx` and `CartDrawer.tsx`.
- **Cart key**: localStorage key is `ciale-cart`.

## Gotchas

- **No product images**: `public/` only has default Next.js SVGs. Product cards render gradient placeholders with initial letters. Images referenced in product data (`/products/*.jpg`) do not exist.
- **"coleccion" category gap**: Products with `category: "coleccion"` exist in data but the filter UI only shows `all`, `dijes`, `personalizable`, `marina`. These products are only findable via search.
- **All client components**: Every component and even `page.tsx` is `"use client"`. Server components and API routes are not used despite App Router setup.
- **No env vars**: The app uses no environment variables. The WhatsApp number and brand info are hardcoded.
- **Locale**: All UI text is in Spanish (Colombian). `lang="es"`, OpenGraph `locale: "es_CO"`.
