# Portfolio – Cinematic Scroll Experience
## Brandenburg Gate → Alexanderplatz fly-through

> Stack already installed: `@theatre/core`, `@theatre/studio`, `@theatre/r3f`,
> `@react-three/drei`, `simplex-noise`. No Blender needed — camera path is
> recorded live in the browser via Theatre.js Studio.

---

## Why no Blender?

Vertex3D (the reference site) baked their camera animation in Blender because
they use PlayCanvas, where the GLB animation pipeline is the standard approach.
**We don't need that.** Theatre.js Studio runs directly in the browser — you
move the camera by hand, set keyframes in a visual timeline, and export a JSON.
Same result, zero context switching. Our models are OBJ-via-WASM, which is
completely decoupled from the camera path system.

---

## Architecture overview

```
scroll progress (0 → 1)
    │
    ▼  useScroll (Drei)
sheet.sequence.position = offset × sequenceDuration
    │
    ▼  Theatre.js
camera.position + camera.quaternion  (keyframed)
    │
    ▼  @theatre/r3f PerspectiveCamera
renders the scene
```

Mouse parallax runs on a separate `<group>` wrapper — never on the camera
directly, to avoid fighting Theatre.js for camera control.

---

## Task 0 – Portfolio integration ✅ DONE

**Goal:** Replace `InteractiveBackground3D` in `portfolio.component.tsx` with the
`CameraPath` experience as a fullscreen fixed background.

- [x] Created `src/components/camera-path-background/CameraPathBackground.tsx`:
  - Fullscreen `fixed inset-0` wrapper, `pointer-events: none` so portfolio scroll works
  - Own `<Canvas>` (not MayoCanvas — full viewport)
  - `SheetProvider` + `PerspectiveCamera theatreKey="Camera"` inside Canvas
  - `ScrollSyncPage` component: listens to `window.scroll`, maps `scrollY/maxScroll` → Theatre.js position — no `ScrollControls` needed, no scroll conflict
  - Loads `theatreState.json` via `getProject('BerlinTour', { state: theatreState })`
  - `<fog>` to soften point cloud edges

- [x] In `portfolio.component.tsx`:
  - Replaced `import InteractiveBackground3D` with `import CameraPathBackground`
  - Replaced `<InteractiveBackground3D />` (line 413) with `<CameraPathBackground />`

- [x] Portfolio scroll conflict resolved: background uses `window.scroll` listener + `pointer-events: none`, not `ScrollControls`, so portfolio content scrolls normally and drives the camera path simultaneously.

---

## Task 1 – Theatre.js scene setup

**Story:** `path=/story/three-experiences-camerapath--default`

**Status:** ✅ DONE

- [x] Wrap the Canvas with `SheetProvider` — done in story decorator
- [x] Replace default camera with Theatre's `<PerspectiveCamera theatreKey="Camera" makeDefault fov={60} />`
- [x] Record keyframes via Theatre.js Studio
- [x] Save Theatre.js state to JSON (`theatreState.json` committed)
- [ ] Guard `studio.initialize()` behind `import.meta.env.DEV` (currently always initializes)

---

## Task 2 – Scroll → sequence sync

**Story:** `path=/story/three-experiences-camerapath--default`

**Status:** ✅ DONE

Two sync modes implemented in `CameraPath.tsx`:

- [x] `ScrollSyncNative` — uses `useScroll()` from Drei. Best for portfolio fullscreen:
  native browser scroll handles trackpad momentum and inertia. Requires
  `<ScrollControls>` wrapping. Exposed as `useNativeScroll={true}`.
- [x] `ScrollSyncWheel` — wheel event listener on canvas parent. Works in any
  embedding context (Storybook iframe, embedded frames). Own lerp damping (0.1).
  Default (`useNativeScroll={false}`).
- [x] Storybook: `Default` story uses wheel mode; `NativeScroll` story uses ScrollControls.
- [x] `SEQUENCE_DURATION = 10`, `PAGES = 6` constants match saved theatreState.

---

## Task 3 – Mouse parallax on background

**Story:** `path=/story/three-postprocessing--default`

**Goal:** subtle organic tilt of the background OBJ point cloud on mouse move.
The point cloud is already rendered in `ThreePostprocessing.tsx`.
The parallax goes on a `<group>` wrapper — not on the camera.

- [ ] Create `useMouseParallax.ts` alongside `ThreePostprocessing.tsx`:
  ```ts
  import { useEffect } from 'react'
  import { useFrame } from '@react-three/fiber'
  import type { Group } from 'three'

  const TARGET = { x: 0, y: 0 }
  const LERP = 0.05
  const STRENGTH = 0.015

  export function useMouseParallax(groupRef: React.RefObject<Group>) {
    useEffect(() => {
      const onMove = (e: MouseEvent) => {
        TARGET.x = (e.clientX / window.innerWidth - 0.5) * 2
        TARGET.y = (e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    }, [])

    useFrame(() => {
      if (!groupRef.current) return
      groupRef.current.rotation.y +=
        (TARGET.x * STRENGTH - groupRef.current.rotation.y) * LERP
      groupRef.current.rotation.x +=
        (-TARGET.y * STRENGTH - groupRef.current.rotation.x) * LERP
    })
  }
  ```

