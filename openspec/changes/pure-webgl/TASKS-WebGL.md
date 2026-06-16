# WebGL Cube Editor — Task List (v2)

## Status Legend
- 🔲 Not Started
- 🔄 In Progress
- ✅ Complete
- ❌ Blocked

---

## Bug Fixes

### BUG-01: Faces view still renders stale wireframe box on switch
**Status:** 🔲 Not Started
**Priority:** P0
**Difficulty:** Easy
**File:** `components/WebGLCanvas.tsx`

**Description:**
When switching from Wireframe to Faces mode the previous wireframe box ghost remains visible
for one frame (or permanently if the render loop's `useEffect` dep array does not fully clear
the canvas state). The faces geometry is built once at init with hard-coded parameters and is
never regenerated from `cubeVertices` state, so if the vertices were dragged before switching,
the faces buffer still shows the original shape while the wireframe buffer reflects the edits.

**Root cause:**
- `cubeFacesDataRef` is populated from hard-coded `generateCubeFaces(1.0, 3.0, -10.0, …)` in
  the init `useEffect`, and never updated when `cubeVertices` changes in state.
- `gl.enable(gl.FRONT_FACE)` / `gl.cullFace` are not called correctly — the constant
  `gl.FRONT_FACE` is not a valid argument to `gl.enable()` (should be `gl.CULL_FACE`).

**Fix:**
1. In the render loop, rebuild face vertices from `s.cubeVertices` each frame and call
   `updateBuffer(gl, cubeFacesBufferRef.current.position, …)` just like edges/points.
2. Replace `gl.enable(gl.FRONT_FACE)` → `gl.enable(gl.CULL_FACE)` when rendering faces.
3. Call `gl.disable(gl.CULL_FACE)` after the faces draw call.

**Acceptance Criteria:**
- [ ] Switching to Faces instantly shows solid faces, no wireframe ghost
- [ ] Faces reflect any vertex deformations made in Wireframe mode
- [ ] Back-faces are culled (no z-fighting artefacts)

---

### BUG-02: Triangles view looks identical to Faces
**Status:** 🔲 Not Started
**Priority:** P1
**Difficulty:** Medium
**File:** `webgl-utils.ts`, `components/WebGLCanvas.tsx`

**Description:**
The "Triangles" view currently reuses the same `cubeFacesData` buffer (6 quads = 12 triangles
with per-face solid colors). The intent is to show each of the **12 individual triangles** with
a **unique color** so the tessellation is visually clear (educational rendering).

**Fix:**
1. Add `generateCubeTriangles(vertices: number[])` to `webgl-utils.ts`:
   - Same 36 positions as faces but each triangle gets its own color from the 12-color palette.
   - Colors from palette: Red, Green, Blue, Yellow, Magenta, Cyan, Orange, Purple, Pink,
     Spring Green, Lime, Gray.
2. Create a separate `cubeTrianglesBufferRef` and `cubeTrianglesDataRef` in `WebGLCanvas`.
3. Regenerate triangle buffer from current `cubeVertices` each frame (same pattern as faces fix).
4. Draw it only when `viewMode === 'triangles'`.

**Color palette:**
```ts
const TRIANGLE_COLORS = [
  [1,0,0,1],     [0,1,0,1],     [0,0,1,1],     [1,1,0,1],
  [1,0,1,1],     [0,1,1,1],     [1,0.5,0,1],   [0.5,0,1,1],
  [1,0,0.5,1],   [0,1,0.5,1],   [0.5,1,0,1],   [0.5,0.5,0.5,1],
];
```

**Acceptance Criteria:**
- [ ] 12 visibly distinct triangle colors rendered on the cube
- [ ] Clearly shows 2 triangles per face
- [ ] Triangles reflect current vertex positions (not stale)
- [ ] Toggle back to Wireframe / Faces works without artefacts

---

## Feature: Interaction Mode Panel (Edit Sub-Module)

### FEAT-01: Context-sensitive Edit Mode panel
**Status:** 🔲 Not Started
**Priority:** P0
**Difficulty:** Medium
**Files:** `components/InteractionModeControl.tsx`, `webgl-basis.tsx`, `types.ts`

