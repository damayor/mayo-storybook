# WebGL Basis - Task List

## Overview

This document contains the actionable task list for improving the WebGL Basis 3D cube editor. Tasks are organized by priority and dependency chain.

## Sprint 1: Localization & UI Polish

### Task 1.1: Translate Spanish Labels to English

**Status:** 🔲 Not Started  
**Priority:** P0 (Blocking)  
**Difficulty:** Easy  
**Estimated Time:** 30 min  
**Dependencies:** None

**Description:**
Replace all Spanish UI labels and text with English equivalents to standardize the interface.

**Current Spanish Labels:**

- "Modo de interacción" → "Interaction Mode"
- "Vista" → "View Settings"
- "Aristas" → "Wireframe"
- "Caras" → "Faces"
- "Tipo de proyección" → "Projection Type"
- "Perspectiva" → "Perspective"
- "Ortogonal" → "Orthogonal"
- "Zoom" → "Zoom" (already English)
- "Frame de selección" → "Selection Frame"

**Files to Update:**

- `components/InteractionModeControl.tsx`
- `components/ViewSettings.tsx`
- `components/ProjectionSettings.tsx`
- `components/ZoomControl.tsx`
- `components/InstructionsPanel.tsx`

**Acceptance Criteria:**

- [ ] All UI labels in English
- [ ] No Spanish text in components
- [ ] Component documentation updated
- [ ] No broken functionality

---

### Task 1.2: Update Instructions Panel

**Status:** 🔲 Not Started  
**Priority:** P1  
**Difficulty:** Easy  
**Estimated Time:** 15 min  
**Dependencies:** Task 1.1

**Description:**
Enhance the instructions panel with clear, English instructions for all features.

**Content:**

```
Cube Editor with WebGL

How to use:
1. Adjust zoom slider to frame the cube
2. Toggle projection type (Perspective/Orthographic)
3. Select view mode (Wireframe/Points/Faces)
4. Click on vertex to select it
5. Drag selected vertex in XY plane to deform
6. Right-click + drag to rotate camera
```

**Files to Update:**

- `components/InstructionsPanel.tsx`

**Acceptance Criteria:**

- [ ] Clear, concise instructions displayed
- [ ] All features documented
- [ ] Professional formatting

---

## Sprint 2: Rendering Modes

### Task 2.1: Implement Solid Face Rendering (Opaque)

**Status:** ✅ Complete
**Priority:** P0 (Core Feature)
**Difficulty:** Medium
**Estimated Time:** 2 hours
**Dependencies:** None (current architecture ready)

**Description:**
Add ability to render the cube as opaque faces with distinct colors for each face material. This is the "Faces" view mode.

**Requirements:**

- Render 6 cube faces as solid surfaces
- Each face has different material color:
  - Top: Red (1, 0, 0)
  - Bottom: Green (0, 1, 0)
  - Front: Blue (0, 0, 1)
  - Back: Yellow (1, 1, 0)
  - Left: Magenta (1, 0, 1)
  - Right: Cyan (0, 1, 1)
- Use GL_TRIANGLES with 36 vertices (6 faces × 6 vertices)
- Enable back-face culling: `gl.enable(gl.CULL_FACE)`
- No transparency (opaque)

**Implementation Steps:**

1. Create new function in `webgl-utils.ts`: `generateCubeFaces()`

   ```typescript
   generateCubeFaces(): {
     vertices: number[];
     colors: number[];
     indices: number[];
   }
   ```

2. Generate vertex data:
   - 36 vertices (6 vertices per face, duplicated for face normals)
   - Each face gets all 6 verts with same color
   - Indices in triangle order [0,1,2, 2,3,0, ...]

3. Update `WebGLCanvas.tsx`:
   - Add cube faces buffer creation
   - Add conditional rendering: if `viewMode === 'faces'`, render faces
   - Else if `viewMode === 'edges'`, render edges
   - Else render points

4. Update view mode type:

   ```typescript
   type ViewMode = 'edges' | 'points' | 'faces' | 'triangles' | 'selection-frame';
   ```

5. Update `ViewSettings.tsx` UI:
   - Add radio button for "Faces"
   - Update value checking

**Files to Modify:**

- `types.ts` - Update ViewMode type
- `webgl-utils.ts` - Add `generateCubeFaces()` function
- `components/WebGLCanvas.tsx` - Add face rendering
- `components/ViewSettings.tsx` - Add UI radio button

