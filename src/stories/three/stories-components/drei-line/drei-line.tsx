import { Line, QuadraticBezierLine, useFBX, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Vector3 } from 'three'

import type { GizmoType } from '../../non-stories-components/helpers/types/commonTypes'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
// import LoaderAnimation from '../loader-animation/loader-animation'

export interface DreiLineProps {
  gizmoType?: GizmoType
  enableOrbitControl?: boolean
  lineWidth: number
  endPosition: [number, number, number]
}

export default function DreiLine({lineWidth = 7, endPosition}: DreiLineProps) {
  return ( 
    <QuadraticBezierLine
      start={[0, 2, 0]}
      end={endPosition}  
      color={'red'}
      lineWidth={lineWidth}            
    />
  )
}