**Description:**
Restore the interaction mode sub-module that was removed. The panel must be **context-sensitive**:
shown options change depending on the current View Mode.

**Rules:**
| View Mode | Available Interaction Modes |
|-----------|----------------------------|
| Wireframe (+ Points) | Drag Vertex, Deform Face, Scale Face |
| Faces | Extrude Face |
| Triangles | Extrude Face |

**InteractionMode type:**
```ts
export type InteractionMode =
  | 'dragVertex'     // move single vertex in XY plane
  | 'deformFace'     // drag a whole face's vertices together
  | 'scaleFace'      // uniformly scale a selected face
  | 'extrudeFace';   // push a face along its normal (Z extrusion)
```

**Implementation:**
1. Update `InteractionModeControl.tsx`:
   - Accept `viewMode: ViewMode` prop
   - Conditionally render options:
     ```tsx
     {viewMode === 'wireframe' && (
       <>
         <Radio value="dragVertex" label="Drag Vertex" />
         <Radio value="deformFace" label="Deform Face" />
         <Radio value="scaleFace" label="Scale Face" />
       </>
     )}
     {(viewMode === 'faces' || viewMode === 'triangles') && (
       <Radio value="extrudeFace" label="Extrude Face" />
     )}
     ```
   - Auto-reset interactionMode to a valid default when viewMode changes.

2. Update `types.ts` with the new `InteractionMode` type above.

3. Update `useUI.ts`:
   - When `setViewMode` is called, if the current `interactionMode` is not valid for
     the new view mode, reset to a sensible default:
     - wireframe → `'dragVertex'`
     - faces/triangles → `'extrudeFace'`

4. Wire the `interactionMode` into `WebGLCanvas.tsx` so mouse events dispatch the
   correct operation (vertex drag is already done; face deform, scale, extrude are
   stubs for now returning a console.log with the mode name).

**Acceptance Criteria:**
- [ ] Switching to Wireframe shows Drag Vertex / Deform Face / Scale Face
- [ ] Switching to Faces or Triangles shows Extrude Face only
- [ ] No invalid mode can be active for the current view
- [ ] Panel header remains "Interaction Mode"

---

## Feature: Config File for Constants

### FEAT-02: Centralised config.ts for all magic numbers
**Status:** 🔲 Not Started
**Priority:** P1
**Difficulty:** Easy
**File:** `config.ts` (new file in `webgl-basis/`)

**Description:**
All hard-coded numbers scattered across `webgl-utils.ts`, `hooks/useUI.ts`, and
`WebGLCanvas.tsx` must be extracted into a single `config.ts` file.

**Contents of `config.ts`:**
```ts
// ─── Cube geometry ────────────────────────────────────────────────────────────
export const CUBE = {
  P1X:  1.0,   // top-left-far  X
  P1Y:  3.0,   // top-left-far  Y
  P1Z: -10.0,  // far Z
  P2X:  3.0,   // bottom-right  X
  P2Y: -0.5,   // bottom-right  Y
  P3Z: -5.0,   // near Z
} as const;

// ─── Camera ───────────────────────────────────────────────────────────────────
export const CAMERA = {
  FOV_DEG:        55,
  Z_NEAR:          0.1,
  Z_FAR:         100.0,
  INITIAL_ZOOM:    1.5,
  INITIAL_ANGLE_X: Math.PI / 3.5,
  INITIAL_ANGLE_Y: Math.PI / 5,
  ORBIT_RADIUS:   12,
  CENTER:         [2.0, 1.25, -7.5] as [number, number, number],
} as const;

// ─── Vertex interaction ───────────────────────────────────────────────────────
export const PICK = {
  RADIUS_PX:  20,   // screen-space pick radius in pixels
  POINT_SIZE: 14,   // gl_PointSize for vertices
} as const;

// ─── Vertex colors ────────────────────────────────────────────────────────────
export const VERTEX_COLORS = {
  NORMAL:   [0.2, 0.5, 1.0, 1.0] as number[],
  HOVER:    [1.0, 0.7, 0.0, 1.0] as number[],
  SELECTED: [1.0, 1.0, 1.0, 1.0] as number[],
  DRAGGING: [0.0, 1.0, 0.5, 1.0] as number[],
} as const;

// ─── Face colors ─────────────────────────────────────────────────────────────
export const FACE_COLORS = {
  BACK:   [1.0, 1.0, 0.0, 1.0] as number[],
  FRONT:  [0.0, 0.0, 1.0, 1.0] as number[],
  TOP:    [1.0, 0.0, 0.0, 1.0] as number[],
  BOTTOM: [0.0, 1.0, 0.0, 1.0] as number[],
  RIGHT:  [0.0, 1.0, 1.0, 1.0] as number[],
  LEFT:   [1.0, 0.0, 1.0, 1.0] as number[],
} as const;

// ─── Triangle palette (12 unique colors) ─────────────────────────────────────
export const TRIANGLE_COLORS: number[][] = [
  [1,0,0,1],   [0,1,0,1],   [0,0,1,1],   [1,1,0,1],
  [1,0,1,1],   [0,1,1,1],   [1,0.5,0,1], [0.5,0,1,1],
  [1,0,0.5,1], [0,1,0.5,1], [0.5,1,0,1], [0.5,0.5,0.5,1],
];

// ─── Floor grid ───────────────────────────────────────────────────────────────
export const FLOOR = {
  DIM:   10,
  LINES: 10,
  COLOR: 0.78,
} as const;
```