**Acceptance Criteria:**

- [x] "Faces" view mode renders opaque cube
- [x] Each face has correct color
- [x] No visible back faces (culling works)
- [x] Smooth color transitions between faces
- [x] Toggle between wireframe and faces works correctly
- [x] No performance regression
- [x] No console errors

**Testing:**

```
1. Switch view to "Faces"
2. Observe 6 solid colored faces
3. Rotate camera (right-click + drag)
4. Verify back faces are hidden
5. Toggle to "Wireframe" and back
6. Verify colors don't bleed between faces
```

---

### Task 2.2: Implement Colored Triangle Rendering

**Status:** 🔲 Not Started  
**Priority:** P1  
**Difficulty:** Medium  
**Estimated Time:** 1.5 hours  
**Dependencies:** Task 2.1

**Description:**
Add ability to render the cube decomposed into 12 colored triangles, each with distinct colors. This is the "Triangles" view mode (educational visualization of tessellation).

**Requirements:**

- Render 12 triangles (2 per face)
- Each triangle gets unique color from palette
- 12 colors from color cycle:
  ```
  colors = [
    [1, 0, 0],       // Red
    [0, 1, 0],       // Green
    [0, 0, 1],       // Blue
    [1, 1, 0],       // Yellow
    [1, 0, 1],       // Magenta
    [0, 1, 1],       // Cyan
    [1, 0.5, 0],     // Orange
    [0.5, 0, 1],     // Purple
    [1, 0, 0.5],     // Pink
    [0, 1, 0.5],     // Spring Green
    [0.5, 1, 0],     // Lime
    [0.5, 0.5, 0.5], // Gray
  ]
  ```
- Use GL_TRIANGLES with 36 vertices
- Optional wireframe overlay (subtle)

**Implementation Steps:**

1. Create new function in `webgl-utils.ts`: `generateCubeTriangles()`

   ```typescript
   generateCubeTriangles(): {
     vertices: number[];
     colors: number[];
     indices: number[];
   }
   ```

2. Generate vertex data:
   - Same vertex positions as faces
   - But with 12 unique colors (2 triangles × 6 faces)
   - Careful index ordering to match triangles

3. Update `WebGLCanvas.tsx`:
   - Add cube triangles buffer
   - Add conditional: if `viewMode === 'triangles'`, render triangles
   - Keep edge overlay optional (via additional GL_LINES render)

4. Optional: Add subtle edge overlay
   ```typescript
   if (showTriangleEdges) {
     drawShape(...cubeEdgesBuffers, ..., true); // wireframe=true
   }
   ```

**Files to Modify:**

- `webgl-utils.ts` - Add `generateCubeTriangles()` function
- `components/WebGLCanvas.tsx` - Add triangle rendering
- `components/ViewSettings.tsx` - Add UI radio button for triangles

**Acceptance Criteria:**

- [ ] "Triangles" view mode renders 12 distinct colored triangles
- [ ] Each triangle clearly visible with unique color
- [ ] Triangle boundaries visible (no color bleeding)
- [ ] Educational value clear (shows tessellation)
- [ ] Toggle between modes works smoothly
- [ ] No console errors

**Testing:**

```
1. Switch view to "Triangles"
2. Observe 12 colored triangles covering cube
3. Verify 2 triangles per face
4. Rotate camera to see 3D effect
5. Compare colors between adjacent triangles
6. Toggle to other view modes
```

---

## Sprint 3: Vertex Selection & Interaction

### Task 3.1: Implement Vertex Selection & Highlighting

**Status:** 🔲 Not Started  
**Priority:** P0 (Core Feature)  
**Difficulty:** Hard  
**Estimated Time:** 3 hours  
**Dependencies:** None (foundational)

**Description:**
Add the ability to click on vertices and have them highlight. This is the foundation for vertex manipulation.

**Requirements:**

- Click on vertex to select it (within hit radius)
- Selected vertex highlights in different color (white/yellow)
- Un-select by clicking empty space
- Only one vertex selected at a time
- Visual feedback immediate and clear
- Ray-triangle intersection algorithm
- Vertex distance threshold (pick radius)

**Implementation Steps:**

1. Add state to `useUI` hook:

   ```typescript
   selectedVertexIndex: number | null;
   ```

