import { BakeShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { WebGPURenderer } from 'three/webgpu';


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

interface BackendPanelProps {
  label: string;
  forceRenderer: 'webgpu' | 'webgl';
  bustCount: number;
}

function makeBustTransforms(count: number) {
  return [...Array(count)].map(() => ({
    position: [40 - Math.random() * 80, 40 - Math.random() * 80, 40 - Math.random() * 80] as [
      number,
      number,
      number,
    ],
    rotation: [
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
    ] as [number, number, number],
  }));
}

function BackendPanel({ label, forceRenderer, bustCount }: BackendPanelProps) {
  const bustTransforms = useMemo(() => makeBustTransforms(bustCount), [bustCount]);
  const [backend, setBackend] = useState<'checking' | 'webgpu' | 'webgl'>('checking');
  const [fps, setFps] = useState<number | null>(null);

  // Memoizado: si esta factory fuera una función nueva en cada render (p.ej. por
  // el re-render que dispara setFps cada 0.5s), R3F podía recrear el WebGPURenderer
  // repetidamente, causando un parpadeo mientras compiten dos inicializaciones.
  const createRenderer = useCallback(
    async (props: { canvas: unknown }) => {
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
    },
    [forceRenderer],
  );

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

      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} shadows gl={createRenderer}>
        <InstancedBust transforms={bustTransforms} usePbrEnvMaterial={backend === 'webgpu'} />
        <FpsCounter onUpdate={setFps} />
        <OrbitControls zoomSpeed={0.75} />
        <pointLight position={[0, 0, 0]} intensity={0.5} />
        {/* Sombras y envMap solo son estables en el backend WebGPU real detectado
            en runtime (`backend`, no `forceRenderer`): el fallback WebGL de
            WebGPURenderer renderiza el material PBR + env en negro. */}
        {backend === 'webgpu' && (
          <>
            <spotLight intensity={2.5} position={[50, 50, 50]} castShadow />
            <Environment preset="city" />
            <BakeShadows />
          </>
        )}
        {backend === 'webgl' && <spotLight intensity={2.5} position={[50, 50, 50]} />}
      </Canvas>
    </div>
  );
}


//ToDo LOD in another class
interface BustTransform {
  position: [number, number, number];
  rotation: [number, number, number];
}

interface InstancedBustProps {
  transforms: BustTransform[];
  // El material PBR del GLTF (con envMap) sale negro en el fallback WebGL de
  // WebGPURenderer sin importar las luces/sombras — es el material en sí, no
  // una prop opcional. En WebGL usamos un MeshStandardMaterial simplificado
  // (mismo color base, sin envMap) para que al menos se vea la forma/color.
  usePbrEnvMaterial: boolean;
}

const LOD_GLTF_PATHS = [
  '/assets/meshes/lod/bust-1-d.glb',
  '/assets/meshes/lod/bust-2-d.glb',
  '/assets/meshes/lod/bust-3-d.glb',
  '/assets/meshes/lod/bust-4-d.glb',
];
// Distance thresholds matching the old <Detailed distances={[0, 15, 25, 35, 100]}>:
// level i is used for distances in [LOD_DISTANCES[i], LOD_DISTANCES[i + 1]).
const LOD_DISTANCES = [0, 15, 25, 35, 100];
// How often (ms) to re-check each instance's distance to the camera and
// possibly move it to a different InstancedMesh level. Cheaper than doing it
// every frame; still reacts to zoom/orbit within a fraction of a second.
const LOD_REEVALUATE_INTERVAL_MS = 250;

function lodLevelForDistance(distance: number) {
  for (let i = LOD_DISTANCES.length - 2; i >= 0; i--) {
    if (distance >= LOD_DISTANCES[i]) return i;
  }
  return 0;
}

