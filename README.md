# CIALÉ | Joyería Artesanal

<p align="center">
  <em>"Cada pieza es única. Como quién la lleva."</em>
</p>

<p align="center">
  <em>"Detalles que cuentan historias."</em>
</p>

---

## English

### Overview

**CIALÉ** is a luxury artisanal jewelry e-commerce storefront built for the Colombian market. It showcases 12 handcrafted necklaces with variant selectors (color/material), product personalization (initial engraving), a shopping cart with localStorage persistence, and WhatsApp-based checkout — no payment gateway required.

The site is designed as a **single-page application** with smooth anchor-link navigation between sections: Hero, Catalog, Customization, About Us, and Contact.

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19** |
| Styling | **Tailwind CSS v4** (new `@theme inline` engine) |
| Animations | **Framer Motion 11** |
| Icons | **Lucide React** |
| Utilities | **clsx** + **tailwind-merge** (`cn()` helper) |
| Language | **TypeScript 5** |
| Deployment | **Vercel** |

### Features

- **12 artisanal products** with optimized WebP photography, descriptions, and variant selectors
- **Product filtering** by category (Todos, Dijes, Colección Marina, Colección) with real-time text search
- **Quick View modal** — click any product card to see details, pick variants, choose quantity, and add to cart
- **Shopping cart drawer** — slide-in panel with item management (add/remove/quantity), subtotal calculation, and WhatsApp checkout
- **WhatsApp integration** — cart checkout generates a pre-filled WhatsApp message with item list, variants, total in COP, and optional delivery address
- **Accessible modals** — Escape to close, keyboard focus trapping, focus restoration on close, and body scroll lock
- **Responsive design** — mobile-first grid: 1 col → 2 col → 3 col → 4 col
- **Announcement bar** — sticky promotional banner at the top
- **Sticky header** — logo, navigation, search icon, cart icon with badge counter
- **Footer** — contact info (Chía, Cundinamarca), phone numbers, Instagram link
- **Smooth scrolling** — anchor-based navigation between page sections
- **localStorage cart persistence** — cart survives page refreshes
- **Google Fonts** — Playfair Display (serif headings) + Inter (body text)
- **SEO & AEO** — `metadataBase` + Open Graph/Twitter cards, `sitemap.xml`, `robots.txt`, JSON-LD structured data (`JewelryStore`, `WebSite`, product `ItemList`, `FAQPage`), visible FAQ section, and optional Google Search Console verification via env var

### Project Structure

```
Ciale/
├── AGENTS.md              # Agent instructions for AI tools
├── README.md              # This file
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── scripts/
│   └── optimize-images.mjs   # Recompresses PNGs to WebP via sharp
├── supabase/
│   ├── schema.sql            # Tables + RLS (run in Supabase SQL Editor)
│   └── seed.sql              # 3 categories + 12 products (re-runnable)
├── public/                   # Static assets: banner, logos, product images (WebP)
└── src/
    ├── app/
    │   ├── globals.css    # Tailwind v4 theme + global styles
    │   ├── layout.tsx     # Root layout: fonts, SEO metadata, JSON-LD, CartProvider
    │   ├── page.tsx       # Single page: assembles all sections
    │   ├── robots.ts      # robots.txt generator
    │   └── sitemap.ts     # sitemap.xml generator
    ├── components/
    │   ├── AnnouncementBar.tsx    # Top promo bar
    │   ├── Header.tsx             # Sticky navbar + mobile menu
    │   ├── HeroSection.tsx        # Landing hero with CTA
    │   ├── ProductCard.tsx        # Individual product card
    │   ├── ProductGrid.tsx        # Filterable grid + search
    │   ├── QuickViewModal.tsx     # Product detail modal
    │   ├── CartDrawer.tsx         # Slide-in cart panel
    │   ├── SobreNosotros.tsx      # About us + value props
    │   ├── FaqSection.tsx         # FAQ accordion (AEO content)
    │   └── Footer.tsx             # Footer with contact
    ├── context/
    │   └── CartContext.tsx   # Cart state + localStorage
    ├── data/
    │   ├── products.ts      # 12 hardcoded product definitions
    │   └── faqs.ts          # FAQ content (visible section + FAQPage schema)
    ├── hooks/
    │   └── useDialog.ts     # Dialog a11y hook (Escape, focus trap, scroll lock)
    └── lib/
        ├── utils.ts         # cn(), formatCOP(), generateWhatsAppLink(), WHATSAPP_NUMBER
        └── supabase/        # Typed clients + Database types (Fase 2)
```

