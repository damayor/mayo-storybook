import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';

const CUBE_COUNT = 4000;

function FpsCounter({ onUpdate }: { onUpdate: (fps: number) => void }) {
  const frames = useRef(0);
  const lastSample = useRef(0);

  useFrame(({ clock }) => {
    frames.current += 1;
    const elapsed = clock.getElapsedTime() - lastSample.current;
    if (elapsed >= 0.5) {
      onUpdate(Math.round(frames.current / elapsed));
      frames.current = 0;
      lastSample.current = clock.getElapsedTime();
    }
  });

  return null;
}

function InstancedCubes({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const items = useMemo(() => {
    const arr: { position: [number, number, number]; speed: number; axis: THREE.Vector3 }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
        ],
        speed: 0.4 + Math.random() * 1.2,
        axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
      });
    }
    return arr;
  }, [count]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    items.forEach((item, i) => {
      dummy.position.set(...item.position);
      dummy.rotation.setFromVector3(item.axis.clone().multiplyScalar(t * item.speed));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.15, 0.15, 0.15]} />
      <meshBasicMaterial color="#00e0ff" />
    </instancedMesh>
  );
}

interface BackendPanelProps {
  label: string;
  forceRenderer: 'webgpu' | 'webgl';
  cubeCount: number;
}

function BackendPanel({ label, forceRenderer, cubeCount }: BackendPanelProps) {
  const [backend, setBackend] = useState<'checking' | 'webgpu' | 'webgl'>('checking');
  const [fps, setFps] = useState<number | null>(null);

  return (
    <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 1,
          display: 'flex',
          gap: 6,
          fontFamily: 'monospace',
          fontSize: 12,
        }}
      >
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            color: '#fff',
            background: backend === 'webgpu' ? '#0b8f4f' : backend === 'webgl' ? '#a15c00' : '#555',
          }}
        >
          {label}: {backend === 'checking' ? 'inicializando…' : backend}
        </span>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            color: '#fff',
            background: '#222',
          }}
        >
          {fps === null ? 'fps: —' : `fps: ${fps}`}
        </span>
      </div>

      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={async (props) => {
          const renderer = new WebGPURenderer({
            canvas: props.canvas as HTMLCanvasElement,
            antialias: true,
            forceWebGL: forceRenderer === 'webgl',
          });
          await renderer.init();
          const isWebGPUBackend =
            'isWebGPUBackend' in renderer.backend && renderer.backend.isWebGPUBackend;
          setBackend(isWebGPUBackend ? 'webgpu' : 'webgl');
          return renderer;
        }}
      >
        <color attach="background" args={['#111116']} />
        <InstancedCubes count={cubeCount} />
        <FpsCounter onUpdate={setFps} />
      </Canvas>
    </div>
  );
}

export interface WebGPUvsWebGLProps {
  cubeCount?: number;
}

export function WebGPUvsWebGL({ cubeCount = CUBE_COUNT }: WebGPUvsWebGLProps) {
  return (
    <div style={{ display: 'flex', gap: 8, width: '100%', height: '600px' }}>
      <BackendPanel label="WebGPU" forceRenderer="webgpu" cubeCount={cubeCount} />
      <BackendPanel label="WebGL" forceRenderer="webgl" cubeCount={cubeCount} />
    </div>
  );
}

export default WebGPUvsWebGL;
