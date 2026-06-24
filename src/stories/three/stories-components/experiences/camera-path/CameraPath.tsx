import { Suspense, useEffect, useRef } from 'react'
import { useCurrentSheet } from '@theatre/r3f'
import { PerspectiveCamera } from '@theatre/r3f'
import { useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { type Group } from 'three'
import { EffectComposer } from '@react-three/postprocessing'
import { ObjRenderer } from '../../../../cpp/ObjRenderer/ObjRenderer'
import { useMouseParallax } from '../../../non-stories-components/hooks/useMouseParallax'
import { MouseWarpEffectPass } from '../../../non-stories-components/effects/MouseWarpPass'
import { ThreePostprocessingEffects } from '../../postprocessing/ThreePostprocessing'
import { flags } from '../../../../../config/flags'

const SEQUENCE_DURATION = 10
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

// Wheel listener on the canvas element — works in any embedding (Storybook iframe).
// function ScrollSyncWheel() {
//   const sheet = useCurrentSheet()
//   const { gl } = useThree()
//   const targetRef = useRef(0)
//   const currentRef = useRef(0)

//   useEffect(() => {
//     const el = gl.domElement.parentElement ?? gl.domElement
//     const totalScroll = window.innerHeight * PAGES
//     const onWheel = (e: WheelEvent) => {
//       e.preventDefault()
//       targetRef.current = Math.max(0, Math.min(1, targetRef.current + e.deltaY / totalScroll))
//     }
//     el.addEventListener('wheel', onWheel, { passive: false })
//     return () => el.removeEventListener('wheel', onWheel)
//   }, [gl])

//   useFrame(() => {
//     if (!sheet) return
//     currentRef.current += (targetRef.current - currentRef.current) * 0.1
//     sheet.sequence.position = currentRef.current * SEQUENCE_DURATION
//   })

//   return null
// }

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

export type ScrollMode = 'native' | 'page'

interface CameraPathProps {
  // native → ScrollControls (Drei, Storybook fullscreen / standalone)
  // wheel  → wheel listener on canvas (Storybook embedded, default)
  // page   → window.scroll listener (portfolio fixed background)
  scrollMode?: ScrollMode
}

export function CameraPath({ scrollMode = 'page' }: CameraPathProps) {
  const meshGroupRef = useRef<Group>(null)
  useMouseParallax(meshGroupRef)

  return (
    <>
      <PerspectiveCamera theatreKey="Camera" makeDefault fov={60} />
      {scrollMode === 'native' && <ScrollSyncNative />}
      {/* {scrollMode === 'wheel'  && <ScrollSyncWheel />} */}
      {scrollMode === 'page'   && <ScrollSyncPage />}
      <group ref={meshGroupRef}>
        <Suspense fallback={null}>
          <ObjRenderer />
          <EffectComposer multisampling={0}>
            <ThreePostprocessingEffects />
            {/* <MouseWarpEffectPass /> */}
          </EffectComposer>
        </Suspense>
      </group>
      {/* {flags.USE_MOUSE_WARP ? (
        <EffectComposer multisampling={0}>
          <ThreePostprocessingEffects />
          <MouseWarpEffectPass />
        </EffectComposer>
      ) : (
        <EffectComposer multisampling={0}>
          <ThreePostprocessingEffects />
        </EffectComposer>
      )} */}
    </>
  )
}
