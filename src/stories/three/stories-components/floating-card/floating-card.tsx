import React, { useRef } from 'react';
import * as THREE from 'three';

import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { SocialCard } from 'HtmlComponents/social-card';
import StarfieldBackground from '../../non-stories-components/starfield-background/starfield-background';

// Componente que hace flotar la carta en el espacio 3D
const FloatingCard = () => {
  const groupRef = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();

      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;

      //   const rotationRange = Math.PI / 8; // 45 grados en radianes
      //   groupRef.current.rotation.y = Math.sin(t * 0.3) * rotationRange;
      groupRef.current.rotation.x = -Math.PI / 50;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Html
        transform
        distanceFactor={1.5}
        position={[0, 0, 0]}
        style={{
          transition: 'none',
          userSelect: 'none',
        }}
      >
        <SocialCard />
      </Html>
    </group>
  );
};

// Componente principal con Canvas
const FloatingCardScene = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1a' }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        style={{ background: 'radial-gradient(circle, #1a1a3a 0%, #0a0a1a 100%)' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#764ba2" />

        <FloatingCard />

        {/* Estrellas de fondo */}
        <StarfieldBackground />

        <OrbitControls
          enableZoom={true}
          //   enablePan={true}
          //   maxDistance={10}
          //   minDistance={2}
          minAzimuthAngle={-Math.PI / 2}
          maxAzimuthAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default FloatingCardScene;
