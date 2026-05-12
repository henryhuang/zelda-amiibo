# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (--host 0.0.0.0)
npm run build     # Build static site to build/
npm run preview   # Preview production build
npm run check     # Svelte + TypeScript type checking
npm run lint      # Prettier check + ESLint
npm run format    # Prettier format all files
```

## Environment

- `VITE_AMIIBO_IMG_ENDPOINT` (required) - Base URL for Amiibo images. Must be set before dev/build.
- No test framework is configured; `npm run check` is the validation command.

## Architecture

### Stack

SvelteKit 2 with static adapter (`@sveltejs/adapter-static`), Svelte 5, Tailwind CSS 4, Flowbite Svelte components, TypeScript. Deployed via GitHub Actions (build + rsync to server).

### Data Flow

1. **Source of truth**: `src/lib/data/zelda-amiibo.json` — local JSON of all Amiibo records.
2. **Loader** (`src/lib/data/loader.ts`): Tries fetching a remote JSON URL first (8s timeout); falls back to bundled JSON. Results sorted by releaseDate descending.
3. **Server load** (`src/routes/+layout.server.ts`): Runs on every page load, computes series-level collection stats, passes data to layout.
4. **Store initialization** (`src/store.ts`): `+layout.svelte` calls `initStore` with computed totals (progress rate, collected count, cost), amiibo list, series stats, and image endpoint. Gallery image URLs are constructed from endpoint + image filenames.
5. **Components** read from writable stores (`amiibos`, `collectedInfo`, `series`, `gallery`).

### Pages

| Route | File | Content |
|-------|------|---------|
| `/` | `+page.svelte` | Home — renders `AmiiboMuseum` with all filters/views |
| `/collecting` | `collecting/+page.svelte` | Collection page — same `AmiiboMuseum` but defaults to "collected" filter |
| `/gallery` | `gallery/+page.svelte` | Simple image gallery — reuses `GalleryShow` |

### Key Components

- **`AmiiboMuseum.svelte`** (`routes/components/`): The hub — renders hero section with progress card, stats grid, filter toolbar, search, sort, view toggle (grid/list), and the card grid. Contains all filtering/sorting/state logic using Svelte 5 `$state`/`$derived`. Accepts `initialStatus` and `initialView` props.
- **`AmiiboCard.svelte`** (`routes/collecting/`): Individual card with image, name, series, date, collection info. Uses Flowbite `Card` component.
- **`Header.svelte`**: Page title (in `<svelte:head>`), brand link, backup download button.
- **`GalleryShow.svelte`**: Image grid for gallery page.

### Data Model

All types in `src/@types/type.d.ts`:
- `Amiibo` — id, name, series, releaseDate (YYYY.MM.DD), images (toy + box filenames), optional `collectedInfo`, detail URL
- `AmiiboCollectedInfo` — collected (boolean), collectDate, price
- `CollectedInfo` — progressRate, collectedNum, totalNum, cost
- Image URLs are constructed at runtime: `${VITE_AMIIBO_IMG_ENDPOINT}/${filename}`

### Design System

All styles live in `src/app.css` using CSS custom properties (`--totk-*`). Tailwind utility classes used sparsely alongside BEM-like class names (`.museum-*`). Responsive breakpoints: 1280px, 900px, 560px.

### Conventions

- Date format: `YYYY.MM.DD` throughout JSON data. `moment` library used for formatting to display strings.
- `collectedInfo` being present on an Amiibo means it's collected (boolean `collected` field).
- Series names in JSON must match exactly for correct grouping.
- Image files are not in repo; served from external endpoint configured via env var.
