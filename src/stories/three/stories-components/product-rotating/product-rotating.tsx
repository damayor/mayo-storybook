import { useFBX, useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
// import { a, useSpring } from 'react-spring-three'
import { Object3D } from 'three'
import { DEFAULT_CAMERA_POSITION } from '../../../../helpers/constants/scene-constants'
import {
  FootwearViews,
  getProductPosition,
  getProductRotation,
  gizmoTypeConfig,
  springConfig,
} from './product-rotating.config'

import { type GizmoType } from '../../../../helpers/types/commonTypes'
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas'
import { productPosition, size } from '../../../../helpers/constants/product.config'
import { a, useSpring } from '@react-spring/three'
// import LoaderAnimation from '../loader-animation/loader-animation'

export interface ProductRotatingProps {
  cameraView: FootwearViews
  handleEnableControls?: (view: FootwearViews) => void
  glbUrl: string
  gizmoType?: GizmoType
  enableOrbitControl?: boolean
}

export default function ProductRotating({
  gizmoType = gizmoTypeConfig,
  enableOrbitControl = false,
  ...args
}: ProductRotatingProps) {
  const [orbit, setOrbit] = useState(true)
  const handleEnableControls = (view: FootwearViews) => {
    setOrbit(enableOrbitControl && view === FootwearViews.FRONT)
  }

  return (
    <MayoCanvas enableOrbitControls={orbit} environmentPreset='studio' gizmoType={gizmoType}>
      <Suspense fallback={<mesh/>}>
        <ProductRotatingComponent
          {...args}
          enableOrbitControl={enableOrbitControl}
          handleEnableControls={handleEnableControls}
        />
      </Suspense>
    </MayoCanvas>
  )
}

function ProductRotatingComponent({
  cameraView = FootwearViews.FRONT,
  handleEnableControls = () => {},
  glbUrl,
  enableOrbitControl,
}: ProductRotatingProps) {
  const ref = useRef<Object3D>(new Object3D())
  const model = useGLTF(glbUrl)
  const { scenes } = model

  console.log('gltf', model)

  const { camera } = useThree()
  const INIT_CAMERA_POSITION = DEFAULT_CAMERA_POSITION.toArray().slice(0, 3)
  const ORBIT_RADIUS = DEFAULT_CAMERA_POSITION.length()
  const [currentRotation, setCurrentRotation] = useState(getProductRotation(FootwearViews.FRONT))
  const [currentPosition, setCurrentPosition] = useState(getProductPosition(FootwearViews.FRONT))
  const refOrbitPosition = useRef(INIT_CAMERA_POSITION)

  const [spring, setSpring] = useSpring(() => ({
    from: {
      position: currentPosition,
      rotationX: currentRotation.x,
      rotationY: currentRotation.y,
      rotationZ: currentRotation.z,
    },
    config: springConfig,
    onRest: () => {
      setCurrentPosition(getProductPosition(cameraView))
      setCurrentRotation(getProductRotation(cameraView))
    },
  }))

  const [_, setCameraSpring] = useSpring(() => ({
    to: {
      cameraX: DEFAULT_CAMERA_POSITION.x,
      cameraY: DEFAULT_CAMERA_POSITION.y,
      cameraZ: DEFAULT_CAMERA_POSITION.z,
    },
    config: springConfig,
    onChange: ({ value }) => {
      const currentTheta = Math.acos(value.cameraZ / ORBIT_RADIUS)
      const cameraRadialX = (value.cameraX > 0 ? ORBIT_RADIUS : -ORBIT_RADIUS) * Math.sin(currentTheta)
      camera.position.set(cameraRadialX, value.cameraY, value.cameraZ)
      camera.lookAt(productPosition)
      camera.updateProjectionMatrix()
    },
  }))

  useEffect(() => {
    handleEnableControls(cameraView)
    setSpring({
      position: getProductPosition(cameraView),
      rotationX: getProductRotation(cameraView).x,
      rotationY: getProductRotation(cameraView).y,
      rotationZ: getProductRotation(cameraView).z,
    })
    startCameraReset()
  }, [cameraView])

  useEffect(() => {
    handleEnableControls(cameraView)
    if (!enableOrbitControl) {
      startCameraReset()
    }
  }, [enableOrbitControl])

  const startCameraReset = () => {
    refOrbitPosition.current = [camera.position.x, camera.position.y, camera.position.z]
    setCameraSpring({
      from: {
        cameraX: refOrbitPosition.current[0],
        cameraY: refOrbitPosition.current[1],
        cameraZ: refOrbitPosition.current[2],
      },
      to: {
        cameraX: DEFAULT_CAMERA_POSITION.x,
        cameraY: DEFAULT_CAMERA_POSITION.y,
        cameraZ: DEFAULT_CAMERA_POSITION.z,
      },
    })
  }

  return (
    <group>
      {/* @ts-ignore */}
      <a.primitive
        rotation-x={spring.rotationX}
        rotation-y={spring.rotationY}
        rotation-z={spring.rotationZ}
        position={spring.position}
        scale={[size, size, size]}
        ref={ref}
        object={scenes[0]}
      />
    </group>
  )
}
