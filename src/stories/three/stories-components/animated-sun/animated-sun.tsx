import { useFrame } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Vector3 } from 'three'

import { type GizmoType } from '../../non-stories-components/helpers/types/commonTypes'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import { spotLightPositionY } from '../../non-stories-components/scene-environment/scene-environment.config'
import { lightPositionTimeScale, positionZOffset, radiusX, radiusZ } from './animated-sun.config'
import Terrain from '../terrain/terrain.component'

export interface AnimatedSunProps {
  gizmoType?: GizmoType
  lightPositionX?: number
  lightPositionZ?: number
  handleMoveLight?: (pos: Vector3) => void
  // lightPos: Vector3
}

export default function AnimatedSun({gizmoType, lightPositionX, lightPositionZ, ...args }: AnimatedSunProps) {
  const [lightPos, setLigtPos] = useState(new Vector3())
  const handleMoveLight = (pos : Vector3) => {
    setLigtPos(pos)
  }

  //ToDo como parametrizo la lightPosition?

  return (
    <MayoCanvas enableOrbitControls={true} environmentPreset='studio' gizmoType={gizmoType} 
      lightPosition={lightPos}>
        <Suspense fallback={<mesh/>}>
          <AnimatedSunComponent {...args} /* lightPos={lightPos}*/ handleMoveLight={handleMoveLight}/>
        </Suspense>
    </MayoCanvas>
  )
}

function AnimatedSunComponent({ /*lightPos,*/ handleMoveLight = () => {}}: AnimatedSunProps ) {

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * lightPositionTimeScale
    const posX = radiusX * Math.sin(t / lightPositionTimeScale)
    const posZ = radiusZ * Math.cos(t / lightPositionTimeScale) + positionZOffset

    handleMoveLight(new Vector3(posX, spotLightPositionY, posZ))
  })

  return (
    <group>
      {/* <DreiLine
        endPosition={lightPos.toArray()}      
        lineWidth={7}    
      /> */}
      <Terrain
        // seed={seed}
        // size={200}
        // height={0.08}
        // levels={4}
        // scale={14}
        // wireframe={true}
      />
    </group>
  )

}


