/**
 * useUI — UI state, camera, and vertex interaction hook
 */

import { useState, useCallback, useEffect } from 'react';
import type { UIState, InteractionMode, ViewMode, ProjectionType } from '../types';
import { getCubeVertices } from '../webgl-utils';
import { CUBE, CAMERA } from '../config';

// ── Matrix helpers (minimal, no external dep) ─────────────────────────────────

const identity = (): number[] => [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];

function buildProjection(type: ProjectionType, zoom: number, w: number, h: number): number[] {
  const m = identity();
  if (type === 'perspective') {
    const ymax = (CAMERA.Z_NEAR * Math.tan(CAMERA.FOV_RAD / 2)) / zoom;
    const xmax = ymax * (w / h);
    const l=-xmax, r=xmax, t=ymax, b=-ymax, n=CAMERA.Z_NEAR, f=CAMERA.Z_FAR;
    m[0]=(2*n)/(r-l); m[5]=(2*n)/(t-b);
    m[8]=(r+l)/(r-l); m[9]=(t+b)/(t-b);
    m[10]=-(f+n)/(f-n); m[11]=-1;
    m[14]=-(2*f*n)/(f-n); m[15]=0;
  } else {
    const hw=5/zoom, hh=5/zoom, n=CAMERA.Z_NEAR, f=CAMERA.Z_FAR;
    m[0]=1/hw; m[5]=1/hh; m[10]=-2/(f-n);
    m[14]=-(f+n)/(f-n);
  }
  return m;
}

function buildModelView(eye: number[], center: number[]): number[] {
  const f = norm(sub(center, eye));
  const s = norm(cross(f, [0,1,0]));
  const u = cross(s, f);
  const m = identity();
  m[0]=s[0]; m[4]=s[1]; m[8]=s[2];
  m[1]=u[0]; m[5]=u[1]; m[9]=u[2];
  m[2]=-f[0]; m[6]=-f[1]; m[10]=-f[2];
  m[12]=-(s[0]*eye[0]+s[1]*eye[1]+s[2]*eye[2]);
  m[13]=-(u[0]*eye[0]+u[1]*eye[1]+u[2]*eye[2]);
  m[14]= (f[0]*eye[0]+f[1]*eye[1]+f[2]*eye[2]);
  return m;
}

function orbitEye(center: number[], ax: number, ay: number, r: number): number[] {
  return [
    center[0] + r * Math.sin(ax) * Math.sin(ay),
    center[1] + r * Math.cos(ax),
    center[2] + r * Math.sin(ax) * Math.cos(ay),
  ];
}

const sub  = (a: number[], b: number[]) => [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
const norm = (v: number[]) => { const l=Math.hypot(...v); return l>0?v.map(x=>x/l):v; };
const cross = (a: number[], b: number[]) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];

// ── Default mode per view ──────────────────────────────────────────────────────

function defaultMode(view: ViewMode): InteractionMode {
  return (view === 'wireframe' || view === 'points') ? 'dragVertex' : 'extrudeFace';
}

