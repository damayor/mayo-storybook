import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { createNoise2D } from "simplex-noise"
import { useControls } from "leva"

// number notation to ensure 
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stringToSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

export default function Terrain() {
  const meshRef = useRef<THREE.Mesh | null>(null)

  // Parameters from Leva
  const { width, height, segments, scale, intensity, offsetX, offsetY } =
    useControls("terrain", {
      width: { value: 100, min: 10, max: 600, step: 1 },
      height: { value: 100, min: 10, max: 600, step: 1 },
      segments: { value: 200, min: 10, max: 600, step: 1 },
      scale: { value: 0.05, min: 0.001, max: 0.5, step: 0.001 },
      intensity: { value: 5, min: 0, max: 50, step: 0.1 },
      offsetX: { value: 0, min: -10, max: 10, step: 0.001 },
      offsetY: { value: 0, min: -10, max: 10, step: 0.001 },
  })

  const geometryRef = useRef(
    new THREE.PlaneGeometry(width, height, segments, segments)
  )

  useEffect(() => {
    const prev = geometryRef.current
    const geo = new THREE.PlaneGeometry(width, height, segments, segments)
    geometryRef.current = geo
    if (meshRef.current) meshRef.current.geometry = geo
    // dispose previous geometry to avoid leaks
    prev.dispose()
    // cleanup on unmount: dispose this geometry if it's still the current one
    return () => {
      if (geometryRef.current === geo) geo.dispose()
    }
  }, [width, height, segments])

  const noise2D = useMemo(() => {
    const rng = mulberry32(stringToSeed("my-seed"))
    return createNoise2D(rng) // returns function (x,y) => -1..1
  }, [])

  useLayoutEffect(() => {
    const geo = geometryRef.current
    if (!geo) return

    const posAttr = geo.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array

    // arr layout: [x0, y0, z0, x1, y1, z1, ...]
    for (let i = 0; i < posAttr.count; i++) {
      const ix = i * 3
      const x = arr[ix] // getX
      const y = arr[ix + 1] // getY
      arr[ix + 2] = noise2D(x * scale + offsetX, y * scale + offsetY) * intensity // compute z using seeded noise
    }

    posAttr.needsUpdate = true
    geo.computeVertexNormals() // keep lighting correct
  }, [noise2D, scale, intensity, offsetX, offsetY])

 return (
    <mesh
      ref={meshRef}
      geometry={geometryRef.current}
      rotation-x={-Math.PI / 2}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color="seagreen" metalness={0.1} roughness={0.8} />
    </mesh>
  )
}


