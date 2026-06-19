# Camera Tour – Scroll & Mouse Parallax

Cinematic scroll-driven camera fly-through of the Berlin point cloud mesh.

The base scene lives in `src/stories/cpp/ObjRenderer/ObjRenderer.tsx` (WASM C++ OBJ parser + R3F `<points>`).
The experience story is `src/stories/three/stories-components/experiences/camera-path/`.

---

## Stack

| Purpose                  | Library                                              |
| ------------------------ | ---------------------------------------------------- |
| Berlin mesh (WASM)       | `src/stories/cpp/ObjRenderer/ObjRenderer.tsx`        |
| Interactive path editor  | `@theatre/core` + `@theatre/studio` + `@theatre/r3f` |
| Scroll → animation sync  | `@react-three/drei` `useScroll` + `useFrame`         |
| Smooth mouse parallax    | `useFrame` + manual lerp on camera/group offset      |

> **Note:** `@theatre/*` packages are not yet installed — Task 1 adds them.
> All other deps (`@react-three/drei`, `@react-three/fiber`, `three`) are already in `package.json`.

---

## Task 0 – Create the CameraPath Story Scaffold

**Goal:** set up the folder, component, and story that will host the camera experience.

- [x] Create folder `src/stories/three/stories-components/experiences/camera-path/`

- [x] Create `CameraPath.tsx` — imports `ObjRenderer` from `src/stories/cpp/ObjRenderer/ObjRenderer.tsx`
  and renders it as a scene child (no Canvas — the stories decorator handles that)
  ```tsx
  // src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx
  import { Suspense } from 'react'
  import { ObjRenderer } from '../../../../cpp/ObjRenderer/ObjRenderer'

  export function CameraPath() {
    return (
      <Suspense fallback={<mesh />}>
        <ObjRenderer />
      </Suspense>
    )
  }
  ```

- [x] Create `CameraPath.stories.tsx` with `title: 'three/Experiences/CameraPath'`,
  wrapping the scene in `MayoCanvas` with the same camera position as the ObjRenderer story
  ```tsx
  // src/stories/three/stories-components/experiences/camera-path/CameraPath.stories.tsx
  import type { Meta, StoryObj } from '@storybook/react'
  import { Vector3 } from 'three'
  import MayoCanvas from '../../../non-stories-components/mayo-canvas/mayo-canvas'
  import { CameraPath } from './CameraPath'

  const meta: Meta<typeof CameraPath> = {
    title: 'three/Experiences/CameraPath',
    component: CameraPath,
    decorators: [
      (Story) => (
        <MayoCanvas
          overrideCameraPos={new Vector3(-30, 0.5, 0)}
          enableOrbitControls={true}
          background="#111111"
          renderShadows={false}
        >
          <Story />
        </MayoCanvas>
      ),
    ],
  }

  export default meta
  type Story = StoryObj<typeof CameraPath>

  export const Default: Story = {}
  ```

- [ ] Run `pnpm storybook` and verify the Berlin point cloud loads at `three/Experiences/CameraPath`

---

## Task 1 – Interactive Camera Path with Theatre.js

**Goal:** visually place keyframes for the camera fly-through (no hardcoded Vector3s).

**File to edit:** `src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx`

### Steps

- [x] Install dependencies with pnpm
  ```
  pnpm i @theatre/core @theatre/studio @theatre/r3f
  ```
  > **Peer dep note:** `@theatre/r3f 0.7.2` (latest) declares `peerDependencies: @react-three/fiber@^8`.
  > This project uses R3F 9.3.0. The warning is cosmetic — the camera APIs used by Theatre.js did not
  > change between R3F 8→9. TypeScript compiles clean with no errors.

- [x] Initialize Theatre.js Studio in dev only
  ```ts
  // CameraPath.stories.tsx — scoped to this story, not global
  import studio from '@theatre/studio'
  if (import.meta.env.DEV) studio.initialize()
  ```

- [x] Wrap the Canvas scene with `SheetProvider` inside the stories decorator
  — `SheetProvider` is a child of `MayoCanvas` (which renders inside R3F `<Canvas>`),
  so it correctly receives the R3F context. `ScrollControls` is added in Task 2.
  ```tsx
  const sheet = getProject('BerlinTour').sheet('Scene')

  decorators: [(Story) => (
    <MayoCanvas overrideCameraPos={new Vector3(-30, 0.5, 0)} enableOrbitControls={false} ...>
      <SheetProvider sheet={sheet}>
        <Story />
      </SheetProvider>
    </MayoCanvas>
  )]
  ```

- [x] Replace the default R3F camera with Theatre's `PerspectiveCamera` inside `CameraPath.tsx`
  ```tsx
  import { PerspectiveCamera } from '@theatre/r3f'

  <PerspectiveCamera theatreKey="Camera" makeDefault fov={60} />
  ```

- [ ] In the Theatre.js Studio, open the sequence timeline and add keyframes along the Berlin mesh:
  - t=0 → starting position (current default: `[-30, 0.5, 0]`)
  - t=0.3 → mid-city fly-through
  - t=0.6 → low-angle pass over a dense mesh area
  - t=1.0 → end position overlooking the mesh

