import { Html } from '@react-three/drei';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Group, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import {
  defaultHotspotsConfiguration,
  getCameraSpherical,
  getModalAnchorOrigin,
  getPositionFromSpherical,
  getSphericalAnglesFacingPin,
  hotspotContentZIndexRange,
  projectToCanvas,
  shortestAngleDelta,
  TRANSITION_DURATION,
} from './hotspots.config';

import { useSpring } from '@react-spring/three';

import type {
  HotspotDataType,
  HotspotsConfigType,
  HotspotPositionsDictionary,
} from '../../helpers/types/commonTypes';
import HotspotButton, { type HotspotIndexLabelMode } from './hotspot-button/hotspot-button';
import HotspotContent from './hotspot-content/hotspot-content';
import HotspotDebugCubes from './hotspot-debug-cubes';
import { outsideOfProductOffset as defaultOffset } from './hotspot-button/hotspot-button.config';
import { getHotspotPositions } from '../../helpers/functions/scene';

export interface HotspotProps {
  /** Group del GLB ya montado. Las posiciones se leen en espacio de mundo. */
  scene: Group;
  hotspotsData: HotspotDataType[];
  hotspotsConfig?: HotspotsConfigType;
  /** Separación del botón respecto a la superficie del mesh. */
  hotspotOffset?: number;
  /** Duración del viaje de cámara, en ms. */
  transitionDuration?: number;
  /**
   * Dibuja un cubo clicable sobre cada pin que, al pincharlo, cambia de color e
   * imprime en consola su posición 3D y su proyección en píxeles del canvas.
   */
  debugShowPinCubes?: boolean;
  /** Muestra el `meshIndex` en el botón: dentro, en una chapita, o nada. */
  indexLabel?: HotspotIndexLabelMode;
  /**
   * Renderiza también los pines del GLB que no tienen entrada en los datos.
   * El GLB puede traer más pines que contenido — esto los revela para poder
   * emparejar `meshIndex` mirando la escena.
   */
  showOrphanPins?: boolean;
}

