# WebGL Basis - Design Document

## Overview

The WebGL Basis component is a modern React + TypeScript implementation of a 3D cube editor built with native WebGL (no Three.js or other higher-level graphics libraries). This design document outlines the architecture, data flow, and rendering strategy. This is an isolated story whose paths inside must be appended to "src/stories/three/stories-components/webgl-basis/".

## Architecture

### Component Hierarchy

```
WebglBasis (Main Container)
├── WebGLCanvas (Rendering Engine)
│   ├── Shader Management
│   ├── Buffer Management
│   ├── Render Loop
│   └── Mouse Event Handlers
├── ViewSettings (UI Control)
├── ProjectionSettings (UI Control)
├── ZoomControl (UI Control)
├── InteractionModeControl (UI Control)
├── InstructionsPanel (Documentation)
└── LogMessage (Status Display)
```

### State Management

**Global State (useUI Hook):**
```typescript
UIState {
  projection: Mat4                    // Camera projection matrix
  modelview: Mat4                     // Camera model-view matrix
  eye: Vec3                           // Camera position
  center: Vec3                        // Look-at target
  angleX, angleY: number              // Camera rotation angles
  zoomZ: number                       // Camera zoom factor
  interactionMode: InteractionMode    // Current interaction mode
  viewMode: ViewMode                  // Rendering view (edges/faces/points/etc)
  projectionType: ProjectionType      // Perspective/Orthogonal
  zoom: number                        // UI zoom slider value [0-10]
}
```

**Component State:**
- `showPickFrame` - Toggle for selection frame view
- `selectedVertex` - Currently selected vertex index (future)
- `selectedFace` - Currently selected face index (future)

## Rendering Pipeline

### View Modes

The application supports multiple rendering modes for different visualization purposes:

#### 1. **Wireframe (Edges)**
- **Purpose:** See cube structure with edge visibility
- **Rendering:** GL_LINES primitive type
- **Data:** 24 line segments (12 edges × 2 vertices)
- **Color:** Per-vertex coloring from color attribute

#### 2. **Solid Faces** (Planned)
- **Purpose:** View opaque cube faces with material colors
- **Rendering:** GL_TRIANGLES primitive type
- **Data:** 36 vertices (6 faces × 6 vertices per face)
- **Color:** Per-face coloring (different material per face)

#### 3. **Triangulated View** (Planned)
- **Purpose:** Show triangle decomposition with distinct colors
- **Rendering:** GL_TRIANGLES primitive type
- **Data:** 36 vertices with unique face colors
- **Color:** Each face (2 triangles) gets a unique color

#### 4. **Vertices Only**
- **Purpose:** View cube vertices with potential highlighting
- **Rendering:** GL_POINTS primitive type
- **Data:** 8 vertex positions
- **Color:** Per-vertex coloring with selection highlighting

#### 5. **Selection Frame** (Planned)
- **Purpose:** 2D orthographic view of vertex picking
- **Rendering:** Orthographic projection, GL_POINTS
- **Data:** 8 vertices in 2D normalized space
- **Color:** Highlight selected vertex, grey for others

### Shader Pipeline

**Vertex Shader:**
```glsl
attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec4 aPickColor;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform bool uOffscreen;

varying lowp vec4 vColor;
varying lowp vec4 vPickColor;

void main(void) {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  gl_PointSize = uOffscreen ? 20.0 : 10.0;
  vColor = aVertexColor;
  vPickColor = aPickColor;
}
```

**Fragment Shader:**
```glsl
varying lowp vec4 vColor;
varying lowp vec4 vPickColor;
uniform bool uOffscreen;
uniform bool uWireframe;

void main(void) {
  // Circle falloff for points
  vec2 location = gl_PointCoord - vec2(0.5, 0.5);
  if(dot(location, location) > 0.25) discard;
  
  if(uOffscreen) {
    gl_FragColor = vPickColor;
  } else if(uWireframe) {
    gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
  } else {
    gl_FragColor = vColor;
  }
}
```

## Camera System

### Projection Matrices

**Perspective Projection:**
- Field of View (FOV): 55°
- Aspect Ratio: Canvas width / height
- Near Plane: 0.1
- Far Plane: 100.0
- Zoom: Applied as FOV divisor (FOV / zoom)

**Orthogonal Projection:**
- Width: 10 / zoom
- Height: 10 / zoom
- Near Plane: 0.1
- Far Plane: 100.0

### Model-View Matrix

Uses simplified lookAt implementation:
```
Forward = normalize(center - eye)
Right = normalize(cross(forward, [0,1,0]))
Up = cross(right, forward)
```

## Data Structures

### Cube Geometry

