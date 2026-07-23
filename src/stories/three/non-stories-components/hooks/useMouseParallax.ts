import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

const LERP_DEFAULT = 0.04
const STRENGTH_DEFAULT = 0.012

interface MouseParallaxOptions {
  lerp?: number     // smoothing 0=frozen → 1=instant. default 0.04
  strength?: number // max rotation radians. default 0.012
}

export function useMouseParallax(
  groupRef: React.RefObject<Group | null>,
  options: MouseParallaxOptions = {},
) {
  const lerpRef     = useRef(options.lerp ?? LERP_DEFAULT) 
  const strengthRef = useRef(options.strength ?? STRENGTH_DEFAULT)
  const target      = useRef({ x: 0, y: 0 })

  // Sync options every render without re-registering the listener
  lerpRef.current     = options.lerp     ?? LERP_DEFAULT
  strengthRef.current = options.strength ?? STRENGTH_DEFAULT

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    const s = strengthRef.current ?? LERP_DEFAULT
    const l = lerpRef.current ?? STRENGTH_DEFAULT
    // mouse right (+x) → rotation.y positive → right side rotates toward cam ✓
    g.rotation.y += (target.current.x * s - g.rotation.y) * l
    // mouse up (y = -1 in browser coords) → rotation.x negative → top tilts toward cam ✓
    g.rotation.x += (target.current.y * s - g.rotation.x) * l
  })
}
