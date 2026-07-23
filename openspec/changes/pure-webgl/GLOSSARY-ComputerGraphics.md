# Computer Graphics — Glossary

A reference for all terms used during the development of the WebGL Cube Editor.
Two chapters: general computer graphics, then WebGL-specific terms with their defaults.

---

## Chapter 1 — Core Computer Graphics Concepts

### Coordinate Systems & Space

**World Space**
The global 3D coordinate system where all objects live at their absolute positions.
Every vertex of the cube is defined here (e.g. `[1.0, 3.0, -10.0]`).

**View Space (Camera Space / Eye Space)**
The coordinate system relative to the camera. After the Model-View matrix is applied,
the camera sits at the origin looking down the −Z axis. All world positions are
transformed into this frame before projection.

**Clip Space**
The intermediate space produced by the Projection matrix. Coordinates are expressed as
`(x, y, z, w)` homogeneous vectors. The GPU discards (clips) anything whose `x, y, z`
fall outside `[−w, +w]`.

**NDC — Normalised Device Coordinates**
After the perspective divide (`x/w, y/w, z/w`), coordinates are in NDC: a unit cube
`[−1, 1]` in X and Y, `[−1, 1]` in Z (OpenGL/WebGL convention). The viewport
transform maps NDC to pixel coordinates on screen.

**Screen Space**
Pixel coordinates on the actual canvas (origin top-left in HTML). Used for mouse
picking and UI hit-testing.

**Object Space (Model Space)**
The local coordinate frame of an individual object before any transforms are applied.
A cube defined centred at the origin is in object space.

---

### Geometry

**Vertex**
A point in 3D space. Each vertex has a position `(x, y, z)` and can carry extra
attributes: color, normal, UV. The cube has 8 vertices.

**Edge**
A line segment connecting two vertices. The cube has 12 edges, drawn with `GL_LINES`.

**Face / Polygon**
A flat surface bounded by vertices and edges. The cube has 6 quad faces, each
tessellated into 2 triangles for GPU rendering.

**Tessellation**
The process of subdividing a surface into triangles (or other primitives) that the GPU
can render. One quad → two triangles is the simplest tessellation.

**Mesh**
A collection of vertices, edges, and faces that together describe a 3D shape.

**Normal**
A unit vector perpendicular to a surface, used for lighting calculations. Points
outward from the visible side of a face.

**Winding Order**
The sequence in which a triangle's vertices are listed. Determines which side is
"front". Counter-clockwise (CCW) means the front face in OpenGL/WebGL by default.
Clockwise (CW) means the back face. The cube editor uses CW outward winding because
of how the modelview matrix is constructed.

**Front Face / Back Face**
Which side of a triangle faces the camera. Back-face culling discards triangles whose
back face would be seen, saving GPU work.

**Back-Face Culling**
GPU optimisation that skips triangles whose winding order indicates they face away from
the camera. Enabled with `gl.enable(gl.CULL_FACE)`.

**Index Buffer (Element Array)**
A list of integers that define which vertices form each triangle. Instead of
duplicating vertex data, indices point into the vertex array. Reduces memory and
bandwidth.

---

### Transformations

**Transformation Matrix**
A 4×4 matrix encoding rotation, scale, and translation. Matrices are multiplied to
chain transforms. The pipeline is:  
`Clip = Projection × View × Model × Vertex`

**Model Matrix**
Transforms object-space vertices into world space (rotate, scale, translate the object).

**View Matrix (ModelView Matrix)**
Transforms world-space coordinates into camera space. Constructed from a **lookAt**
function that takes `eye`, `center`, and `up` vectors.

**lookAt**
A function that builds a view matrix orienting the camera at `eye` to look at
`center`, with `up` defining which direction is "up". Produces three orthonormal axes
(right `s`, up `u`, forward `f`) packed into a 4×4 matrix.

**Projection Matrix**
Transforms camera-space coordinates into clip space. Two types:

- **Perspective projection** — objects farther away appear smaller. Defined by FOV,
  aspect ratio, near, and far planes. Produces the characteristic depth illusion.