export default function Hotspots({
  scene,
  hotspotsData,
  hotspotsConfig = defaultHotspotsConfiguration,
  hotspotOffset = defaultOffset,
  transitionDuration = TRANSITION_DURATION,
  debugShowPinCubes = false,
  indexLabel = 'none',
  showOrphanPins = false,
}: HotspotProps) {
  const { camera, size } = useThree();
  const controls = useThree((state) => state.controls) as any;

  const [selectedIndex, setSelectedIndex] = useState(-1);
  // El modal solo aparece cuando el viaje terminó y el pin ya está en el centro.
  const [isPinCentered, setIsPinCentered] = useState(false);
  // Los empties del GLB se dejan SIEMPRE ocultos: el modo debug dibuja sus
  // propios cubos sobre las posiciones ya calculadas, y revelar también los
  // originales pintaría dos cosas distintas en el mismo sitio.
  const [hotspotsPositions, setHotspotsPositions] = useState<HotspotPositionsDictionary>(() =>
    getHotspotPositions(scene, hotspotOffset)
  );

  // Se compara contra el dict vigente para no re-renderizar cuando nada se movió.
  const positionsRef = useRef(hotspotsPositions);
  positionsRef.current = hotspotsPositions;

  // Mientras la cámara viaja es el spring quien la mueve; el evento `start` de
  // OrbitControls se dispara igual, y sin esta bandera se cerraría el modal a sí
  // mismo en cuanto empieza la animación.
  const isAnimatingRef = useRef(false);

  const controlsRef = useRef(controls);
  controlsRef.current = controls;

  const cameraRef = useRef(camera);
  cameraRef.current = camera;

  // El radio se congela al arrancar el viaje: la cámara recorre la superficie de
  // una esfera, no una recta entre dos puntos.
  const orbitRadiusRef = useRef(0);

  const [, setCameraSpring] = useSpring(() => ({
    // Se interpolan ÁNGULOS, no posiciones. Interpolar posiciones en línea recta
    // atraviesa la esfera y acerca la cámara al zapato a mitad de camino.
    from: { theta: 0, phi: 0 },
    config: { duration: transitionDuration },
    onChange: ({ value }) => {
      const activeCamera = cameraRef.current;
      const activeControls = controlsRef.current;
      if (!activeControls?.target) return;

      activeCamera.position.copy(
        getPositionFromSpherical(
          value.theta,
          value.phi,
          orbitRadiusRef.current,
          activeControls.target
        )
      );

      // La cámara mira SIEMPRE al centro de órbita; eso es lo que deja el pin
      // —que está sobre ese mismo rayo— clavado en el centro del canvas.
      //
      // Sin `update()` a propósito: OrbitControls recalcularía la posición desde
      // su propio estado interno y pelearía con el spring, tirando de la cámara
      // hacia el producto. Se sincroniza una sola vez, al terminar.
      activeCamera.lookAt(activeControls.target);
    },
    onRest: () => {
      isAnimatingRef.current = false;
      // Ahora sí: OrbitControls reabsorbe la posición final como suya, para que
      // el siguiente arrastre del usuario parta de donde quedó la cámara.
      controlsRef.current?.update?.();
      setIsPinCentered(true);
    },
  }));

  /**
   * Orbita la cámara hasta ver el pin en el centro del canvas.
   *
   * El destino son los ángulos del vector centro→pin; el radio se mantiene
   * exactamente el que la cámara ya tenía, así que el zoom del usuario se
   * respeta y el recorrido es un arco sobre la esfera, sin acercarse.
   */
  const focusHotspot = useCallback(
    (index: number) => {
      const pinPosition = positionsRef.current[index];
      const activeControls = controlsRef.current;
      if (!pinPosition || !activeControls?.target) return;

      const orbitTarget = activeControls.target as Vector3;
      const destination = getSphericalAnglesFacingPin(pinPosition, orbitTarget);
      if (!destination) return;

      const current = getCameraSpherical(camera.position, orbitTarget);
      orbitRadiusRef.current = current.radius;

      isAnimatingRef.current = true;
      setCameraSpring.start({
        from: { theta: current.theta, phi: current.phi },
        to: {
          // Por el camino corto: sumar el delta en vez de saltar al ángulo
          // absoluto evita que la cámara dé la vuelta larga cruzando ±π.
          theta: current.theta + shortestAngleDelta(current.theta, destination.theta),
          phi: destination.phi,
        },
      });
    },
    [camera, setCameraSpring]
  );

  const handleSelect = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      setIsPinCentered(false);
      if (index !== -1) focusHotspot(index);
    },
    [focusHotspot]
  );

  /**
   * Orbitar cierra el modal.
   *
   * El modal se dibuja anclado a una esquina del canvas y traza una línea hasta
   * el CENTRO exacto — donde la cámara dejó el pin. En cuanto el usuario mueve
   * la cámara ese punto deja de ser el pin, así que el modal se retira en vez de
   * quedarse señalando un sitio vacío.
   */
  useEffect(() => {
    if (!controls) return;
    const handleOrbitStart = () => {
      // El propio viaje de cámara dispara `start`: no debe cerrarse solo.
      if (isAnimatingRef.current) return;
      setSelectedIndex(-1);
      setIsPinCentered(false);
    };
    controls.addEventListener('start', handleOrbitStart);
    return () => controls.removeEventListener('start', handleOrbitStart);
  }, [controls]);

  /** Refresca el dict solo si alguna posición cambió de verdad. */
  const syncPositions = useCallback(() => {
    const next = getHotspotPositions(scene, hotspotOffset);
    const previous = positionsRef.current;

    const previousKeys = Object.keys(previous);
    const nextKeys = Object.keys(next);
    const hasSameShape =
      previousKeys.length === nextKeys.length &&
      nextKeys.every((key) => previous[key] && previous[key].distanceToSquared(next[key]) < 1e-8);

    if (!hasSameShape) setHotspotsPositions(next);
  }, [hotspotOffset, scene]);

  // El producto se orienta con un spring fuera de React, así que las posiciones
  // de mundo hay que muestrearlas por frame; syncPositions corta el re-render
  // cuando nada cambió.
  useFrame(syncPositions);

  // Avisa del desajuste entre pines del GLB y entradas de datos — es silencioso
  // de otro modo, y es la causa habitual de "el botón no aparece".
  useEffect(() => {
    const pinIndices = Object.keys(hotspotsPositions).map(Number);
    if (!pinIndices.length) {
      console.warn('[hotspots] el GLB no expone ningún nodo `hotspotN`.');
      return;
    }

    const dataIndices = hotspotsData.map((hotspot) => hotspot.meshIndex ?? -1);
    const missingContent = pinIndices.filter((index) => !dataIndices.includes(index));
    const missingPin = dataIndices.filter((index) => !hotspotsPositions[index]);

    if (missingContent.length) {
      console.info(
        `[hotspots] pines sin contenido: ${missingContent.join(', ')}. ` +
          'Usa `showOrphanPins` para verlos en la escena.'
      );
    }
    if (missingPin.length) {
      console.warn(`[hotspots] meshIndex sin pin en el GLB: ${missingPin.join(', ')}.`);
    }
  }, [hotspotsData, hotspotsPositions]);

  // Al terminar el viaje, deja por consola cuánto se desvió el pin del centro.
  // Es la comprobación de que la geometría del encuadre es correcta.
  useEffect(() => {
    if (!debugShowPinCubes || !isPinCentered || selectedIndex === -1) return;
    const pinPosition = positionsRef.current[selectedIndex];
    if (!pinPosition) return;

    const screen = projectToCanvas(pinPosition, camera, size);
    console.log(
      `[hotspots] pin ${selectedIndex} centrado — desviación del centro:`,
      `${Math.round(screen.x - size.width / 2)}px, ${Math.round(screen.y - size.height / 2)}px`
    );
  }, [camera, debugShowPinCubes, isPinCentered, selectedIndex, size]);

  const activeHotspot = useMemo(
    () => hotspotsData.find((hotspot) => hotspot.meshIndex === selectedIndex),
    [hotspotsData, selectedIndex]
  );

  /**
   * Un pin del GLB y una entrada de datos son cosas distintas: el mesh puede
   * traer 8 pines y los datos cubrir solo 5. Se renderiza un botón por cada
   * entrada con pin existente; con `showOrphanPins`, también los pines sueltos
   * (sin contenido) para poder emparejar índices mirando la escena.
   */
  const renderableHotspots = useMemo(() => {
    const withContent = hotspotsData
      .map((hotspotData) => ({ index: hotspotData.meshIndex ?? -1, hasContent: true }))
      .filter(({ index }) => hotspotsPositions[index]);

    if (!showOrphanPins) return withContent;

    const claimed = new Set(withContent.map(({ index }) => index));
    const orphans = Object.keys(hotspotsPositions)
      .map(Number)
      .filter((index) => !claimed.has(index))
      .map((index) => ({ index, hasContent: false }));

    return [...withContent, ...orphans].sort((a, b) => a.index - b.index);
  }, [hotspotsData, hotspotsPositions, showOrphanPins]);

  const isContentShown = isPinCentered && !!activeHotspot;

  return (
    <group
      onPointerMissed={() => {
        if (selectedIndex !== -1) handleSelect(-1);
      }}
    >
      {renderableHotspots.map(({ index }) => (
        <HotspotButton
          key={`hotspot-${index}`}
          position={hotspotsPositions[index]}
          index={index}
          isChecked={index === selectedIndex}
          indexLabel={indexLabel}
          onToggle={(checked: boolean) => handleSelect(checked ? index : -1)}
        />
      ))}

      {debugShowPinCubes && (
        <HotspotDebugCubes positions={hotspotsPositions} selectedIndex={selectedIndex} />
      )}

      <Html
        fullscreen
        wrapperClass="hotspot-content__container"
        calculatePosition={getModalAnchorOrigin}
        zIndexRange={hotspotContentZIndexRange}
      >
        {isContentShown && (
          <HotspotContent
            modalAnchor={hotspotsConfig.modalAnchor}
            imageSize={hotspotsConfig.imageSize}
            hotspotData={activeHotspot}
          />
        )}
      </Html>
    </group>
  );
}