**Vertices (8 points):**
```
p1 = (1.0, 3.0, -10.0)    // 0: top-left-far
p2 = (3.0, 3.0, -10.0)    // 1: top-right-far
p3 = (3.0, -0.5, -10.0)   // 2: bottom-right-far
p4 = (1.0, -0.5, -10.0)   // 3: bottom-left-far
p5 = (1.0, 3.0, -5.0)     // 4: top-left-near
p6 = (3.0, 3.0, -5.0)     // 5: top-right-near
p7 = (3.0, -0.5, -5.0)    // 6: bottom-right-near
p8 = (1.0, -0.5, -5.0)    // 7: bottom-left-near
```

**Edges (12):**
```
Far face:     0-1, 1-2, 2-3, 3-0
Near face:    4-5, 5-6, 6-7, 7-4
Connecting:   0-4, 1-5, 2-6, 3-7
```

**Faces (6):**
```
Far:    0-1-2, 2-3-0
Near:   4-5-6, 6-7-4
Top:    0-1-5, 5-4-0
Bottom: 2-3-7, 7-6-2
Right:  1-2-6, 6-5-1
Left:   3-0-4, 4-7-3
```

**Colors (RGB per vertex):**
```
Red (X):     1.0, 0.0, 0.0
Green (Y):   0.0, 1.0, 0.0
Blue (Z):    0.0, 0.0, 1.0
Yellow:      1.0, 1.0, 0.0
Magenta:     1.0, 0.0, 1.0
Cyan:        0.0, 1.0, 1.0
```

## Interaction Flow

### Current Flow
1. User clicks on canvas
2. `handleInteractionStart` saves click position
3. Multiple handlers track mouse movement
4. `handleInteractionEnd` completes interaction

### Planned Flow
1. Get mouse position in canvas space
2. Convert to 3D ray via inverse MVP matrix
3. Test ray intersection with cube geometry
4. If vertex hit → highlight and track selection
5. On mouse move → constrain to XY plane, update vertex position
6. On mouse release → finalize deformation

## Rendering Strategy

### Performance Considerations

1. **Batch Rendering:** All geometry rendered in single draw call per shape
2. **Dynamic Buffers:** Use `gl.DYNAMIC_DRAW` for vertex positions that may change
3. **Frustum Culling:** Floor grid and cube always on-screen, no culling needed
4. **State Management:** Minimize WebGL state changes per frame

### Render Loop

```
Every Frame:
1. Clear canvas (color + depth)
2. Setup WebGL state (viewport, program)
3. Update matrices from UI state
4. Draw floor grid (GL_LINES)
5. Draw cube based on viewMode:
   - edges: GL_LINES (24 indices)
   - faces: GL_TRIANGLES (36 indices)
   - points: GL_POINTS (8 vertices)
   - triangles: GL_TRIANGLES with unique colors (36 indices)
6. Render selection frame if enabled (overlay orthographic view)
7. Request next animation frame
```

## Coordinate Systems

### World Space
- X: Left-Right (positive right)
- Y: Up-Down (positive up)
- Z: Forward-Backward (positive toward camera)

### Screen Space
- Origin: Top-left corner
- X: Left to Right (0 to width)
- Y: Top to Bottom (0 to height)

### Normalized Device Coordinates (NDC)
- Range: [-1, 1] for X and Y
- Depth: [-1, 1] where -1 is near plane, 1 is far plane

## UI/UX Design

### Control Panel (Top)
- Interaction Mode: Deform/Scale/Extrude (planned interaction types)
- View Settings: Switch between render modes
- Projection: Perspective / Orthogonal toggle
- Zoom: Slider [0-10] to control view zoom

### Overlays
- Instructions Panel: Bottom-left, explains controls
- Log Message: Status messages below instructions
- Selection Frame: Optional overlay for vertex selection (when enabled)

## Future Extensions

1. **Undo/Redo System:** Track vertex position changes
2. **Export/Import:** Save/load cube geometry as JSON
3. **Additional Shapes:** Extend beyond cube to support other primitives
4. **Texture Support:** Add texture mapping to faces
5. **Lighting Model:** Implement Phong/PBR shading
6. **Performance Optimization:** Level-of-detail rendering, instancing
7. **Touch Support:** Mobile/tablet interaction
8. **Keyboard Shortcuts:** Delete vertex, duplicate face, etc.

## Technology Stack

- **Framework:** React 18+ with TypeScript
- **Graphics API:** WebGL 1.0 (compatible, no extensions required)
- **Matrix/Vector Math:** Vanilla JS implementations
- **Styling:** Tailwind CSS
- **Build Tool:** Vite (via Storybook)
- **State Management:** React Hooks (useState, useCallback, useRef)
