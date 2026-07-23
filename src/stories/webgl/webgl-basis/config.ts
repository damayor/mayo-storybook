/**
 * WebGL Cube Editor — centralised configuration
 * All magic numbers live here. Import from this file, never hardcode elsewhere.
 */

// ── Cube geometry (world-space bounds) ───────────────────────────────────────
export const CUBE = {
  P1X: 1.0, // top-left-far  X
  P1Y: 3.0, // top-left-far  Y
  P1Z: -10.0, // far Z
  P2X: 3.0, // bottom-right  X
  P2Y: -0.5, // bottom-right  Y
  P3Z: -5.0, // near Z
} as const;

// ── Camera ───────────────────────────────────────────────────────────────────
export const CAMERA = {
  FOV_RAD: (55 * Math.PI) / 180,
  Z_NEAR: 0.1,
  Z_FAR: 100.0,
  INITIAL_ZOOM: 1.5,
  // The point the camera orbits around (centroid of the cube)
  CENTER: [2.0, 1.25, -7.5] as [number, number, number],
  // Initial eye position in world space — orbit angles & radius are derived from this
  INITIAL_EYE: [3.5, 3.5, -18.0] as [number, number, number],
} as const;

// ── Vertex interaction ────────────────────────────────────────────────────────
export const PICK = {
  RADIUS_PX: 20, // screen-space pick radius in pixels
  POINT_SIZE: 14, // gl_PointSize for vertices
} as const;

// ── Vertex colors ─────────────────────────────────────────────────────────────
export const VERTEX_COLORS = {
  NORMAL: [0.2, 0.5, 1.0, 1.0],
  HOVER: [1.0, 0.7, 0.0, 1.0],
  SELECTED: [1.0, 1.0, 1.0, 1.0],
  DRAGGING: [0.0, 1.0, 0.5, 1.0],
} as const;

// ── Face colors ───────────────────────────────────────────────────────────────
export const FACE_COLORS = {
  BACK: [1.0, 1.0, 0.0, 1.0],
  FRONT: [0.0, 0.0, 1.0, 1.0],
  TOP: [1.0, 0.0, 0.0, 1.0],
  BOTTOM: [0.0, 1.0, 0.0, 1.0],
  RIGHT: [0.0, 1.0, 1.0, 1.0],
  LEFT: [1.0, 0.0, 1.0, 1.0],
} as const;

// ── 12-triangle palette ───────────────────────────────────────────────────────
export const TRIANGLE_COLORS: ReadonlyArray<readonly [number, number, number, number]> = [
  [1, 0, 0, 1], // Red
  [0, 1, 0, 1], // Green
  [0, 0, 1, 1], // Blue
  [1, 1, 0, 1], // Yellow
  [1, 0, 1, 1], // Magenta
  [0, 1, 1, 1], // Cyan
  [1, 0.5, 0, 1], // Orange
  [0.5, 0, 1, 1], // Purple
  [1, 0, 0.5, 1], // Pink
  [0, 1, 0.5, 1], // Spring Green
  [0.5, 1, 0, 1], // Lime
  [0.5, 0.5, 0.5, 1], // Gray
] as const;

// ── Floor grid ────────────────────────────────────────────────────────────────
export const FLOOR = {
  DIM: 18,
  LINES: 10,
  BRIGHTNESS: 0.78,
} as const;

// ── Canvas defaults ───────────────────────────────────────────────────────────
export const CANVAS = {
  DEFAULT_WIDTH: 1050,
  DEFAULT_HEIGHT: 750,
} as const;