- **Orthographic projection** — no perspective foreshortening; parallel lines stay
  parallel. Used in CAD and technical drawing.

**MVP Matrix**
The combined `Projection × ModelView` matrix. Used in this editor to transform world
vertices into clip space in one step, and its inverse for unprojecting mouse rays.

**Inverse Matrix**
The matrix `M⁻¹` such that `M × M⁻¹ = I` (identity). Used to unproject screen
coordinates back into world space for picking and dragging.

**Column-Major Order**
WebGL stores matrices in column-major order: the first 4 floats are column 0, the
next 4 are column 1, etc. Important when reading or writing matrix elements manually.

---

### Camera

**Eye (Camera Position)**
The world-space position of the camera. In this editor: initially `[0.5, 0.3, -9.0]`.

**Center (Look-at Target)**
The world-space point the camera is looking at. In this editor: `[2.0, 1.25, -7.5]`
(centroid of the cube).

**Up Vector**
A hint vector defining which direction is "up" for the camera. Typically `[0, 1, 0]`
(positive Y is up). Used by lookAt to compute the camera's right axis.

**FOV — Field of View**
The vertical angle subtended by the camera's view frustum. Measured in degrees or
radians. This editor uses 55°.

**Near Plane / Far Plane**
The minimum and maximum distances from the camera that are rendered. Geometry outside
this range is clipped. Near = 0.1, Far = 100.0 in this editor.

**Aspect Ratio**
`canvas width / canvas height`. Used in the projection matrix to avoid stretching.

**Spherical Orbit (Arcball)**
Moving the camera along a sphere centred on a fixed target. Described by two angles
(polar `θ` = angleX, azimuth `φ` = angleY) and a radius. Right-drag in this editor
orbits the camera this way.

**Zoom**
In this editor, zoom is implemented by scaling the FOV frustum (smaller frustum =
larger objects), not by translating the camera.

---

### Rendering Pipeline

**Vertex Shader**
A GPU program that runs once per vertex. Receives attributes (position, color),
applies the MVP transform, and outputs clip-space coordinates and varyings to the
fragment stage.

**Fragment Shader**
A GPU program that runs once per rasterised fragment (roughly, per pixel). Determines
the final color of that pixel. Reads varyings interpolated from the surrounding
vertices.

**Rasterisation**
Converting geometric primitives (triangles, lines, points) into a grid of fragments
(potential pixels) that are passed to the fragment shader.

**Attribute**
Per-vertex data fed into a vertex shader from a buffer: position, color, normal, etc.
Declared with the `attribute` keyword in GLSL (WebGL 1).

**Varying**
A value output by the vertex shader and automatically interpolated across a primitive's
surface, then received by the fragment shader. Used here for `vColor` and `vPickColor`.

**Uniform**
A value set once by the CPU that remains constant across all vertices/fragments of a
single draw call. Used for matrices (`uProjectionMatrix`), flags (`uWireframe`), etc.

**Depth Buffer (Z-Buffer)**
A per-pixel buffer storing the depth of the closest fragment rendered so far. New
fragments are drawn only if their depth is less than (or equal to) the stored value,
implementing hidden-surface removal.

**Depth Test**
The comparison that decides whether a fragment passes the depth buffer check.
`LEQUAL` means "draw if depth ≤ stored value".

**Frame Buffer**
The memory holding the final color (and depth) values for each pixel that will be
displayed on screen.

**Primitive**
The basic drawable unit: `POINTS`, `LINES`, `LINE_STRIP`, `LINE_LOOP`, `TRIANGLES`,
`TRIANGLE_STRIP`, `TRIANGLE_FAN`.

---

### Picking & Interaction

**Ray Casting**
Shooting a ray from the camera through a screen pixel into the scene to detect which
object or vertex the mouse cursor is over.

**Screen-Space Picking**
The approach used in this editor: project each world vertex onto screen pixels and
find the one closest to the mouse cursor (within a radius threshold). Simpler than
full ray-triangle intersection.

**Unprojection**
The inverse of projection: transforming a screen-space point back into world space.
Used to map the mouse position to a world XY coordinate during vertex dragging.
Requires the inverse MVP matrix.

