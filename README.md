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

- **12 artisanal products** with unique gradient placeholders, descriptions, and variant selectors
- **Product filtering** by category (Todos, Dijes, Personalizables, Colección Marina) with real-time text search
- **Quick View modal** — click any product card to see details, pick variants, choose quantity, and add to cart
- **Shopping cart drawer** — slide-in panel with item management (add/remove/quantity), subtotal calculation, and WhatsApp checkout
- **Personalization** — selectable initial engraving for compatible products (e.g., Aura Rosa)
- **WhatsApp integration** — cart checkout generates a pre-filled WhatsApp message with item list, variants, initials, and total in COP
- **Responsive design** — mobile-first grid: 1 col → 2 col → 3 col → 4 col
- **Announcement bar** — sticky promotional banner at the top
- **Sticky header** — logo, navigation, search icon, cart icon with badge counter
- **Footer** — contact info (Chía, Cundinamarca), phone numbers, Instagram link
- **Smooth scrolling** — anchor-based navigation between page sections
- **localStorage cart persistence** — cart survives page refreshes
- **Google Fonts** — Playfair Display (serif headings) + Inter (body text)

### Project Structure

```
Ciale/
├── AGENTS.md                    # Agent instructions for AI tools
├── README.md                    # This file
└── ciale-app/                   # ← Next.js application root
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    ├── public/                  # Static assets (currently only default SVGs)
    └── src/
        ├── app/
        │   ├── globals.css      # Tailwind v4 theme + global styles
        │   ├── layout.tsx       # Root layout: fonts, metadata, CartProvider
        │   └── page.tsx         # Single page: assembles all sections
        ├── components/
        │   ├── AnnouncementBar.tsx    # Top promo bar
        │   ├── Header.tsx             # Sticky navbar + mobile menu
        │   ├── HeroSection.tsx        # Landing hero with CTA
        │   ├── ProductCard.tsx        # Individual product card
        │   ├── ProductGrid.tsx        # Filterable grid + search
        │   ├── QuickViewModal.tsx     # Product detail modal
        │   ├── CartDrawer.tsx         # Slide-in cart panel
        │   ├── PersonalizaSection.tsx # Customization feature
        │   ├── SobreNosotros.tsx      # About us + value props
        │   └── Footer.tsx             # Footer with contact
        ├── context/
        │   └── CartContext.tsx   # Cart state + localStorage
        ├── data/
        │   └── products.ts      # 12 hardcoded product definitions
        └── lib/
            └── utils.ts         # cn(), formatCOP(), generateWhatsAppLink()
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
cd ciale-app
npm install

# ⚠️ If npm fails with "Invalid Version" error (npm v11 bug with @tailwindcss/oxide):
npx npm@10 install
```

#### Development

```bash
cd ciale-app
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
  category: "dijes" | "personalizable" | "marina" | "coleccion";
  tags: string[];       // Search keywords
  image: string;        // Path to image (currently unused — gradient placeholders shown)
  gradient: string;     // Tailwind gradient for placeholder card
  variants: ProductVariant[];
  customizable: boolean;
  customizableLabel?: string;
}
```

#### Changing the WhatsApp Number

Search for `573203039847` in `ProductCard.tsx` and `CartDrawer.tsx`. Replace with the target number in international format (no `+`).

#### Changing Colors

Edit the `@theme inline` block in `src/app/globals.css`.

### Deployment (Vercel)

1. Push to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Set **Root Directory** to `ciale-app`
4. Framework Preset: **Next.js** (auto-detected)
5. Deploy

No environment variables are required.

### Known Limitations

- **No product images**: The `public/` directory only contains default Next.js SVGs. Product cards display gradient placeholders with the product's initial letter. To add real images, place them in `public/products/` and update the `image` field in `products.ts`.
- **"coleccion" category**: Products in this category exist in data but have no dedicated filter tab — they're only findable via search.
- **No backend**: All data is hardcoded. No API routes, no CMS integration, no database.
- **No tests**: No test framework is configured.
- **Single locale**: UI is entirely in Spanish (Colombian). No i18n support.

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

