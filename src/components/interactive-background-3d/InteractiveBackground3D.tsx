import { useControls } from 'leva';
import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import CursorTrail from '../cursor-trail/CursorTrail';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, OrbitControls, Sphere } from '@react-three/drei';

interface PhysicsSphereProps {
  position: [number, number, number];
  color: number;
  onWallCollision: () => void;
  spheres: React.MutableRefObject<
    Array<{
      mesh: THREE.Mesh | null;
      velocity: THREE.Vector3;
    }>
  >;
  index: number;
}

const gridDivisions = 11;
const roomPositionZ = -2;
const FORCE_RATE = 0.25;
const DAMPING = 0.99;
const BOUNCINESS = -0.7;
const BLACKOUT_TIME = 2.5;

// ============= COMPONENTE DE ESFERA CON FÍSICA =============
function PhysicsSphere({ position, color, onWallCollision, spheres, index }: PhysicsSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(
    new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02,
      (Math.random() - 0.5) * 0.02
    )
  );
  const [isHovered, setIsHovered] = useState(false);

  // Registrar esta esfera en el array compartido
  React.useEffect(() => {
    if (meshRef.current) {
      spheres.current[index] = {
        mesh: meshRef.current,
        velocity: velocityRef.current,
      };
    }
  }, [spheres, index]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const velocity = velocityRef.current;

    // Aplicar velocidad
    mesh.position.add(velocity);

    // Rotación
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    // Fricción
    velocity.multiplyScalar(DAMPING);

    // Colisiones con paredes (roomSize = 10)
    const roomSize = 10;
    const halfRoom = roomSize / 2;
    const radius = 1;

    if (Math.abs(mesh.position.x) > halfRoom - radius) {
      velocity.x *= BOUNCINESS;
      mesh.position.x = Math.sign(mesh.position.x) * (halfRoom - radius);
      onWallCollision();
    }
    if (Math.abs(mesh.position.y) > halfRoom - radius) {
      velocity.y *= BOUNCINESS;
      mesh.position.y = Math.sign(mesh.position.y) * (halfRoom - radius);
      onWallCollision();
    }
    if (Math.abs(mesh.position.z) > halfRoom - radius) {
      velocity.z *= BOUNCINESS;
      mesh.position.z = Math.sign(mesh.position.z) * (halfRoom - radius);
      onWallCollision();
    }

    // Colisiones entre esferas (usando world position)
    const worldPosition = new THREE.Vector3();
    mesh.getWorldPosition(worldPosition);

    spheres.current.forEach((other, otherIndex) => {
      if (otherIndex === index || !other.mesh) return;

      const otherWorldPosition = new THREE.Vector3();
      other.mesh.getWorldPosition(otherWorldPosition);

      const distance = worldPosition.distanceTo(otherWorldPosition);
      const minDistance = radius * 2;

      if (distance < minDistance) {
        const normal = new THREE.Vector3()
          .subVectors(otherWorldPosition, worldPosition)
          .normalize();

        const relativeVelocity = new THREE.Vector3().subVectors(velocity, other.velocity);
        const speed = relativeVelocity.dot(normal);

        if (speed < 0) return;

        velocity.sub(normal.clone().multiplyScalar(speed * 0.8));
        other.velocity.add(normal.clone().multiplyScalar(speed * 0.8));

        // Separar esferas
        const overlap = minDistance - distance;
        const separation = normal.clone().multiplyScalar(overlap / 2);
        mesh.position.sub(separation);
        other.mesh.position.add(separation);
      }
    });
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    const forceX = (Math.random() - 0.5) * FORCE_RATE;
    const forceY = (Math.random() - 0.5) * FORCE_RATE;
    const forceZ = (Math.random() - 1) * FORCE_RATE;
    const force = new THREE.Vector3(forceX, forceY, forceZ);
    velocityRef.current.add(force);
  };

  return (
    <Sphere
      ref={meshRef}
      args={[1, 32, 32]}
      position={position}
      onClick={handleClick}
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
    >
      <MeshDistortMaterial
        color={color}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.3}
        metalness={0.8}
      />
    </Sphere>
  );
}

