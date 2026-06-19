import { Suspense, useEffect, useRef } from 'react'
import { useCurrentSheet } from '@theatre/r3f'
import { PerspectiveCamera } from '@theatre/r3f'
import { useScroll } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { ObjRenderer } from '../../../../cpp/ObjRenderer/ObjRenderer'

const SEQUENCE_DURATION = 10
const PAGES = 6

// Native browser scroll via ScrollControls — best for fullscreen (portfolio).
// Browser handles trackpad momentum and inertia; precise 0→1 normalization.
// Requires <ScrollControls> wrapping this component from outside.
function ScrollSyncNative() {
  const sheet = useCurrentSheet()
  const scroll = useScroll()

  console.log("  confirmo si estamos usando  useScroll")
  useFrame(() => {
    if (!sheet) return
    sheet.sequence.position = scroll.offset * SEQUENCE_DURATION
  })

  return null
}

//todo Review if keeps working in Storybook, then remove this
function ScrollSyncWheel() {
  const sheet = useCurrentSheet()
  const { gl } = useThree()
  const targetRef = useRef(0)
  const currentRef = useRef(0)

  useEffect(() => {
    const el = gl.domElement.parentElement ?? gl.domElement
    const totalScroll = window.innerHeight * PAGES

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetRef.current = Math.max(0, Math.min(1, targetRef.current + e.deltaY / totalScroll))
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [gl])

  useFrame(() => {
    if (!sheet) return
    currentRef.current += (targetRef.current - currentRef.current) * 0.1
    sheet.sequence.position = currentRef.current * SEQUENCE_DURATION
  })

  return null
}

interface CameraPathProps {
  // true  → ScrollControls (native scroll by drei, portfolio fullscreen)
  // false → wheel listener (Storybook embedded, default)
  useNativeScroll?: boolean
}

export function CameraPath({ useNativeScroll = true }: CameraPathProps) {
  return (
    <>
      <PerspectiveCamera theatreKey="Camera" makeDefault fov={60} />
      {/* {useNativeScroll ? <ScrollSyncNative /> : <ScrollSyncWheel />} */}
      <ScrollSyncNative /> 
      <Suspense fallback={<mesh />}>
        <ObjRenderer />
      </Suspense>
    </>
  )
}
