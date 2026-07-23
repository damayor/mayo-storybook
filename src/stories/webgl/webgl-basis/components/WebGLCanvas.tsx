import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { UIState } from '../types';
import {
  initShaderProgram,
  initLinesBuffers,
  clearCanvas,
  setupDrawing,
  drawShape,
  generateFloorGrid,
  generateCubeFaces,
  generateCubeTriangles,
  getCanvasMousePos,
  getCubePointColors,
  mat4Invert,
  mat4Multiply,
  pickVertex,
  screenToWorldAtZ,
  updateBuffer,
} from '../webgl-utils';
import { PICK } from '../config';

// ── Prop types ────────────────────────────────────────────────────────────────

interface WebGLCanvasProps {
  uiState: UIState;
  onHoverVertex: (index: number | null) => void;
  onSelectVertex: (index: number | null) => void;
  onStartDrag: () => void;
  onStopDrag: () => void;
  onMoveVertex: (index: number, x: number, y: number) => void;
  onCameraRotate: (dx: number, dy: number) => void;
  onResize: (w: number, h: number) => void;
  onLog: (msg: string) => void;
}

type ShapeDataLocal = {
  vertices: number[];
  colors: number[];
  pickColors: number[];
  indices: number[];
  indexCount: number;
  primitiveType: GLenum;
};

// ── Component ─────────────────────────────────────────────────────────────────

