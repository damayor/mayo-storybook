# WebGL Basis - Feature Proposal

## Executive Summary

This document proposes a complete feature set for the WebGL Basis 3D cube editor. The application provides an interactive platform for visualizing and editing 3D geometry using native WebGL, designed as a learning tool and showcase for modern web-based graphics programming.

## Vision

**Create a lightweight, educational 3D cube editor that:**
- Demonstrates native WebGL capabilities without framework abstractions
- Provides interactive 3D geometry manipulation in the browser
- Serves as a reference implementation for graphics programming concepts
- Integrates seamlessly with Storybook as an interactive component

## Core Features

### 1. Multiple Visualization Modes

#### View Modes (Progressive Enhancement)

| Mode | Render Type | Purpose | Status |
|------|-------------|---------|--------|
| Wireframe | GL_LINES | See cube structure | ✅ Implemented |
| Points | GL_POINTS | Vertex selection | ✅ Implemented |
| Faces | GL_TRIANGLES | Opaque surface rendering | 🔲 Planned |
| Triangles | GL_TRIANGLES | Colored triangle decomposition | 🔲 Planned |
| Selection Frame | Orthographic 2D | Vertex picking interface | 🔲 Planned |

### 2. Camera Control System

**Features:**
- Perspective and Orthogonal projection modes
- Zoom slider for view control [0-10 range]
- Mouse right-click + drag for camera rotation
- Field of view adjustable via zoom
- Real-time matrix updates

**Current Status:** ✅ Core implementation complete, requiring UX refinement

### 3. Geometry Picking & Selection

**Features:**
- Vertex selection via mouse click
- Highlight selected vertex (visual feedback)
- Vertex position tracking
- Ray-triangle intersection testing (planned)

**Current Status:** 🔲 Infrastructure ready, interaction logic pending

### 4. Geometry Deformation

**Features:**
- Move vertices in XY plane (Z locked to current value)
- Real-time mesh deformation preview
- Maintain vertex connectivity (no mesh breaking)
- Visual feedback during manipulation

**Current Status:** 🔲 Pending vertex selection implementation

### 5. User Interface

**Control Panel Components:**

| Component | Type | Purpose | Status |
|-----------|------|---------|--------|
| View Settings | Radio Toggle | Switch render modes | ✅ Implemented |
| Projection Settings | Radio Toggle | Camera projection type | ✅ Implemented |
| Zoom Control | Slider | View zoom adjustment | ✅ Implemented |
| Interaction Mode | Radio Toggle | Deform/Scale/Extrude modes | ✅ Implemented |

**Overlays:**
- Instructions Panel - Control guidance
- Log Message - Status/feedback display
- Selection Frame - 2D vertex picking (when enabled)

**Current Status:** 🟡 Core UI complete, some modes unimplemented

### 6. Localization

**Current State:** Mixed Spanish/English labels
- UI Labels: Spanish
- Instructions: English
- Log Messages: English

**Proposal:** Standardize to English throughout

## Technical Requirements

### Must Have (MVP)

1. ✅ Canvas rendering with proper z-index layering
2. ✅ Click-through UI elements above canvas
3. ✅ Projection and zoom controls working
4. ✅ Wireframe and point rendering
5. 🔲 Vertex selection and highlighting
6. 🔲 XY-plane vertex deformation
7. 🔲 View mode: Solid faces
8. 🔲 View mode: Colored triangles
9. 🔲 Selection frame mode: Points of vertices in 2D image

### Should Have (Next Phase)

1. 🔲 Extrude Front and Back faces in +- Z 
2. 🔲 Scale faces keeping the angles in 90°

### Nice to Have (Future)

2. 🔲 Materials and textures
3. 🔲 Lighting models (Phong, PBR)
5. 🔲 Collaborative editing via WebSocket

## Feature Specifications

### Vertex Selection System

**Goal:** Enable intuitive vertex picking and manipulation

**Requirements:**
- Ray casting from camera through mouse position
- Intersection testing with geometry
- Visual feedback (highlight selected vertex)
- Unselect on background click
- Support multiple selection modes (single, multi, box select)

**Implementation Approach:**
1. Calculate camera ray: `ray = camera.eye + t * camera.direction`
2. Test ray distance to each vertex
3. Select closest vertex within threshold radius
4. Highlight via separate color attribute
5. Track selection state in React

### XY-Plane Deformation

**Goal:** Allow intuitive mesh editing by dragging vertices

**Requirements:**
- Only allow XY plane movement (Z unchanged)
- Real-time vertex position update
- Mesh connectivity preserved
- Visual feedback (moving vertex shown in different color)
- Abort deformation on Escape key

**Implementation Approach:**
1. On vertex selection, capture current Z position
2. Convert mouse XY to world space preserving Z
3. Update vertex buffer dynamically
4. Regenerate affected geometry (cube edges/faces)
5. Re-render next frame

### Solid Face Rendering

**Goal:** Display cube with opaque, colored faces