**Migration steps:**
1. Create `src/stories/three/stories-components/webgl-basis/config.ts`.
2. Import and replace all magic literals in:
   - `webgl-utils.ts` → CUBE, FACE_COLORS, TRIANGLE_COLORS, FLOOR, VERTEX_COLORS, PICK
   - `hooks/useUI.ts` → CAMERA, CUBE
   - `components/WebGLCanvas.tsx` → PICK, CUBE

**Acceptance Criteria:**
- [ ] No magic numbers remain in webgl-utils, useUI, or WebGLCanvas
- [ ] All values accessible from a single import: `import { CUBE, CAMERA, … } from '../config'`
- [ ] Build still passes with no errors

---

## UI / UX

### UI-01: Bottom status bar
**Status:** 🔲 Not Started
**Priority:** P1
**Difficulty:** Easy
**Files:** `webgl-basis.tsx`, `components/StatusBar.tsx` (new)

**Description:**
Move all dynamic runtime info out of the floating log box and the inline toolbar badge into a
dedicated **bottom status bar** spanning the full width of the component.

**Content (left → right):**
```
[ Hover: #3 ]  [ Selected: #1 ]  [ Dragging ]  |  Vertex 1: (2.14, 0.82, -5.00)
```

**Implementation:**
1. Create `components/StatusBar.tsx`:
   ```tsx
   interface StatusBarProps {
     hoveredIndex: number | null;
     selectedIndex: number | null;
     isDragging: boolean;
     logMessage: string;
   }
   ```
2. Remove the floating `LogMessage` box and the vertex badge from the toolbar.
3. `LogMessage` component can be kept as the log engine but rendered inside `StatusBar`.
4. Pin bar to `bottom-0 left-0 right-0` with `z-30`, fixed height, dark background.

**Acceptance Criteria:**
- [ ] Status bar always visible at bottom edge
- [ ] Shows hover / selected / dragging state in real time
- [ ] Shows last coordinate log message
- [ ] No floating amber log box on canvas
- [ ] No vertex badge cluttering the top toolbar

---

### UI-02: Canvas fits Storybook viewport (no Y scroll)
**Status:** 🔲 Not Started
**Priority:** P1
**Difficulty:** Easy
**Files:** `webgl-basis.tsx`, `components/WebGLCanvas.tsx`

**Description:**
The canvas currently has a hard-coded `width={1050} height={750}` that overflows the Storybook
iframe, forcing Y-scroll. The layout must be responsive: the canvas fills the available height
minus the toolbar and status bar.

**Fix:**
1. Remove `width={1050} height={750}` from the `<canvas>` element attribute (these set the
   **internal resolution**; they must stay as JS properties, not HTML attrs, OR be set
   dynamically via `ResizeObserver`).