**Pick Radius**
The maximum screen-space distance (in pixels) between the mouse and a vertex for the
vertex to be considered "picked". This editor uses 20 px.

**Drag Plane**
During vertex dragging, the vertex is constrained to the plane `z = constant` (its
original Z value). The mouse ray is intersected with this plane to get the new XY
position.

---

### Color

**RGBA**
Red, Green, Blue, Alpha. Each component is normalised to `[0.0, 1.0]` in WebGL
(not 0–255). Alpha = 1.0 is fully opaque.

**Vertex Color**
A color attribute stored per-vertex and interpolated across the triangle surface by
the GPU rasteriser. The interpolation is called **Gouraud shading**.

**Wireframe**
Rendering only the edges of a mesh (as lines), making the internal structure visible.
The solid shape is not filled.

---

### Visual Aids

**Gizmo**
A visual overlay that shows the orientation of the world axes (X, Y, Z) in relation
to the current camera view. Typically drawn in a corner of the viewport. Updates as
the camera rotates to always reflect current orientation.

**Floor Grid**
A flat grid drawn on the ground plane (Y=0) to give the scene a sense of scale and
ground reference.

**Point Sprite**
A GL_POINTS primitive rendered as a screen-aligned square (or circle via fragment
shader discard). Used in this editor to draw the 8 cube vertices as interactive dots.

---

---

## Chapter 2 — WebGL-Specific Terms & Default Values

WebGL is a JavaScript API that exposes OpenGL ES 2.0 to the browser via the `<canvas>`
element. The following terms, constants, and defaults are specific to the WebGL API.

---

### Context & Initialisation

**WebGLRenderingContext**
The main interface to WebGL, obtained with:

```js
canvas.getContext('webgl');
// fallback:
canvas.getContext('experimental-webgl');
```

All GL calls are methods on this object (`gl.drawElements`, `gl.uniform1i`, …).

**Canvas Resolution vs CSS Size**
`canvas.width` / `canvas.height` = the internal pixel resolution of the framebuffer.
CSS `width` / `height` = the display size. If they differ, the image is scaled.
A `ResizeObserver` is used in this editor to keep them in sync, and
`gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)` tells the GPU the resolution.

**Device Pixel Ratio (`window.devicePixelRatio`)**
The ratio of physical screen pixels to CSS pixels (e.g. 2.0 on Retina displays).
Multiplying the canvas resolution by DPR gives a crisp high-DPI render.  
Default: `1.0` on standard displays, `2.0` on HiDPI/Retina.

---

### Shaders & Programs

**GLSL (OpenGL Shading Language)**
The C-like language for writing vertex and fragment shaders. WebGL 1 uses GLSL ES 1.0.

**`gl.createShader(type)`**
Creates a shader object. `type` is `gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`.

**`gl.shaderSource(shader, source)`**
Uploads GLSL source code to a shader object.

**`gl.compileShader(shader)`**
Compiles the GLSL source. Check success with `gl.getShaderParameter(shader, gl.COMPILE_STATUS)`.

**`gl.createProgram()`**
Creates a program object that links a vertex and fragment shader together.

**`gl.linkProgram(program)`**
Links the attached shaders. Must succeed before `gl.useProgram`.
Check with `gl.getProgramParameter(program, gl.LINK_STATUS)`.

**`gl.useProgram(program)`**
Installs the given program as the active shader program for subsequent draw calls.

**`gl.getAttribLocation(program, name)`**
Returns the index of a named `attribute` variable in the shader.
Returns `-1` if not found.

**`gl.getUniformLocation(program, name)`**
Returns a `WebGLUniformLocation` object for a named `uniform` variable.
Returns `null` if not found.

---

### Buffers

**`gl.createBuffer()`**
Allocates a new GPU buffer object. Returns `WebGLBuffer | null`.

**`gl.bindBuffer(target, buffer)`**
Sets the active buffer for a target. Must be called before any buffer data operations.

