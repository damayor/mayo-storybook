
import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three'
import { DEFAULT_CAMERA_FOV, DEFAULT_CAMERA_POSITION } from '../../../../helpers/constants/scene-constants'


import Controls from '../controls/controls.component'
import Gizmos from '../gizmos/gizmos.component'
import SceneEnvironment from '../scene-environment/scene-environment.component'
import type { GizmoType } from '../../../../helpers/types/commonTypes'


interface MayoCanvasProps {
  children: React.ReactNode
  enableOrbitControls?: boolean
  environmentPreset?: 'studio'
  gizmoType?: GizmoType
  lightPosition?: Vector3
}

export default function MayoCanvas({
  children,
  enableOrbitControls = false,
  gizmoType = 'none',
  lightPosition 
}: MayoCanvasProps) {
  return (
    <div style={{ height: '500px', border: '1px solid black' }}>
      <Canvas
        camera={{ position: DEFAULT_CAMERA_POSITION, fov: DEFAULT_CAMERA_FOV }}
      >
        {children}
        <SceneEnvironment lightPosition={lightPosition} />
        {enableOrbitControls && <Controls />}
        <Gizmos gizmoType={gizmoType} />
      </Canvas>
    </div>
  )
}