- **12 productos artesanales** con placeholders degradados, descripciones y selectores de variantes
- **Filtrado de productos** por categoría (Todos, Dijes, Personalizables, Colección Marina) con búsqueda en tiempo real
- **Modal de Vista Rápida** — haz clic en cualquier tarjeta para ver detalles, elegir variantes, cantidad y agregar al carrito
- **Drawer del carrito** — panel lateral con gestión de artículos (agregar/quitar/cantidad), cálculo de subtotales y checkout por WhatsApp
- **Personalización** — selección de inicial grabada para productos compatibles (ej: Aura Rosa)
- **Integración con WhatsApp** — el checkout genera un mensaje prellenado con lista de productos, variantes, iniciales y total en COP
- **Diseño responsivo** — grid mobile-first: 1 col → 2 col → 3 col → 4 col
- **Barra de anuncios** — banner promocional fijo en la parte superior
- **Header fijo** — logo, navegación, ícono de búsqueda, ícono de carrito con contador
- **Footer** — información de contacto (Chía, Cundinamarca), teléfonos, Instagram
- **Scroll suave** — navegación basada en anclas entre secciones
- **Persistencia del carrito** — el carrito sobrevive recargas de página via `localStorage`
- **Google Fonts** — Playfair Display (serif para títulos) + Inter (texto cuerpo)

### Estructura del Proyecto

```
Ciale/
├── AGENTS.md                    # Instrucciones para herramientas de IA
├── README.md                    # Este archivo
└── ciale-app/                   # ← Raíz de la aplicación Next.js
    ├── package.json
    ├── tsconfig.json
    ├── next.config.ts
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    ├── public/                  # Assets estáticos (solo SVGs por defecto)
    └── src/
        ├── app/
        │   ├── globals.css      # Tema Tailwind v4 + estilos globales
        │   ├── layout.tsx       # Layout raíz: fuentes, metadata, CartProvider
        │   └── page.tsx         # Página única: ensambla todas las secciones
        ├── components/
        │   ├── AnnouncementBar.tsx    # Barra promocional superior
        │   ├── Header.tsx             # Navbar fijo + menú móvil
        │   ├── HeroSection.tsx        # Hero de aterrizaje con CTA
        │   ├── ProductCard.tsx        # Tarjeta individual de producto
        │   ├── ProductGrid.tsx        # Cuadrícula filtrable + búsqueda
        │   ├── QuickViewModal.tsx     # Modal de detalle de producto
        │   ├── CartDrawer.tsx         # Panel lateral del carrito
        │   ├── PersonalizaSection.tsx # Sección de personalización
        │   ├── SobreNosotros.tsx      # Sobre nosotros + propuestas de valor
        │   └── Footer.tsx             # Footer con contacto
        ├── context/
        │   └── CartContext.tsx   # Estado del carrito + localStorage
        ├── data/
        │   └── products.ts      # 12 definiciones de productos hardcodeados
        └── lib/
            └── utils.ts         # cn(), formatCOP(), generateWhatsAppLink()
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
cd ciale-app
npm install

# ⚠️ Si npm falla con error "Invalid Version" (bug de npm v11 con @tailwindcss/oxide):
npx npm@10 install
```

#### Desarrollo

```bash
cd ciale-app
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
  category: "dijes" | "personalizable" | "marina" | "coleccion";
  tags: string[];       // Palabras clave de búsqueda
  image: string;        // Ruta a imagen (actualmente no se usa — se muestran placeholders degradados)
  gradient: string;     // Degradado de Tailwind para tarjeta placeholder
  variants: ProductVariant[];
  customizable: boolean;
  customizableLabel?: string;
}
```

#### Cambiar el Número de WhatsApp

Busca `573203039847` en `ProductCard.tsx` y `CartDrawer.tsx`. Reemplázalo con el número deseado en formato internacional (sin `+`).

#### Cambiar Colores

Edita el bloque `@theme inline` en `src/app/globals.css`.

### Despliegue (Vercel)

1. Subir a GitHub
2. Importar el repositorio en [vercel.com](https://vercel.com)
3. Configurar **Root Directory** a `ciale-app`
4. Framework Preset: **Next.js** (detectado automáticamente)
5. Desplegar

No se requieren variables de entorno.

### Limitaciones Conocidas

- **Sin imágenes de producto**: El directorio `public/` solo contiene SVGs por defecto de Next.js. Las tarjetas de producto muestran placeholders degradados con la inicial del producto. Para agregar imágenes reales, colócalas en `public/products/` y actualiza el campo `image` en `products.ts`.
- **Categoría "coleccion"**: Los productos en esta categoría existen en los datos pero no tienen pestaña de filtro dedicada — solo se encuentran mediante búsqueda.
- **Sin backend**: Todos los datos están hardcodeados. Sin rutas API, sin integración CMS, sin base de datos.
- **Sin tests**: No hay framework de pruebas configurado.
- **Solo un idioma**: La interfaz está completamente en español (colombiano). Sin soporte i18n.

---

<p align="center">
  <em>CIALÉ — Hecho con ❤️ en Colombia</em>
</p>
