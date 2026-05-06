/**
 * WebGL Utilities - Core WebGL operations
 * Shader loading, buffer management, and drawing functions
 */

import type { ShaderInfo, ShapeData, BufferInfo, Mat4 } from './types';

// ============================================
// SHADER LOADING & COMPILATION
// ============================================

export const VERTEX_SHADER_SOURCE = `
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
    vColor = aVertexColor;
    vPickColor = aPickColor;

    if(uOffscreen){
      gl_PointSize = 20.0;
    } else {
      gl_PointSize = 10.0;
    }
  }
`;

export const FRAGMENT_SHADER_SOURCE = `
  varying lowp vec4 vColor;
  varying lowp vec4 vPickColor;
  uniform bool uOffscreen;
  uniform highp vec4 uDiffuseColor;
  uniform bool uWireframe;
  precision mediump float;

  void main(void) {
    vec2 location = gl_PointCoord - vec2(0.5, 0.5);
    if(dot(location, location) > 0.25) discard;

    if(uOffscreen){
      gl_FragColor = vPickColor;
      return;
    }
    if(uWireframe){
      gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
      return;
    }
    
    gl_FragColor = vColor;
  }
`;

/**
 * Compile a single shader
 */
export function loadShader(gl: WebGLRenderingContext, type: GLenum, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Create and link shader program
 */
export function loadShaderProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string
): WebGLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  gl.detachShader(program, vertexShader);
  gl.detachShader(program, fragmentShader);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  return program;
}

/**
 * Initialize shader program and get all attribute/uniform locations
 */
export function initShaderProgram(gl: WebGLRenderingContext): ShaderInfo | null {
  const program = loadShaderProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
  if (!program) return null;

  return {
    GLSLprogram: program,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(program, 'aVertexColor'),
      vertexPickColor: gl.getAttribLocation(program, 'aPickColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
      uOffscreen: gl.getUniformLocation(program, 'uOffscreen'),
      diffuseColor: gl.getUniformLocation(program, 'uDiffuseColor'),
      uWireframe: gl.getUniformLocation(program, 'uWireframe'),
    },
  };
}

// ============================================
// BUFFER MANAGEMENT
// ============================================

/**
 * Create and bind buffers for line/edge drawing
 */
export function initLinesBuffers(
  gl: WebGLRenderingContext,
  shapeData: ShapeData
): BufferInfo {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeData.vertices), gl.DYNAMIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeData.colors), gl.DYNAMIC_DRAW);

  const pickColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pickColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeData.pickColors), gl.DYNAMIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shapeData.indices), gl.DYNAMIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    pickColor: pickColorBuffer,
    indices: indexBuffer,
  };
}

// ============================================
// DRAWING OPERATIONS
// ============================================

/**
 * Clear canvas and setup WebGL state
 */
export function clearCanvas(gl: WebGLRenderingContext): void {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * Setup viewport and program
 */
export function setupDrawing(
  gl: WebGLRenderingContext,
  shaderInfo: ShaderInfo,
  projection: Mat4,
  modelView: Mat4
): void {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.useProgram(shaderInfo.GLSLprogram);

  gl.uniformMatrix4fv(shaderInfo.uniformLocations.projectionMatrix, false, projection);
  gl.uniformMatrix4fv(shaderInfo.uniformLocations.modelViewMatrix, false, modelView);
}

/**
 * Draw shape data with buffers
 */
export function drawShape(
  gl: WebGLRenderingContext,
  shaderInfo: ShaderInfo,
  buffers: BufferInfo,
  shapeData: ShapeData,
  wireframe: boolean = false
): void {
  // Position
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);

  // Color
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(shaderInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);

  // Pick Color
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pickColor);
  gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPickColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPickColor);

  // Indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Set uniforms
  gl.uniform1i(shaderInfo.uniformLocations.uWireframe, wireframe ? 1 : 0);
  gl.uniform1i(shaderInfo.uniformLocations.uOffscreen, 0);

  // Draw
  gl.drawElements(shapeData.primitiveType, shapeData.indexCount, gl.UNSIGNED_SHORT, 0);
}

