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

# Build with staging flags (VITE_USE_CAMERA_PATH_BG, VITE_USE_MOUSE_WARP, etc.)
pnpm build --mode staging

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
- `fullscreen` prop — `false` (default) = fixed 800×600 with border for Storybook; `true` = 100% width/height for portfolio or fullscreen use

When creating a new Three.js story, compose the scene inside `<MayoCanvas>`. For portfolio fullscreen use, pass `fullscreen` and wrap in a `fixed inset-0 pointer-events-none` div.

### Feature flags

All feature flags live in `src/config/flags.ts` and are driven by Vite env vars (`VITE_*`). Flags default to `false` when the env var is not set.

| Flag                 | Env var                   | Effect                                                                    |
| -------------------- | ------------------------- | ------------------------------------------------------------------------- |
| `USE_CAMERA_PATH_BG` | `VITE_USE_CAMERA_PATH_BG` | Use Berlin fly-through background in portfolio instead of physics spheres |
| `USE_MOUSE_WARP`     | `VITE_USE_MOUSE_WARP`     | Enable screen-space mouse warp post-processing in the CameraPath scene    |

Env files: `.env.staging` is activated with `pnpm build --mode staging`. Never commit secret values — use `.env.example` as the template.

### Berlin fly-through background (`CameraPath`)

The main portfolio background is a cinematic Berlin point-cloud fly-through driven by Theatre.js + scroll.

Key files:

- `src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx` — scene component (camera, mesh group, scroll sync, effects)
- `src/stories/three/stories-components/experiences/camera-path/CameraPath.stories.tsx` — Storybook story (Theatre.js studio init, `getTheatreState()` helper)
- `src/stories/three/stories-components/experiences/camera-path/theatreState.json` — saved Theatre.js keyframes (project `BerlinTour`, sheet `Scene`, camera key `Camera`)
- `src/components/camera-path-background/CameraPathBackground.tsx` — portfolio wrapper using `MayoCanvas fullscreen` + `SheetProvider`

**Theatre.js state export:** After recording keyframes in the Storybook story, run `getTheatreState()` in the browser console. This calls `studio.__experimental.__experimental_createContentOfSaveFileTyped('BerlinTour')` which produces `{ definitionVersion, sheetsById, revisionHistory }` — the exact shape `getProject(id, { state })` requires. Paste the output into `theatreState.json`.

**Scroll modes (`scrollMode` prop on `CameraPath`):**

- `'wheel'` — wheel event on canvas element; works in Storybook embedded (default)
- `'native'` — `useScroll()` from Drei; requires `<ScrollControls>` ancestor
- `'page'` — `window.scroll` listener; used for portfolio (canvas has `pointer-events:none`)

**Single EffectComposer rule:** There can only be ONE `<EffectComposer>` per R3F Canvas. `CameraPath` owns it and composes all effects inside:

- `<ThreePostprocessingEffects />` — film grain, scanlines, chromatic aberration, vignette, glitch
- `<MouseWarpEffectPass />` — screen-space UV warp driven by mouse position (enabled by `USE_MOUSE_WARP` flag)

Never add a second `<EffectComposer>` inside the same canvas — it will silently break all effects.

### Post-processing architecture

- `src/stories/three/stories-components/postprocessing/ThreePostprocessing.tsx` exports two components:
  - `ThreePostprocessing` — full standalone (EffectComposer + ObjRenderer + effects); use in the standalone Storybook story
  - `ThreePostprocessingEffects` — bare effects only (no EffectComposer, no ObjRenderer); use when composing into an existing EffectComposer
- `src/stories/three/non-stories-components/effects/MouseWarpEffect.ts` — custom `postprocessing` Effect class (screen-space UV distortion)
- `src/stories/three/non-stories-components/effects/MouseWarpPass.tsx` — React bindings: `MouseWarpEffectPass` (bare effect, for use inside EffectComposer) and `useMouseWarpUniforms` (mouse tracking hook)

### Mouse interaction hooks

- `src/stories/three/non-stories-components/hooks/useMouseParallax.ts` — rotates a `<group>` based on mouse position. Options: `{ lerp, strength }`. Applied to the mesh group in `CameraPath` and demonstrated in the `three/Postprocessing/MouseParallax` story.
- `src/stories/three/non-stories-components/hooks/useMouseDistort.ts` — unused (superseded by the post-processing warp effect); kept for reference.

### WASM OBJ parser

Berlin point cloud is loaded via a C++ WASM OBJ parser:

- Parser: `src/stories/cpp/ObjRenderer/obj_parser.js` + `.wasm`
- React component: `src/stories/cpp/ObjRenderer/ObjRenderer.tsx` — loads `/assets/meshes/mesh_berlin/Mesh_3894_58196_-002.obj`, parses it, renders as `<points>` with `<pointsMaterial>`
- Do not add vertex shader distortion to `ObjRenderer` — it is a focused WASM rendering demo. Post-processing effects go in the EffectComposer instead.

### Path aliases

Defined in `tsconfig.app.json` and resolved via `vite-tsconfig-paths`:

| Alias              | Resolves to          |
| ------------------ | -------------------- |
| `Data/*`           | `src/data/*`         |
| `Interfaces/*`     | `src/interfaces/*`   |
| `HtmlComponents/*` | `src/stories/html/*` |

JSON imports are enabled via `"resolveJsonModule": true` in `tsconfig.app.json`.

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
