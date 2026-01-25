import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CanvasTexture, Object3D } from 'three'
import { DEFAULT_CAMERA_POSITION, SHOE_URL } from '../../non-stories-components/helpers/constants/scene-constants'
import {
  FootwearViews,
  getProductPosition,
  getProductRotation,
  springConfig,
} from '../product-rotating/product-rotating.config'

import { productPosition, size } from '../../non-stories-components/helpers/constants/product.config'
import { a, useSpring } from '@react-spring/three'
export interface ProductRotatingPrdProps {
  cameraView: FootwearViews
  glbUrl?: string
}

export function ProductRotatingPrd({
  cameraView = FootwearViews.RIGHT,
  glbUrl = SHOE_URL ,
}: ProductRotatingPrdProps) {
  const ref = useRef<Object3D>(new Object3D())
  const model = useGLTF(glbUrl)
  const { scenes } = model

  const { camera } = useThree()
  const INIT_CAMERA_POSITION = DEFAULT_CAMERA_POSITION.toArray().slice(0, 3) as [number, number, number]
  const ORBIT_RADIUS = DEFAULT_CAMERA_POSITION.length()
  const [currentRotation, setCurrentRotation] = useState(getProductRotation(FootwearViews.FRONT))
  const [currentPosition, setCurrentPosition] = useState(getProductPosition(FootwearViews.FRONT))

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

  // FIX: Usar interpolación directa en lugar de recalcular coordenadas polares
  const [_, setCameraSpring] = useSpring(() => ({
    to: {
      cameraX: DEFAULT_CAMERA_POSITION.x,
      cameraY: DEFAULT_CAMERA_POSITION.y,
      cameraZ: DEFAULT_CAMERA_POSITION.z,
    },
    config: springConfig,
    onChange: ({ value }) => {
      // Simplemente usar los valores interpolados directamente
      camera.position.set(value.cameraX, value.cameraY, value.cameraZ)
      camera.lookAt(productPosition)
      camera.updateProjectionMatrix()
    },
  }))

  useEffect(() => {
    setSpring({
      position: getProductPosition(cameraView),
      rotationX: getProductRotation(cameraView).x,
      rotationY: getProductRotation(cameraView).y,
      rotationZ: getProductRotation(cameraView).z,
    })
    startCameraReset()
  }, [cameraView])

  const startCameraReset = () => {
    const currentCameraPos = camera.position.clone()
    
    setCameraSpring({
      from: {
        cameraX: currentCameraPos.x,
        cameraY: currentCameraPos.y,
        cameraZ: currentCameraPos.z,
      },
      to: {
        cameraX: DEFAULT_CAMERA_POSITION.x,
        cameraY: DEFAULT_CAMERA_POSITION.y,
        cameraZ: DEFAULT_CAMERA_POSITION.z,
      },
    })
  }

  const firstColor = '#eeffdd';
  const secondColor = '#363';
  const direction = "vertical";

  const { scene } = useThree();
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d")!;

    const gradient =
      direction === "vertical"
        ? context.createLinearGradient(0, 0, 0, canvas.height)
        : context.createLinearGradient(0, 0, canvas.width, 0);

    gradient.addColorStop(0, firstColor);
    gradient.addColorStop(1, secondColor);

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const tex = new CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [firstColor, secondColor, direction]);

  scene.background = texture;

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