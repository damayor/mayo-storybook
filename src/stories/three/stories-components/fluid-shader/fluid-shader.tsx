import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import { type GizmoType } from '../../non-stories-components/helpers/types/commonTypes'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import { useControls } from 'leva'
import * as THREE from 'three'
import type { Bounds } from 'pixi.js'
import { metalness, roughness } from 'three/tsl'
import { bufferGeometry } from '../homogeneus-background/background.config'

export interface FluidShaderProps {
  gizmoType?: GizmoType
  // enableOrbitControl?: boolean
  // lineWidth: number
  // followMouse: boolean
  // isPlaneTransparent?: boolean
}

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec3 uColor;
  uniform float uDensity;
  uniform float uVelocity;
  uniform float uRadius;
  varying vec2 vUv;

  // Simple swirl function
  float swirl(vec2 uv, vec2 center, float radius, float strength) {
    vec2 offset = uv - center;
    float dist = length(offset);
    if (dist < radius) {
      float angle = strength * (radius - dist);
      float s = sin(angle);
      float c = cos(angle);
      offset = mat2(c, -s, s, c) * offset;
    }
    return smoothstep(radius, 0.0, dist);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * uVelocity;

    // create moving noise
    float n = sin(uv.x * 10.0 + t) * cos(uv.y * 10.0 - t);

    // swirling pattern influenced by mouse
    float mask = swirl(uv, uMouse, uRadius, 4.0 * uDensity);

    // color intensity
    vec3 col = uColor * mask * (1.0 + n * 0.3);

    gl_FragColor = vec4(col, 1.0);
  }
`

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`


export default function FluidShader(props: FluidShaderProps)  {
  const mesh = useRef<THREE.Mesh | null>(null)
  const { size } = useThree()

  const uniforms = useRef({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uColor: { value: new THREE.Color('#ff00ff') },
    uDensity: { value: 0.5 },
    uVelocity: { value: 0.5 },
    uRadius: { value: 0.2 },
  }).current

  const { color, density, velocity, radius } = useControls('Fluid Controls', {
    color: '#ff00ff',
    density: { value: 0.5, min: 0.0, max: 2.0, step: 0.01 },
    velocity: { value: 0.5, min: 0.0, max: 2.0, step: 0.01 },
    radius: { value: 0.2, min: 0.01, max: 1.0, step: 0.01 },
  })

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime()
    uniforms.uColor.value.set(color)
    uniforms.uDensity.value = density
    uniforms.uVelocity.value = velocity
    uniforms.uRadius.value = radius
  })

  // 🖱️ Mouse movement handler
  const handleMouseMove = (event: any) => {
    console.log('move in fluid', event.uv.x, event.uv.y);
    uniforms.uMouse.value.x = event.uv.x
    uniforms.uMouse.value.y = event.uv.y
  }

  let renderFluid = true;

  return (
     <mesh ref={mesh} onPointerMove={handleMouseMove}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </mesh>
    

      // <mesh onPointerMove={handleMouseMove}
      //   scale={[0.5, 0.5, 0.5]}
      //   geometry={bufferGeometry}
      // >
      //   <meshStandardMaterial metalness={1} roughness={0.5} emissive={new THREE.Color(0xee0000)} />
      // </mesh>
  )
   
  
}

