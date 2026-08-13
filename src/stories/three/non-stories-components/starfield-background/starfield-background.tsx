import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export interface StarfieldBackgroundProps {
  /** Number of stars */
  count?: number;
  /** Half-extent of the random spread on the X axis */
  spreadX?: number;
  /** Half-extent of the random spread on the Y axis (vertical in three.js) */
  spreadY?: number;
  /** Half-extent of the random spread on the Z axis */
  spreadZ?: number;
  /** Z offset applied after spreading (pushes the field forward/back) */
  offsetZ?: number;
  /** Sphere radius */
  radius?: number;
  /** Sphere color */
  color?: THREE.ColorRepresentation;
}

// Fondo de estrellas reutilizable (esferas dispersas por el espacio), extraído de FloatingCard.
// Usa InstancedMesh: 200 esferas reales en una sola draw call, mismo look que el original
// pero sin el costo de 200 <mesh> independientes.
const StarfieldBackground = ({
  count = 200,
  spreadX = 20,
  spreadY = 20,
  spreadZ = 20,
  offsetZ = -5,
  radius = 0.02,
  color = 'white',
}: StarfieldBackgroundProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const positions = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      arr.push([
        (Math.random() - 0.5) * spreadX,
        (Math.random() - 0.5) * spreadY,
        (Math.random() - 0.5) * spreadZ + offsetZ,
      ]);
    }
    return arr;
  }, [count, spreadX, spreadY, spreadZ, offsetZ]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    positions.forEach(([x, y, z], i) => {
      dummy.position.set(x, y, z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[radius, 8, 8]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};

export default StarfieldBackground;
