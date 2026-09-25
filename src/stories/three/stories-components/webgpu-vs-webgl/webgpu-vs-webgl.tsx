import { BakeShadows, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

// DEBUG: mismo instancedMesh que ya se ve cian, pero con la geometría del GLB
// en vez de una esfera local. Aísla la geometría como única variable.
function DebugInstancedSpheres() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const [{ nodes }] = useGLTF([LOD_GLTF_PATHS_WEBGL]) as any[];

  // DEBUG: imita a los bustos — buffer grande, count dinámico y reescritura
  // periódica desde useFrame, en vez de escribir las matrices una sola vez.
  const lastAt = useRef(-Infinity);
  useFrame(({ clock }) => {
    const now = clock.getElapsedTime() * 1000;
    if (now - lastAt.current < 250) return;
    lastAt.current = now;
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < 5; i++) {
      dummy.position.set(-8 + i * 4, -12, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.count = 5;
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 200]} geometry={nodes.Mesh_0001.geometry}>
      <meshStandardMaterial color="cyan" />
    </instancedMesh>
  );
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
        {backend === 'webgl' && (
          <>
            <spotLight intensity={1} position={[10, 10, 10]} />
            <ambientLight intensity={1.5} />
            <mesh position={[10, 10, 10]}>
              <sphereGeometry args={[2, 16, 16]} />
              <meshBasicMaterial color="red" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[3, 32, 32]} />
              <meshStandardMaterial color="white" />
            </mesh>
            {/* DEBUG: instancedMesh con geometría y material 100% locales. Si esta
                sale negra, el fallback WebGL rompe todo InstancedMesh. */}
            <DebugInstancedSpheres />
          </>
        )}
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
  // El material PBR del GLTF (con envMap embebido) sale negro en el fallback
  // WebGL de WebGPURenderer. En WebGL usamos un MeshStandardMaterial propio
  // con el mismo color/roughness/metalness, iluminado vía <Environment> en
  // vez del envMap embebido del GLTF.
  usePbrEnvMaterial: boolean;
}

const LOD_GLTF_PATHS = [
  '/assets/meshes/lod/bust-1-d.glb',
  '/assets/meshes/lod/bust-2-d.glb',
  '/assets/meshes/lod/bust-3-d.glb',
  '/assets/meshes/lod/bust-4-d.glb',
];

const LOD_GLTF_PATHS_WEBGL = '/assets/meshes/lod/bust-3-d.glb'
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
  // DEBUG: el panel WebGL carga un GLB que el panel WebGPU no toca, para
  // descartar que el caché compartido de useGLTF sea la causa del negro.
  const pbrLevels = useGLTF(LOD_GLTF_PATHS) as any[];
  const webglLevels = useGLTF([LOD_GLTF_PATHS_WEBGL]) as any[];
  const levels = usePbrEnvMaterial ? pbrLevels : webglLevels;
  const lastEvaluatedAt = useRef(-Infinity);

  // Fallback material para el backend WebGL: MeshStandardMaterial (reactiva
  // iluminación PBR). El material `default` del GLTF no trae baseColorFactor
  // propio (ver bust-1-d.glb) — su apariencia depende de reflejos vía envMap,
  // por eso el panel WebGL también necesita <Environment> para mostrar algo
  // distinto de blanco plano. Uno por nivel LOD, memoizado por nivel para no
  // violar la estabilidad de `args` (ver nota abajo).
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
  // useGLTF cachea el GLTF parseado globalmente por URL, así que `materials.default`
  // es el MISMO objeto Three.js en los dos paneles (WebGPU y WebGL) al usar los
  // mismos LOD_GLTF_PATHS. El panel PBR (usePbrEnvMaterial) no puede usarlo
  // directamente como material del InstancedMesh: el otro panel lo pisaría
  // (envMap, uniforms) al montarse simultáneamente. Clonarlo por nivel evita
  // que ambos Canvas compartan y muten la misma instancia de material.
  const pbrMaterials = useMemo(
    () => levels.map(({ materials }) => materials.default.clone()),
    [levels],
  );
  // Los GLB están comprimidos con Draco (KHR_draco_mesh_compression) y sus
  // normales decodificadas no iluminan bajo InstancedMesh: la malla sale plana,
  // que con el material blanco del busto se ve negra. Recalcularlas tras clonar
  // arregla el sombreado. El clon además evita compartir buffers entre paneles.
  const geometries = useMemo(
    () =>
      levels.map(({ nodes }) => {
        const geometry = nodes.Mesh_0001.geometry.clone();
        geometry.computeVertexNormals();
        return geometry;
      }),
    [levels],
  );
  // Stable per-index ref callbacks: an inline `ref={(mesh) => ...}` is a new
  // function every render, which makes React detach + reattach the ref (calling
  // it with null, then the mesh again) on every re-render instead of only on
  // mount/unmount.
  const setMeshRef = useMemo(
    () =>
      levels.map(
        (_, levelIndex) => (mesh: THREE.InstancedMesh | null) => {
          meshRefs.current[levelIndex] = mesh;
        },
      ),
    [levels],
  );

  const updateLevels = useMemo(() => {
    const dummy = new THREE.Object3D();
    return (camera: THREE.Camera) => {
      const groups: BustTransform[][] = levels.map(() => []);
      transforms.forEach((transform) => {
        const distance = camera.position.distanceTo(new THREE.Vector3(...transform.position));
        groups[Math.min(lodLevelForDistance(distance), levels.length - 1)].push(transform);
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
  }, [transforms, levels]);

  useFrame(({ camera, clock }) => {
    const now = clock.getElapsedTime() * 1000;
    if (now - lastEvaluatedAt.current < LOD_REEVALUATE_INTERVAL_MS) return;
    lastEvaluatedAt.current = now;
    updateLevels(camera);
  });

  return (
    <>
      {levels.map((_, levelIndex) => (
        <instancedMesh
          key={levelIndex}
          ref={setMeshRef[levelIndex]}
          // El tercer arg (count) define el tamaño del buffer de instancias. La
          // geometría y el material van como hijos en vez de por `args`: pasarlos
          // al constructor hacía que el fallback WebGL de WebGPURenderer los
          // renderizara negros, mientras que declarados como hijos se iluminan.
          args={[undefined, undefined, transforms.length]}
          geometry={geometries[levelIndex]}
          material={usePbrEnvMaterial ? pbrMaterials[levelIndex] : fallbackMaterials[levelIndex]}
          receiveShadow={usePbrEnvMaterial}
          castShadow={usePbrEnvMaterial}
        />
      ))}
      {/* DEBUG: mismo busto como <mesh> normal (no instanced) para separar si el
          negro viene de InstancedMesh o de la geometría del GLB. */}
      {!usePbrEnvMaterial && (
        <mesh geometry={geometries[0]} position={[0, -6, 0]} scale={3}>
          <meshStandardMaterial color="white" />
        </mesh>
      )}
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
