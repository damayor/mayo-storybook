import { Html, useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { CanvasTexture, Object3D, Vector3 } from 'three';
import {
  DEFAULT_CAMERA_POSITION,
  hotspotsCopaData,
  SHOE_URL,
} from '../../helpers/constants/scene-constants';
import {
  FootwearViews,
  getProductPosition,
  getProductRotation,
  gizmoTypeConfig,
  springConfig,
} from '../product-rotating/product-rotating.config';

import { productPosition } from '../../helpers/constants/product.config';
import { a, useSpring } from '@react-spring/three';
import Hotspots from '../hotspots/hotspots';
import { defaultHotspotsConfiguration } from '../hotspots/constants/default-product-config';

export interface ProductHotspotsProps {
  cameraView: FootwearViews;
  glbUrl?: string;
}

export function ProductHotspots({
  cameraView = FootwearViews.RIGHT,
  glbUrl = SHOE_URL,
}: ProductHotspotsProps) {
  const ref = useRef<Object3D>(new Object3D());
  const model = useGLTF(glbUrl);
  const { scenes } = model;

  const { camera } = useThree();
  const INIT_CAMERA_POSITION = DEFAULT_CAMERA_POSITION.toArray().slice(0, 3) as [
    number,
    number,
    number,
  ];
  const ORBIT_RADIUS = DEFAULT_CAMERA_POSITION.length();
  const [currentRotation, setCurrentRotation] = useState(getProductRotation(FootwearViews.FRONT));
  const [currentPosition, setCurrentPosition] = useState(getProductPosition(FootwearViews.FRONT));

  const [spring, setSpring] = useSpring(() => ({
    from: {
      position: currentPosition,
      rotationX: currentRotation.x,
      rotationY: currentRotation.y,
      rotationZ: currentRotation.z,
    },
    config: springConfig,
    onRest: () => {
      setCurrentPosition(getProductPosition(cameraView));
      setCurrentRotation(getProductRotation(cameraView));
    },
  }));

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
      camera.position.set(value.cameraX, value.cameraY, value.cameraZ);
      camera.lookAt(productPosition);
      camera.updateProjectionMatrix();
    },
  }));

  useEffect(() => {
    setSpring({
      position: getProductPosition(cameraView),
      rotationX: getProductRotation(cameraView).x,
      rotationY: getProductRotation(cameraView).y,
      rotationZ: getProductRotation(cameraView).z,
    });
    startCameraReset();
  }, [cameraView]);

  const startCameraReset = () => {
    const currentCameraPos = camera.position.clone();

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
    });
  };

  const firstColor = '#eeffdd';
  const secondColor = '#030';
  const direction = 'vertical';

  const { scene } = useThree();
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    const gradient =
      direction === 'vertical'
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

  const scale = 8;

  return (
    <group>
      {/* @ts-ignore */}
      <a.primitive
        rotation-x={spring.rotationX}
        rotation-y={spring.rotationY}
        rotation-z={spring.rotationZ}
        position={spring.position}
        scale={scale}
        ref={ref}
        object={scenes[0]}
      />
      <Hotspots
        scene={scenes[0]}
        hotspotsData={hotspotsCopaData}
        onZoom={() => {}}
        // scale={scale}
        productView={cameraView}
        // isBeingAnimated={false}
        hotspotsConfig={defaultHotspotsConfiguration}
        // isViewChangedOnZoom={isViewChangedOnZoom}
      />
    </group>
  );
}
