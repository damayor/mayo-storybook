/**
 * useUI - Custom hook for managing UI state and camera
 * Handles camera updates, interactions, and projections
 */

import { useState, useCallback, useEffect } from 'react';
import type { UIState, InteractionMode, ViewMode, ProjectionType } from '../types';

const FOV = (55 * Math.PI) / 180;
const Z_NEAR = 0.1;
const Z_FAR = 100.0;

/**
 * Simple matrix operations (replacement for glMatrix in minimal form)  */
const mat4 = {
  create: (): number[] => [
    1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
  ],
  identity: (m: number[]): number[] => {
    m[0] = m[5] = m[10] = m[15] = 1;
    m[1] = m[2] = m[3] = m[4] = m[6] = m[7] = m[8] = m[9] = m[11] = m[12] = m[13] = m[14] = 0;
    return m;
  },
  translate: (m: number[], x: number, y: number, z: number): number[] => {
    m[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
    m[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
    m[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
    m[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
    return m;
  },
  rotateX: (m: number[], rad: number): number[] => {
    const s = Math.sin(rad);
    const c = Math.cos(rad);
    const a10 = m[4], a11 = m[5], a12 = m[6], a13 = m[7];
    const a20 = m[8], a21 = m[9], a22 = m[10], a23 = m[11];
    m[4] = a10 * c + a20 * s;
    m[5] = a11 * c + a21 * s;
    m[6] = a12 * c + a22 * s;
    m[7] = a13 * c + a23 * s;
    m[8] = a10 * -s + a20 * c;
    m[9] = a11 * -s + a21 * c;
    m[10] = a12 * -s + a22 * c;
    m[11] = a13 * -s + a23 * c;
    return m;
  },
};

const vec3 = {
  create: (x: number = 0, y: number = 0, z: number = 0): number[] => [x, y, z],
  copy: (v: number[]): number[] => [...v],
  subtract: (a: number[], b: number[]): number[] => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  normalize: (v: number[]): number[] => {
    const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return len > 0 ? [v[0] / len, v[1] / len, v[2] / len] : v;
  },
  cross: (a: number[], b: number[]): number[] => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ],
};

export function useUI(canvasWidth: number = 1050, canvasHeight: number = 750) {
  const [state, setState] = useState<UIState>({
    projection: mat4.create(),
    modelview: mat4.create(),
    eye: vec3.create(1, 2, 2),
    center: vec3.create(3.0, 1.0, -10.0),
    angleX: Math.PI / 3,
    angleY: 0,
    zoomZ: 1,
    interactionMode: '2ndClic',
    viewMode: 'edges',
    projectionType: 'perspective',
    zoom: 1.5,
  });

  /**
   * Update projection matrix based on type
   */
  const updateProjection = useCallback((uiState: UIState): void => {
    const proj = mat4.create();
    mat4.identity(proj);

    if (uiState.projectionType === 'perspective') {
      const aspectRatio = canvasWidth / canvasHeight;
      const ymax = (Z_NEAR * Math.tan(FOV / 2)) / uiState.zoom;
      const xmax = ymax * aspectRatio;

      // Perspective projection matrix
      const left = -xmax;
      const right = xmax;
      const top = ymax;
      const bottom = -ymax;
      const near = Z_NEAR;
      const far = Z_FAR;

      proj[0] = (2 * near) / (right - left);
      proj[5] = (2 * near) / (top - bottom);
      proj[8] = (right + left) / (right - left);
      proj[9] = (top + bottom) / (top - bottom);
      proj[10] = -(far + near) / (far - near);
      proj[11] = -1;
      proj[14] = -(2 * far * near) / (far - near);
      proj[15] = 0;
    } else {
      // Orthogonal projection
      const orthoWidth = 10 / uiState.zoom;
      const orthoHeight = 10 / uiState.zoom;
      const left = -orthoWidth / 2;
      const right = orthoWidth / 2;
      const bottom = -orthoHeight / 2;
      const top = orthoHeight / 2;
      const near = Z_NEAR;
      const far = Z_FAR;

      proj[0] = 2 / (right - left);
      proj[5] = 2 / (top - bottom);
      proj[10] = -2 / (far - near);
      proj[12] = -(right + left) / (right - left);
      proj[13] = -(top + bottom) / (top - bottom);
      proj[14] = -(far + near) / (far - near);
    }

    setState((prev) => ({ ...prev, projection: proj }));
  }, [canvasWidth, canvasHeight]);

  /**
   * Update model-view matrix based on camera position
   */
  const updateModelView = useCallback((uiState: UIState): void => {
    const modelview = mat4.create();
    mat4.identity(modelview);

    // Simple lookAt implementation
    const eyeArray = Array.isArray(uiState.eye) ? uiState.eye : Array.from(uiState.eye);
    const centerArray = Array.isArray(uiState.center) ? uiState.center : Array.from(uiState.center);
    const f = vec3.normalize(vec3.subtract(centerArray, eyeArray));
    const s = vec3.normalize(vec3.cross(f, [0, 1, 0]));
    const u = vec3.cross(s, f);

    const mv = mat4.create();
    mv[0] = s[0]; mv[4] = s[1]; mv[8] = s[2];
    mv[1] = u[0]; mv[5] = u[1]; mv[9] = u[2];
    mv[2] = -f[0]; mv[6] = -f[1]; mv[10] = -f[2];
    mv[12] = -eyeArray[0] * s[0] - eyeArray[0] * u[0] - eyeArray[0] * -f[0];
    mv[13] = -eyeArray[1] * s[1] - eyeArray[1] * u[1] - eyeArray[1] * -f[1];
    mv[14] = -eyeArray[2] * s[2] - eyeArray[2] * u[2] - eyeArray[2] * -f[2];

    setState((prev) => ({ ...prev, modelview: mv }));
  }, []);

  /**
   * Initialize projection and modelview
   */
  useEffect(() => {
    updateProjection(state);
    updateModelView(state);
  }, [state.projectionType, state.zoom]);

  /**
   * Update modelview when camera changes
   */
  useEffect(() => {
    updateModelView(state);
  }, [state.angleX, state.angleY, state.zoomZ]);

  const setInteractionMode = useCallback((mode: InteractionMode) => {
    setState((prev) => ({ ...prev, interactionMode: mode }));
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const setProjectionType = useCallback((type: ProjectionType) => {
    setState((prev) => ({ ...prev, projectionType: type }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({ ...prev, zoom }));
  }, []);

  const rotateCamera = useCallback((deltaX: number, deltaY: number) => {
    setState((prev) => ({
      ...prev,
      angleX: prev.angleX + deltaY * 0.01,
      angleY: prev.angleY + deltaX * 0.01,
    }));
  }, []);

  return {
    state,
    setInteractionMode,
    setViewMode,
    setProjectionType,
    setZoom,
    rotateCamera,
    updateProjection,
    updateModelView,
  };
}
