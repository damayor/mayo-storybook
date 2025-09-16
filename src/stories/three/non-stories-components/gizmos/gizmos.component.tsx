import { GizmoHelper, GizmoViewcube, GizmoViewport } from '@react-three/drei'
import { gizmoAlignment, marginX, marginY } from './gizmos.config'
import type { GizmoType } from '../../../../helpers/types/commonTypes'
import type { JSX } from 'react/jsx-dev-runtime'

interface GizmosProps {
  gizmoType: GizmoType
}

type RenderGizmoDictionaryType = { [key: string]: JSX.Element | null }

export default function Gizmos({ gizmoType }: GizmosProps) {
  const renderGizmo: RenderGizmoDictionaryType = {
    viewCube: <GizmoViewcube />,
    viewPort: <GizmoViewport />,
    none: null,
  }
  return (
    <GizmoHelper alignment={gizmoAlignment} margin={[marginX, marginY]}>
      {renderGizmo[gizmoType]}
      {/* <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" /> */}
       {/* <GizmoViewcube /> */}
    </GizmoHelper>
  )
}
