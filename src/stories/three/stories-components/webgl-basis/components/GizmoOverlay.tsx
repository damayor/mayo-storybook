import React, { useEffect, useRef } from 'react';
import type { Mat4 } from '../types';

interface GizmoOverlayProps {
  modelview: Mat4;
}

const SIZE   = 80;   // canvas px
const ORIGIN = 40;   // centre of canvas
const LEN    = 28;   // axis arm length in px

const AXES: Array<{ dir: [number,number,number]; color: string; label: string }> = [
  { dir: [1, 0, 0], color: '#e74c3c', label: 'X' },
  { dir: [0, 1, 0], color: '#2ecc71', label: 'Y' },
  { dir: [0, 0, 1], color: '#3498db', label: 'Z' },
];

/** Extract the upper-left 3×3 rotation block from a column-major mat4 and
 *  rotate a direction vector by it (no translation, no scale). */
function rotateByMV(mv: Mat4, v: [number,number,number]): [number, number, number] {
  const m = mv as number[];
  return [
    m[0]*v[0] + m[4]*v[1] + m[8]*v[2],
    m[1]*v[0] + m[5]*v[1] + m[9]*v[2],
    m[2]*v[0] + m[6]*v[1] + m[10]*v[2],
  ];
}

export const GizmoOverlay: React.FC<GizmoOverlayProps> = ({ modelview }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width  = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Background circle
    ctx.beginPath();
    ctx.arc(ORIGIN, ORIGIN, ORIGIN - 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20,20,20,0.55)';
    ctx.fill();

    // Project each axis and collect for depth-sorted draw order
    const projected = AXES.map(axis => {
      const rotated = rotateByMV(modelview, axis.dir);
      // In view-space: x→right, y→up, z→toward camera
      // Map to 2D canvas: canvas-x = view-x, canvas-y = -view-y (flip Y)
      const ex = ORIGIN + rotated[0] * LEN;
      const ey = ORIGIN - rotated[1] * LEN;   // flip Y for screen coords
      return { ...axis, ex, ey, depth: rotated[2] };
    });

    // Sort back-to-front so closer axes draw on top
    projected.sort((a, b) => a.depth - b.depth);

    // Draw negative stubs first (faded)
    projected.forEach(({ ex, ey, color }) => {
      const nx = ORIGIN - (ex - ORIGIN) * 0.5;
      const ny = ORIGIN - (ey - ORIGIN) * 0.5;
      ctx.beginPath();
      ctx.moveTo(ORIGIN, ORIGIN);
      ctx.lineTo(nx, ny);
      ctx.strokeStyle = color + '44';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // Draw axes back-to-front
    projected.forEach(({ ex, ey, color, label }) => {
      // Line
      ctx.beginPath();
      ctx.moveTo(ORIGIN, ORIGIN);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Arrowhead dot
      ctx.beginPath();
      ctx.arc(ex, ey, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Label
      const lx = ex + (ex - ORIGIN) * 0.45;
      const ly = ey + (ey - ORIGIN) * 0.45;
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, lx, ly);
    });

    // Centre dot
    ctx.beginPath();
    ctx.arc(ORIGIN, ORIGIN, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }, [modelview]);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      style={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        width:  SIZE,
        height: SIZE,
        pointerEvents: 'none',
        borderRadius: '50%',
      }}
    />
  );
};