- [ ] In `ThreePostprocessing.tsx`, wrap the `<points>` in a `<group>` and apply the hook:
  ```tsx
  const bgGroupRef = useRef<Group>(null)
  useMouseParallax(bgGroupRef)

  <group ref={bgGroupRef}>
    <points ...> {/* OBJ point cloud from WASM */} </points>
  </group>
  ```

- [ ] Optional — vertex shader displacement for a more organic feel.
  `simplex-noise` is already installed. Replace `<pointsMaterial>` with a
  `<shaderMaterial>` and offset vertex positions using mouse + time uniforms
  in the vertex shader.

---

## Task 4 – Scene transition (white flash + model swap)

**Story:** `path=/story/three-experiences-camerapath--default`

**Goal:** at scroll ~60%, flash to white, swap point cloud geometry from
Brandenburg Gate to Alexanderplatz, then continue the camera path seamlessly.
The camera path itself doesn't need to change — Theatre.js handles t=0 to t=1
as a continuous sequence across both scenes.

**Pre-requisite:** The Alexanderplatz OBJ mesh must be imported and parsed via
WASM before this task can be wired up. See sub-task below.

### Sub-task 4a – Import the Alexanderplatz mesh

- [ ] Add a WASM load for the Alexanderplatz OBJ alongside the Brandenburg Gate:
  ```tsx
  // In CameraPath.tsx (or the Scene component)
  const [gateVertices, setGateVertices] = useState<Float32Array | null>(null)
  const [alexVertices, setAlexVertices] = useState<Float32Array | null>(null)

  useEffect(() => {
    async function loadMeshes() {
      const instance = await cityParserModule()

      // Brandenburg Gate (already loaded in ThreePostprocessing — reuse the same pattern)
      const gateRes = await fetch('/assets/meshes/mesh_berlin/brandenburger-tor.obj')
      const gateText = await gateRes.text()
      const gateParser = new instance.CityParser()
      gateParser.parse_obj(gateText)
      setGateVertices(new Float32Array(gateParser.get_vertices_view()))
      gateParser.delete()

      // Alexanderplatz — import this second mesh before the transition can work
      const alexRes = await fetch('/assets/meshes/mesh_berlin/alexanderplatz.obj')
      const alexText = await alexRes.text()
      const alexParser = new instance.CityParser()
      alexParser.parse_obj(alexText)
      setAlexVertices(new Float32Array(alexParser.get_vertices_view()))
      alexParser.delete()
    }

    loadMeshes()
  }, [])
  ```

- [ ] Confirm the Alexanderplatz `.obj` file exists at
  `/public/assets/meshes/mesh_berlin/alexanderplatz.obj`. If not, add it before
  proceeding to sub-tasks 4b–4e.

### Sub-task 4b – Transition state tracking

- [ ] Track transition state (only after both meshes are loaded):
  ```tsx
  const [activeScene, setActiveScene] = useState<'gate' | 'alex'>('gate')
  const [flashOpacity, setFlashOpacity] = useState(0)
  const transitioned = useRef(false)
  ```

### Sub-task 4c – Flash trigger in useFrame

- [ ] Trigger the flash in `useFrame`:
  ```tsx
  useFrame(() => {
    if (scroll.offset > 0.58 && !transitioned.current) {
      transitioned.current = true
      setFlashOpacity(1)
      setTimeout(() => {
        setActiveScene('alex')
        setFlashOpacity(0)
      }, 250) // white frame lasts 250ms — enough to hide the geometry swap
    }
  })
  ```

### Sub-task 4d – White flash overlay

- [ ] White flash overlay — a `<div>` over the Canvas, not inside R3F:
  ```tsx
  <div style={{
    position: 'fixed', inset: 0, pointerEvents: 'none',
    background: 'white',
    opacity: flashOpacity,
    transition: 'opacity 0.2s ease',
    zIndex: 10
  }} />
  ```

### Sub-task 4e – Conditional point cloud render + fog

- [ ] Conditionally render the active point cloud (requires both meshes from 4a):
  ```tsx
  <group ref={bgGroupRef}>
    {activeScene === 'gate'
      ? <points> {/* gateVertices Float32Array */} </points>
      : <points> {/* alexVertices Float32Array */} </points>
    }
  </group>
  ```

- [ ] Add fog to soften geometry edges and hide the swap boundary:
  ```tsx
  <fog attach="fog" args={['#000000', 80, 300]} />
  ```

---

## Bug 1 – `theatre:save` reports "sheetsById is empty" / `getTheatreState is not defined` ✅ FIXED

**Symptoms:**
- `pnpm theatre:save` → `⚠ No keyframes found — sheetsById is empty` — script
  opens a headless browser that has no `localStorage`, so the recorded state is
  never found.
- Calling `getTheatreState()` in the normal Storybook DevTools console →
  `Uncaught ReferenceError: getTheatreState is not defined` — the function was
  only exposed on the **iframe's** `window`, not the parent Storybook frame.
  It only works when you open the iframe URL directly with `viewMode=story`.

