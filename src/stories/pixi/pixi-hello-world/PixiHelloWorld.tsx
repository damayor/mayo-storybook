import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const PixiHelloWorld: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = new PIXI.Application({
      width: 400,
      height: 300,
      background: '#1099bb',
      antialias: true,
    });
    if (containerRef.current) {
      containerRef.current.appendChild(app.view);
    }

    const text = new PIXI.Text('Hello Pixi.js!', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0xffffff,
      align: 'center',
    });
    text.anchor.set(0.5);
    text.x = app.screen.width / 2;
    text.y = app.screen.height / 2;
    app.stage.addChild(text);

    return () => {
      app.destroy(true, { children: true });
    };
  }, []);

  return <div ref={containerRef} style={{ width: 400, height: 300 }} />;
};

export default PixiHelloWorld;