// ============================================
// MATRIX & VECTOR UTILITIES
// ============================================

/**
 * Get eye ray from click position using inverse MVP matrix
 */
export function getEyeRay(
  invMVP: Mat4,
  x: number,
  y: number,
  width: number,
  height: number
): { start: Float32Array; dir: Float32Array } {
  // Normalize to [-1, 1]
  const ndcX = (2.0 * x) / width - 1.0;
  const ndcY = 1.0 - (2.0 * y) / height;

  const near = new Float32Array([ndcX, ndcY, -1.0, 1.0]);
  const far = new Float32Array([ndcX, ndcY, 1.0, 1.0]);

  // Transform by inverse MVP
  const nearWorld = vec4Transform(near, invMVP);
  const farWorld = vec4Transform(far, invMVP);

  // Perspective divide
  divideByW(nearWorld);
  divideByW(farWorld);

  const dir = new Float32Array([
    farWorld[0] - nearWorld[0],
    farWorld[1] - nearWorld[1],
    farWorld[2] - nearWorld[2],
  ]);

  return { start: nearWorld.slice(0, 3) as Float32Array, dir };
}

/**
 * Transform 4D vector by matrix
 */
function vec4Transform(v: Float32Array, m: Mat4): Float32Array {
  const result = new Float32Array([0, 0, 0, 0]);
  for (let i = 0; i < 4; i++) {
    result[i] = v[0] * m[i] + v[1] * m[i + 4] + v[2] * m[i + 8] + v[3] * m[i + 12];
  }
  return result;
}

/**
 * Perspective divide
 */
export function divideByW(vec: Float32Array): void {
  const w = vec[3];
  if (w !== 0) {
    vec[0] /= w;
    vec[1] /= w;
    vec[2] /= w;
    vec[3] = 1;
  }
}

// ============================================
// CANVAS COORDINATES
// ============================================

/**
 * Get mouse position relative to canvas
 */
