import { useRef } from 'react';
import { type Group } from 'three';
import { useMouseParallax } from '../../non-stories-components/hooks/useMouseParallax';

interface MouseParallaxDemoProps {
  lerp: number;
  strength: number;
}

export function MouseParallaxDemo({ lerp, strength }: MouseParallaxDemoProps) {
  const groupRef = useRef<Group>(null);
  useMouseParallax(groupRef, { lerp, strength });

  return (
    <group ref={groupRef}>
      <mesh>
        <coneGeometry args={[1.5, 2.5, 4]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>
      <mesh>
        {/* new THREE.ConeGeometry(1.5, 2.5, 4); */}
        <coneGeometry args={[1.5, 2.5, 4]} />
        <meshStandardMaterial color="#ff4444" transparent opacity={0.15} />
      </mesh>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
    </group>
  );
}
