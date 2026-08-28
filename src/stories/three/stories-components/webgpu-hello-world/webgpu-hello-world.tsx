import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import type { Mesh } from 'three';
import { WebGPURenderer, MeshBasicNodeMaterial } from 'three/webgpu';
import { color, mix, uniform } from 'three/tsl';

function SpinningCube() {
  const meshRef = useRef<Mesh>(null);

  const colorMix = useMemo(() => uniform(0), []);

  const material = useMemo(() => {
    const material = new MeshBasicNodeMaterial();
    material.colorNode = mix(color('#ff2200'), color('#00e0ff'), colorMix);
    return material;
  }, [colorMix]);

  useFrame(({ clock }, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.6;
      meshRef.current.rotation.y += delta * 0.9;
    }
    colorMix.value = (Math.sin(clock.getElapsedTime()) + 1) / 2;
  });

  return (
    <mesh ref={meshRef} material={material}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
    </mesh>
  );
}

export function WebGPUHelloWorld() {
  const [backend, setBackend] = useState<'checking' | 'webgpu' | 'webgl-fallback'>('checking');

  return (
    <div style={{ width: '100%', height: '600px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 1,
          padding: '4px 10px',
          borderRadius: 6,
          fontFamily: 'monospace',
          fontSize: 12,
          color: '#fff',
          background: backend === 'webgpu' ? '#0b8f4f' : backend === 'webgl-fallback' ? '#a15c00' : '#555',
        }}
      >
        {backend === 'checking' && 'inicializando…'}
        {backend === 'webgpu' && 'backend: WebGPU ✅'}
        {backend === 'webgl-fallback' && 'backend: WebGL (fallback) ⚠️'}
      </div>

      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={async (props) => {
          const renderer = new WebGPURenderer({
            canvas: props.canvas as HTMLCanvasElement,
            antialias: true,
          });
          await renderer.init();
          const isWebGPUBackend = 'isWebGPUBackend' in renderer.backend && renderer.backend.isWebGPUBackend;
          setBackend(isWebGPUBackend ? 'webgpu' : 'webgl-fallback');
          return renderer;
        }}
      >
        <color attach="background" args={['#111116']} />
        <SpinningCube />
      </Canvas>
    </div>
  );
}

export default WebGPUHelloWorld;
