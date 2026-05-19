import { VRButton, XR, Controllers, Interactive } from '@react-three/xr'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'

// Three.js r130+ uses XRWebGLBinding for WebXR layers. The Immersive Web
// Emulator's polyfill creates its own XRSession objects that fail the native
// XRWebGLBinding constructor's type check. Removing it here forces Three.js
// to use the older XRWebGLLayer fallback path, which the polyfill supports.
if (typeof window !== 'undefined') {
  delete (window as any).XRWebGLBinding
}

export function XRHelloWorld() {
  const [active, setActive] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <VRButton sessionInit={{ optionalFeatures: ['local-floor'] }} />
      <Canvas>
        <XR>
          <Controllers />
          <ambientLight intensity={0.8} />
          <Interactive onSelect={() => setActive((v) => !v)}>
            <mesh
              position={[0, 1, -1]}
              onClick={() => setActive((v) => !v)}
            >
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color={active ? 'hotpink' : 'royalblue'} />
            </mesh>
          </Interactive>
        </XR>
      </Canvas>
    </div>
  )
}
