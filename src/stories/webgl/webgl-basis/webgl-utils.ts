/**
 * WebGL Utilities — shaders, buffers, drawing, math, picking
 */

import type React from 'react';
import type { ShaderInfo, ShapeData, BufferInfo, Mat4 } from './types';
import { VERTEX_COLORS, FACE_COLORS, TRIANGLE_COLORS, FLOOR, PICK } from './config';

// ── Shaders ───────────────────────────────────────────────────────────────────

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
    vColor      = aVertexColor;
    vPickColor  = aPickColor;
    gl_PointSize = uOffscreen ? 20.0 : ${PICK.POINT_SIZE}.0;
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
    vec2 coord = gl_PointCoord - vec2(0.5);
    float d = dot(coord, coord);

    if (uOffscreen) {
      if (d > 0.25) discard;
      gl_FragColor = vPickColor;
      return;
    }
    if (uWireframe) {
      gl_FragColor = vec4(0.35, 0.35, 0.35, 1.0);
      return;
    }
    if (d > 0.25) discard;
    // Subtle border ring on points
    gl_FragColor = d > 0.14 ? vec4(vColor.rgb * 0.55, 1.0) : vColor;
  }
`;

// ── Shader program ────────────────────────────────────────────────────────────

export function loadShader(
  gl: WebGLRenderingContext,
  type: GLenum,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function initShaderProgram(gl: WebGLRenderingContext): ShaderInfo | null {
  const vs = loadShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fs = loadShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  gl.detachShader(program, vs);
  gl.detachShader(program, fs);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

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

// ── Buffers ───────────────────────────────────────────────────────────────────

export function initLinesBuffers(gl: WebGLRenderingContext, data: ShapeData): BufferInfo {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.DYNAMIC_DRAW);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.colors), gl.DYNAMIC_DRAW);

  const pickColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, pickColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.pickColors), gl.DYNAMIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.DYNAMIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
    pickColor: pickColorBuffer,
    indices: indexBuffer,
  };
}

export function updateBuffer(
  gl: WebGLRenderingContext,
  buffer: WebGLBuffer | null,
  data: Float32Array
): void {
  if (!buffer) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
}

// ── Drawing ───────────────────────────────────────────────────────────────────

export function clearCanvas(gl: WebGLRenderingContext): void {
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

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

export function drawShape(
  gl: WebGLRenderingContext,
  shaderInfo: ShaderInfo,
  buffers: BufferInfo,
  data: ShapeData,
  wireframe = false
): void {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPosition, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(shaderInfo.attribLocations.vertexColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexColor);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.pickColor);
  gl.vertexAttribPointer(shaderInfo.attribLocations.vertexPickColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderInfo.attribLocations.vertexPickColor);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.uniform1i(shaderInfo.uniformLocations.uWireframe, wireframe ? 1 : 0);
  gl.uniform1i(shaderInfo.uniformLocations.uOffscreen, 0);
  gl.drawElements(data.primitiveType, data.indexCount, gl.UNSIGNED_SHORT, 0);
}

// ── Matrix math ───────────────────────────────────────────────────────────────

export function mat4Multiply(a: number[], b: number[]): number[] {
  const o = new Array<number>(16).fill(0);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      for (let k = 0; k < 4; k++) o[i + j * 4] += a[i + k * 4] * b[k + j * 4];
  return o;
}

export function mat4Invert(m: number[]): number[] | null {
  const inv = new Array<number>(16);
  inv[0] =
    m[5] * m[10] * m[15] -
    m[5] * m[11] * m[14] -
    m[9] * m[6] * m[15] +
    m[9] * m[7] * m[14] +
    m[13] * m[6] * m[11] -
    m[13] * m[7] * m[10];
  inv[4] =
    -m[4] * m[10] * m[15] +
    m[4] * m[11] * m[14] +
    m[8] * m[6] * m[15] -
    m[8] * m[7] * m[14] -
    m[12] * m[6] * m[11] +
    m[12] * m[7] * m[10];
  inv[8] =
    m[4] * m[9] * m[15] -
    m[4] * m[11] * m[13] -
    m[8] * m[5] * m[15] +
    m[8] * m[7] * m[13] +
    m[12] * m[5] * m[11] -
    m[12] * m[7] * m[9];
  inv[12] =
    -m[4] * m[9] * m[14] +
    m[4] * m[10] * m[13] +
    m[8] * m[5] * m[14] -
    m[8] * m[6] * m[13] -
    m[12] * m[5] * m[10] +
    m[12] * m[6] * m[9];
  inv[1] =
    -m[1] * m[10] * m[15] +
    m[1] * m[11] * m[14] +
    m[9] * m[2] * m[15] -
    m[9] * m[3] * m[14] -
    m[13] * m[2] * m[11] +
    m[13] * m[3] * m[10];
  inv[5] =
    m[0] * m[10] * m[15] -
    m[0] * m[11] * m[14] -
    m[8] * m[2] * m[15] +
    m[8] * m[3] * m[14] +
    m[12] * m[2] * m[11] -
    m[12] * m[3] * m[10];
  inv[9] =
    -m[0] * m[9] * m[15] +
    m[0] * m[11] * m[13] +
    m[8] * m[1] * m[15] -
    m[8] * m[3] * m[13] -
    m[12] * m[1] * m[11] +
    m[12] * m[3] * m[9];
  inv[13] =
    m[0] * m[9] * m[14] -
    m[0] * m[10] * m[13] -
    m[8] * m[1] * m[14] +
    m[8] * m[2] * m[13] +
    m[12] * m[1] * m[10] -
    m[12] * m[2] * m[9];
  inv[2] =
    m[1] * m[6] * m[15] -
    m[1] * m[7] * m[14] -
    m[5] * m[2] * m[15] +
    m[5] * m[3] * m[14] +
    m[13] * m[2] * m[7] -
    m[13] * m[3] * m[6];
  inv[6] =
    -m[0] * m[6] * m[15] +
    m[0] * m[7] * m[14] +
    m[4] * m[2] * m[15] -
    m[4] * m[3] * m[14] -
    m[12] * m[2] * m[7] +
    m[12] * m[3] * m[6];
  inv[10] =
    m[0] * m[5] * m[15] -
    m[0] * m[7] * m[13] -
    m[4] * m[1] * m[15] +
    m[4] * m[3] * m[13] +
    m[12] * m[1] * m[7] -
    m[12] * m[3] * m[5];
  inv[14] =
    -m[0] * m[5] * m[14] +
    m[0] * m[6] * m[13] +
    m[4] * m[1] * m[14] -
    m[4] * m[2] * m[13] -
    m[12] * m[1] * m[6] +
    m[12] * m[2] * m[5];
  inv[3] =
    -m[1] * m[6] * m[11] +
    m[1] * m[7] * m[10] +
    m[5] * m[2] * m[11] -
    m[5] * m[3] * m[10] -
    m[9] * m[2] * m[7] +
    m[9] * m[3] * m[6];
  inv[7] =
    m[0] * m[6] * m[11] -
    m[0] * m[7] * m[10] -
    m[4] * m[2] * m[11] +
    m[4] * m[3] * m[10] +
    m[8] * m[2] * m[7] -
    m[8] * m[3] * m[6];
  inv[11] =
    -m[0] * m[5] * m[11] +
    m[0] * m[7] * m[9] +
    m[4] * m[1] * m[11] -
    m[4] * m[3] * m[9] -
    m[8] * m[1] * m[7] +
    m[8] * m[3] * m[5];
  inv[15] =
    m[0] * m[5] * m[10] -
    m[0] * m[6] * m[9] -
    m[4] * m[1] * m[10] +
    m[4] * m[2] * m[9] +
    m[8] * m[1] * m[6] -
    m[8] * m[2] * m[5];

  let det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];
  if (det === 0) return null;
  det = 1.0 / det;
  return inv.map((v) => v * det);
}

function vec4Transform(v: number[], m: number[]): Float32Array {
  const r = new Float32Array(4);
  for (let i = 0; i < 4; i++)
    r[i] = v[0] * m[i] + v[1] * m[i + 4] + v[2] * m[i + 8] + v[3] * m[i + 12];
  return r;
}

function divideByW(v: Float32Array): void {
  if (v[3] !== 0 && v[3] !== 1) {
    v[0] /= v[3];
    v[1] /= v[3];
    v[2] /= v[3];
    v[3] = 1;
  }
}

// ── Picking ───────────────────────────────────────────────────────────────────

export interface PickResult {
  vertexIndex: number;
  distance: number;
}

/** Projects each world vertex to screen and returns the closest one within pickRadiusPx. */
export function pickVertex(
  mouseX: number,
  mouseY: number,
  canvasW: number,
  canvasH: number,
  vertices: number[],
  mvp: number[],
  pickRadiusPx = PICK.RADIUS_PX
): PickResult | null {
  let best: PickResult | null = null;
  for (let i = 0; i < vertices.length; i += 3) {
    const clip = vec4Transform([vertices[i], vertices[i + 1], vertices[i + 2], 1], mvp);
    if (Math.abs(clip[3]) < 1e-6) continue;
    const sx = (clip[0] / clip[3] + 1) * 0.5 * canvasW;
    const sy = (-clip[1] / clip[3] + 1) * 0.5 * canvasH;
    const dist = Math.hypot(mouseX - sx, mouseY - sy);
    if (dist <= pickRadiusPx && (!best || dist < best.distance))
      best = { vertexIndex: i / 3, distance: dist };
  }
  return best;
}

/** Unprojects mouse to the world XY plane at a given worldZ (for vertex dragging). */
export function screenToWorldAtZ(
  mouseX: number,
  mouseY: number,
  canvasW: number,
  canvasH: number,
  invMVP: number[],
  targetZ: number
): { x: number; y: number } | null {
  const ndcX = (2 * mouseX) / canvasW - 1;
  const ndcY = -(2 * mouseY) / canvasH + 1;
  const near = vec4Transform([ndcX, ndcY, -1, 1], invMVP);
  const far = vec4Transform([ndcX, ndcY, 1, 1], invMVP);
  divideByW(near);
  divideByW(far);
  const dz = far[2] - near[2];
  if (Math.abs(dz) < 1e-6) return null;
  const t = (targetZ - near[2]) / dz;
  return { x: near[0] + (far[0] - near[0]) * t, y: near[1] + (far[1] - near[1]) * t };
}

// ── Canvas helpers ────────────────────────────────────────────────────────────

export function getCanvasMousePos(
  event: React.MouseEvent<HTMLCanvasElement> | MouseEvent,
  canvas: HTMLCanvasElement
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const cx = 'clientX' in event ? event.clientX : 0;
  const cy = 'clientY' in event ? event.clientY : 0;
  return {
    x: (cx - rect.left) * (canvas.width / rect.width),
    y: (cy - rect.top) * (canvas.height / rect.height),
  };
}

// ── Geometry generators ───────────────────────────────────────────────────────

/** 8 corner vertices of a box defined by two opposite corners. */
export function getCubeVertices(
  p1x: number,
  p1y: number,
  p1z: number,
  p2x: number,
  p2y: number,
  p3z: number
): number[] {
  return [
    p1x,
    p1y,
    p1z, // 0 top-left-far
    p2x,
    p1y,
    p1z, // 1 top-right-far
    p2x,
    p2y,
    p1z, // 2 bottom-right-far
    p1x,
    p2y,
    p1z, // 3 bottom-left-far
    p1x,
    p1y,
    p3z, // 4 top-left-near
    p2x,
    p1y,
    p3z, // 5 top-right-near
    p2x,
    p2y,
    p3z, // 6 bottom-right-near
    p1x,
    p2y,
    p3z, // 7 bottom-left-near
  ];
}

/**
 * Per-vertex colors for the 8 point sprites, updated each frame to reflect
 * hover / selection / drag state.
 */
export function getCubePointColors(
  hoveredIndex: number | null,
  selectedIndex: number | null,
  isDragging: boolean,
  count = 8
): number[] {
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const c =
      isDragging && i === selectedIndex
        ? VERTEX_COLORS.DRAGGING
        : i === selectedIndex
          ? VERTEX_COLORS.SELECTED
          : i === hoveredIndex
            ? VERTEX_COLORS.HOVER
            : VERTEX_COLORS.NORMAL;
    out.push(...c);
  }
  return out;
}

export function getCubeColors(): number[] {
  return [
    1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 0, 1,
    0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
  ];
}

// Quad vertex indices per face.
// Winding is CW in world-space for all outward-facing faces because the modelview
// lookAt produces a coordinate system where CW in clip-space = front-face.
// We therefore call gl.frontFace(gl.CW) before drawing faces/triangles.
// Vertices: 0=TLF 1=TRF 2=BRF 3=BLF  4=TLN 5=TRN 6=BRN 7=BLN
//           TL=top-left TR=top-right BR=bottom-right BL=bottom-left
//           F=far(z=-10) N=near(z=-5)
const FACE_DEFS = [
  { vi: [0, 1, 2, 3], color: FACE_COLORS.BACK }, // Back   (z far)
  { vi: [5, 4, 7, 6], color: FACE_COLORS.FRONT }, // Front  (z near)
  { vi: [0, 4, 5, 1], color: FACE_COLORS.TOP }, // Top    (y max)
  { vi: [3, 2, 6, 7], color: FACE_COLORS.BOTTOM }, // Bottom (y min)
  { vi: [1, 5, 6, 2], color: FACE_COLORS.RIGHT }, // Right  (x max)
  { vi: [4, 0, 3, 7], color: FACE_COLORS.LEFT }, // Left   (x min)
] as const;

/**
 * Generates solid-face geometry from 8 live vertex positions.
 * Call each frame when vertices move so faces stay in sync.
 */
export function generateCubeFaces(vertices: number[]): {
  vertices: number[];
  colors: number[];
  indices: number[];
} {
  const outVerts: number[] = [];
  const outColors: number[] = [];
  const outIdx: number[] = [];

  FACE_DEFS.forEach((face) => {
    const base = outVerts.length / 3;
    face.vi.forEach((vi) => {
      outVerts.push(vertices[vi * 3], vertices[vi * 3 + 1], vertices[vi * 3 + 2]);
      outColors.push(...face.color);
    });
    outIdx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  });

  return { vertices: outVerts, colors: outColors, indices: outIdx };
}

/**
 * Generates 12 individually-colored triangles (2 per face) from 8 live vertices.
 * Each triangle has a unique color from TRIANGLE_COLORS so tessellation is visible.
 */
export function generateCubeTriangles(vertices: number[]): {
  vertices: number[];
  colors: number[];
  indices: number[];
} {
  const outVerts: number[] = [];
  const outColors: number[] = [];
  const outIdx: number[] = [];
  let triIdx = 0;

  FACE_DEFS.forEach((face) => {
    const [a, b, c, d] = face.vi;
    // Triangle 1: a, b, c
    const base1 = outVerts.length / 3;
    const col1 = TRIANGLE_COLORS[triIdx % TRIANGLE_COLORS.length];
    [a, b, c].forEach((vi) => {
      outVerts.push(vertices[vi * 3], vertices[vi * 3 + 1], vertices[vi * 3 + 2]);
      outColors.push(...col1);
    });
    outIdx.push(base1, base1 + 1, base1 + 2);
    triIdx++;

    // Triangle 2: a, c, d
    const base2 = outVerts.length / 3;
    const col2 = TRIANGLE_COLORS[triIdx % TRIANGLE_COLORS.length];
    [a, c, d].forEach((vi) => {
      outVerts.push(vertices[vi * 3], vertices[vi * 3 + 1], vertices[vi * 3 + 2]);
      outColors.push(...col2);
    });
    outIdx.push(base2, base2 + 1, base2 + 2);
    triIdx++;
  });

  return { vertices: outVerts, colors: outColors, indices: outIdx };
}

/** Floor grid geometry (static). */
export function generateFloorGrid(
  dim = FLOOR.DIM,
  lines = FLOOR.LINES
): {
  vertices: number[];
  colors: number[];
  indices: number[];
} {
  const vertices: number[] = [];
  const colors: number[] = [];
  const indices: number[] = [];
  const inc = (2 * dim) / lines;
  const b = FLOOR.BRIGHTNESS;
  let idx = 0;

  for (let l = 0; l <= lines; l++) {
    const x = -dim + l * inc;
    vertices.push(x, 0, -dim, x, 0, dim, -dim, 0, x, dim, 0, x);
    for (let k = 0; k < 4; k++) colors.push(b, b, b, 1);
    indices.push(idx, idx + 1, idx + 2, idx + 3);
    idx += 4;
  }

  return { vertices, colors, indices };
}
