# TASKS: Storybook Postprocessing — CRT / Old TV Effect

> Stack: React Three Fiber · `@react-three/postprocessing` · Storybook · TypeScript

---

## Task 1 — Clone `WasmpCpp` → `ObjRenderer`

**Goal:** Duplicate the existing WASM-powered OBJ loader component into its own clean story
folder, renaming every reference from `WasmpCpp` to `ObjRenderer`.

### Steps

1. **Copy the folder**

   ```
   src/stories/three/stories-components/wasm-cpp
   └── WasmpCpp.tsx
   └── WasmpCpp.stories.tsx
   └── (any .wasm / loader helpers)
   ```

   Duplicate it to:

   ```
   src/stories/cpp/ObjRenderer/
   └── ObjRenderer.tsx
   └── ObjRenderer.stories.tsx
   └── (same .wasm / loader helpers — copy, do not move)
   ```

2. **Rename inside `ObjRenderer.tsx`**
   - Component function: `WasmpCpp` → `ObjRenderer`
   - Default export: update accordingly
   - Keep all internal logic (WASM init, `useEffect`, OBJ parsing, `<mesh>`) identical

3. **Rename inside `ObjRenderer.stories.tsx`**
   - `title`: set to `"cpp/ObjRenderer"`
   - `component`: point to `ObjRenderer`
   - Story name: `Default` (or `ObjRendererDefault`)
   - Import path: `./ObjRenderer`

4. **Verify in Storybook**
   ```bash
   npm run storybook
   ```
   - Sidebar should show `cpp > ObjRenderer > Default`
   - OBJ mesh loads and renders exactly as in the original `WasmpCpp` story
   - No console errors

### Acceptance criteria
- [ ] `ObjRenderer.tsx` exports a component named `ObjRenderer`
- [ ] Original `WasmpCpp` story is untouched
- [ ] Storybook sidebar shows `cpp/ObjRenderer`
- [ ] Mesh renders without errors

---

## Task 2 — Add CRT Postprocessing → `ThreePostprocessing`

**Goal:** Take the same `ObjRenderer` content and wrap it with an `EffectComposer` stack
that makes the scene look like an old TV with diffuse/noisy signal.

### Install dependencies (if not already present)

```bash
npm install @react-three/postprocessing postprocessing
```

### Folder structure

```
src/stories/three-postprocessing/
└── ThreePostprocessing.tsx
└── ThreePostprocessing.stories.tsx
```

### Steps

1. **Create `ThreePostprocessing.tsx`**

   Copy the full content of `ObjRenderer.tsx` as the base, then:

   - Rename component to `ThreePostprocessing`
   - Add the following imports at the top:

     ```tsx
     import { EffectComposer, Noise, Scanline, ChromaticAberration, Vignette, Glitch } from '@react-three/postprocessing'
     import { BlendFunction, GlitchMode } from 'postprocessing'
     import { Vector2 } from 'three'
     ```

   - Inside the JSX returned by the component, wrap the existing `<Canvas>` children
     (keep `<Canvas>` itself as-is) by adding `<EffectComposer>` **as the last child inside
     `<Canvas>`**, after all mesh/light elements:

     ```tsx
     <EffectComposer>
       {/* Grain — analog noise over the whole frame */}
       <Noise
         opacity={0.09}
         blendFunction={BlendFunction.SOFT_LIGHT}
       />

       {/* CRT scanlines */}
       <Scanline
         blendFunction={BlendFunction.OVERLAY}
         density={1.4}
         opacity={0.25}
       />

       {/* RGB channel shift — core of the "bad signal" look */}
       <ChromaticAberration
         offset={new Vector2(0.0022, 0.0)}
         radialModulation={false}
         modulationOffset={0}
       />

       {/* Phosphor vignette — darkens edges like a curved CRT tube */}
       <Vignette
         eskil={false}
         offset={0.28}
         darkness={0.85}
       />

       {/* Sporadic glitch bursts — simulates signal loss */}
       <Glitch
         delay={new Vector2(3, 9)}
         duration={new Vector2(0.08, 0.25)}
         strength={new Vector2(0.02, 0.06)}
         mode={GlitchMode.SPORADIC}
         active
         ratio={0.85}
       />
     </EffectComposer>
     ```

   > **Note:** `EffectComposer` must be a child of `<Canvas>`. It creates its own render
   > target internally; do not nest it inside any `<mesh>` or `<group>`.

2. **Create `ThreePostprocessing.stories.tsx`**

   ```tsx
   import type { Meta, StoryObj } from '@storybook/react'
   import { ThreePostprocessing } from './ThreePostprocessing'

   const meta: Meta<typeof ThreePostprocessing> = {
     title: 'three-postprocessing/ThreePostprocessing',
     component: ThreePostprocessing,
   }

   export default meta
   type Story = StoryObj<typeof ThreePostprocessing>

   export const Default: Story = {}
   ```

3. **Tweak parameters (optional but recommended)**

   Add a Storybook `argTypes` block to expose effect intensities as knobs for
   live tuning directly in the Storybook UI:

   ```tsx
   argTypes: {
     noiseOpacity:    { control: { type: 'range', min: 0, max: 0.3, step: 0.01 } },
     scanlineDensity: { control: { type: 'range', min: 0.5, max: 3,  step: 0.1 } },
     vignetteOffset:  { control: { type: 'range', min: 0,   max: 0.8, step: 0.01 } },
   }
   ```

   Wire these props into the component if you want real-time control — useful for
   dialing in the exact look before hardcoding final values.

4. **Verify in Storybook**
   ```bash
   npm run storybook
   ```
   - Sidebar shows `three-postprocessing > ThreePostprocessing > Default`
   - OBJ mesh loads normally
   - Grain, scanlines, chromatic aberration, vignette, and occasional glitch are visible
   - No TS errors, no console errors

### Acceptance criteria
- [ ] `ThreePostprocessing.tsx` exports a component named `ThreePostprocessing`
- [ ] `EffectComposer` is the last child inside `<Canvas>`
- [ ] All five effects render: Noise, Scanline, ChromaticAberration, Vignette, Glitch
- [ ] `Glitch` fires sporadically (not constant)
- [ ] Storybook sidebar shows `three-postprocessing/ThreePostprocessing`
- [ ] `ObjRenderer` story is untouched

---

## Effect Reference — Quick Tuning Guide

| Effect | Key prop | Lower value | Higher value |
|---|---|---|---|
| `Noise` | `opacity` | Cleaner | Heavier grain |
| `Scanline` | `density` | Wider lines | Tighter lines |
| `ChromaticAberration` | `offset.x` | Subtle shift | Harsh split |
| `Vignette` | `darkness` | Open frame | Heavy tunnel |
| `Glitch` | `strength` | Micro jitter | Full roll |

---