export const WebGLCanvas: React.FC<WebGLCanvasProps> = ({
  uiState,
  onHoverVertex,
  onSelectVertex,
  onStartDrag,
  onStopDrag,
  onMoveVertex,
  onCameraRotate,
  onResize,
  onLog,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [glReady, setGlReady] = useState(false);

  const isRightDrag = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const isDragVert = useRef(false);
  const stateRef = useRef(uiState);
  stateRef.current = uiState;
  const rafRef = useRef(0);

  // Buffer refs
  const floorBuf = useRef<ReturnType<typeof initLinesBuffers> | null>(null);
  const edgeBuf = useRef<ReturnType<typeof initLinesBuffers> | null>(null);
  const pointBuf = useRef<ReturnType<typeof initLinesBuffers> | null>(null);
  const faceBuf = useRef<ReturnType<typeof initLinesBuffers> | null>(null);
  const triBuf = useRef<ReturnType<typeof initLinesBuffers> | null>(null);
  const shaderRef = useRef<ReturnType<typeof initShaderProgram> | null>(null);

  // Shape data refs (mutable, updated each frame)
  const floorData = useRef<{ vertices: number[]; colors: number[]; indices: number[] } | null>(
    null
  );
  const edgeData = useRef<ShapeDataLocal | null>(null);
  const pointData = useRef<ShapeDataLocal | null>(null);
  const faceData = useRef<ShapeDataLocal | null>(null);
  const triData = useRef<ShapeDataLocal | null>(null);

  // ── Init WebGL context ───────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = (canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      console.error('WebGL unavailable');
      return;
    }
    glRef.current = gl;
    setGlReady(true);
  }, []);

  // ── ResizeObserver — keeps canvas resolution in sync with CSS size ───────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const w = Math.round(width);
        const h = Math.round(height);
        if (w !== canvas.width || h !== canvas.height) {
          canvas.width = w;
          canvas.height = h;
          onResize(w, h);
        }
      }
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [onResize]);

  // ── Init shaders + static buffers (once) ────────────────────────────────────
  useEffect(() => {
    const gl = glRef.current;
    if (!glReady || !gl) return;

    const shader = initShaderProgram(gl);
    if (!shader) {
      console.error('Shader init failed');
      return;
    }
    shaderRef.current = shader;

    // Floor (static)
    const fd = generateFloorGrid();
    floorData.current = fd;
    floorBuf.current = initLinesBuffers(gl, {
      vertices: fd.vertices,
      colors: fd.colors,
      pickColors: fd.colors,
      indices: fd.indices,
      indexCount: fd.indices.length,
      primitiveType: gl.LINES,
    });

    // Cube edges (positions updated each frame)
    const verts = stateRef.current.cubeVertices;
    const edgeColors = Array<number>(8 * 4)
      .fill(0)
      .map((_, i) => [0.2, 0.5, 1, 1][i % 4]);
    edgeData.current = {
      vertices: [...verts],
      colors: edgeColors,
      pickColors: edgeColors,
      indices: [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7],
      indexCount: 24,
      primitiveType: gl.LINES,
    };
    edgeBuf.current = initLinesBuffers(gl, edgeData.current);

    // Point sprites (colors + positions updated each frame)
    pointData.current = {
      vertices: [...verts],
      colors: getCubePointColors(null, null, false),
      pickColors: getCubePointColors(null, null, false),
      indices: [0, 1, 2, 3, 4, 5, 6, 7],
      indexCount: 8,
      primitiveType: gl.POINTS,
    };
    pointBuf.current = initLinesBuffers(gl, pointData.current);

    // Faces (positions updated each frame from cubeVertices)
    const fInit = generateCubeFaces(verts);
    faceData.current = {
      vertices: fInit.vertices,
      colors: fInit.colors,
      pickColors: fInit.colors,
      indices: fInit.indices,
      indexCount: fInit.indices.length,
      primitiveType: gl.TRIANGLES,
    };
    faceBuf.current = initLinesBuffers(gl, faceData.current);

    // Triangles (positions updated each frame)
    const tInit = generateCubeTriangles(verts);
    triData.current = {
      vertices: tInit.vertices,
      colors: tInit.colors,
      pickColors: tInit.colors,
      indices: tInit.indices,
      indexCount: tInit.indices.length,
      primitiveType: gl.TRIANGLES,
    };
    triBuf.current = initLinesBuffers(gl, triData.current);
  }, [glReady]);

  // ── Render loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const gl = glRef.current;
    const shader = shaderRef.current;
    if (!glReady || !gl || !shader) return;

    cancelAnimationFrame(rafRef.current);

    const render = () => {
      const s = stateRef.current;
      const verts = s.cubeVertices;

      // --- Update point colors (hover / select / drag) ---
      if (pointData.current && pointBuf.current) {
        const pc = getCubePointColors(
          s.hoveredVertexIndex,
          s.selectedVertexIndex,
          s.isDraggingVertex
        );
        pointData.current.colors = pc;
        updateBuffer(gl, pointBuf.current.color, new Float32Array(pc));
      }

      // --- Sync edge positions ---
      if (edgeData.current && edgeBuf.current) {
        edgeData.current.vertices = [...verts];
        updateBuffer(gl, edgeBuf.current.position, new Float32Array(verts));
      }

      // --- Sync point positions ---
      if (pointData.current && pointBuf.current) {
        pointData.current.vertices = [...verts];
        updateBuffer(gl, pointBuf.current.position, new Float32Array(verts));
      }

      // --- Rebuild face geometry from live vertices ---
      if (faceData.current && faceBuf.current) {
        const fd = generateCubeFaces(verts);
        faceData.current.vertices = fd.vertices;
        faceData.current.colors = fd.colors;
        faceData.current.indexCount = fd.indices.length;
        updateBuffer(gl, faceBuf.current.position, new Float32Array(fd.vertices));
        updateBuffer(gl, faceBuf.current.color, new Float32Array(fd.colors));
      }

      // --- Rebuild triangle geometry from live vertices ---
      if (triData.current && triBuf.current) {
        const td = generateCubeTriangles(verts);
        triData.current.vertices = td.vertices;
        triData.current.colors = td.colors;
        triData.current.indexCount = td.indices.length;
        updateBuffer(gl, triBuf.current.position, new Float32Array(td.vertices));
        updateBuffer(gl, triBuf.current.color, new Float32Array(td.colors));
      }

      clearCanvas(gl);
      setupDrawing(gl, shader, s.projection, s.modelview);

      // Floor — hidden in points-only mode
      if (s.viewMode !== 'points' && floorBuf.current && floorData.current) {
        const fd = floorData.current;
        drawShape(
          gl,
          shader,
          floorBuf.current,
          {
            vertices: fd.vertices,
            colors: fd.colors,
            pickColors: fd.colors,
            indices: fd.indices,
            indexCount: fd.indices.length,
            primitiveType: gl.LINES,
          },
          true
        );
      }

      if (s.viewMode === 'wireframe') {
        if (edgeBuf.current && edgeData.current)
          drawShape(gl, shader, edgeBuf.current, edgeData.current, true);
        // Points on top (depth test off so they're never occluded by edges)
        gl.disable(gl.DEPTH_TEST);
        if (pointBuf.current && pointData.current)
          drawShape(gl, shader, pointBuf.current, pointData.current, false);
        gl.enable(gl.DEPTH_TEST);
      } else if (s.viewMode === 'points') {
        // Points-only demo: just the 8 vertices, no floor, no edges
        gl.disable(gl.DEPTH_TEST);
        if (pointBuf.current && pointData.current)
          drawShape(gl, shader, pointBuf.current, pointData.current, false);
        gl.enable(gl.DEPTH_TEST);
      } else if (s.viewMode === 'faces') {
        // gl.enable(gl.CULL_FACE);
        // gl.frontFace(gl.CW);
        // gl.cullFace(gl.FRONT);
        if (faceBuf.current && faceData.current)
          drawShape(gl, shader, faceBuf.current, faceData.current, false);
        gl.disable(gl.CULL_FACE);
        // Subtle wireframe overlay
        if (edgeBuf.current && edgeData.current)
          drawShape(gl, shader, edgeBuf.current, edgeData.current, true);
      } else if (s.viewMode === 'triangles') {
        // gl.enable(gl.CULL_FACE);
        // gl.frontFace(gl.CW);
        // gl.cullFace(gl.FRONT);
        if (triBuf.current && triData.current)
          drawShape(gl, shader, triBuf.current, triData.current, false);
        gl.disable(gl.CULL_FACE);
        // Thin edge overlay so triangle boundaries are clear
        if (edgeBuf.current && edgeData.current)
          drawShape(gl, shader, edgeBuf.current, edgeData.current, true);
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(rafRef.current);
  }, [glReady, uiState.viewMode]);

  // ── MVP helpers ──────────────────────────────────────────────────────────────
  const getMVP = useCallback((): number[] | null => {
    const s = stateRef.current;
    return mat4Multiply(s.projection as number[], s.modelview as number[]);
  }, []);

  // ── Mouse events ─────────────────────────────────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const pos = getCanvasMousePos(e, canvas);
      const s = stateRef.current;

      if (isRightDrag.current) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        onCameraRotate(dx, dy);
        return;
      }

      if (isDragVert.current && s.selectedVertexIndex !== null) {
        const mvp = getMVP();
        const invMVP = mvp ? mat4Invert(mvp) : null;
        if (!invMVP) return;
        const targetZ = s.cubeVertices[s.selectedVertexIndex * 3 + 2];
        const world = screenToWorldAtZ(pos.x, pos.y, canvas.width, canvas.height, invMVP, targetZ);
        if (world) {
          onMoveVertex(s.selectedVertexIndex, world.x, world.y);
          onLog(
            `Vertex ${s.selectedVertexIndex}: (${world.x.toFixed(2)}, ${world.y.toFixed(2)}, ${targetZ.toFixed(2)})`
          );
        }
        return;
      }

      // Hover pick
      const mvp = getMVP();
      if (!mvp) return;
      const hit = pickVertex(
        pos.x,
        pos.y,
        canvas.width,
        canvas.height,
        s.cubeVertices,
        mvp,
        PICK.RADIUS_PX
      );
      onHoverVertex(hit?.vertexIndex ?? null);
      canvas.style.cursor = hit ? 'pointer' : 'default';
    },
    [getMVP, onHoverVertex, onMoveVertex, onCameraRotate, onLog]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (e.button === 2) {
        isRightDrag.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        return;
      }
      if (e.button !== 0) return;

      const pos = getCanvasMousePos(e, canvas);
      const mvp = getMVP();
      if (!mvp) return;
      const hit = pickVertex(
        pos.x,
        pos.y,
        canvas.width,
        canvas.height,
        stateRef.current.cubeVertices,
        mvp,
        PICK.RADIUS_PX
      );

      if (hit) {
        onSelectVertex(hit.vertexIndex);
        isDragVert.current = true;
        onStartDrag();
        onLog(`Selected vertex ${hit.vertexIndex}`);
      } else {
        onSelectVertex(null);
      }
    },
    [getMVP, onSelectVertex, onStartDrag, onLog]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button === 2) {
        isRightDrag.current = false;
        return;
      }
      if (isDragVert.current) {
        isDragVert.current = false;
        onStopDrag();
        onLog('Vertex placed');
      }
    },
    [onStopDrag, onLog]
  );

  const handleMouseLeave = useCallback(() => {
    isRightDrag.current = false;
    if (isDragVert.current) {
      isDragVert.current = false;
      onStopDrag();
    }
    onHoverVertex(null);
    if (canvasRef.current) canvasRef.current.style.cursor = 'default';
  }, [onHoverVertex, onStopDrag]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => e.preventDefault(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && stateRef.current.selectedVertexIndex !== null) {
        onSelectVertex(null);
        isDragVert.current = false;
        onStopDrag();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onSelectVertex, onStopDrag]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ display: 'block' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
    />
  );
};