// Instanced busts with dynamic LOD: one InstancedMesh per detail level, sized
// for the worst case (all instances could land on the same level). A throttled
// useFrame recomputes which level each instance belongs to based on its live
// distance to the camera, and rewrites each level's instance matrices + count
// — the InstancedMesh equivalent of what <Detailed> does per-object every frame.
function InstancedBust({ transforms, usePbrEnvMaterial }: InstancedBustProps) {
  const meshRefs = useRef<(THREE.InstancedMesh | null)[]>([]);
  const levels = useGLTF(LOD_GLTF_PATHS) as any[];
  const lastEvaluatedAt = useRef(-Infinity);

  // Fallback material para el backend WebGL: mismo color base que el material
  // del GLTF, sin envMap. Uno por nivel LOD, memoizado por nivel para no violar
  // la estabilidad de `args` (ver nota abajo).
  const fallbackMaterials = useMemo(
    () =>
      levels.map(
        ({ materials }) =>
          new THREE.MeshStandardMaterial({
            color: materials.default?.color ?? '#ffffff',
            roughness: materials.default?.roughness ?? 0.8,
            metalness: materials.default?.metalness ?? 0,
          }),
      ),
    [levels],
  );
  // Stable per-index ref callbacks: an inline `ref={(mesh) => ...}` is a new
  // function every render, which makes React detach + reattach the ref (calling
  // it with null, then the mesh again) on every re-render instead of only on
  // mount/unmount.
  const setMeshRef = useMemo(
    () =>
      LOD_GLTF_PATHS.map(
        (_, levelIndex) => (mesh: THREE.InstancedMesh | null) => {
          meshRefs.current[levelIndex] = mesh;
        },
      ),
    [],
  );

  const updateLevels = useMemo(() => {
    const dummy = new THREE.Object3D();
    return (camera: THREE.Camera) => {
      const groups: BustTransform[][] = LOD_GLTF_PATHS.map(() => []);
      transforms.forEach((transform) => {
        const distance = camera.position.distanceTo(new THREE.Vector3(...transform.position));
        groups[lodLevelForDistance(distance)].push(transform);
      });
      groups.forEach((group, levelIndex) => {
        const mesh = meshRefs.current[levelIndex];
        if (!mesh) return;
        group.forEach(({ position, rotation }, i) => {
          dummy.position.set(...position);
          dummy.rotation.set(...rotation);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        });
        mesh.count = group.length;
        mesh.instanceMatrix.needsUpdate = true;
      });
    };
  }, [transforms]);

  useFrame(({ camera, clock }) => {
    const now = clock.getElapsedTime() * 1000;
    if (now - lastEvaluatedAt.current < LOD_REEVALUATE_INTERVAL_MS) return;
    lastEvaluatedAt.current = now;
    updateLevels(camera);
  });

  return (
    <>
      {levels.map(({ nodes, materials }, levelIndex) => (
        <instancedMesh
          key={levelIndex}
          ref={setMeshRef[levelIndex]}
          // `args` son los argumentos del constructor de InstancedMesh: si aquí
          // llegara un objeto nuevo en cada render (material inline sin memo,
          // por ejemplo) R3F destruiría y recrearía el mesh entero, vaciando la
          // escena por un frame — por eso fallbackMaterials está memoizado arriba.
          args={[
            nodes.Mesh_0001.geometry,
            usePbrEnvMaterial ? materials.default : fallbackMaterials[levelIndex],
            transforms.length,
          ]}
          receiveShadow={usePbrEnvMaterial}
          castShadow={usePbrEnvMaterial}
          material-envMapIntensity={usePbrEnvMaterial ? 0.25 : 0}
        />
      ))}
    </>
  );
}

const BUST_COUNT = 200;

export interface WebGPUvsWebGLProps {
  bustCount?: number;
}

export function WebGPUvsWebGL({ bustCount = BUST_COUNT }: WebGPUvsWebGLProps) {
  return (
    <div style={{ display: 'flex', gap: 8, width: '100%', height: '600px' }}>
      <BackendPanel label="WebGPU" forceRenderer="webgpu" bustCount={bustCount} />
      <BackendPanel label="WebGL" forceRenderer="webgl" bustCount={bustCount} />
    </div>
  );
}

export default WebGPUvsWebGL;