/** Derive spherical orbit angles and radius from an explicit eye position + center. */
function eyeToOrbit(eye: number[], center: number[]): { ax: number; ay: number; r: number } {
  const dx = eye[0] - center[0];
  const dy = eye[1] - center[1];
  const dz = eye[2] - center[2];
  const r  = Math.hypot(dx, dy, dz);
  const ax = r > 0 ? Math.acos(Math.max(-1, Math.min(1, dy / r))) : 0;
  const ay = Math.atan2(dx, dz);
  return { ax, ay, r };
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useUI(canvasWidth = 1050, canvasHeight = 750) {
  const initVerts  = getCubeVertices(CUBE.P1X, CUBE.P1Y, CUBE.P1Z, CUBE.P2X, CUBE.P2Y, CUBE.P3Z);
  const initCenter = [...CAMERA.CENTER] as number[];
  const initEye    = [...CAMERA.INITIAL_EYE] as number[];
  const { ax: initAX, ay: initAY } = eyeToOrbit(initEye, initCenter);

  const [state, setState] = useState<UIState>({
    projection:          buildProjection('perspective', CAMERA.INITIAL_ZOOM, canvasWidth, canvasHeight),
    modelview:           buildModelView(initEye, initCenter),
    eye:                 initEye,
    center:              initCenter,
    angleX:              initAX,
    angleY:              initAY,
    zoomZ:               1,
    interactionMode:     'dragVertex',
    viewMode:            'wireframe',
    projectionType:      'perspective',
    zoom:                CAMERA.INITIAL_ZOOM,
    selectedVertexIndex: null,
    hoveredVertexIndex:  null,
    isDraggingVertex:    false,
    cubeVertices:        initVerts,
  });

  // Keep canvas dimensions in sync when called from ResizeObserver
  const updateCanvasDimensions = useCallback((w: number, h: number) => {
    setState(prev => ({
      ...prev,
      projection: buildProjection(prev.projectionType, prev.zoom, w, h),
    }));
  }, []);

  const setInteractionMode = useCallback((mode: InteractionMode) => {
    setState(prev => ({ ...prev, interactionMode: mode }));
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setState(prev => ({
      ...prev,
      viewMode: mode,
      // Reset to a valid interaction mode for the new view
      interactionMode: defaultMode(mode),
    }));
  }, []);

  const setProjectionType = useCallback((type: ProjectionType) => {
    setState(prev => ({
      ...prev,
      projectionType: type,
      projection: buildProjection(type, prev.zoom, canvasWidth, canvasHeight),
    }));
  }, [canvasWidth, canvasHeight]);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({
      ...prev,
      zoom,
      projection: buildProjection(prev.projectionType, zoom, canvasWidth, canvasHeight),
    }));
  }, [canvasWidth, canvasHeight]);

  // Spherical orbit on right-drag
  const rotateCamera = useCallback((deltaX: number, deltaY: number) => {
    setState(prev => {
      const ax = Math.max(0.05, Math.min(Math.PI - 0.05, (prev.angleX as number) + deltaY * 0.01));
      const ay = (prev.angleY as number) + deltaX * 0.01;
      const eye_arr = prev.eye as number[];
      const ctr_arr = prev.center as number[];
      const r = Math.hypot(eye_arr[0]-ctr_arr[0], eye_arr[1]-ctr_arr[1], eye_arr[2]-ctr_arr[2]);
      const newEye = orbitEye(ctr_arr, ax, ay, r);
      return { ...prev, angleX: ax, angleY: ay, eye: newEye, modelview: buildModelView(newEye, ctr_arr) };
    });
  }, []);

  const setHoveredVertex     = useCallback((i: number | null) => setState(p => p.hoveredVertexIndex===i ? p : { ...p, hoveredVertexIndex: i }), []);
  const setSelectedVertex    = useCallback((i: number | null) => setState(p => ({ ...p, selectedVertexIndex: i })), []);
  const startDraggingVertex  = useCallback(() => setState(p => ({ ...p, isDraggingVertex: true  })), []);
  const stopDraggingVertex   = useCallback(() => setState(p => ({ ...p, isDraggingVertex: false })), []);

  const updateVertexPosition = useCallback((vi: number, x: number, y: number) => {
    setState(prev => {
      const v = [...prev.cubeVertices];
      v[vi*3]   = x;
      v[vi*3+1] = y;
      return { ...prev, cubeVertices: v };
    });
  }, []);

  const resetCubeVertices = useCallback(() => {
    setState(prev => ({ ...prev, cubeVertices: getCubeVertices(CUBE.P1X, CUBE.P1Y, CUBE.P1Z, CUBE.P2X, CUBE.P2Y, CUBE.P3Z) }));
  }, []);

  // Rebuild projection if canvas size changes externally
  useEffect(() => {
    setState(prev => ({ ...prev, projection: buildProjection(prev.projectionType, prev.zoom, canvasWidth, canvasHeight) }));
  }, [canvasWidth, canvasHeight]);

  return {
    state,
    setInteractionMode,
    setViewMode,
    setProjectionType,
    setZoom,
    rotateCamera,
    setHoveredVertex,
    setSelectedVertex,
    startDraggingVertex,
    stopDraggingVertex,
    updateVertexPosition,
    resetCubeVertices,
    updateCanvasDimensions,
  };
}