2. Use CSS to make the canvas fill its container:
   ```tsx
   <canvas
     ref={canvasRef}
     className="w-full h-full block"
     style={{ display: 'block' }}
   />
   ```
3. In the parent layout set up a flex column so the canvas gets all remaining height:
   ```tsx
   <div className="flex flex-col" style={{ height: '100vh' }}>
     <div className="flex-none">  {/* toolbar */}  </div>
     <div className="flex-1 min-h-0">  {/* canvas wrapper */}  </div>
     <div className="flex-none">  {/* status bar */}  </div>
   </div>
   ```
4. Add a `ResizeObserver` in `WebGLCanvas` that syncs `canvas.width` / `canvas.height` to the
   element's actual `clientWidth` / `clientHeight` whenever it changes, then calls
   `useUI`'s `updateMatrices` with the new dimensions so the projection stays correct.

**Acceptance Criteria:**
- [ ] No vertical scroll in Storybook at any reasonable viewport width
- [ ] Canvas fills all space between toolbar and status bar
- [ ] Aspect ratio updates correctly on window resize
- [ ] Vertex pick radius remains accurate after resize

---

---

### CONTENT-01: Blog Post — Ray Tracing (iframe story)
**Status:** ✅ Complete
**Priority:** P2
**Difficulty:** Easy
**Files:**
- `src/stories/three/stories-components/webgl-blog-post/WebGLBlogPost.tsx` (new)
- `src/stories/three/stories-components/webgl-blog-post/WebGLBlogPost.stories.tsx` (new)

**Description:**
Embed the author's 2018 WebGL ray-tracing blog post as a Storybook story so it lives
alongside the other WebGL examples.

**Source URL:** `https://drmayor.blogspot.com/2018/05/10-raytracing.html`

**Implementation:**
- `WebGLBlogPost.tsx` renders a `position:fixed; inset:0` wrapper with a full-viewport
  `<iframe>` pointing to the post URL.
- `WebGLBlogPost.stories.tsx` registers it under `title: 'WebGL/Blog/Ray Tracing Post'`
  with `layout: 'fullscreen'` so there is no Storybook padding around the embed.

**Notes:**
- `loading="lazy"` defers fetch until the story is actually viewed.
- `referrerPolicy="no-referrer"` avoids leaking the Storybook origin to Blogger.
- If Blogger serves an `X-Frame-Options: SAMEORIGIN` header, the iframe will be blocked
  by the browser. In that case the task would need to fall back to an external link
  button + screenshot preview. Test in the browser to confirm embeddability.

**Acceptance Criteria:**
- [x] Story appears under `WebGL > Blog > Ray Tracing Post` in Storybook sidebar
- [x] iframe fills the entire viewport with no scroll bars
- [x] No Storybook body padding visible around the embed
- [ ] Blog post loads without X-Frame-Options error (browser-dependent — Blogger policy)

---

## Dependency Graph

```
BUG-01 (Faces stale render)           — independent, fix first
BUG-02 (Triangles distinct colors)    — depends on BUG-01 pattern

FEAT-01 (Interaction mode panel)       — depends on types.ts update
FEAT-02 (config.ts)                   — independent, low risk

UI-01 (Status bar)                    — independent
UI-02 (Canvas fit viewport)           — independent

CONTENT-01 (Blog post iframe)         — independent
```

## Priority Order

| # | Task | Priority | Est. Time | Status |
|---|------|----------|-----------|--------|
| 1 | BUG-01 — Faces stale render | P0 | 30 min | ✅ |
| 2 | BUG-02 — Triangles distinct colors | P1 | 45 min | ✅ |
| 3 | FEAT-02 — config.ts | P1 | 30 min | ✅ |
| 4 | UI-02 — Canvas fits viewport | P1 | 45 min | ✅ |
| 5 | UI-01 — Status bar | P1 | 1 h | ✅ |
| 6 | FEAT-01 — Interaction mode panel | P0 | 1.5 h | ✅ |
| 7 | CONTENT-01 — Blog post iframe | P2 | 15 min | ✅ |