| Target                    | Purpose                                            |
| ------------------------- | -------------------------------------------------- |
| `gl.ARRAY_BUFFER`         | Vertex attribute data (positions, colors, normals) |
| `gl.ELEMENT_ARRAY_BUFFER` | Index data (triangle indices)                      |

**`gl.bufferData(target, data, usage)`**
Uploads typed array data to the currently bound buffer.

| `usage` hint      | Meaning                                   |
| ----------------- | ----------------------------------------- |
| `gl.STATIC_DRAW`  | Data set once, drawn many times           |
| `gl.DYNAMIC_DRAW` | Data updated frequently, drawn many times |
| `gl.STREAM_DRAW`  | Data set once, drawn a few times          |

This editor uses `gl.DYNAMIC_DRAW` for all geometry buffers since vertices are updated every frame during dragging.

**`gl.bufferSubData(target, offset, data)`**
Updates a region of an existing buffer without reallocating it. Used for per-frame vertex/color updates. Much cheaper than `bufferData`.

- `offset` is in **bytes** from the start of the buffer. Usually `0`.

**`gl.vertexAttribPointer(index, size, type, normalised, stride, offset)`**
Describes how to read attribute data from the currently bound `ARRAY_BUFFER`.

| Parameter    | Typical value in this editor                 |
| ------------ | -------------------------------------------- |
| `index`      | from `gl.getAttribLocation`                  |
| `size`       | `3` for position (xyz), `4` for color (rgba) |
| `type`       | `gl.FLOAT`                                   |
| `normalised` | `false`                                      |
| `stride`     | `0` (tightly packed)                         |
| `offset`     | `0`                                          |

**`gl.enableVertexAttribArray(index)`**
Activates an attribute location so it reads from the buffer. Must be called for each attribute used in the shader.

---

### Uniforms

**`gl.uniformMatrix4fv(location, transpose, value)`**
Uploads a 4×4 matrix as a `Float32Array`. `transpose` is **always `false`** in WebGL
(WebGL expects column-major; `true` would transpose on upload, which is almost never wanted).

**`gl.uniform1i(location, value)`**
Uploads a single integer (or boolean) uniform. Used for `uOffscreen` and `uWireframe` flags.

**`gl.uniform4fv(location, value)`**
Uploads a `vec4` (4 floats). Used for `uDiffuseColor`.

---

### Drawing

**`gl.drawElements(mode, count, type, offset)`**
Draws primitives using indices from the bound `ELEMENT_ARRAY_BUFFER`.

| Parameter | Typical value                                   |
| --------- | ----------------------------------------------- |
| `mode`    | `gl.TRIANGLES`, `gl.LINES`, `gl.POINTS`         |
| `count`   | number of indices                               |
| `type`    | `gl.UNSIGNED_SHORT` (max 65535 unique vertices) |
| `offset`  | `0`                                             |

**`gl.drawArrays(mode, first, count)`**
Draws primitives directly from vertex arrays, without an index buffer.

**`gl.TRIANGLES`**
Each group of 3 indices forms an independent triangle. Most common mode.  
Default: not active — must be specified per draw call.

**`gl.LINES`**
Each pair of indices forms an independent line segment.

**`gl.POINTS`**
Each index is an independent point sprite. Size controlled by `gl_PointSize` in the vertex shader.

---

### Depth & Culling

**`gl.enable(capability)` / `gl.disable(capability)`**
Enables or disables a GL capability.

| Capability        | Purpose                                 | Default      |
| ----------------- | --------------------------------------- | ------------ |
| `gl.DEPTH_TEST`   | Hidden-surface removal via depth buffer | **Disabled** |
| `gl.CULL_FACE`    | Skip back-facing triangles              | **Disabled** |
| `gl.BLEND`        | Alpha blending                          | **Disabled** |
| `gl.SCISSOR_TEST` | Restrict rendering to a rectangle       | **Disabled** |

**`gl.depthFunc(func)`**
Sets the depth comparison function.  
Default: **`gl.LESS`**. This editor uses `gl.LEQUAL` to allow overdrawing at equal depth.

**`gl.clearDepth(depth)`**
Sets the value the depth buffer is cleared to.  
Default: **`1.0`** (the far plane).

