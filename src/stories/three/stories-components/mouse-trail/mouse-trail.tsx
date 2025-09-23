import { Line, Point, PointMaterial, Points, QuadraticBezierLine, useFBX, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Euler, MathUtils, Vector3 } from 'three'

import { type GizmoType } from '../../../../helpers/types/commonTypes'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import { lerpVelocity, mouseZ, pointSize, pointsN, rayPlaneColor, rayPlanePosition, rayPlaneRotation, rayPlaneScale } from './mouse-trail.config'

export interface MouseTrailProps {
  gizmoType?: GizmoType
  enableOrbitControl?: boolean
  lineWidth: number
  followMouse: boolean
  isPlaneTransparent?: boolean
}

//https://codesandbox.io/s/mouse-trail-part-4-1rp5o?from-embed=&file=/src/index.js 
export default function MouseTrail({followMouse = true, isPlaneTransparent = true}: MouseTrailProps) {

  const [initPos, setInitPos] = useState(new Vector3(0, 0, 1))

  const [points, setPoints] = useState<number[][]>(() => {
    return Array.from({ length: pointsN}, (v, i) => {
      const x = (i / (pointsN - 1) - 0.5) * 3;
      const y = Math.sin(i / 10.5) * 0.5;

      return [x, y, mouseZ] 
    })
  })

  useFrame(() => {
    if(followMouse) {
      const positions :number[][] = Array.from({ length: pointsN}, (_, i) => {
        return points[i]
      })

      if (points) {
        points.forEach((p, i) => {
          const previous = i -1

          if(i === 0) {
            positions[0] = new Vector3(initPos.x, initPos.y + 0.1, initPos.z).toArray()
          }
          else {
            const currentPoint = new Vector3(
              positions[i][0],
              positions[i][1],
              positions[i][2],       
              );
            const previousPoint = new Vector3(
              positions[previous][0],
              positions[previous][1],
              positions[previous][2],
            );

            const lerpPoint = currentPoint.lerp(previousPoint, lerpVelocity);
            positions[i][0] = lerpPoint.x
            positions[i][1] = lerpPoint.y
            positions[i][2] = lerpPoint.z
          }
        })
      }
      setPoints(positions)
    }
  })

  const handleRaycastMouse = (point: Vector3) => 
  {
    setInitPos(point)
  }

  return ( 
    <group>
      <Points>
        {points.map((p, index ) => (
          /* @ts-ignore */
          <Point key={`${index}-${Math.random()}`} position={p} color={[p[0]/5, 0.1, p[2]/5 ]}  />
        ))}
        {/* @ts-ignore  */}
        <PointMaterial scale={pointSize} />
      </Points>
      <mesh
          onPointerMove={(e) => { handleRaycastMouse(e.point) }}
          position={rayPlanePosition}
          rotation={rayPlaneRotation}
          scale={rayPlaneScale}
        >
        <planeGeometry />
        <meshStandardMaterial opacity={0.1} color={rayPlaneColor} transparent={isPlaneTransparent}/>
      </mesh>
    </group>
    
  )
}


