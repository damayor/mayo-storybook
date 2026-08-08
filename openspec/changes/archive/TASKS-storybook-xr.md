# Storybook Tasks — WebXR Hello World

> This file is scoped exclusively to the Storybook setup (`mayo-storybook`). Do **not** touch the portfolio pages, components, or routing. All new files live under `src/stories/three/stories-components/xr/`.

---

## Task 1 — Install and configure `@react-three/xr`

### Context

The repo already has `three@0.180.0`, `@react-three/fiber@9.3.0`, and `@react-three/drei` installed. The only missing package is `@react-three/xr`. This task sets up the dependency and ensures Vite can handle the WebXR APIs without errors in a browser/mobile environment.

### Checklist — mark each item `[x]` when done

- [x] **1.1** Install `@react-three/xr@latest` and verify v6+
- [x] **1.2** Install `@vitejs/plugin-basic-ssl` and configure Vite for HTTPS
- [x] **1.3** Run Storybook smoke test — no XR import errors
- [x] **1.3** Delete `xr.sanity.ts` after smoke test passes

---

### Subtask 1.1 — Install the package

- Run: `pnpm add @react-three/xr@latest`
- Verify the installed version is v6+ (the API changed significantly from v5 — do not use v5 patterns).
- After install, confirm there are no peer dependency conflicts with the existing `three` and `@react-three/fiber` versions. If there are, flag them for David before proceeding.

### Subtask 1.2 — Vite configuration for WebXR

- WebXR requires the page to be served over **HTTPS**, even locally. Configure Vite to use HTTPS in dev mode.
- Install `@vitejs/plugin-basic-ssl` as a dev dependency and add it to `vite.config.ts`:

```ts
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    react(),
    basicSsl(), // Required for WebXR on mobile
  ],
});
```

- **Flag for David:** after this change, the dev server will run on `https://localhost:5173`. The browser will show a security warning — click "Proceed anyway" (it's a self-signed cert, safe for local dev). On mobile, you'll need to accept the cert warning too.

### Subtask 1.3 — Verify Storybook can import XR without errors

- Create a minimal smoke-test file `src/stories/three/stories-components/xr/xr.sanity.ts` that simply imports `createXRStore` from `@react-three/xr`:

```ts
import { createXRStore } from '@react-three/xr';
export const store = createXRStore();
```

- Run `pnpm storybook` and confirm there are no import or bundling errors related to `@react-three/xr`.
- Delete `src/stories/three/stories-components/xr/xr.sanity.ts` after confirming it works — it's only a build check.

---

## Task 2 — Build the WebXR Hello World story

### Context

The goal is a Storybook story that renders a simple interactive VR scene: a colored box in 3D space that toggles color when clicked. It must work on mobile via WebXR VR mode, and optionally be testable on desktop via the `@react-three/xr` built-in emulator.

### Checklist — mark each item `[x]` when done

- [x] **2.1** Create `XRHelloWorld.tsx` in `src/stories/three/stories-components/xr/`
- [x] **2.2** Create `XRHelloWorld.stories.tsx` in `src/stories/three/stories-components/xr/`
- [x] **2.3** Create `README.md` in `src/stories/three/stories-components/xr/`
- [x] **2.3** Verify story appears under `Three / Experiences / XR` in Storybook sidebar

---

### Subtask 2.1 — Create the XR Hello World component

Create `src/stories/three/stories-components/xr/XRHelloWorld.tsx`:

```tsx
import { Canvas } from '@react-three/fiber';
import { XR, createXRStore } from '@react-three/xr';
import { useState } from 'react';

const store = createXRStore({
  emulate: 'metaQuest3',
  layers: false,
  anchors: false,
  handTracking: false,
  bodyTracking: false,
  meshDetection: false,
  planeDetection: false,
  hitTest: false,
  domOverlay: false,
});

export function XRHelloWorld() {
  const [active, setActive] = useState(false);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button
        onClick={() => store.enterVR()}
        style={{
          position: 'absolute',
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          padding: '12px 24px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Enter VR
      </button>
      <Canvas>
        <XR store={store}>
          <ambientLight intensity={0.8} />
          <mesh position={[0, 1, -1]} onClick={() => setActive((v) => !v)}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color={active ? 'hotpink' : 'royalblue'} />
          </mesh>
        </XR>
      </Canvas>
    </div>
  );
}
```

### Subtask 2.2 — Create the Storybook story

Create `src/stories/three/stories-components/xr/XRHelloWorld.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { XRHelloWorld } from './XRHelloWorld';

const meta: Meta<typeof XRHelloWorld> = {
  title: 'ThreeJs/Experiences/XR',
  component: XRHelloWorld,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'A basic WebXR VR scene. Click "Enter VR" on a compatible mobile device (Android + Chrome) to launch. On desktop, disable the Immersive Web Emulator extension so the built-in @react-three/xr emulator activates.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof XRHelloWorld>;

export const HelloWorld: Story = {};
```

### Subtask 2.3 — Mobile testing instructions (no code required)

No code changes needed for this subtask — create `src/stories/three/stories-components/xr/README.md` with testing instructions for VR on Android, desktop emulator, and iOS limitations.

---

## Task 3 — Migrate to VR session and downgrade to v5.5.0

### Context

The v6 API (`createXRStore`, `store.enterVR()`) is fundamentally incompatible with the Immersive Web Emulator Chrome extension due to an `XRWebGLBinding` polyfill mismatch — the emulator's polyfill returns a session object that fails v6's type guard, crashing session startup. v5.5.0 uses a simpler session flow that the polyfill handles correctly, as confirmed by the official CodeSandbox demo. This task downgrades to v5.5.0 and rewrites the component using the v5 API.

### Checklist — mark each item `[x]` when done

- [x] **3.1** Downgrade `@react-three/xr` from v6.6.29 to v5.5.0
- [x] **3.2** Rewrite `XRHelloWorld.tsx` using v5 API: `<VRButton>` + `<XR>` + `<Controllers>` + `<Interactive>`
- [x] **3.3** Remove `createXRStore` — v5 manages session state internally via `<XR>` context
- [x] **3.4** Use `<Interactive onSelect>` for controller trigger interactions (replaces v6 mesh `onClick` in XR mode)
- [x] **3.5** Update story description in `XRHelloWorld.stories.tsx`
- [x] **3.6** Rewrite `README.md` — remove AR/camera instructions, document VR + Immersive Web Emulator
- [x] **3.7** Move all XR files into `src/stories/three/stories-components/xr/`
- [x] **3.8** Update all AR references in `TASKS.md` to VR

## Task 4

[] Add an intro page to my storybook, el mejor ejemplo es https://designlanguage.adidas.com/?path=/docs/welcome--documentation
[] Plase hide the controls panel on all the stories that do not have any parameter in the story

---

## Notes for Claude

- Do not modify any existing stories or components outside `src/stories/three/stories-components/xr/`.
- The import path in the story file is relative (`./XRHelloWorld`) since component and story live in the same folder.
- The `@react-three/xr` built-in emulator (activated via `emulate: 'metaQuest3'`) is the correct desktop testing path — the Immersive Web Emulator Chrome extension conflicts with it and should be disabled.
- iOS does not support WebXR VR — do not attempt any iOS workarounds, just document it.
- If `@react-three/xr` v6 API differs from what's written here, prefer the official docs at https://docs.pmnd.rs/xr/getting-started/introduction over the code snippets above.
- Run `pnpm storybook` after each subtask to confirm no regressions.