- [ ] Export the project state to JSON and commit it as
  `src/stories/three/stories-components/experiences/camera-path/theatreState.json`

  > **Bugs encountered & resolved:**
  > 1. `studio.ui.saveSnapshot()` → `studio is not defined` — the Storybook manager UI and
  >    the story run in **separate iframes** with separate `window` objects.
  > 2. `studio.__experimental_getStore is not a function` — that internal API was removed in
  >    `@theatre/studio` 0.7.x.
  >
  > **Working solution — Playwright script reads localStorage directly:**
  > Theatre.js 0.7.x auto-saves all state to `localStorage` (key: `theatre-0.4.persistent`)
  > inside the story iframe. A headless Playwright script opens the iframe, reads localStorage,
  > and writes `theatreState.json`.
  >
  > **After recording keyframes in the Studio UI, run:**
  > ```bash
  > pnpm theatre:save
  > ```
  > Script: `src/stories/three/stories-components/experiences/camera-path/save-theatre-state.mjs`
  > If `sheetsById` is still empty it will warn you to add keyframes first.

- [ ] Load the saved state in production
  ```js
  import state from './theatreState.json'
  const project = getProject('BerlinTour', { state })
  ```

---

## Task 2 – Sync Camera Path to Scroll

**Goal:** scroll progress (0→1) drives the Theatre.js sequence position.

**File to edit:** `src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx`

### Steps

- [ ] Add `<ScrollControls pages={N}>` from `@react-three/drei` to the stories decorator
  (wrap around the `SheetProvider` — see Task 1)

- [ ] Inside `CameraPath`, read scroll offset and drive the sequence
  ```js
  import { useScroll } from '@react-three/drei'
  import { useCurrentSheet } from '@theatre/r3f'
  import { val } from '@theatre/core'
  import { useFrame } from '@react-three/fiber'

  function CameraPath() {
    const sheet = useCurrentSheet()
    const scroll = useScroll()

    useFrame(() => {
      const length = val(sheet.sequence.pointer.length)
      sheet.sequence.position = scroll.offset * length
    })
    // ...
  }
  ```

- [ ] Tune `pages` in `ScrollControls` so the scroll speed feels natural (start with `pages={5}`)

- [ ] Add `damping` to `ScrollControls` for inertia
  ```jsx
  <ScrollControls pages={5} damping={0.3}>
  ```

- [ ] Test: scroll through the story and confirm the camera moves along the recorded path

---

## Task 3 – Mouse Parallax on the Background

**Goal:** subtle camera offset based on mouse position so the 3D scene feels alive while idle.

**File to edit:** `src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx`

### Steps

- [ ] Create a `useMouseParallax` hook in `src/stories/three/non-stories-components/hooks/`
  ```js
  // hooks/useMouseParallax.ts
  import { useRef, useEffect } from 'react'
  import * as THREE from 'three'

  export function useMouseParallax(strength = 0.02) {
    const mouse = useRef(new THREE.Vector2())

    useEffect(() => {
      const handler = (e: MouseEvent) => {
        mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
        mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
      }
      window.addEventListener('mousemove', handler)
      return () => window.removeEventListener('mousemove', handler)
    }, [])

    return mouse
  }
  ```

- [ ] In `CameraPath`, apply a lerped offset to a wrapper `<group>` (NOT the camera itself,
  to avoid fighting Theatre.js)
  ```jsx
  const groupRef = useRef()
  const mouse = useMouseParallax(0.015)
  const target = useRef(new THREE.Vector2())

  useFrame(() => {
    target.current.lerp(mouse.current, 0.05)
    groupRef.current.rotation.y = target.current.x * 0.1
    groupRef.current.rotation.x = target.current.y * 0.05
  })

  return <group ref={groupRef}><ObjRenderer /></group>
  ```

- [ ] Disable mouse parallax when the user is actively scrolling (use a `isScrolling` ref with a timeout reset)

- [ ] Optional: add a subtle `position` offset in addition to rotation for a deeper parallax feel

---

## Task 4 – Scene Polish

**Goal:** make the Berlin point cloud feel cinematic before the camera starts moving.

The scene uses a single Berlin OBJ mesh loaded via the WASM C++ parser in `ObjRenderer` —
there is no second model. Polish is about atmosphere and visual density.

**File to edit:** `src/stories/three/stories-components/experiences/camera-path/CameraPath.tsx`

### Steps

- [ ] Add fog to give depth and hide the hard mesh boundary at distance
  ```jsx
  <fog attach="fog" args={['#111111', 50, 300]} />
  ```

- [ ] Tune point cloud appearance by passing props to `ObjRenderer` or adjusting defaults
  (point size, color, opacity — aim for a neon/phosphor look that pairs with the postprocessing stack)

- [ ] Define 3–4 landmark bookmarks in the Theatre.js keyframe list that correspond to
  recognizable areas of the Berlin mesh (these become the keyframes in Task 1)

- [ ] Optional: add an `<Html>` overlay (via `@react-three/drei`) that shows the current
  area name, driven by `scroll.offset` ranges

---

## Notes

- Theatre.js Studio is **dev-only** — never ship `@theatre/studio` in production (use dynamic import or env guard)
- Keep the number of spline control points low (< 20) for a smoother, less jittery camera path
- `CatmullRomCurve3` is a valid manual alternative to Theatre.js if you prefer code-only control points
- Reference tutorial: [Codrops – Camera Fly-through with Theatre.js + R3F](https://tympanus.net/codrops/2023/02/14/animate-a-camera-fly-through-on-scroll-using-theatre-js-and-react-three-fiber/)

---

## Final file structure

```
src/stories/three/stories-components/experiences/camera-path/
├── CameraPath.tsx           ← scene component (Tasks 1–4)
├── CameraPath.stories.tsx   ← Storybook story at three/Experiences/CameraPath
└── theatreState.json        ← exported keyframes (Task 1, committed after recording)
```
