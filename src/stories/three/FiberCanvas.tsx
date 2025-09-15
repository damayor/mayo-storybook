import React from 'react';

import { Canvas } from '@react-three/fiber'

import { OrbitControls } from '@react-three/drei'

// import './App.css';
import './three.css';

function FiberCanvas() {
  return (
    
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

       <mesh
          scale={1}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={'red'} />
        </mesh>
        <OrbitControls />
    </Canvas>
  );
}

export default FiberCanvas;
