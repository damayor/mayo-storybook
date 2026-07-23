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

// Lerp factor for easing the sequence position toward the scroll target —
// same smoothing technique as useMouseParallax. Softens the hard snap at the
// very start/end of the scroll range instead of binding position 1:1 to raw
// scroll input every frame.
const SCROLL_LERP = 0.1

// Requires <ScrollControls> ancestor. Drei normalises trackpad inertia natively.
function ScrollSyncNative() {
  const sheet = useCurrentSheet()
  const scroll = useScroll()
  const positionRef = useRef(0)
  useFrame(() => {
    if (!sheet) return
    positionRef.current += (scroll.offset * SEQUENCE_DURATION - positionRef.current) * SCROLL_LERP
    sheet.sequence.position = positionRef.current
  })
  return null
}

// window.scroll listener — for portfolio fullscreen background.
// Canvas has pointer-events:none so the page scrolls normally and drives the camera.
function ScrollSyncPage() {
  const sheet = useCurrentSheet()
  const progressRef = useRef(0)
  const positionRef = useRef(0)

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
    positionRef.current += (progressRef.current * SEQUENCE_DURATION - positionRef.current) * SCROLL_LERP
    sheet.sequence.position = positionRef.current
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
        {/* <ThreePostprocessingEffects /> disabled for long time*/}
        <MouseWarpEffectPass />
      </EffectComposer>
    </>
  )
}
