import { Html, type OrbitControlsProps } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';
import { Group, PerspectiveCamera, Vector3, Euler } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import {
  CAMERA_FOCUS,
  getOrbitAngle,
  getShortestWayAngles,
  TRANSITION_DURATION,
  defaultTheta,
  convertThetaToAzimuthAngle,
  zoomTargetRadius,
  zoomThetaLimit,
  animateCameraSpherically,
  getModalAnchorOrigin,
  hotspotContentZIndexRange,
} from './hotspots.config';
import { DEFAULT_RADIAL_DISTANCE, DEFAULT_CAMERA_POSITION } from './constants/scene-constants';

import { useSpring } from '@react-spring/three';

import type {
  HotspotDataType,
  HotspotsConfigType,
  ProductViewModeType,
  HotspotPositionsDictionary,
} from '../../helpers/types/commonTypes';
import { defaultHotspotsConfiguration } from './constants/default-product-config';
import HotspotButton from './hotspot-button/hotspot-button';
import { outsideOfProductOffset } from './hotspot-button/hotspot-button.config';
import { renderControlsOffHelper } from '../../non-stories-components/controls/controls.component';
import { getHotspotPositions } from '../../helpers/functions/scene';
import { minZoom } from '../../non-stories-components/controls/controls.config';

export interface HotspotProps {
  scene: Group;
  hotspotsData: HotspotDataType[];
  onZoom: (newVale: boolean) => void;
  hotspotsConfig?: HotspotsConfigType;
  productViewMode?: ProductViewModeType;
  productView: string; // 'front', 'right', 'back', 'left', etc.
  isProductFloating?: boolean;
  scale?: number;
}

