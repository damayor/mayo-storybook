import React, { useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Vector3 } from 'three';

//ToDo Minigame 
// ============= COMPONENTE DE ESFERA CON FÍSICA =============
interface PhysicsSphereProps {
  position: [number, number, number];
  color: number;
  onWallCollision: () => void;
  onSphereCollision: () => void;
  onPlayerClick: () => void;
  spheres: React.MutableRefObject<Array<{
    mesh: THREE.Mesh | null;
    velocity: Vector3;
  }>>;
  index: number;
}

function PhysicsSphere({ 
  position, 
  color, 
  onWallCollision,
  onSphereCollision,
  onPlayerClick,
  spheres,
  index
}: PhysicsSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);

<mesh visible userData={{ hello: 'world' }} position={[1, 2, 3]} rotation={[Math.PI / 2, 0, 0]}>
  <sphereGeometry args={[1, 16, 16]} />
  <meshStandardMaterial color="hotpink" transparent />
</mesh>


  const velocityRef = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ));
  const [isHovered, setIsHovered] = useState(false);

  // Registrar esta esfera en el array compartido
  React.useEffect(() => {
    if (meshRef.current) {
      spheres.current[index] = {
        mesh: meshRef.current,
        velocity: velocityRef.current
      };
    }
  }, [spheres, index]);

  useFrame(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    const velocity = velocityRef.current;

    // Aplicar velocidad
    mesh.position.add(velocity);

    // Rotación
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;

    // Fricción
    velocity.multiplyScalar(0.99);

    // Colisiones con paredes (roomSize = 10)
    const roomSize = 10;
    const halfRoom = roomSize / 2;
    const radius = 1;

    let collided = false;

    if (Math.abs(mesh.position.x) > halfRoom - radius) {
      velocity.x *= -0.8;
      mesh.position.x = Math.sign(mesh.position.x) * (halfRoom - radius);
      collided = true;
    }
    if (Math.abs(mesh.position.y) > halfRoom - radius) {
      velocity.y *= -0.8;
      mesh.position.y = Math.sign(mesh.position.y) * (halfRoom - radius);
      collided = true;
    }
    if (Math.abs(mesh.position.z) > halfRoom - radius) {
      velocity.z *= -0.8;
      mesh.position.z = Math.sign(mesh.position.z) * (halfRoom - radius);
      collided = true;
    }


    if (collided) {
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
        // Notificar colisión entre esferas
        onSphereCollision();

        const normal = new THREE.Vector3()
          .subVectors(otherWorldPosition, worldPosition)
          .normalize();

        const relativeVelocity = new THREE.Vector3()
          .subVectors(velocity, other.velocity);
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
    onPlayerClick(); // Notificar que el jugador hizo click
    const force = new THREE.Vector3(0, 0.08, 0.08);
    velocityRef.current.add(force);
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={() => setIsHovered(false)}
    >
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial
        color={color}
        roughness={0.3}
        metalness={0.8}
        emissive={color}
        emissiveIntensity={isHovered ? 1 : 0.2}
        flatShading
      />
    </mesh>
  );
}

// ============= COMPONENTE DEL CUARTO (GRID) =============
function Room({ visible, opacity }: { visible: boolean; opacity: number }) {
  const roomSize = 10;

  if (!visible) return null;

  return (
    <group>
      {/* Piso */}
      <gridHelper 
        args={[roomSize, 10, 0xffffff, 0xffffff]} 
        position={[0, -roomSize/2, 0]}
      >
        <lineBasicMaterial 
          attach="material" 
          color={0xffffff} 
          transparent 
          opacity={opacity} 
        />
      </gridHelper>
      
      {/* Techo */}
      <gridHelper 
        args={[roomSize, 10, 0xffffff, 0xffffff]} 
        position={[0, roomSize/2, 0]}
      >
        <lineBasicMaterial 
          attach="material" 
          color={0xffffff} 
          transparent 
          opacity={opacity} 
        />
      </gridHelper>
      
      {/* Pared frontal */}
      <gridHelper 
        args={[roomSize, 10, 0xffffff, 0xffffff]} 
        position={[0, 0, roomSize/2]}
        rotation={[Math.PI/2, 0, 0]}
      >
        <lineBasicMaterial 
          attach="material" 
          color={0xffffff} 
          transparent 
          opacity={opacity} 
        />
      </gridHelper>
      
      {/* Pared trasera */}
      <gridHelper 
        args={[roomSize, 10, 0xffffff, 0xffffff]} 
        position={[0, 0, -roomSize/2]}
        rotation={[Math.PI/2, 0, 0]}
      >
        <lineBasicMaterial 
          attach="material" 
          color={0xffffff} 
          transparent 
          opacity={opacity} 
        />
      </gridHelper>
      
      {/* Pared izquierda */}
      <gridHelper 
        args={[roomSize, 10, 0xffffff, 0xffffff]} 
        position={[-roomSize/2, 0, 0]}
        rotation={[Math.PI/2, Math.PI/2, 0]}
      >
        <lineBasicMaterial 
          attach="material" 
          color={0xffffff} 
          transparent 
          opacity={opacity} 
        />
      </gridHelper>
      
      {/* Pared derecha */}
      <gridHelper 
        args={[roomSize, 10, 0xffffff, 0xffffff]} 
        position={[roomSize/2, 0, 0]}
        rotation={[Math.PI/2, Math.PI/2, 0]}
      >
        <lineBasicMaterial 
          attach="material" 
          color={0xffffff} 
          transparent 
          opacity={opacity} 
        />
      </gridHelper>
    </group>
  );
}