**`gl.cullFace(mode)`**
Specifies which triangles are culled when `CULL_FACE` is enabled.  
Default: **`gl.BACK`**.

| `mode`              | Culled                          |
| ------------------- | ------------------------------- |
| `gl.BACK`           | Back-facing triangles (default) |
| `gl.FRONT`          | Front-facing triangles          |
| `gl.FRONT_AND_BACK` | All triangles (nothing drawn)   |

**`gl.frontFace(mode)`**
Defines which winding order is "front".  
Default: **`gl.CCW`** (counter-clockwise).

| `mode`   | Front face                                                            |
| -------- | --------------------------------------------------------------------- |
| `gl.CCW` | Counter-clockwise (default, OpenGL convention)                        |
| `gl.CW`  | Clockwise — used in this editor because of the modelview construction |

---

### Clearing

**`gl.clearColor(r, g, b, a)`**
Sets the color the color buffer is cleared to.  
Default: **`(0.0, 0.0, 0.0, 0.0)`** (transparent black).  
This editor uses `(1.0, 1.0, 1.0, 1.0)` (white).

**`gl.clear(mask)`**
Clears the specified buffers.

| Mask flag               | Clears         |
| ----------------------- | -------------- |
| `gl.COLOR_BUFFER_BIT`   | Color buffer   |
| `gl.DEPTH_BUFFER_BIT`   | Depth buffer   |
| `gl.STENCIL_BUFFER_BIT` | Stencil buffer |

Both are combined with `|`: `gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT`.

---

### Viewport

**`gl.viewport(x, y, width, height)`**
Maps NDC coordinates to canvas pixel coordinates.  
Default: set to the canvas dimensions at context creation time.  
Must be called again after a canvas resize, otherwise rendering maps to the wrong region.

---

### Data Types

**`Float32Array`**
The typed array used for all vertex data and matrices in WebGL. Each element is a 32-bit IEEE 754 float.

**`Uint16Array`**
The typed array used for index buffers with `gl.UNSIGNED_SHORT`. Supports up to **65 535** unique vertex indices. Use `Uint32Array` + `gl.UNSIGNED_INT` for larger meshes (requires the `OES_element_index_uint` extension in WebGL 1).

---

### Precision Qualifiers (GLSL ES)

Used in GLSL to control floating-point precision on the GPU.

| Qualifier | Bits    | Where common                         |
| --------- | ------- | ------------------------------------ |
| `lowp`    | ~8-bit  | Colors, UVs                          |
| `mediump` | ~16-bit | Positions in fragment shader         |
| `highp`   | 32-bit  | Positions in vertex shader, matrices |

Fragment shaders have no default precision for `float` in WebGL — it must be declared:

```glsl
precision mediump float;
```

---

### Coordinate Conventions

| Convention         | WebGL default                    |
| ------------------ | -------------------------------- |
| Clip-space X       | `−1` (left) → `+1` (right)       |
| Clip-space Y       | `−1` (bottom) → `+1` (top)       |
| Clip-space Z       | `−1` (near) → `+1` (far)         |
| Handedness         | Right-handed (before projection) |
| Winding front-face | Counter-clockwise (`gl.CCW`)     |
| Viewport origin    | Bottom-left of canvas            |
| Texture origin     | Bottom-left                      |

Note: HTML canvas and mouse events use a **top-left** origin with Y increasing
downward — the opposite of GL. The conversion is `gl_y = canvas.height - mouse_y`.

---

### `gl_PointCoord`

A built-in fragment shader variable available only when rendering `GL_POINTS`.
Contains the 2D position within the point sprite, ranging `(0,0)` to `(1,1)`.
Used in this editor to discard fragments outside a circle:

```glsl
vec2 c = gl_PointCoord - vec2(0.5);
if (dot(c, c) > 0.25) discard;
```

---

### `gl_PointSize`

A vertex shader output that sets the size of a point sprite in pixels.  
Default (implicit): **`1.0`**.  
Maximum value is implementation-defined (`gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)`).  
This editor sets it to **`14.0`** for interactive vertex dots.