2. Create picking utility in `webgl-utils.ts`:

   ```typescript
   interface PickResult {
     vertexIndex: number;
     distance: number;
   }

   function pickVertex(
     mouseX: number,
     mouseY: number,
     width: number,
     height: number,
     vertices: number[],
     invMVP: Mat4,
     pickRadius: number = 0.1
   ): PickResult | null {
     // Calculate view ray from mouse position
     // Find closest vertex to ray
     // Return if within threshold
   }
   ```

3. Update `WebGLCanvas.tsx`:

   ```typescript
   const handleVertexPick = (e: MouseEvent) => {
     const picked = pickVertex(
       e.clientX,
       e.clientY,
       canvas.width,
       canvas.height,
       cubeVertices,
       invMVP
     );
     if (picked) {
       setSelectedVertex(picked.vertexIndex);
     }
   };
   ```

4. Modify vertex color rendering:
   - If vertex is selected, use highlight color (white)
   - Otherwise use face color
   - Update color buffer based on selection

5. Update `types.ts`:
   ```typescript
   interface UIState {
     // ... existing fields
     selectedVertexIndex: number | null;
   }
   ```

**Math Details (Ray-Sphere Intersection):**

```typescript
const ray_origin = cameraEye;
const ray_direction = getEyeRay(invMVP, x, y, width, height);

for (let i = 0; i < vertices.length; i += 3) {
  const vertex = [vertices[i], vertices[i + 1], vertices[i + 2]];
  const toVertex = subtract(vertex, ray_origin);
  const projection = dot(toVertex, ray_direction);
  const closest = add(ray_origin, scale(ray_direction, projection));
  const distance = distance(vertex, closest);

  if (distance < pickRadius) {
    results.push({ vertexIndex: i / 3, distance });
  }
}

return minBy(results, 'distance') || null;
```

**Files to Modify:**

- `types.ts` - Add `selectedVertexIndex` to UIState
- `hooks/useUI.ts` - Add state setter
- `webgl-utils.ts` - Add `pickVertex()` function
- `components/WebGLCanvas.tsx` - Add picking logic
- Update color generation to highlight selected

**Acceptance Criteria:**

- [ ] Clicking near vertex selects it
- [ ] Selected vertex shown in highlight color (white/yellow)
- [ ] Only one vertex selected at a time
- [ ] Click on empty space deselects
- [ ] Visual feedback is immediate
- [ ] Picking works in both perspective and orthographic views
- [ ] Pick radius is reasonable (neither too large nor too small)
- [ ] No console errors
- [ ] No lag from picking operations

**Testing:**

```
1. Click on each of 8 vertices
2. Verify each highlights in unique color
3. Verify only one selection active
4. Click empty space, verify deselection
5. Test in both projection modes
6. Rotate camera, verify selection persists
7. Zoom in/out, verify picking still works
```

---

### Task 3.2: Implement XY-Plane Vertex Deformation

**Status:** 🔲 Not Started  
**Priority:** P0 (Core Feature)  
**Difficulty:** Hard  
**Estimated Time:** 3 hours  
**Dependencies:** Task 3.1

**Description:**
Allow dragging selected vertices in the XY plane while keeping Z constant. This is the primary interaction for editing the cube.

**Requirements:**

- Left-click + drag on selected vertex
- Vertex moves in world XY plane
- Z position remains unchanged
- Real-time vertex position update
- Mesh connectivity preserved
- Visual feedback (cursor feedback, status messages)
- Cube deforms smoothly in real-time
- Release mouse to finalize
- Escape key cancels deformation

**Implementation Steps:**

1. Add deformation state to `useUI`:

   ```typescript
   isDraggingVertex: boolean;
   dragStartPos: Vec2 | null;
   vertexStartPos: Vec3 | null;
   ```

