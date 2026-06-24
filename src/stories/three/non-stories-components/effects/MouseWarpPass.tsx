import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { wrapEffect } from '@react-three/postprocessing'
import { Vector2 } from 'three'
import { MouseWarpEffect } from './MouseWarpEffect'

// React component that renders the warp Effect inside an existing <EffectComposer>.
// Do NOT wrap this in its own EffectComposer — there can only be one per canvas.
export const MouseWarpEffectComponent = wrapEffect(MouseWarpEffect)

// Hook that tracks mouse NDC + velocity and writes them into a MouseWarpEffect's uniforms.
// effectRef must point to the effect instance captured via the onInstance constructor callback.
export function useMouseWarpUniforms(effectRef: React.RefObject<MouseWarpEffect | null>) {
  const { gl } = useThree()
  const mouseNDC = useRef(new Vector2(0, 0))
  const prevNDC  = useRef(new Vector2(0, 0))
  const velNDC   = useRef(new Vector2(0, 0))

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect()
      prevNDC.current.copy(mouseNDC.current)
      mouseNDC.current.set(
        ((e.clientX - rect.left) / rect.width)  *  2 - 1,
        ((e.clientY - rect.top)  / rect.height) * -2 + 1,
      )
      const vel = new Vector2().subVectors(mouseNDC.current, prevNDC.current)
      velNDC.current = vel.length() > 0.001 ? vel.normalize() : new Vector2(0, 0)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [gl])

  useFrame(() => {
    const fx = effectRef.current
    if (!fx) return
    ;(fx.uniforms.get('uMouse')!.value    as Vector2).copy(mouseNDC.current)
    ;(fx.uniforms.get('uMouseVel')!.value as Vector2).copy(velNDC.current)
  })
}

// Convenience component: warp effect + uniform driver in one.
// Must be rendered INSIDE an existing <EffectComposer> — NOT standalone.
export function MouseWarpEffectPass() {
  const effectRef = useRef<MouseWarpEffect | null>(null)
  useMouseWarpUniforms(effectRef)

  const onInstance = useCallback((e: MouseWarpEffect) => {
    effectRef.current = e
  }, [])

  const stableProps = useMemo(() => ({ onInstance }), [onInstance])

  return <MouseWarpEffectComponent {...stableProps} />
}
