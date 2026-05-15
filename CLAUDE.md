# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Read the Next.js docs before writing any code

This project uses **Next.js 16.2.6** — a version with breaking API changes not present in training data. Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/`. Key entry points:
- `node_modules/next/dist/docs/index.md` — overview and routing behavior
- `node_modules/next/dist/docs/01-app/03-api-reference/01-directives/` — `use client`, `use server`, `use cache`
- `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md` — **required reading if touching navigation** (Suspense placement + `unstable_instant` export)

Heed all deprecation notices in those docs.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint (eslint-config-next)
```

No test runner is configured.

## Stack

- **Next.js 16** App Router (no `pages/` directory)
- **React 19**
- **TypeScript 5** — strict mode, path alias `@/*` maps to repo root
- **Tailwind CSS v4** — CSS-first config; there is no `tailwind.config.js`. Configuration lives in `app/globals.css` via `@import "tailwindcss"` and `@theme inline { … }`.

## Project: SparePlate

A food-rescue marketplace for Eugene, OR. Local businesses post end-of-day surplus; anyone can browse, reserve, and pick it up free.

The `wireframe/` directory is the design and behavior source of truth — a self-contained React prototype (plain JSX + browser globals, no bundler). It contains:

| File | Purpose |
|---|---|
| `wireframe/SparePlate.html` | Entry point, loads all scripts |
| `wireframe/data.js` | Mock data (`SP_DATA` global) |
| `wireframe/app.jsx` | Root `SPApp` component, view routing, role toggle, toast system |
| `wireframe/components.jsx` | `ListingCard`, `MapPanel`, `Sparkline`, `AreaLine` |
| `wireframe/icons.jsx` | `SPIcons` — all SVG icon components |
| `wireframe/view-hub.jsx` | Recipient hub: filter bar, card grid, map |
| `wireframe/view-listing.jsx` | `ListingDrawer` (slide-in detail + reserve flow) |
| `wireframe/view-business.jsx` | Business dashboard + `PostListingModal` (3-step form) |
| `wireframe/view-about.jsx` | "How it works" marketing page |
| `wireframe/styles.css` | All CSS custom properties and class names |
| `wireframe/tweaks-panel.jsx` | Dev-only role/accent toggle panel (omit in production) |

## App architecture

The Next.js implementation lives entirely in `app/`. It is a single-page client app — all views are rendered client-side with no server data fetching.

```
app/
  layout.tsx         # Root layout; loads Geist + Geist Mono via next/font/google
  page.tsx           # Should export the SPApp client component
  globals.css        # Tailwind v4 import + @theme + SparePlate CSS variables/classes
  types.ts           # TypeScript interfaces (Listing, Business, AppContext, etc.)
  data.ts            # SP_DATA: all mock data, mapPins generation
  components/
    utils.ts         # fmtTime(), windowState() — shared pure functions
    Icons.tsx        # All SVG icon components (ported from wireframe/icons.jsx)
    ListingCard.tsx  # Card used in hub grid
    MapPanel.tsx     # Sticky map with pins + list
    Charts.tsx       # Sparkline, AreaLine SVG charts
    ListingDrawer.tsx # Slide-in detail + reservation success state
    PostListingModal.tsx # 3-step "Post surplus" form
  views/
    HubView.tsx      # Recipient view: hero stats, filter bar, card grid + map
    BusinessView.tsx # Business dashboard: impact stats, listings table, pickups
    AboutView.tsx    # "How it works" page
```

## Key implementation notes

**Client components**: `'use client'` is needed only at the client-server boundary — the root `SPApp` component (in `page.tsx` or a dedicated file). Components imported by a client component are automatically client-rendered without their own `'use client'` directive.

**CSS approach**: The wireframe's `styles.css` defines all the design tokens (CSS custom properties) and semantic class names (`.card`, `.btn`, `.drawer`, `.window-pill`, etc.). Port these into `app/globals.css` alongside the Tailwind import. Components use these class names directly; Tailwind utilities fill any gaps.

**CSS variables for theming**: Brand accent color is controlled by CSS custom properties on `:root` (`--terra`, `--terra-50`, `--terra-100`, `--terra-ink`, `--leaf-*`). The wireframe swaps them dynamically; in the Next.js app this can be done via `document.documentElement.style.setProperty(...)` in a `useEffect`.

**AppContext pattern**: All views receive a single `ctx: AppContext` prop (defined in `types.ts`) containing `data`, `now`, `listings` (stateful), and callback functions (`openListing`, `claimListing`, `addListing`, `addToast`).

**No routing**: The app uses a single `view` state variable (`'hub' | 'business' | 'about'`) to switch views. No Next.js `router.push()` needed.
