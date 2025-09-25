import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const TRAIL_LENGTH = 15;

const PixiTrail2D: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const positions = useRef<{x: number, y: number}[]>([]);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: 600,
      height: 400,
      background: '#222',
      antialias: true,
    });
    appRef.current = app;
    if (canvasRef.current) {
      canvasRef.current.appendChild(app.view);
    }

    const trail = new PIXI.Graphics();
    app.stage.addChild(trail);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = app.view.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      positions.current.push({ x, y });
      if (positions.current.length > TRAIL_LENGTH) {
        positions.current.shift();
      }
    };
    app.view.addEventListener('mousemove', handleMouseMove);

    app.ticker.add(() => {
      trail.clear();
      trail.lineStyle(4, 0xffcc00, 1);
      positions.current.forEach((pos, i) => {
        if (i === 0) {
          trail.moveTo(pos.x, pos.y);
        } else {
          trail.lineTo(pos.x, pos.y);
        }
      });
    });

    return () => {
      app.view.removeEventListener('mousemove', handleMouseMove);
      app.destroy(true, { children: true });
    };
  }, []);

  return <div ref={canvasRef} style={{ width: 600, height: 400 }} />;
};

export default PixiTrail2D;
