import { useGLTF } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import { CanvasTexture, Group } from 'three';
import { HOTSPOTS_SHOE_URL } from '../../helpers/constants/scene-constants';
import { useHotspotsData } from '../../non-stories-components/hooks/useHotspotsData';
import type { HotspotIndexLabelMode } from './hotspot-button/hotspot-button';
import {
  FootwearViews,
  getProductPosition,
  getProductRotation,
} from '../product-rotating/product-rotating.config';

import Hotspots from './hotspots';
import { defaultHotspotsConfiguration, TRANSITION_DURATION } from './hotspots.config';
import type {
  HotspotImageSizeType,
  HotspotsConfigType,
  ModalAnchorType,
} from '../../helpers/types/commonTypes';

/**
 * Producto + hotspots: monta el GLB de la zapatilla en su pose de presentación y
 * delega en `Hotspots` los pines, el modal y el viaje de cámara.
 *
 * El producto se queda quieto: es la cámara la que se traslada hasta ver el pin
 * en el centro del canvas. Rotar el zapato en su lugar no funcionaba —las
 * posiciones de mundo de los pines ya incluyen su rotación, así que el ángulo a
 * corregir salía siempre ~0 y el producto apenas se movía.
 *
 * El GLB, el contenido y la vista son fijos a propósito: esto es un demo de la
 * experiencia de hotspots, no un visor de productos configurable.
 */

/** Pose de presentación del producto. */
const PRODUCT_VIEW = FootwearViews.RIGHT;

export interface ProductWithHotspotsProps {
  /** Escala del producto. */
  scale?: number;
  /** Separación del botón respecto a la superficie del mesh. */
  hotspotOffset?: number;
  /** Duración del viaje de cámara, en ms. */
  transitionDuration?: number;
  /** Esquina del canvas donde se ancla el modal. */
  modalAnchor?: ModalAnchorType;
  /** Tamaño de la miniatura del modal. */
  imageSize?: HotspotImageSizeType;
  /** Cubos clicables sobre cada pin que reportan su posición por consola. */
  debugShowPinCubes?: boolean;
  /** Muestra el `meshIndex` en el botón. */
  indexLabel?: HotspotIndexLabelMode;
  /** Revela los pines del GLB que aún no tienen contenido. */
  showOrphanPins?: boolean;
}

export function ProductWithHotspots({
  scale = 8,
  hotspotOffset = 1.05,
  transitionDuration = TRANSITION_DURATION,
  modalAnchor = defaultHotspotsConfiguration.modalAnchor,
  imageSize = defaultHotspotsConfiguration.imageSize,
  debugShowPinCubes = false,
  indexLabel = 'none',
  showOrphanPins = false,
}: ProductWithHotspotsProps) {
  const { scenes } = useGLTF(HOTSPOTS_SHOE_URL);
  const productScene = scenes[0] as Group;
  const { data: hotspotsData } = useHotspotsData();

  // `getWorldPosition` solo es válido después de que el primitive esté montado;
  // sin esta bandera el primer render calcula todos los hotspots en el origen.
  const [isProductMounted, setIsProductMounted] = useState(false);
  useEffect(() => {
    setIsProductMounted(false);
    const frame = requestAnimationFrame(() => setIsProductMounted(true));
    return () => cancelAnimationFrame(frame);
  }, [productScene]);

  const rotation = useMemo(() => getProductRotation(PRODUCT_VIEW), []);
  const position = useMemo(() => getProductPosition(PRODUCT_VIEW), []);

  const { scene } = useThree();
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#000');
    gradient.addColorStop(1, '#111');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const tex = new CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  useEffect(() => {
    scene.background = texture;
  }, [scene, texture]);

  const hotspotsConfig: HotspotsConfigType = useMemo(
    () => ({ ...defaultHotspotsConfiguration, modalAnchor, imageSize }),
    [modalAnchor, imageSize]
  );

  return (
    <group>
      <primitive
        object={productScene}
        rotation={[rotation.x, rotation.y, rotation.z]}
        position={position}
        scale={scale}
      />
      {isProductMounted && (
        <Hotspots
          scene={productScene}
          hotspotsData={hotspotsData}
          hotspotsConfig={hotspotsConfig}
          hotspotOffset={hotspotOffset}
          transitionDuration={transitionDuration}
          debugShowPinCubes={debugShowPinCubes}
          indexLabel={indexLabel}
          showOrphanPins={showOrphanPins}
        />
      )}
    </group>
  );
}
