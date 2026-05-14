# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Portfolio dev server (Vite)
pnpm dev

# Storybook dev server (port 6006) — all stories
pnpm storybook

# Storybook dev server — production stories only
pnpm storybook:prd

# Build portfolio
pnpm build

# Build static Storybook (all stories)
pnpm build-storybook

# Build static Storybook (production stories only)
pnpm build-storybook:prd

# Format code
pnpm format

# Check formatting
pnpm format:check
```

There is no standalone test command; Storybook's Vitest addon (`@storybook/addon-vitest`) is present as a dependency but is currently commented out in `.storybook/main.ts`.

## Architecture

This repo serves two purposes simultaneously:
1. **Portfolio website** — a personal portfolio SPA at `src/portfolio/components/portfolio.component.tsx`, served via Vite
2. **Component library / creative lab** — Storybook showcasing 3D, HTML, and Pixi.js experiments

### Story categories

Stories live under `src/stories/` and are organized into three technology groups:

- **`three/`** — React Three Fiber + Three.js scenes (3D products, shaders, terrain, particles, WASM)
- **`html/`** — DaisyUI + Tailwind components (buttons, cards, badges, icons)
- **`pixi/`** — Pixi.js canvas experiments (2D trails, hello world)

Each story component lives alongside a `.stories.tsx` file and often a `.config.ts` for Leva controls.

### Production vs development stories

`STORYBOOK_ENV=production` activates a curated subset of stories (see `.storybook/main.ts`). The `pnpm storybook:prd` and `pnpm build-storybook:prd` commands toggle this mode.

### MayoCanvas — shared 3D wrapper

All Three.js stories render inside `src/stories/three/non-stories-components/mayo-canvas/mayo-canvas.tsx`. It wraps R3F `<Canvas>` with:
- `SceneEnvironment` (lights, shadows)
- `Controls` (OrbitControls, optional)
- `Gizmos` (optional axis helper)

When creating a new Three.js story, compose the scene inside `<MayoCanvas>`.

### Path aliases

Defined in `tsconfig.app.json` and resolved via `vite-tsconfig-paths`:

| Alias | Resolves to |
|---|---|
| `Data/*` | `src/data/*` |
| `Interfaces/*` | `src/interfaces/*` |
| `HtmlComponents/*` | `src/stories/html/*` |

### Styling

- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin, not PostCSS)
- **DaisyUI** for component classes — themes are `light` and `dark`, toggled via `data-theme` attribute on a wrapper element
- Custom color `camelot-*` is used throughout (rose/crimson palette)
- Storybook preview toolbar exposes a light/dark theme switcher that sets `data-theme` on the story wrapper

### GLTF assets

3D model files (`.glb`) are stored in `src/gltf/` and imported directly in story components.

### i18n

Translations live in `src/i18n/locales/` (en, de, es). The portfolio component uses `react-i18next`. The language switcher in the sidebar is currently commented out pending full translation coverage.

### Contact form

The contact form in `portfolio.component.tsx` sends messages directly to a Telegram Bot API. The bot token and chat ID are hardcoded in the component (marked `//Todo save as env vars`). SMTP email config via `.env` is stubbed but not wired up — see `.env.example` and `src/services/email.service.ts`.