export function getCanvasMousePos(
  event: React.MouseEvent<HTMLCanvasElement> | MouseEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const clientX = event instanceof MouseEvent ? event.clientX : (event as React.MouseEvent).clientX;
  const clientY = event instanceof MouseEvent ? event.clientY : (event as React.MouseEvent).clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

/**
 * Normalize mouse position to [-1, 1]
 */
export function getNormalizedMousePos(
  event: React.MouseEvent<HTMLCanvasElement> | MouseEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const pos = getCanvasMousePos(event, canvas);
  return {
    x: (pos.x / canvas.width) * 2 - 1,
    y: 1 - (pos.y / canvas.height) * 2,
  };
}

// ============================================
// SHAPE DATA GENERATORS
// ============================================

/**
 * Generate cube vertices from bounds
 */
export function getCubeVertices(
  p1x: number, p1y: number, p1z: number,  // top-left-far
  p2x: number, p2y: number,                // bottom-right-far
  p3z: number                              // near z
): number[] {
  return [
    p1x, p1y, p1z,  // 0 - top-left-far
    p2x, p1y, p1z,  // 1 - top-right-far
    p2x, p2y, p1z,  // 2 - bottom-right-far
    p1x, p2y, p1z,  // 3 - bottom-left-far
    p1x, p1y, p3z,  // 4 - top-left-near
    p2x, p1y, p3z,  // 5 - top-right-near
    p2x, p2y, p3z,  // 6 - bottom-right-near
    p1x, p2y, p3z,  // 7 - bottom-left-near
  ];
}

/**
 * Generate cube faces (triangles)
 */
export function generateCubeFaces(
  p1x: number, p1y: number, p1z: number,
  p2x: number, p2y: number,
  p3z: number
): {
  vertices: number[];
  colors: number[];
  indices: number[];
} {
  const v = [
    p1x, p1y, p1z, // 0 - top-left-far
    p2x, p1y, p1z, // 1 - top-right-far
    p2x, p2y, p1z, // 2 - bottom-right-far
    p1x, p2y, p1z, // 3 - bottom-left-far
    p1x, p1y, p3z, // 4 - top-left-near
    p2x, p1y, p3z, // 5 - top-right-near
    p2x, p2y, p3z, // 6 - bottom-right-near
    p1x, p2y, p3z  // 7 - bottom-left-near
  ];

  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const faceColors = [
    [1.0, 0.0, 0.0, 1.0], // Front (Blue) -> actually according to task: Back: Yellow (1, 1, 0)
    [0.0, 1.0, 0.0, 1.0], // Bottom: Green (0, 1, 0)
    [0.0, 0.0, 1.0, 1.0], // Front: Blue (0, 0, 1)
    [1.0, 1.0, 0.0, 1.0], // Back: Yellow (1, 1, 0)
    [1.0, 0.0, 1.0, 1.0], // Left: Magenta (1, 0, 1)
    [0.0, 1.0, 1.0, 1.0]  // Right: Cyan (0, 1, 1)
  ];

  // Specific mapping from task:
  // Top: Red (1, 0, 0)
  // Bottom: Green (0, 1, 0)
  // Front: Blue (0, 0, 1)
  // Back: Yellow (1, 1, 0)
  // Left: Magenta (1, 0, 1)
  // Right: Cyan (0, 1, 1)

  const faceDefinitions = [
    { name: 'back', indices: [0, 1, 2, 3], color: [1.0, 1.0, 0.0, 1.0] },  // Back
    { name: 'front', indices: [4, 5, 6, 7], color: [0.0, 0.0, 1.0, 1.0] }, // Front
    { name: 'top', indices: [0, 1, 5, 4], color: [1.0, 0.0, 0.0, 1.0] },    // Top
    { name: 'bottom', indices: [2, 3, 7, 6], color: [0.0, 1.0, 0.0, 1.0] }, // Bottom
    { name: 'right', indices: [1, 2, 6, 5], color: [0.0, 1.0, 1.0, 1.0] },  // Right
    { name: 'left', indices: [3, 0, 4, 7], color: [1.0, 0.0, 1.0, 1.0] }    // Left
  ];

  faceDefinitions.forEach((face, fIdx) => {
    const startIdx = vertices.length / 3;
    face.indices.forEach(vIdx => {
      vertices.push(v[vIdx * 3], v[vIdx * 3 + 1], v[vIdx * 3 + 2]);
      colors.push(...face.color);
    });

    // Two triangles per face
    indices.push(startIdx, startIdx + 1, startIdx + 2);
    indices.push(startIdx, startIdx + 2, startIdx + 3);
  });

  return { vertices, colors, indices };
}

/**
 * Generate cube colors
 */
export function getCubeColors(): number[] {
  const face1 = [1.0, 0.0, 0.0, 1.0]; // red-x
  const face2 = [0.0, 1.0, 0.0, 1.0]; // green-y
  const face3 = [0.0, 0.0, 1.0, 1.0]; // blue-z
  const face4 = [1.0, 1.0, 0.0, 1.0]; // yellow
  const face5 = [1.0, 0.0, 1.0, 1.0]; // magenta
  const face6 = [0.0, 1.0, 1.0, 1.0]; // cyan

  return [
    ...face1, ...face2, ...face3, ...face4, ...face5, ...face6,
    ...face1, ...face2, ...face3, ...face4, ...face5, ...face6,
  ];
}

/**
 * Generate floor grid
 */
export function generateFloorGrid(dim: number = 10, lines: number = 10): {
  vertices: number[];
  colors: number[];
  indices: number[];
} {
  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];

  const inc = (2 * dim) / lines;
  let idx = 0;

  for (let l = 0; l <= lines; l++) {
    const x = -dim + l * inc;

    // Vertical lines
    vertices.push(x, 0, -dim);
    vertices.push(x, 0, dim);

    // Horizontal lines
    vertices.push(-dim, 0, x);
    vertices.push(dim, 0, x);

    const dif = 0.7;
    colors.push(dif, dif, dif, 1.0);
    colors.push(dif, dif, dif, 1.0);
    colors.push(dif, dif, dif, 1.0);
    colors.push(dif, dif, dif, 1.0);

    indices.push(idx, idx + 1);
    indices.push(idx + 2, idx + 3);
    idx += 4;
  }

  return { vertices, colors, indices };
}