**Root cause:** Theatre.js saves keyframes to `localStorage` of whichever
browser tab is running the story. The Playwright script launches a brand-new
headless context (empty `localStorage`). The `window` trick only reaches the
iframe context, not the parent Storybook shell.

**Fix applied (low-effort, already in code):**
`CameraPath.stories.tsx` now exposes `getTheatreState` on **both** `window`
(iframe) and `window.parent` (Storybook shell), so the function is callable
from the DevTools console regardless of which frame context is selected:

```ts
;(window as any).getTheatreState = getTheatreState
try { (window.parent as any).getTheatreState = getTheatreState } catch (_) {}
```

**How to export your keyframes (works in normal Storybook view now):**
1. Open Storybook at `http://localhost:6006` and navigate to the CameraPath story.
2. Open DevTools → Console (no need to switch to the iframe frame).
3. Run: `getTheatreState()`
4. The JSON is logged and copied to clipboard — paste it into
   `src/stories/three/stories-components/experiences/camera-path/theatreState.json`.

**Remaining issue with `pnpm theatre:save`:** the Playwright script still reads
from a headless `localStorage` (always empty). It can be fixed by making the
script read `theatreState.json` from the clipboard or a temp file written by
the browser step above, but the manual export above is sufficient for now.

---

## Bug 2 – MouseWarpEffect never working

**Symptoms:** `MouseWarpEffectPass` renders inside the EffectComposer but produces no visible distortion. The screen-space UV warp never appears, even with `VITE_USE_MOUSE_WARP=true`.

**What was tried:**
- `<primitive object={effect}>` inside EffectComposer — doesn't register the Effect properly
- `wrapEffect(MouseWarpEffect)` + `onInstance` callback for ref capture
- Canvas-relative NDC via `gl.domElement.getBoundingClientRect()`
- Y-axis convention fix (removed `-uMouse.y` negation in shader)
- Confirmed only ONE EffectComposer in canvas (two-composer bug is separate)

**Files to investigate:**
- `src/stories/three/non-stories-components/effects/MouseWarpEffect.ts` — custom Effect class, fragment shader, uniform setup
- `src/stories/three/non-stories-components/effects/MouseWarpPass.tsx` — `wrapEffect` binding, `useMouseWarpUniforms` hook, NDC calculation

**Suspected causes (not yet confirmed):**
- The `onInstance` constructor callback pattern with `wrapEffect` may not correctly capture the Effect instance ref — `useMemo` uses `JSON.stringify(a)` which drops function references, so `onInstance` may get serialized to `{}` causing stale args
- The uniform names (`uMouse`, `uMouseVel`) may not match what the fragment shader expects after `super()` call in the Effect constructor
- The `postprocessing` Effect class may require `inputBuffer` to be declared differently

**To fix:** Debug uniform flow end-to-end — confirm the Effect instance ref is set, confirm uniforms are being written each frame via `useFrame`, add a visual diagnostic (set `uStrength` to a very large value like 0.5 in the shader to make warp obvious).

---

## Task 5 – Portfolio UI/UX improvement for point-cloud background

**Goal:** Redesign portfolio UI/UX to complement and enhance the Berlin point-cloud / line background that is always visible behind the content. The visual language of the interface should feel cohesive with the sparse, geometric, city-data aesthetic of the OBJ point cloud.

**Design direction:**
- UI elements (cards, panels, text containers) should feel transparent, minimal, or glassy — avoid heavy opaque blocks that hide the background
- Typography and layout should work WITH the point cloud lines/dots, not against them — consider dark overlays with subtle blur (`backdrop-filter`) rather than solid fills
- Colors should complement the dark background (`#111111`) and the point cloud color palette
- Explore: thin border UI (1px lines), translucent panels, reduced visual weight on the foreground so the background remains expressive
- Possible: animate foreground elements in sync with scroll (parallax on content sections)

**Constraints:**
- Background renders as `fixed inset-0 pointer-events-none` — all pointer events go to the portfolio DOM
- Portfolio uses DaisyUI + Tailwind v4, `data-theme="dark"` — glass/translucent variants via Tailwind `backdrop-blur-*` classes
- Foreground z-index is above the canvas (`z-index: 0` on background, portfolio content at default stacking)

---

## Notes

- Theatre.js Studio ships **dev-only** — dynamic import it behind
  `import.meta.env.DEV`, never in the production bundle.
- Keep Theatre.js keyframes under ~20 total for smooth cubic interpolation.
- `CatmullRomCurve3` is a valid code-only fallback: sample it at
  `t = scroll.offset` and set `camera.position.copy(curve.getPoint(t))`.
- The WASM OBJ parser fills a `Float32Array` for `<bufferGeometry>` — it's
  independent of Theatre.js. No changes needed to the parser itself.
- `simplex-noise` (already in devDeps) can drive vertex displacement in a
  custom `<shaderMaterial>` for organic point cloud movement.
- The postprocessing stack (Noise, Scanline, ChromaticAberration, Vignette)
  in `ThreePostprocessing.tsx` stays as-is — it sits on top of everything.