// ============= COMPONENTE DEL CUARTO (GRID) =============
function Room({ opacity }: { opacity: number }) {
  const roomSize = 10;

  return (
    <group>
      {/* Piso */}
      <gridHelper
        args={[roomSize, 10, 0xbbb, 0xbbb]}
        position={[0, -roomSize / 2, 0]}
        material-opacity={opacity}
        material-transparent
      />

      {/* Techo */}
      <gridHelper
        args={[roomSize, 10, 0xbbb, 0xbbb]}
        position={[0, roomSize / 2, 0]}
        material-opacity={opacity}
        material-transparent
      />

      {/* Paredes - necesitas rotar los grids */}
      <gridHelper
        args={[roomSize, 10, 0xbbb, 0xbbb]}
        position={[0, 0, -roomSize / 2]}
        rotation={[Math.PI / 2, 0, 0]}
        material-opacity={opacity}
        material-transparent
      />

      {/* Left y Right */}
      <gridHelper
        args={[roomSize, 10, 0xbbb, 0xbbb]}
        position={[-roomSize / 2, 0, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        material-opacity={opacity}
        material-transparent
      />

      <gridHelper
        args={[roomSize, 10, 0xbbb, 0xbbb]}
        position={[roomSize / 2, 0, 0]}
        rotation={[Math.PI / 2, 0, -Math.PI / 2]}
        material-opacity={opacity}
        material-transparent
      />
    </group>
  );
}

// ============= COMPONENTE DE LUCES =============
function Lights({ intensity }: { intensity: number }) {
  return (
    <>
      <ambientLight intensity={0.5 * intensity} color={0xfff} />
      <directionalLight position={[10, 10, 5]} intensity={1 * intensity} />
    </>
  );
}

const backgrounCollisionColor = new THREE.Color(0x000000);
// const backgroundDefaultColor = new THREE.Color('rgb(241,237,244)');
const backgroundDefaultColor = new THREE.Color(0x111122);
const defaultWallOpacity = 0.05;
const collisionWallOpacity = 0.9;
const lightIntensity = 1;
const delayUntilNextWall = 2.5;

function SceneController() {
  const { scene } = useThree();
  const [showRoom, setShowRoom] = useState(false);

  const [roomOpacity, setRoomOpacity] = useState(0);
  const timerRef = useRef(0);

  const spheresRef = useRef<
    Array<{
      mesh: THREE.Mesh | null;
      velocity: THREE.Vector3;
    }>
  >([]);
  const groupSpheresRef = useRef<THREE.Group>(null);
  const lastCollisionTimeRef = useRef(0);

  const handleWallCollision = () => {
    const currentTime = Date.now();
    lastCollisionTimeRef.current = currentTime;

    //desde el primer golpe!
    if (!showRoom) {
      setShowRoom(true);
      setRoomOpacity(collisionWallOpacity);

      scene.background = backgrounCollisionColor;
      timerRef.current = BLACKOUT_TIME;
    }
  };

  useFrame((state, delta) => {
    if (showRoom) {
      const timeSinceLastCollision = (Date.now() - lastCollisionTimeRef.current) / 1000;

      //Vuelva a la normalidad cuando esta cambiando
      if (timeSinceLastCollision >= delayUntilNextWall) {
        setTimeout(() => setShowRoom(false), 100);
      }
    }

    if (timerRef.current > 0) {
      timerRef.current -= delta;
      const progress = 1 - timerRef.current / BLACKOUT_TIME;
      const newOpacity = 0.9 + (defaultWallOpacity - 0.9) * progress;
      setRoomOpacity(newOpacity);
      const newColor = backgrounCollisionColor.clone().lerp(backgroundDefaultColor, progress);
      state.scene.background = newColor;

      if (timerRef.current <= 0) {
        state.gl.setClearColor(backgroundDefaultColor);
      }
    }

    if (groupSpheresRef.current) {
      groupSpheresRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <Lights intensity={lightIntensity} />
      <Room opacity={roomOpacity} />
      <group ref={groupSpheresRef}>
        <PhysicsSphere
          position={[-3, 0, 0]}
          color={0xc09b00}
          onWallCollision={handleWallCollision}
          spheres={spheresRef}
          index={0}
        />
        <PhysicsSphere
          position={[3, 1, -2]}
          color={0x003893}
          onWallCollision={handleWallCollision}
          spheres={spheresRef}
          index={1}
        />
        <PhysicsSphere
          position={[0, -2, -1]}
          color={0xc8102e}
          onWallCollision={handleWallCollision}
          spheres={spheresRef}
          index={2}
        />
      </group>
    </>
  );
}

export function InteractiveBackground3D() {
  return (
    <div className="fixed inset-0" style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        style={{ width: '100%', height: '100%', cursor: 'pointer' }}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 8], fov: 55 }}
      >
        <color attach="background" args={[backgroundDefaultColor]} />
        <SceneController />
      </Canvas>

      {/* Cursor trail effect */}
      <CursorTrail />
    </div>
  );
}

export default InteractiveBackground3D;
