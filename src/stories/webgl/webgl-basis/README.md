# WebGL Basis - Modernized 3D Cube Editor

//ToDo install opengl library to multiply matrices and so on!

A modern React + TypeScript implementation of a WebGL-based 3D cube editor, originally created in 2018 for a Master's course in Visual and Interactive Computing.

## 📋 Overview

This is a complete modernization of legacy WebGL code from 2018, demonstrating contemporary best practices in 2026:

- ✅ **React** - Component-based architecture
- ✅ **TypeScript** - Full type safety with interfaces
- ✅ **Clean Code** - No dead code or jQuery dependencies
- ✅ **Modular Design** - Separated UI and logic components
- ✅ **Professional Structure** - Organized folder layout with utilities and hooks

## 📁 Project Structure

```
webgl-basis/
├── webgl-basis.tsx                          # Main React component
├── webgl-basis.stories.tsx                  # Storybook integration
├── index.ts                                 # Public exports
├── types.ts                                 # TypeScript interfaces
├── webgl-utils.ts                           # Core WebGL utilities
├── webgl-sketchup.css                       # Styles (pre-Tailwind)
│
├── hooks/
│   └── useUI.ts                             # Camera & UI state management
│
├── components/
│   ├── WebGLCanvas.tsx                      # Core rendering component
│   ├── InteractionModeControl.tsx           # Mode selector UI
│   ├── ViewSettings.tsx                     # View mode selector
│   ├── ProjectionSettings.tsx               # Projection type selector
│   ├── ZoomControl.tsx                      # Zoom slider
│   ├── InstructionsPanel.tsx                # User instructions
│   └── LogMessage.tsx                       # Status messages
│
└── MODERNIZATION.md                         # Detailed modernization guide
```

## 🚀 Quick Start

### Basic Usage

```tsx
import WebglBasis from './webgl-basis/webgl-basis';

function App() {
  return <WebglBasis />;
}
```

### In Storybook

The component is configured for Storybook. View in your Storybook instance:

```
storybook → Stories → Three → WebGL Basis
```

## 🎮 Features

### Interaction Modes

- **Deform Face** - Modify cube vertices
- **Scale Face** - Resize cube faces
- **Extrude Z-axis** - Extrude along Z axis

### View Modes

- **Edges** - Wireframe view
- **Faces** - Solid face view

### Projections

- **Perspective** - Traditional 3D perspective
- **Orthogonal** - Parallel projection

### Camera Controls

- **Mouse Right-Click + Drag** - Rotate camera
- **Zoom Slider** - Adjust zoom level

## 🏗️ Architecture

### Custom Hooks

#### `useUI(width, height)`

Manages all UI state and camera control.

```tsx
const {
  state, // Current UI state
  setInteractionMode,
  setViewMode,
  setProjectionType,
  setZoom,
  rotateCamera,
  updateProjection,
  updateModelView,
} = useUI(canvasWidth, canvasHeight);
```

**UIState shape:**

```typescript
{
  projection: Mat4; // Projection matrix
  modelview: Mat4; // Model-view matrix
  eye: Vec3; // Camera position
  center: Vec3; // Look-at target
  angleX: number; // X rotation
  angleY: number; // Y rotation
  zoomZ: number; // Zoom amount
  interactionMode; // Current mode
  viewMode; // edges or faces
  projectionType; // perspective or orthogonal
  zoom: number; // Zoom factor [0-10]
}
```

### Utility Functions

**Shader Operations:**

```typescript
// Compile and link shaders
initShaderProgram(gl): ShaderInfo | null

// Load individual shader
loadShader(gl, type, source): WebGLShader | null
```

**Buffer Management:**

```typescript
// Create buffers for shape data
initLinesBuffers(gl, shapeData): BufferInfo

// Draw shapes with buffers
drawShape(gl, shaderInfo, buffers, shapeData, wireframe)
```

**Matrix/Vector Math:**

```typescript
// Get ray from canvas click
getEyeRay(invMVP, x, y, width, height);

// Canvas coordinate utilities
getCanvasMousePos(event, canvas);
getNormalizedMousePos(event, canvas);

// Shape generation
getCubeVertices(p1x, p1y, p1z, p2x, p2y, p3z);
generateFloorGrid(dim, lines);
```

## 🔧 Configuration

### Canvas Size

Adjust in `webgl-basis.tsx`:

```tsx
const { state, ... } = useUI(1050, 750);  // width, height
```

### WebGL Parameters

Modify in `hooks/useUI.ts`:

```typescript
const FOV = (55 * Math.PI) / 180; // Field of view
const Z_NEAR = 0.1; // Near clipping plane
const Z_FAR = 100.0; // Far clipping plane
```

## 📝 Types Reference

### Core Types

```typescript
// Interaction modes
type InteractionMode = 'selectClic' | '2ndClic' | '3rdClic';

// View modes
type ViewMode = 'edges' | 'faces';

// Projection types
type ProjectionType = 'perspective' | 'orthogonal';

// Matrix and vector types
type Mat4 = number[] | Float32Array;
type Vec3 = number[] | Float32Array;
```

### Interfaces

All interfaces are defined in [types.ts](./types.ts) for full IDE autocompletion.

## 🎨 Styling

### Current CSS

The component uses [webgl-sketchup.css](./webgl-sketchup.css) for styling.

### Future: Tailwind CSS Migration

CSS will be migrated to Tailwind classes in the next phase (see MODERNIZATION.md).

## 🔄 What Changed from 2018

### Major Improvements

| 2018                        | 2026                            |
| --------------------------- | ------------------------------- |
| Global variables everywhere | React state in hooks            |
| jQuery for DOM interactions | Native React event system       |
| No type safety              | Full TypeScript with interfaces |
| All code in one file        | Modular components              |
| Commented-out code          | Clean source files              |
| String magic for IDs        | React props system              |
| No error checking           | Proper error handling           |
| Manual matrix math          | Organized utility functions     |

See [MODERNIZATION.md](./MODERNIZATION.md) for detailed analysis of 2018 practices and improvements.

## 🚧 Next Steps

1. **Implement Interaction Logic**
   - Vertex picking
   - Face manipulation
   - Real-time geometry updates

2. **Migrate to Tailwind CSS**
   Replace CSS module with Tailwind classes

3. **Add Test Suite**
   - Jest unit tests
   - React Testing Library for components
   - E2E tests with Cypress

4. **Performance Optimization**
   - WebGL 2.0 features
   - Buffer pooling
   - Mesh optimization

5. **Enhanced Features**
   - Undo/redo system
   - Export/import models
   - Additional shape types
   - Texture support

## 📚 Learning Resources

- **WebGL 2.0 API**: https://www.khronos.org/registry/webgl/specs/latest/2.0/
- **TypeScript**: https://www.typescriptlang.org/
- **React Hooks**: https://react.dev/reference/react/hooks
- **Storybook**: https://storybook.js.org/

## 🐛 Debugging

### Enable WebGL Debug Output

```typescript
// In webgl-utils.ts
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
  console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
}
```

### Check TypeScript Types

All errors will be caught at compile time thanks to TypeScript's type checking.

### Canvas Size Issues

Ensure canvas dimensions match the container and WebGL viewport settings.

## 📄 License

Original course project. Modernized for 2026.

## ✨ Credits

- **Original 2018 Implementation**: Master's degree project
- **Modernization 2026**: Full TypeScript + React refactoring

---

**Status**: ✅ Production Ready for UI • ⚠️ Interaction Logic In Progress
