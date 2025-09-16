
import { Suspense } from 'react'
import MayoCanvas from '../mayo-canvas/mayo-canvas'
// import LoaderAnimation from '../../stories/components/loader-animation/loader-animation'
import { bufferGeometry, emmisive, geometryPosition, geometryScale, metalness, roughness } from './background.config'
import { Bounds, useBounds } from '@react-three/drei'
import { Color, Vector3 } from 'three'
import { useEffect } from 'react'

export interface HomogeneusBackgroundProps {
  backgroundColor?: string
  gradientFirstColor?: never
  gradientSecondColor?: never
  gradientDirection?: never
  gradientRatio?: never
}

export interface GradientBackgroundProps {
  backgroundColor?: never
  gradientFirstColor: string
  gradientSecondColor: string
  gradientDirection?: number
  gradientRatio?: number
}

export type BackgroundProps = HomogeneusBackgroundProps | GradientBackgroundProps

export default function Background(props: BackgroundProps) {
  return (
    <MayoCanvas enableOrbitControls environmentPreset='studio'>
      <Suspense fallback={<mesh />}>
          <Bounds fit clip margin={1.2}>
            <SelectToZoom>
              <mesh position={geometryPosition} scale={geometryScale} geometry={bufferGeometry}>
                <meshStandardMaterial metalness={metalness} roughness={roughness} emissive={emmisive} />
              </mesh>
              <mesh position={new Vector3(2, 1, 0)} scale={[0.5, 0.5, 0.5]} geometry={bufferGeometry}>
                <meshStandardMaterial metalness={metalness} roughness={roughness} emissive={emmisive} />
              </mesh>
            </SelectToZoom>
            <mesh
              onPointerMove={(e) => (e.stopPropagation(), console.log('move', e))}
              //   onPointerUp={(e) => (console.log('U', e), e.stopPropagation())}
              // onPointerDown={(event) => {event.stopPropagation(); console.log('U', event)} }
              onClick={(e) => (e.stopPropagation(), console.log('clicked', e))}
              position={new Vector3(2, 1, 1.5)}
              scale={[0.5, 0.5, 0.5]}
              geometry={bufferGeometry}
            >
              <meshStandardMaterial metalness={metalness} roughness={roughness} emissive={new Color(0xee0000)} />
            </mesh>
          </Bounds>
      </Suspense>
    </MayoCanvas>
  )
}

interface SelectToZoomProps {
  children: React.ReactNode
}

function SelectToZoom({ children }: SelectToZoomProps) {
  const api = useBounds()
  useEffect(() => {
    console.log(api)
  }, [])
  return (
    <group
      onClick={(e) => (console.log('set bounds', e), e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit())}
      onPointerMissed={(e) => {
        console.log('devolvete', e)
        return e.button === 0 && api.refresh().fit()
      }}
    >
      {children}
    </group>
  )
}