2. Create interaction handler in `WebGLCanvas.tsx`:

   ```typescript
   const handleVertexDragStart = (vertexIndex: number, position: Vec2) => {
     if (selectedVertexIndex !== vertexIndex) return;
     setIsDraggingVertex(true);
     setDragStartPos(position);
     setVertexStartPos(vertices[vertexIndex]);
   };

   const handleVertexDragMove = (currentPos: Vec2) => {
     if (!isDraggingVertex || !selectedVertexIndex) return;

     // Convert screen coords to world XY
     const worldXY = screenToWorldXY(currentPos, invMVP, canvas);

     // Keep original Z
     const newPos = [worldXY.x, worldXY.y, vertexStartPos.z];

     // Update vertex buffer
     cubeVertices[selectedVertexIndex * 3 + 0] = newPos[0];
     cubeVertices[selectedVertexIndex * 3 + 1] = newPos[1];
     cubeVertices[selectedVertexIndex * 3 + 2] = newPos[2];

     // Update WebGL buffer
     updateVertexBuffer(cubeVertices);

     // Log status
     logRef.current?.log?.(
       `Vertex ${selectedVertexIndex}: (${newPos[0]}, ${newPos[1]}, ${newPos[2]})`
     );
   };

   const handleVertexDragEnd = () => {
     setIsDraggingVertex(false);
     logRef.current?.log?.('Deformation complete');
   };
   ```

3. Add coordinate transformation helper:

   ```typescript
   function screenToWorldXY(
     screenPos: Vec2,
     invMVP: Mat4,
     canvas: HTMLCanvasElement,
     z: number = 0
   ): Vec2 {
     // Convert screen to NDC
     const ndc = {
       x: (screenPos.x / canvas.width) * 2 - 1,
       y: 1 - (screenPos.y / canvas.height) * 2,
     };

     // Transform through inverse MVP
     const worldPos = vec4Transform([ndc.x, ndc.y, z, 1], invMVP);
     divideByW(worldPos);

     return { x: worldPos[0], y: worldPos[1] };
   }
   ```

4. Update vertex buffer dynamically:

   ```typescript
   const updateVertexBuffer = (vertices: number[]) => {
     gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
     gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
   };
   ```

5. Wire up mouse event handlers:

   ```typescript
   const handleMouseDown = (e: MouseEvent) => {
     if (e.button !== 0) return; // Left click only
     handleVertexDragStart(selectedVertexIndex, {
       x: e.clientX,
       y: e.clientY,
     });
   };

   const handleMouseMove = (e: MouseEvent) => {
     handleVertexDragMove({ x: e.clientX, y: e.clientY });
   };

   const handleMouseUp = () => {
     handleVertexDragEnd();
   };

   const handleKeyDown = (e: KeyboardEvent) => {
     if (e.key === 'Escape') {
       // Reset vertex to original position
       cubeVertices.set(vertexStartPos);
       updateVertexBuffer(cubeVertices);
       handleVertexDragEnd();
     }
   };
   ```

6. Regenerate affected geometry:
   - Cube edges connected to moved vertex update automatically
   - Cube faces update automatically
   - No mesh breaking (vertices stay connected)

**Files to Modify:**

- `types.ts` - Add deformation state fields
- `hooks/useUI.ts` - Add state management
- `webgl-utils.ts` - Add `screenToWorldXY()` and buffer update functions
- `components/WebGLCanvas.tsx` - Complete interaction handling
- Update render loop to handle dynamic geometries

**Acceptance Criteria:**

- [ ] Selecting vertex and dragging moves it
- [ ] XY movement works, Z stays constant
- [ ] Real-time visual update during drag
- [ ] Cube deforms correctly
- [ ] Mesh connectivity preserved
- [ ] Status messages show position feedback
- [ ] Escape cancels and reverts changes
- [ ] Works in both projection modes
- [ ] Works with zoom levels
- [ ] Smooth interaction (60 FPS)
- [ ] No visual artifacts during deformation

**Testing:**

```
1. Select a vertex
2. Drag it left/right (X movement)
3. Drag it up/down (Y movement)
4. Drag diagonally
5. Verify Z doesn't change
6. Observe cube edges update
7. Press Escape during drag, verify revert
8. Toggle projection and try again
9. Rotate camera while dragging
10. Verify smooth 60 FPS performance
```

---

## Sprint 4: Advanced Features

### Task 4.1: Implement Selection Frame (2D View)

**Status:** 🔲 Not Started  
**Priority:** P2  
**Difficulty:** Medium  
**Estimated Time:** 2 hours  
**Dependencies:** Task 3.1

**Description:**
Add optional 2D orthographic view of vertices for educational purposes and alternative selection method.

**Requirements:**

- Toggle-able via checkbox in View Settings
- Shows 8 vertices as circles in 2D
- Vertices arranged naturally in 2D space
- Click to select vertex in 2D (syncs with 3D)
- Selected vertex highlighted
- Zoom/pan for 2D view
- Shows vertex indices or labels