// ============= COMPONENTE DE LUCES =============
function Lights({ intensity }: { intensity: number }) {
  return (
    <>
      <ambientLight intensity={0.5 * intensity} />
      <directionalLight position={[10, 10, 5]} intensity={1 * intensity} />
      <pointLight position={[-10, -10, -5]} color="#4f46e5" intensity={0.5 * intensity} />
    </>
  );
}

// ============= SCENE CONTROLLER =============
function SceneController() {
  const { scene } = useThree();
  const [showRoom, setShowRoom] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [roomOpacity, setRoomOpacity] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const lastCollisionTimeRef = useRef(0);
  const spheresHitRef = useRef<Set<number>>(new Set());
  const comboActiveRef = useRef(false);
  const spheresRef = useRef<Array<{
    mesh: THREE.Mesh | null;
    velocity: THREE.Vector3;
  }>>([]);
  const groupRef = useRef<THREE.Group>(null);

  const handleWallCollision = () => {
    const currentTime = Date.now();
    lastCollisionTimeRef.current = currentTime;
    
    if (!showRoom) {
      setShowRoom(true);
      setRoomOpacity(0.8);
      scene.background = new THREE.Color(0x000000);
      setLightIntensity(0);
    }
  };

  const handleSphereCollision = (sphereIndex: number) => {
    if (!comboActiveRef.current) return;

    // Agregar esfera al set de golpeadas
    spheresHitRef.current.add(sphereIndex);

    // Si se golpearon las 3 esferas, incrementar combo
    if (spheresHitRef.current.size === 3) {
      setComboCount(prev => prev + 1);
      spheresHitRef.current.clear();
      comboActiveRef.current = false;
    }
  };

  const handlePlayerClick = () => {
    // Activar modo combo cuando el jugador hace click
    comboActiveRef.current = true;
    spheresHitRef.current.clear();
  };

  useFrame((state, delta) => {
    // Rotar el grupo de esferas lentamente
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }

    // Verificar si han pasado 2 segundos desde la última colisión
    if (showRoom) {
      const timeSinceLastCollision = (Date.now() - lastCollisionTimeRef.current) / 1000;
      
      if (timeSinceLastCollision >= 2) {
        setLightIntensity(1);
        scene.background = null;
        setRoomOpacity(0);
        comboActiveRef.current = false;
        spheresHitRef.current.clear();
        setTimeout(() => setShowRoom(false), 100);
      }
    }
  });

  return (
    <>
      <Lights intensity={lightIntensity} />
      <Room visible={showRoom} opacity={roomOpacity} />
      
      <group ref={groupRef}>
        <PhysicsSphere 
          position={[-3, 0, 0]} 
          color={0x4f46e5} 
          onWallCollision={handleWallCollision}
          onSphereCollision={() => handleSphereCollision(0)}
          onPlayerClick={handlePlayerClick}
          spheres={spheresRef}
          index={0}
        />
        <PhysicsSphere 
          position={[3, 1, -2]} 
          color={0x06b6d4} 
          onWallCollision={handleWallCollision}
          onSphereCollision={() => handleSphereCollision(1)}
          onPlayerClick={handlePlayerClick}
          spheres={spheresRef}
          index={1}
        />
        <PhysicsSphere 
          position={[0, -2, -1]} 
          color={0x8b5cf6} 
          onWallCollision={handleWallCollision}
          onSphereCollision={() => handleSphereCollision(2)}
          onPlayerClick={handlePlayerClick}
          spheres={spheresRef}
          index={2}
        />
      </group>

      {/* Contador visible solo cuando luces apagadas */}
      {showRoom && lightIntensity === 0 && (
        <Html position={[4, -4, 0]} center>
          <div className="bg-black/90 backdrop-blur-sm border-2 border-white rounded-lg px-6 py-4 pointer-events-none">
            <div className="text-white text-center">
              <div className="text-5xl font-bold mb-1">{comboCount}</div>
              <div className="text-xs font-semibold tracking-wider">COMBO HITS</div>
            </div>
          </div>
        </Html>
      )}
    </>
  );
}

// ============= CURSOR TRAIL =============
function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface TrailPoint {
      x: number;
      y: number;
      life: number;
    }

    const trail: TrailPoint[] = [];
    const maxTrailLength = 20;

    const handleMouseMove = (e: MouseEvent) => {
      trail.push({
        x: e.clientX,
        y: e.clientY,
        life: 1
      });

      if (trail.length > maxTrailLength) {
        trail.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trail.forEach((point, index) => {
        const size = (point.life * 15) * (index / trail.length);
        const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, size);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${point.life * 0.8})`);
        gradient.addColorStop(0.5, `rgba(79, 70, 229, ${point.life * 0.4})`);
        gradient.addColorStop(1, `rgba(139, 92, 246, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();

        point.life *= 0.95;
      });

      for (let i = trail.length - 1; i >= 0; i--) {
        if (trail[i].life < 0.01) {
          trail.splice(i, 1);
        }
      }
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

// ============= COMPONENTE PRINCIPAL =============
export default function InteractiveBackground3D() {
  return (
    <>
      {/* Canvas de Three.js - SIN -z-10, con z-0 */}
      <div className="fixed inset-0 z-0" style={{ width: '100vw', height: '100vh' }}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 50 }}
          style={{ width: '100%', height: '100%', cursor: 'pointer' }}
          gl={{ alpha: true, antialias: true }}
        >
          <SceneController />
        </Canvas>
      </div>

      <CursorTrail />

      {/* Indicador de instrucciones - z-20 para que esté visible */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-purple-500/30 rounded-full px-6 py-3 flex items-center gap-3 shadow-lg animate-bounce-slow">
          <span className="text-2xl">👆</span>
          <p className="text-sm text-gray-300 font-medium">
            Click the spheres to interact!
          </p>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}