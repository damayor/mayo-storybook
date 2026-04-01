import React, { useEffect, useRef, useState } from 'react';
import type { UIState } from '../types';
import {
  initShaderProgram,
  initLinesBuffers,
  clearCanvas,
  setupDrawing,
  drawShape,
  generateFloorGrid,
  getCubeVertices,
  getCubeColors,
  getCanvasMousePos,
} from '../webgl-utils';

interface WebGLCanvasProps {
  uiState: UIState;
  onInteractionStart?: (x: number, y: number) => void;
  onInteractionMove?: (x: number, y: number) => void;
  onInteractionEnd?: () => void;
}

export const WebGLCanvas: React.FC<WebGLCanvasProps> = ({
  uiState,
  onInteractionStart,
  onInteractionMove,
  onInteractionEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const [glReady, setGlReady] = useState(false);

  // Initialize WebGL context
  useEffect(() => {
    if (!canvasRef.current) return;

    const gl = canvasRef.current.getContext('webgl') as WebGLRenderingContext | null
      || (canvasRef.current.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (!gl) {
      console.error('WebGL context could not be created');
      return;
    }

    glRef.current = gl;
    setGlReady(true);
  }, []);

  // Setup shaders and render loop
  useEffect(() => {
    if (!glReady || !glRef.current || !canvasRef.current) return;

    const gl = glRef.current;
    const shaderInfo = initShaderProgram(gl);

    if (!shaderInfo) {
      console.error('Failed to initialize shader program');
      return;
    }

    // Create floor grid
    const floorData = generateFloorGrid(10, 10);
    const floorBuffers = initLinesBuffers(gl, {
      vertices: floorData.vertices,
      colors: floorData.colors,
      pickColors: floorData.colors,
      indices: floorData.indices,
      indexCount: floorData.indices.length,
      primitiveType: gl.LINES,
    });

    // Create cube vertices
    const cubeVertices = getCubeVertices(1.0, 3.0, -10.0, 3.0, -0.5, -5.0);
    const cubeColors = getCubeColors();
    const cubePickColors = getCubeColors();

    // Cube vertices for points
    const cubePointsData = {
      vertices: cubeVertices,
      colors: cubeColors,
      pickColors: cubePickColors,
      indices: [0, 1, 2, 3, 4, 5, 6, 7],
      indexCount: 8,
      primitiveType: gl.POINTS,
    };

    // Cube lines (edges)
    const cubeEdgesData = {
      vertices: cubeVertices,
      colors: cubeColors,
      pickColors: cubePickColors,
      indices: [
        0, 1, 1, 2, 2, 3, 3, 0,  // Far face
        4, 5, 5, 6, 6, 7, 7, 4,  // Near face
        0, 4, 1, 5, 2, 6, 3, 7,  // Connecting edges
      ],
      indexCount: 24,
      primitiveType: gl.LINES,
    };

    const cubePointsBuffers = initLinesBuffers(gl, cubePointsData);
    const cubeEdgesBuffers = initLinesBuffers(gl, cubeEdgesData);

    // Render loop
    const renderFrame = () => {
      clearCanvas(gl);
      setupDrawing(gl, shaderInfo, uiState.projection, uiState.modelview);

      // Draw floor
      drawShape(
        gl,
        shaderInfo,
        floorBuffers,
        {
          vertices: floorData.vertices,
          colors: floorData.colors,
          pickColors: floorData.colors,
          indices: floorData.indices,
          indexCount: floorData.indices.length,
          primitiveType: gl.LINES,
        },
        uiState.viewMode === 'edges'
      );

      // Draw cube edges
      drawShape(
        gl,
        shaderInfo,
        cubeEdgesBuffers,
        cubeEdgesData,
        uiState.viewMode === 'edges'
      );

      // Draw cube vertices
      drawShape(
        gl,
        shaderInfo,
        cubePointsBuffers,
        cubePointsData,
        false
      );

      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  }, [glReady, uiState.projection, uiState.modelview, uiState.viewMode]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const pos = getCanvasMousePos(e, canvasRef.current);
    onInteractionStart?.(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const pos = getCanvasMousePos(e, canvasRef.current);
    onInteractionMove?.(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    onInteractionEnd?.();
  };

  return (
    <canvas
      ref={canvasRef}
      id="glcanvas"
      width={1050}
      height={750}
      className="absolute inset-0 w-full h-full block border border-gray-300"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};
