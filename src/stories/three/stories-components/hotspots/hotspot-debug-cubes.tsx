import { useThree } from '@react-three/fiber';
import { useCallback, useState } from 'react';
import { Vector3 } from 'three';
import { projectToCanvas } from './hotspots.config';
import type { HotspotPositionsDictionary } from '../../helpers/types/commonTypes';

const IDLE_COLOR = '#22d3ee';
const PICKED_COLOR = '#f43f5e';
const CUBE_SIZE = 0.06;

interface HotspotDebugCubesProps {
  positions: HotspotPositionsDictionary;
  /** Índice seleccionado por la experiencia, para contrastarlo con el clicado. */
  selectedIndex: number;
}

/**
 * Cubos clicables sobre cada pin, solo para depurar el anclaje.
 *
 * Los empties `hotspotN` del GLB son invisibles y no tienen geometría propia que
 * se pueda picar, así que esto dibuja un cubo real en la posición de mundo que
 * `getHotspotPositions` devolvió — es decir, verifica exactamente el número que
 * usa el resto de la experiencia, no el nodo original.
 *
 * Al hacer clic, el cubo cambia de color e imprime en consola su posición 3D y
 * su proyección en píxeles del canvas. Si un pin está bien centrado, esos
 * píxeles deben coincidir con el centro del canvas.
 */
export default function HotspotDebugCubes({ positions, selectedIndex }: HotspotDebugCubesProps) {
  const { camera, size } = useThree();
  const [pickedIndex, setPickedIndex] = useState(-1);

  const logHotspot = useCallback(
    (index: number, position: Vector3) => {
      const screen = projectToCanvas(position, camera, size);
      const center = { x: size.width / 2, y: size.height / 2 };

      console.log(`%c[hotspot ${index}]`, `color:${PICKED_COLOR};font-weight:bold`, {
        mundo3D: {
          x: +position.x.toFixed(4),
          y: +position.y.toFixed(4),
          z: +position.z.toFixed(4),
        },
        canvas2D: { x: Math.round(screen.x), y: Math.round(screen.y) },
        centroCanvas: center,
        // Lo que de verdad interesa: cuán lejos del centro quedó el pin. Si la
        // experiencia dice que está centrado, esto debería ser ~0.
        desviacionPx: {
          x: Math.round(screen.x - center.x),
          y: Math.round(screen.y - center.y),
        },
        detrasDeLaCamara: screen.isBehindCamera,
        seleccionadoEnLaExperiencia: selectedIndex === index,
      });
    },
    [camera, selectedIndex, size]
  );

  return (
    <group>
      {Object.entries(positions).map(([key, position]) => {
        const index = Number(key);
        return (
          <mesh
            key={`debug-cube-${key}`}
            position={position}
            onClick={(event) => {
              // Sin esto el clic atraviesa y dispara también los cubos de detrás.
              event.stopPropagation();
              setPickedIndex(index);
              logHotspot(index, position);
            }}
          >
            <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
            <meshBasicMaterial
              color={pickedIndex === index ? PICKED_COLOR : IDLE_COLOR}
              // Se ven a través del zapato: si un cubo quedara oculto por la
              // geometría no habría forma de clicarlo para depurarlo.
              depthTest={false}
              transparent
              opacity={0.85}
            />
          </mesh>
        );
      })}
    </group>
  );
}