export default function Hotspots({
  scene,
  hotspotsData,
  onZoom,
  hotspotsConfig = defaultHotspotsConfiguration,
  productViewMode,
  productView,
  isProductFloating = false,
  scale,
}: HotspotProps) {
  const { camera } = useThree();
  const [controlEnabled, setControlEnabled] = useState(true);
  const [contentShownIndex, setContentShownIndex] = useState(-1);
  const [isContentShown, setIsContentShown] = useState(false);
  const controls = useThree((state) => state.controls) as any;
  const [hotspotsPositions, setHotspotsPositions] = useState<HotspotPositionsDictionary>(
    getHotspotPositions(scene, outsideOfProductOffset)
  );

  // Referencias para detectar cambios
  const previousViewRef = useRef(productView);
  const previousViewModeRef = useRef(productViewMode);
  const previousCameraPositionRef = useRef(camera.position.clone());
  const previousSceneRotationRef = useRef(new Euler());
  const isAnimatingRef = useRef(false);

  // Detectar si la escena está siendo animada
  const detectSceneAnimation = () => {
    if (!scene) return false;

    // Detectar rotación del producto
    const currentRotation = scene.rotation;
    const hasRotationChanged =
      Math.abs(currentRotation.x - previousSceneRotationRef.current.x) > 0.001 ||
      Math.abs(currentRotation.y - previousSceneRotationRef.current.y) > 0.001 ||
      Math.abs(currentRotation.z - previousSceneRotationRef.current.z) > 0.001;

    previousSceneRotationRef.current.copy(currentRotation);
    return hasRotationChanged;
  };

  // Detectar cambios en la cámara
  const detectCameraMovement = () => {
    const currentPosition = camera.position;
    const hasPositionChanged =
      Math.abs(currentPosition.x - previousCameraPositionRef.current.x) > 0.001 ||
      Math.abs(currentPosition.y - previousCameraPositionRef.current.y) > 0.001 ||
      Math.abs(currentPosition.z - previousCameraPositionRef.current.z) > 0.001;

    previousCameraPositionRef.current.copy(currentPosition);
    return hasPositionChanged;
  };

  const [cameraSpringValues, setCameraSpring] = useSpring(() => ({
    cameraY: camera.position.y,
    theta: getOrbitAngle(camera.position),
    radius: camera.position.length(),
    targetPos: CAMERA_FOCUS.toArray(),
    config: {
      duration: TRANSITION_DURATION,
    },
    onStart: () => {
      console.log('🚀 Camera animation started');
      isAnimatingRef.current = true;
      if (controls) {
        controls.enabled = false; // Deshabilitar controles durante animación
        controls.minAzimuthAngle = -Infinity;
        controls.maxAzimuthAngle = Infinity;
        controls.minDistance = 0;
      }
    },
    onChange: ({ value }) => {
      console.log('📹 Camera animating:', {
        radius: value.radius,
        theta: value.theta,
        cameraY: value.cameraY,
        targetPos: value.targetPos,
      });
    },
    onRest: ({ value }) => {
      console.log('✅ Camera animation finished', value);
      isAnimatingRef.current = false;
      setControlEnabled(true);
      setIsContentShown(true);
      if (controls) {
        controls.enabled = true; // Re-habilitar controles
        if (value.radius !== DEFAULT_RADIAL_DISTANCE) {
          controls.minAzimuthAngle = convertThetaToAzimuthAngle(value.theta) - zoomThetaLimit;
          controls.maxAzimuthAngle = convertThetaToAzimuthAngle(value.theta) + zoomThetaLimit;
          controls.minDistance = zoomTargetRadius;
        } else {
          controls.minDistance = minZoom;
        }
      }
    },
  }));

  const handleClick = (index: number) => {
    console.log('🎯 handleClick called with index:', index);
    const pos = hotspotsPositions[index];
    console.log('📍 Hotspot position:', pos);

    const isHotspotClicked = index !== -1;
    const startRefPos = camera.position.clone();
    const startTheta = getOrbitAngle(startRefPos);

    const endRefPos = isHotspotClicked
      ? new Vector3(...pos.toArray()).setLength(pos.length() + zoomTargetRadius)
      : DEFAULT_CAMERA_POSITION;
    const endTheta = isHotspotClicked ? getOrbitAngle(endRefPos) : defaultTheta;
    const startTarget = hotspotsPositions[contentShownIndex] ?? CAMERA_FOCUS;
    const shortestWayAngles = getShortestWayAngles(startTheta, endTheta);

    console.log('🎬 Animation parameters:', {
      from: {
        cameraY: startRefPos.y,
        theta: shortestWayAngles[0],
        radius: startRefPos.length(),
      },
      to: {
        cameraY: endRefPos.y,
        theta: shortestWayAngles[1],
        radius: endRefPos.length(),
      },
    });

    setCameraSpring.start({
      from: {
        cameraY: startRefPos.y,
        theta: shortestWayAngles[0],
        radius: startRefPos.length(),
        targetPos: startTarget.toArray(),
      },
      to: {
        cameraY: endRefPos.y,
        theta: shortestWayAngles[1],
        radius: endRefPos.length(),
        targetPos: isHotspotClicked ? pos.toArray() : CAMERA_FOCUS.toArray(),
      },
    });

    setContentShownIndex(index);
    setControlEnabled(false);
    setIsContentShown(false);
    onZoom(isHotspotClicked);
  };

  // Aplicar valores del spring a la cámara en cada frame
  useFrame((_) => {
    // Aplicar animación de cámara si está activa
    if (isAnimatingRef.current && controls) {
      const radiusValue = cameraSpringValues.radius.get();
      const thetaValue = cameraSpringValues.theta.get();
      const cameraYValue = cameraSpringValues.cameraY.get();
      const targetPosValue = cameraSpringValues.targetPos.get();

      controls.target.set(targetPosValue[0], targetPosValue[1], targetPosValue[2]);
      animateCameraSpherically(radiusValue, thetaValue, cameraYValue, camera as PerspectiveCamera);

      // Type guard para asegurar que update existe
      if (controls.update) {
        controls.update();
      }
    }

    // Actualizar posiciones de hotspots cuando hay animación
    const isSceneAnimating = detectSceneAnimation();
    const isCameraMoving = detectCameraMovement();
    const isBeingAnimated =
      isSceneAnimating || isCameraMoving || isProductFloating || isAnimatingRef.current;

    if (isBeingAnimated) {
      setHotspotsPositions(getHotspotPositions(scene, outsideOfProductOffset));
    }
  });

  // Detectar cambio de vista (front -> right, etc.)
  useEffect(() => {
    const hasViewChanged = previousViewRef.current !== productView;
    const hasViewModeChanged = previousViewModeRef.current !== productViewMode;

    if ((hasViewChanged || hasViewModeChanged) && contentShownIndex !== -1) {
      resetHotspotsView();
    }

    previousViewRef.current = productView;
    previousViewModeRef.current = productViewMode;
  }, [productView, productViewMode]);

  // Actualizar posiciones cuando cambia la vista
  useEffect(() => {
    // Pequeño delay para permitir que la animación del producto termine
    const timeoutId = setTimeout(() => {
      setHotspotsPositions(getHotspotPositions(scene, outsideOfProductOffset));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [productView, productViewMode, scene]);

  const resetHotspotsView = () => {
    if (productViewMode === 'cameraAngle') {
      forceResetCamera();
    } else {
      handleClick(-1);
    }
  };

  const forceResetCamera = () => {
    setContentShownIndex(-1);
    setControlEnabled(true);
    setIsContentShown(false);
    onZoom(false);

    if (controls) {
      controls.target = CAMERA_FOCUS;
      controls.minAzimuthAngle = -Infinity;
      controls.maxAzimuthAngle = Infinity;
      controls.minDistance = minZoom;
    }
  };

  // Hotfix para bug de R3F
  const [allowGlobalOrbit, setAllowGlobalOrbit] = useState(true);

  return (
    <group
      scale={scale}
      onPointerMissed={(e) => {
        if (allowGlobalOrbit && hotspotsPositions[contentShownIndex]) {
          resetHotspotsView();
        }
      }}
    >
      {hotspotsData.map((hotspotData) => {
        const index = hotspotData.meshIndex ?? -1;
        return (
          hotspotsPositions[index] && (
            <HotspotButton
              key={`hotspot-${index}`}
              position={hotspotsPositions[index]}
              index={index}
              isChecked={index === contentShownIndex}
              onToggle={(check: boolean) => (check ? handleClick(index) : resetHotspotsView())}
              customButton={hotspotsConfig?.customButton}
            />
          )
        );
      })}
      <Html
        fullscreen
        wrapperClass={'hotspot-content__container'}
        calculatePosition={getModalAnchorOrigin}
        zIndexRange={hotspotContentZIndexRange}
      >
        {isContentShown && contentShownIndex !== -1 && (
          <h3>Aca otro hotspot!</h3>
          // <HotspotContent
          //     modalAnchor={hotspotsConfig.modalAnchor}
          //     imageSize={hotspotsConfig.imageSize}
          //     contentTextWidth={hotspotsConfig.contentTextWidth}
          //     hidden={!isContentShown}
          //     hotspotData={hotspotsData.find((hs) => hs.meshIndex === contentShownIndex) ?? {}}
          //   />
        )}
      </Html>
      {!controlEnabled && renderControlsOffHelper()}
    </group>
  );
}
