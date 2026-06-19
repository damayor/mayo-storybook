# TASKS: LED Scanline Point Cloud — ThreePostprocessing Refactor

> Stack already in repo: R3F 9.3.0 · `@react-three/postprocessing` ^3.0.4 ·
> `postprocessing` ^6.39.1 · `leva` ^0.10.0 · `three` 0.180.0
>
> **No new dependencies required.** Everything needed is already in `package.json`.

---

## Why this approach

The current `<pointsMaterial>` + `<Scanline>` combo renders points first, then
overlays a sinusoidal darkening pass on top — the rows modulate brightness but the
points still exist everywhere. The brief is the opposite: **points only live on LED
rows; the space between rows is void.**

The correct tool is a custom **`ShaderMaterial`** where the fragment shader calls
`discard` on any fragment whose window-space Y coordinate (`gl_FragCoord.y`) does
not fall on an LED row. This runs per-fragment inside the GPU, before blending,
before the postprocessing stack. The `EffectComposer` stack (Noise, ChromaticAberration,
Vignette, Glitch) stays exactly as-is on top.

Approach chosen: **Approach 1 — Points + `discard` in fragment shader**
(not Approach 2 `ScanlineEffect` overlay, not Approach 3 RT + custom Effect).

---

## Task 1 — Replace `<pointsMaterial>` with a custom `shaderMaterial` (drei)

**File to edit:** `src/stories/three/stories-components/postprocessing/ThreePostprocessing.tsx`

- [ ] **1.1 Add imports**

```tsx
import { shaderMaterial } from '@react-three/drei'
import { extend }         from '@react-three/fiber'
import * as THREE         from 'three'
```

- [ ] **1.2 Declare the shader material (module scope, outside the component)**

```tsx
// Vertex shader: standard points pass-through, exposes gl_PointSize in world space.
const vertexShader = /* glsl */`
  uniform float uSize;
  uniform float uPixelRatio;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position  = projectionMatrix * mvPosition;
    // sizeAttenuation: larger when close, smaller when far
    gl_PointSize = uSize * uPixelRatio * (300.0 / -mvPosition.z);
  }
`

// Fragment shader: round sprite + LED row mask via gl_FragCoord.y.
const fragmentShader = /* glsl */`
  uniform vec3  uColor;
  uniform float uLineSpacing;   // distance between LED rows (device px)
  uniform float uLineThickness; // visible height of each LED row (device px)

  void main() {
    // — Round LED sprite —
    // gl_PointCoord is [0,1]x[0,1] within the point quad.
    vec2 center = gl_PointCoord - 0.5;
    if (dot(center, center) > 0.25) discard;   // outside circle

    // — LED row mask (screen-aligned) —
    // gl_FragCoord.y is in DEVICE pixels, bottom-left origin.
    // mod(y, spacing) gives position within one row period.
    if (mod(gl_FragCoord.y, uLineSpacing) > uLineThickness) discard;

    gl_FragColor = vec4(uColor, 1.0);
  }
`

const LedPointsMaterial = shaderMaterial(
  {
    uColor:         new THREE.Color('#ffffff'),
    uSize:          3.0,
    uPixelRatio:    typeof window !== 'undefined' ? window.devicePixelRatio : 1.0,
    uLineSpacing:   6.0,   // px between LED row starts
    uLineThickness: 2.5,   // px of visible LED row height
  },
  vertexShader,
  fragmentShader
)

// Register with R3F so JSX <ledPointsMaterial /> works.
extend({ LedPointsMaterial })
```

> **Important — point size vs row spacing rule:**
> `uSize` (in world units before attenuation) must be large enough that each point
> sprite spans at least one full `uLineSpacing` period, otherwise a sprite can land
> entirely between two rows and disappear. A safe starting ratio: `uSize ≥ uLineSpacing`.

- [ ] **1.3 Add TypeScript declaration for the extended element**

Add this anywhere outside the component (same file is fine):

```tsx
declare module '@react-three/fiber' {
  interface ThreeElements {
    ledPointsMaterial: THREE.ShaderMaterialParameters & {
      uColor?:         THREE.Color | string
      uSize?:          number
      uPixelRatio?:    number
      uLineSpacing?:   number
      uLineThickness?: number
    }
  }
}
```

- [ ] **1.4 Add LED props to the component interface**

```tsx
interface ThreePostprocessingProps {
  // ... existing props unchanged ...

  // LED scanline
  ledSize?:          number
  ledLineSpacing?:   number
  ledLineThickness?: number
  ledColor?:         string
}
```

Add defaults in the destructured signature:

```tsx
ledSize          = 3.0,
ledLineSpacing   = 6.0,
ledLineThickness = 2.5,
ledColor         = '#ffffff',
```

- [ ] **1.5 Replace `<pointsMaterial>` in the JSX**

Find the existing:
```tsx
<pointsMaterial size={0.5} color="#ffffff" sizeAttenuation={true} opacity={0.8} />
```

Replace with:
```tsx
<ledPointsMaterial
  uColor={new THREE.Color(ledColor)}
  uSize={ledSize}
  uPixelRatio={window.devicePixelRatio}
  uLineSpacing={ledLineSpacing}
  uLineThickness={ledLineThickness}
/>
```