**Requirements:**
- 36 vertices (6 faces × 6 vertices per face with normals)
- Per-face material colors (6 different colors)
- Back-face culling for performance
- Normal vector calculation for future lighting

**Implementation Approach:**
1. Generate face-based vertex list with duplicated vertices
2. Calculate per-face normals
3. Assign unique color per face (or per material)
4. Use GL_TRIANGLES for rendering
5. Enable face culling: `gl.enable(gl.CULL_FACE)`

### Colored Triangle View

**Goal:** Show triangle decomposition with distinct coloring

**Requirements:**
- 36 vertices arranged as 12 triangles (2 per face)
- Each triangle gets unique color from palette
- Transparent overlay or separate view mode
- Educational purpose (show tessellation)

**Implementation Approach:**
1. Same vertex data as solid faces
2. Use different fragment shader or color attribute
3. Assign unique colors: `colors[triangle_index] = palette[triangle_index % palette.length]`
4. No normal calculation needed for silhouette view
5. Optional wireframe overlay for edges

### Selection Frame (2D View)

**Goal:** Provide alternative 2D vertex picking interface

**Requirements:**
- Orthographic projection of vertices only
- 2D plane with normalized coordinates
- Visual representation of 8 vertices
- Click to select, highlight selected vertex
- Toggle-able on/off via UI

**Implementation Approach:**
1. Separate render pass with orthographic projection
2. Display vertices as circles in 2D plane
3. Show vertex indices or labels
4. Mouse click detection in 2D space
5. Sync selection with 3D view

## User Workflows

### Workflow 1: Explore Cube Structure
```
1. User launches component
2. Adjusts zoom slider to frame cube in view
3. Toggles between Perspective/Orthogonal
4. Switches view modes (Wireframe/Points/Faces/Triangles)
5. Understands cube geometry
```

### Workflow 2: Edit Cube Geometry
```
1. User selects "Points" view mode
2. Clicks on a vertex to select it (highlighted)
3. Drags vertex in XY plane
4. Cube deforms in real-time
5. Releases mouse to finalize position
6. Repeats for other vertices
```

### Workflow 3: Learn Mesh Structure
```
1. User enables "Selection Frame" view
2. Sees 2D representation of 8 vertices
3. Clicks on 2D vertex to select
4. Observes corresponding 3D vertex highlight
5. Understands picking/intersection algorithm
```

## Success Metrics

### Functional Metrics
- [ ] All view modes render correctly
- [ ] Projection/zoom updates reflect in real-time
- [ ] Vertex selection highlights properly
- [ ] XY-plane deformation works smoothly
- [ ] No visual glitches or rendering artifacts

### Performance Metrics
- [ ] Frame rate > 60 FPS on modern hardware
- [ ] Smooth interactions without lag
- [ ] Memory usage < 10 MB
- [ ] Shader compilation < 100ms

### UX Metrics
- [ ] Users can operate without documentation in < 2 minutes
- [ ] All controls are intuitive and discoverable
- [ ] Status messages provide helpful feedback
- [ ] Responsive to user input without delays

## Dependencies

### Required
- React 18+
- TypeScript 4.5+
- Tailwind CSS 3+
- WebGL 1.0 (all modern browsers)

### Optional
- Storybook 7+ (for documentation and showcase)
- Jest/React Testing Library (for testing)
- gl-matrix (future, for advanced math)

## Timeline & Milestones

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1 (Current) | 1 week | Base component, camera, basic rendering |
| Phase 2 | 2 weeks | All view modes, localization, UI polish |
| Phase 3 | 2 weeks | Selection, deformation, edge cases |
| Phase 4 (Future) | 3 weeks | Undo/redo, export, testing, optimization |

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WebGL compatibility issues | Low | High | Test on multiple browsers, use extensions carefully |
| Performance with large meshes | Low | Medium | Profile code, optimize matrix math, use WebGL 2.0 later |
| Complex intersection logic | Medium | Medium | Use well-tested algorithms, add unit tests |
| Touch input not supported | Medium | Low | Add touch event handlers in future phase |

## Acceptance Criteria

**Feature Complete When:**
1. ✅ All Spanish labels translated to English
2. ✅ Solid face rendering implemented and tested
3. ✅ Colored triangle view working
4. ✅ Vertex selection with highlighting functional
5. ✅ XY-plane deformation smooth and intuitive
6. ✅ Selection frame 2D view optional but working
7. ✅ No console errors or warnings
8. ✅ Frame rate maintained > 60 FPS
9. ✅ All controls responsive and working

## Open Questions

1. Should vertex selection support multi-select?
2. Should faces be color-coded by material or flat colors?
3. Should deformation preview show mesh in real-time or on release?
4. Should there be undo/redo for this MVP?
5. Should export be JSON, OBJ, or GLB format?

## Conclusion

This proposal outlines a comprehensive 3D cube editor that balances educational value with practical functionality. The phased approach allows iterative development while delivering value at each milestone.

The focus on native WebGL demonstrates modern graphics concepts without framework abstractions, making it an excellent learning resource and portfolio piece.