**Implementation:**

- Separate render pass with orthographic projection
- Layer as overlay or split-view (configurable)
- Clicking selects vertex in both 2D and 3D views
- Optional edge overlay showing connectivity

**Files to Modify:**

- `components/WebGLCanvas.tsx` - Add separate render pass
- `webgl-utils.ts` - Add `renderSelectionFrame()` function
- `components/ViewSettings.tsx` - Add checkbox for "Selection Frame"
- `types.ts` - Add `showSelectionFrame` state

---

### Task 4.2: Add Undo/Redo Support

**Status:** 🔲 Not Started  
**Priority:** P3  
**Difficulty:** Hard  
**Estimated Time:** 2-3 hours  
**Dependencies:** Task 3.2

**Description:**
Implement undo/redo history for vertex deformations to allow users to experiment without fear of losing changes.

**Features:**

- Ctrl+Z / Cmd+Z for undo
- Ctrl+Y / Cmd+Shift+Z for redo
- Limit history to last 20 states
- Visual feedback on history state
- Status message showing undo/redo position

---

### Task 4.3: Export Geometry as JSON

**Status:** 🔲 Not Started  
**Priority:** P2  
**Difficulty:** Easy  
**Estimated Time:** 1 hour  
**Dependencies:** Task 3.2

**Description:**
Allow users to export the modified cube geometry as JSON for saving/sharing.

**Format:**

```json
{
  "vertices": [x0, y0, z0, x1, y1, z1, ...],
  "faces": [[0,1,2], [2,3,0], ...],
  "metadata": {
    "version": "1.0",
    "timestamp": "2026-04-04T12:00:00Z",
    "author": "user"
  }
}
```

---

## Dependency Graph

```
Task 1.1 (Localization - Easy)
  └─ Task 1.2 (Instructions - Easy)

Task 2.1 (Solid Faces - Medium) [Independent]
  └─ Task 2.2 (Colored Triangles - Medium)

Task 3.1 (Vertex Selection - Hard) [Independent]
  └─ Task 3.2 (XY-Plane Deformation - Hard)
     └─ Task 4.2 (Undo/Redo)
     └─ Task 4.3 (Export JSON)

Task 4.1 (Selection Frame - Medium) [Depends on 3.1]
```

## Priority Matrix

| Task | Priority | Difficulty | Time | Dependencies |
| ---- | -------- | ---------- | ---- | ------------ |
| 1.1  | P0       | Easy       | 30m  | None         |
| 1.2  | P1       | Easy       | 15m  | 1.1          |
| 2.1  | P0       | Medium     | 2h   | None         |
| 2.2  | P1       | Medium     | 1.5h | 2.1          |
| 3.1  | P0       | Hard       | 3h   | None         |
| 3.2  | P0       | Hard       | 3h   | 3.1          |
| 4.1  | P2       | Medium     | 2h   | 3.1          |
| 4.2  | P3       | Hard       | 3h   | 3.2          |
| 4.3  | P2       | Easy       | 1h   | 3.2          |

## Recommended Order

**Week 1 (MVP):**

1. Task 1.1 - Localization (30 min)
2. Task 2.1 - Solid Face Rendering (2 hours)
3. Task 3.1 - Vertex Selection (3 hours)
4. Task 3.2 - XY-Plane Deformation (3 hours)

**Week 2:** 5. Task 2.2 - Colored Triangles (1.5 hours) 6. Task 1.2 - Enhanced Instructions (15 min) 7. Task 4.1 - Selection Frame (2 hours) 8. Task 4.3 - Export JSON (1 hour)

**Week 3+:** 9. Task 4.2 - Undo/Redo (3 hours) 10. Testing, optimization, documentation

---

## Progress Tracking

- [ ] Week 1 MVP launched
- [ ] All P0 tasks complete
- [ ] All P1 tasks complete
- [ ] All P2 tasks complete
- [ ] P3 tasks evaluated

---

## Success Criteria (Overall)

- [x] All code compiles without errors
- [x] Component renders without visual glitches
- [ ] All Spanish labels translated to English
- [ ] All 4 rendering modes functional
- [ ] Vertex selection and highlighting working
- [ ] XY-plane deformation smooth at 60 FPS
- [ ] User can complete editing task without instructions
- [ ] No console errors or warnings
- [ ] Component works in Storybook