### Acceptance criteria — Task 1
- [ ] Point cloud renders only on horizontal LED rows (void between rows)
- [ ] Each visible point is a circle (round sprite), not a square
- [ ] Effect is screen-aligned: rotating the camera moves the mesh but rows stay horizontal
- [ ] No TS errors, no console errors

---

## Task 2 — Wire LED props to Storybook `argTypes`

**File to edit:** `src/stories/three/stories-components/postprocessing/ThreePostprocessing.stories.tsx`

Expose the four new LED uniforms as story controls so you can tune the LED grid
live in the Storybook Addons panel.

- [ ] **2.1 Add LED argTypes to the existing meta object**

```tsx
const meta: Meta<typeof ThreePostprocessing> = {
  title: 'three/Postprocessing',
  component: ThreePostprocessing,
  argTypes: {
    // — LED scanline controls (new) —
    ledLineSpacing: {
      control: { type: 'range', min: 2, max: 20, step: 0.5 },
      description: 'Distance between LED row starts (device px)',
    },
    ledLineThickness: {
      control: { type: 'range', min: 0.5, max: 10, step: 0.25 },
      description: 'Visible height of each LED row (device px)',
    },
    ledSize: {
      control: { type: 'range', min: 0.5, max: 12, step: 0.25 },
      description: 'Point sprite size (world units before attenuation)',
    },
    ledColor: {
      control: 'color',
      description: 'LED phosphor color',
    },

    // — Existing postprocessing controls (keep as-is) —
    noiseOpacity:    { control: { type: 'range', min: 0, max: 0.3,  step: 0.01 } },
    scanlineDensity: { control: { type: 'range', min: 0.5, max: 3,  step: 0.1  } },
    vignetteOffset:  { control: { type: 'range', min: 0,   max: 0.8, step: 0.01 } },
    vignetteDarkness:{ control: { type: 'range', min: 0,   max: 1.5, step: 0.01 } },
    // ... rest of existing argTypes unchanged ...
  },
}
```

- [ ] **2.2 Add preset stories**

```tsx
// Preset: tight phosphor-green CRT
export const GreenPhosphor: Story = {
  args: {
    ledColor:         '#39ff14',
    ledLineSpacing:   5.0,
    ledLineThickness: 1.8,
    ledSize:          4.0,
    noiseOpacity:     0.12,
    scanlineDensity:  1.6,
  },
}

// Preset: sparse blue LED panel
export const BlueLED: Story = {
  args: {
    ledColor:         '#00b4ff',
    ledLineSpacing:   10.0,
    ledLineThickness: 3.0,
    ledSize:          8.0,
    vignetteDarkness: 1.1,
    noiseOpacity:     0.05,
  },
}
```

### Acceptance criteria — Task 2
- [ ] Storybook Addons panel shows LED controls under the component args
- [ ] Changing `ledLineSpacing` live updates the row gap without page reload
- [ ] Changing `ledColor` updates the point color live
- [ ] `GreenPhosphor` and `BlueLED` presets appear in the Stories list

---

## Task 3 — HDPI safety fix

The `uPixelRatio` uniform is currently set once at init from `window.devicePixelRatio`.
On screens that switch DPI (e.g. dragging between a Retina and a standard monitor)
the rows will drift unless you keep it in sync.

- [ ] **3.1 Replace `window.devicePixelRatio` with `gl.getPixelRatio()`**

Add a `useThree` import and replace the static value with the renderer's live value:

```tsx
import { useThree } from '@react-three/fiber'

// Inside ThreePostprocessing():
const { gl } = useThree()
```

```tsx
// Replace:
uPixelRatio={window.devicePixelRatio}
// With:
uPixelRatio={gl.getPixelRatio()}
```

Since `LedPointsMaterial` is a `ref`-less declarative material, passing
`uPixelRatio={gl.getPixelRatio()}` as a prop is sufficient — R3F re-renders
when the renderer changes, keeping the uniform in sync automatically.

### Acceptance criteria — Task 3
- [ ] LED rows stay consistent when Storybook is moved between monitors with different DPI
- [ ] No `window` reference in the shader uniform path (SSR-safe)

---

## Quick tuning reference

| Uniform | Low value | High value | Sweet spot |
|---|---|---|---|
| `uLineSpacing` | Rows very tight (dense) | Rows far apart (sparse) | 5–8 px |
| `uLineThickness` | Thin sliver of LED | Nearly fills row period | ~40% of spacing |
| `uSize` | Small sprites, risk vanishing | Big sprites, overlap | ≥ `uLineSpacing` |
| `uColor` | Any phosphor color | — | `#39ff14` green, `#ff6a00` amber |

**Rule of thumb:** `uLineThickness / uLineSpacing ≈ 0.35–0.5` gives a realistic
LED panel duty cycle. Below 0.25 looks like laser lines; above 0.6 rows start merging.

---

## What stays the same

The `EffectComposer` block (Noise, Scanline, ChromaticAberration, Vignette, Glitch)
is **untouched**. It runs as a post-process on top of the already-masked point cloud,
adding the CRT veneer after the LED geometry is already correct. The two layers
are complementary, not redundant.

---

## Final file structure

```
src/stories/three/stories-components/postprocessing/
├── ThreePostprocessing.tsx          ← edited: Tasks 1 + 3
└── ThreePostprocessing.stories.tsx  ← edited: Task 2
```