### Getting Started

#### Prerequisites

- **Node.js** 18+ (tested with v22)
- **npm** 10+ (npm v11 has a known bug — see below)

#### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/Ciale.git
cd Ciale

# Install dependencies
npm install

# ⚠️ If npm fails with "Invalid Version" error (npm v11 bug with @tailwindcss/oxide):
npx npm@10 install
```

#### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Build & Verify

```bash
npm run build      # Production build — use this to verify changes
npm run lint       # ESLint
npx tsc --noEmit   # Type checking (no script defined, run directly)
```

### Design System

#### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#FDFBF7` | Page background |
| `cream-dark` | `#FAF8F5` | Gradient backgrounds |
| `charcoal` | `#2D2926` | Primary text, hover states |
| `coffee` | `#3E3228` | Headings, buttons, deep accents |
| `nude` | `#E8D3C8` | Soft accents, swatches, scrollbar |
| `coral` | `#E79C88` | Primary accent, CTAs, highlights |
| `gold` | `#D4AF37` | Premium badges, customization tags |
| `sage` | `#A3B18A` | WhatsApp buttons, secondary accents |
| `border` | `#EFECE6` | Card borders, dividers |
| `gray-soft` | `#9B9590` | Muted secondary text |
| `gray-light` | `#D1CCC7` | Placeholder text |

#### Typography

- **Headings**: Playfair Display (serif) — loaded via `next/font/google`
- **Body**: Inter (sans-serif) — loaded via `next/font/google`
- **CSS Variables**: `--font-playfair`, `--font-inter`
- **Tailwind classes**: `font-serif` → Playfair, `font-sans` → Inter

#### Utility Function

```typescript
import { cn } from "@/lib/utils";

// Combines clsx (conditional classes) + tailwind-merge (deduplication)
<div className={cn("base-class", isActive && "active-class", className)} />
```

### Customization Guide

#### Adding Products

Edit `src/data/products.ts`. Each product follows this interface:

```typescript
interface Product {
  id: string;           // Unique slug
  name: string;         // Display name
  description: string;  // Short description
  price: number;        // Price in COP (e.g., 50000)
  category: "dijes" | "marina" | "coleccion";
  tags: string[];       // Search keywords
  image: string;        // Path to WebP product image in /public/products
  gradient: string;     // Tailwind gradient for placeholder card
  variants: ProductVariant[];
}
```

#### Changing the WhatsApp Number

Search for `573203039847` in `ProductCard.tsx` and `CartDrawer.tsx`. Replace with the target number in international format (no `+`).

#### Changing Colors

Edit the `@theme inline` block in `src/app/globals.css`.

### Supabase Setup (Fase 2)

The database layer is ready; connecting it requires your Supabase account:

1. Create a project at [supabase.com](https://supabase.com)
2. Open its **SQL Editor** and run `supabase/schema.sql`, then `supabase/seed.sql` (both are re-runnable)
3. Copy credentials from *Project Settings → API*: **Project URL** and the `anon` `public` key
4. Locally: copy `.env.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. In Vercel → Settings → Environment Variables, add the same two values

Until those env vars exist, `isSupabaseConfigured()` returns `false` and the storefront keeps serving hardcoded data — nothing breaks either way.

### Deployment (Vercel)

1. Push to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Framework Preset: **Next.js** (auto-detected)
4. Deploy

No environment variables are required for the storefront. The only optional one is `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (see SEO section below). No root directory configuration needed — `package.json` is at the repo root.

### SEO & AEO

Technical SEO and answer-engine optimization are built in:

- **Metadata** (`src/app/layout.tsx`): `metadataBase`, canonical URL, Open Graph and Twitter cards using `/og-image.jpg` (1200×630 JPEG — WhatsApp-safe, regenerated from the banner by `scripts/generate-og-image.mjs`) as share image
- **Structured data (JSON-LD)**: `JewelryStore` (local business), `WebSite`, an `ItemList` of all 12 products with COP prices, and `FAQPage` — injected in the root layout
- **Visible FAQ**: accordion section rendered by `FaqSection.tsx`; its content lives in `src/data/faqs.ts` and mirrors the `FAQPage` schema
- **Sitemap & robots**: generated at build time by `src/app/sitemap.ts` and `src/app/robots.ts`

#### Google Search Console Verification

Recommended method — **DNS domain verification**:

1. Open [Google Search Console](https://search.google.com/search-console) and add `ciale.online` as a **Domain** property.
2. Google shows a `TXT` record like `google-site-verification=XXXX`. Add it at your DNS provider (wherever `ciale.online` is managed) as a `TXT` record on the root (`@`) host.
3. Wait for DNS propagation, then click **Verify**.
4. Submit `https://ciale.online/sitemap.xml` under *Sitemaps*.

DNS verification covers the whole domain (including subdomains) and doesn't depend on deploys, hosting, or environment variables.

> Alternative: URL-prefix property + HTML-tag method — set the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var to the `content` value Google provides; the site injects the meta tag automatically when it's present.

### Known Limitations

- **No backend**: All data is hardcoded. No API routes, no CMS integration, no database.
- **No tests**: No test framework is configured.
- **Single locale**: UI is entirely in Spanish (Colombian). No i18n support.
- **Personalization not implemented**: The initial-engraving feature is postponed — its section, nav links, filter tab, and product data fields were removed until it ships.

### Roadmap

| Phase | Status | Description |
|---|---|---|
| **Fase 1** | ✅ Done | Frontend storefront — products, cart, WhatsApp checkout, WebP images |
| **Fase 2** | Partial | Supabase Foundation — catalog reads from Supabase with local fallback; activation pending (env vars in .env.local / Vercel) |
| **Fase 3** | Pending | Admin Authentication — Supabase Auth, login page, protected routes |
| **Fase 4** | Pending | Product CRUD — admin dashboard, create/edit/delete products |
| **Fase 5** | Pending | Categories & Organization — category management, tags, ordering |
| **Fase 6** | Pending | Orders & Checkout — order storage, admin view, status tracking |
| **Fase 7** | Partial | Polish & Production — analytics, performance, error handling, testing *(SEO & AEO already done)* |

---

## Español

### Descripción General

**CIALÉ** es una tienda virtual de joyería artesanal de lujo diseñada para el mercado colombiano. Presenta 12 collares artesanales con selectores de variantes (color/material), personalización de productos (grabado de inicial), un carrito de compras con persistencia en `localStorage`, y finalización de pedido vía **WhatsApp** — sin necesidad de pasarela de pago.

El sitio funciona como una **aplicación de una sola página** con navegación suave por enclavijado entre secciones: Hero, Catálogo, Personalización, Sobre Nosotros y Contacto.

### Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19** |
| Estilos | **Tailwind CSS v4** (nuevo motor `@theme inline`) |
| Animaciones | **Framer Motion 11** |
| Iconos | **Lucide React** |
| Utilidades | **clsx** + **tailwind-merge** (helper `cn()`) |
| Lenguaje | **TypeScript 5** |
| Despliegue | **Vercel** |

### Funcionalidades

- **12 productos artesanales** con fotografía WebP optimizada, descripciones y selectores de variantes
- **Filtrado de productos** por categoría (Todos, Dijes, Colección Marina, Colección) con búsqueda en tiempo real
- **Modal de Vista Rápida** — haz clic en cualquier tarjeta para ver detalles, elegir variantes, cantidad y agregar al carrito
- **Drawer del carrito** — panel lateral con gestión de artículos (agregar/quitar/cantidad), cálculo de subtotales y checkout por WhatsApp
- **Integración con WhatsApp** — el checkout genera un mensaje prellenado con lista de productos, variantes, total en COP y dirección de entrega opcional
- **Modales accesibles** — cierre con Escape, trampa de foco por teclado, restauración de foco al cerrar y bloqueo de scroll
- **Diseño responsivo** — grid mobile-first: 1 col → 2 col → 3 col → 4 col
- **Barra de anuncios** — banner promocional fijo en la parte superior
- **Header fijo** — logo, navegación, ícono de búsqueda, ícono de carrito con contador
- **Footer** — información de contacto (Chía, Cundinamarca), teléfonos, Instagram
- **Scroll suave** — navegación basada en anclas entre secciones
- **Persistencia del carrito** — el carrito sobrevive recargas de página via `localStorage`
- **Google Fonts** — Playfair Display (serif para títulos) + Inter (texto cuerpo)
- **SEO y AEO** — `metadataBase` + tarjetas Open Graph/Twitter, `sitemap.xml`, `robots.txt`, datos estructurados JSON-LD (`JewelryStore`, `WebSite`, `ItemList` de productos, `FAQPage`), sección FAQ visible y verificación opcional de Google Search Console vía variable de entorno

### Estructura del Proyecto

```
Ciale/
├── AGENTS.md              # Instrucciones para herramientas de IA
├── README.md              # Este archivo
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── scripts/
│   └── optimize-images.mjs   # Recomprime PNGs a WebP con sharp
├── supabase/
│   ├── schema.sql            # Tablas + RLS (ejecutar en el SQL Editor de Supabase)
│   └── seed.sql              # 3 categorías + 12 productos (re-ejecutable)
├── public/                   # Assets estáticos: banner, logos e imágenes de productos (WebP)
└── src/
    ├── app/
    │   ├── globals.css    # Tema Tailwind v4 + estilos globales
    │   ├── layout.tsx     # Layout raíz: fuentes, metadata SEO, JSON-LD, CartProvider
    │   ├── page.tsx       # Página única: ensambla todas las secciones
    │   ├── robots.ts      # Generador de robots.txt
    │   └── sitemap.ts     # Generador de sitemap.xml
    ├── components/
    │   ├── AnnouncementBar.tsx    # Barra promocional superior
    │   ├── Header.tsx             # Navbar fijo + menú móvil
    │   ├── HeroSection.tsx        # Hero de aterrizaje con CTA
    │   ├── ProductCard.tsx        # Tarjeta individual de producto
    │   ├── ProductGrid.tsx        # Cuadrícula filtrable + búsqueda
    │   ├── QuickViewModal.tsx     # Modal de detalle de producto
    │   ├── CartDrawer.tsx         # Panel lateral del carrito
    │   ├── SobreNosotros.tsx      # Sobre nosotros + propuestas de valor
    │   ├── FaqSection.tsx         # Acordeón de preguntas frecuentes (contenido AEO)
    │   └── Footer.tsx             # Footer con contacto
    ├── context/
    │   └── CartContext.tsx   # Estado del carrito + localStorage
    ├── data/
    │   ├── products.ts      # 12 definiciones de productos hardcodeados
    │   └── faqs.ts          # Contenido FAQ (sección visible + schema FAQPage)
    ├── hooks/
    │   └── useDialog.ts     # Hook de a11y para diálogos (Escape, focus trap, scroll lock)
    └── lib/
        ├── utils.ts         # cn(), formatCOP(), generateWhatsAppLink(), WHATSAPP_NUMBER
        └── supabase/        # Clientes tipados + tipos Database (Fase 2)
```

### Primeros Pasos

#### Prerrequisitos

- **Node.js** 18+ (probado con v22)
- **npm** 10+ (npm v11 tiene un bug conocido — ver más abajo)

#### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Ciale.git
cd Ciale

# Instalar dependencias
npm install

# ⚠️ Si npm falla con error "Invalid Version" (bug de npm v11 con @tailwindcss/oxide):
npx npm@10 install
```

#### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

#### Construcción y Verificación

```bash
npm run build      # Build de producción — usa esto para verificar cambios
npm run lint       # ESLint
npx tsc --noEmit   # Verificación de tipos (no hay script definido, ejecutar directamente)
```

### Sistema de Diseño

#### Paleta de Colores

| Token | Hex | Uso |
|---|---|---|
| `cream` | `#FDFBF7` | Fondo de página |
| `cream-dark` | `#FAF8F5` | Fondos de degradado |
| `charcoal` | `#2D2926` | Texto primario, estados hover |
| `coffee` | `#3E3228` | Encabezados, botones, acentos profundos |
| `nude` | `#E8D3C8` | Acentos suaves, swatches, scrollbar |
| `coral` | `#E79C88` | Acento principal, CTAs, resaltados |
| `gold` | `#D4AF37` | Insignias premium, etiquetas de personalización |
| `sage` | `#A3B18A` | Botones de WhatsApp, acentos secundarios |
| `border` | `#EFECE6` | Bordes de tarjetas, divisores |
| `gray-soft` | `#9B9590` | Texto secundario atenuado |
| `gray-light` | `#D1CCC7` | Texto placeholder |

#### Tipografía

- **Encabezados**: Playfair Display (serif) — cargada vía `next/font/google`
- **Cuerpo**: Inter (sans-serif) — cargada vía `next/font/google`
- **Variables CSS**: `--font-playfair`, `--font-inter`
- **Clases Tailwind**: `font-serif` → Playfair, `font-sans` → Inter

#### Función de Utilidad

```typescript
import { cn } from "@/lib/utils";

// Combina clsx (clases condicionales) + tailwind-merge (deduplicación)
<div className={cn("base-class", isActive && "active-class", className)} />
```

### Guía de Personalización

#### Agregar Productos

Edita `src/data/products.ts`. Cada producto sigue esta interfaz:

```typescript
interface Product {
  id: string;           // Slug único
  name: string;         // Nombre para mostrar
  description: string;  // Descripción corta
  price: number;        // Precio en COP (ej: 50000)
  category: "dijes" | "marina" | "coleccion";
  tags: string[];       // Palabras clave de búsqueda
  image: string;        // Ruta a la imagen WebP del producto en /public/products
  gradient: string;     // Degradado de Tailwind para tarjeta placeholder
  variants: ProductVariant[];
}
```

#### Cambiar el Número de WhatsApp

Actualiza la constante `WHATSAPP_NUMBER` en `src/lib/utils.ts`. Usa formato internacional sin `+`.

#### Cambiar Colores

Edita el bloque `@theme inline` en `src/app/globals.css`.

### Configuración de Supabase (Fase 2)

La capa de base de datos está lista; conectarla requiere tu cuenta de Supabase:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Abre su **SQL Editor** y ejecuta `supabase/schema.sql`, luego `supabase/seed.sql` (ambos son re-ejecutables)
3. Copia las credenciales desde *Project Settings → API*: **Project URL** y la clave `anon` `public`
4. Localmente: copia `.env.example` a `.env.local` y completa `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. En Vercel → Settings → Environment Variables, agrega los mismos dos valores

Hasta que existan esas variables, `isSupabaseConfigured()` retorna `false` y la tienda sigue sirviendo datos hardcodeados — nada se rompe en ningún escenario.

### Despliegue (Vercel)

1. Subir a GitHub
2. Importar el repositorio en [vercel.com](https://vercel.com)
3. Framework Preset: **Next.js** (detectado automáticamente)
4. Desplegar

No se requieren variables de entorno para la tienda. La única opcional es `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (ver sección de SEO abajo). No se necesita configurar directorio raíz — `package.json` está en la raíz del repositorio.

### SEO y AEO

El sitio incluye SEO técnico y optimización para motores de respuesta (answer engines):

- **Metadata** (`src/app/layout.tsx`): `metadataBase`, URL canónica, tarjetas Open Graph y Twitter usando `/og-image.jpg` (1200×630 JPEG — segura para WhatsApp, regenerada desde el banner con `scripts/generate-og-image.mjs`) como imagen de compartir
- **Datos estructurados (JSON-LD)**: `JewelryStore` (negocio local), `WebSite`, un `ItemList` con los 12 productos y sus precios en COP, y `FAQPage` — inyectados en el layout raíz
- **FAQ visible**: sección acordeón renderizada por `FaqSection.tsx`; su contenido vive en `src/data/faqs.ts` y refleja el schema `FAQPage`
- **Sitemap y robots**: generados en build por `src/app/sitemap.ts` y `src/app/robots.ts`

#### Verificación en Google Search Console

Método recomendado — **verificación por DNS (dominio)**:

1. Abre [Google Search Console](https://search.google.com/search-console) y agrega `ciale.online` como propiedad de **Dominio**.
2. Google muestra un registro `TXT` como `google-site-verification=XXXX`. Agrégalo en tu proveedor de DNS (donde esté gestionado `ciale.online`) como registro `TXT` en el host raíz (`@`).
3. Espera la propagación de DNS y haz clic en **Verificar**.
4. Envía `https://ciale.online/sitemap.xml` en *Sitemaps*.

La verificación por DNS cubre todo el dominio (incluyendo subdominios) y no depende de deploys, hosting ni variables de entorno.

> Alternativa: propiedad de Prefijo de URL con método Etiqueta HTML — define la variable de entorno `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` con el valor `content` que entrega Google; el sitio inyecta la etiqueta meta automáticamente cuando existe.

### Limitaciones Conocidas

- **Sin backend**: Todos los datos están hardcodeados. Sin rutas API, sin integración CMS, sin base de datos.
- **Sin tests**: No hay framework de pruebas configurado.
- **Solo un idioma**: La interfaz está completamente en español (colombiano). Sin soporte i18n.
- **Personalización no implementada**: La función de inicial grabada está aplazada — su sección, enlaces de navegación, filtro y campos de producto fueron removidos hasta que se implemente.

### Hoja de Ruta

| Fase | Estado | Descripción |
|---|---|---|
| **Fase 1** | ✅ Listo | Frontend storefront — productos, carrito, checkout WhatsApp, imágenes WebP |
| **Fase 2** | Parcial | Supabase Foundation — el catálogo lee de Supabase con fallback local; falta activar con env vars (.env.local / Vercel) |
| **Fase 3** | Pendiente | Autenticación Admin — Supabase Auth, página de login, rutas protegidas |
| **Fase 4** | Pendiente | CRUD de Productos — dashboard admin, crear/editar/eliminar productos |
| **Fase 5** | Pendiente | Categorías y Organización — gestión de categorías, tags, ordenamiento |
| **Fase 6** | Pendiente | Pedidos y Checkout — almacenamiento de pedidos, vista admin, estados |
| **Fase 7** | Parcial | Pulido y Producción — analytics, performance, error handling, testing *(SEO y AEO ya implementados)* |

---

<p align="center">
  <em>CIALÉ — Hecho con ❤️ en Colombia</em>
</p>
