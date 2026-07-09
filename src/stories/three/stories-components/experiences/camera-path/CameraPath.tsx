import { Suspense, useEffect, useRef } from 'react'
import { useCurrentSheet } from '@theatre/r3f'
import { PerspectiveCamera } from '@theatre/r3f'
import { types } from '@theatre/core'
import { useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { type Group, type PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import { EffectComposer } from '@react-three/postprocessing'
import { ObjRenderer } from '../../../../cpp/ObjRenderer/ObjRenderer'
import { useMouseParallax } from '../../../non-stories-components/hooks/useMouseParallax'
import { MouseWarpEffectPass } from '../../../non-stories-components/effects/MouseWarpPass'
import { ThreePostprocessingEffects } from '../../postprocessing/ThreePostprocessing'
import { flags } from '../../../../../config/flags'
import { PlyRenderer } from '../../../../cpp/PlyRenderer/PlyRenderer'

const SEQUENCE_DURATION = 24
const PAGES = 6

// Requires <ScrollControls> ancestor. Drei normalises trackpad inertia natively.
function ScrollSyncNative() {
  const sheet = useCurrentSheet()
  const scroll = useScroll()
  useFrame(() => {
    if (!sheet) return
    sheet.sequence.position = scroll.offset * SEQUENCE_DURATION
  })
  return null
}

// window.scroll listener — for portfolio fullscreen background.
// Canvas has pointer-events:none so the page scrolls normally and drives the camera.
function ScrollSyncPage() {
  const sheet = useCurrentSheet()
  const progressRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      if (max <= 0) return
      progressRef.current = Math.min(1, window.scrollY / max)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(() => {
    if (!sheet) return
    sheet.sequence.position = progressRef.current * SEQUENCE_DURATION
  })

  return null
}

export type ScrollMode = 'native' | 'page' | 'none'

interface CameraPathProps {
  // native → ScrollControls (Drei, Storybook fullscreen / standalone)
  // page   → window.scroll listener (portfolio fixed background)
  // none   → no scroll listener; scrub the sequence directly in Theatre Studio (dev/testing)
  scrollMode?: ScrollMode
}


export function CameraPath({ scrollMode = 'page' }: CameraPathProps) {
  const meshGroupRef = useRef<Group>(null)
  useMouseParallax(meshGroupRef)

  return (
    <>
      <PerspectiveCamera theatreKey="Camera" makeDefault fov={60} />
      {scrollMode === 'native' && <ScrollSyncNative />}
      {scrollMode === 'page' && <ScrollSyncPage />}
      <group ref={meshGroupRef}>
        <Suspense fallback={null}>
          <PlyRenderer />
        </Suspense>
      </group>
      <EffectComposer multisampling={0}>
        <ThreePostprocessingEffects />
      </EffectComposer>
    </>
  )
}
