import { Group, Object3D, Vector3 } from 'three';
import type { HotspotPositionsDictionary } from '../types/commonTypes';

const HOTSPOT_NAME_PATTERN = /hotspot(?<index>\d+)/i;

/**
 * Recorre el grafo completo (no solo `scene.children`) buscando nodos llamados
 * `hotspotN` y devuelve su posición de mundo indexada por N.
 *
 * Los empties se ocultan salvo que `keepVisible` sea true — útil para depurar
 * que las posiciones coinciden con la geometría.
 */
export function getHotspotPositions(
  scene: Group | Object3D | undefined | null,
  sceneScale?: number,
  keepVisible = false
) {
  const positions: HotspotPositionsDictionary = {};
  if (!scene) return positions;

  // getWorldPosition depende de la matriz de mundo; si el nodo se acaba de
  // montar o el producto rotó en este frame, sin esto se leen valores viejos.
  scene.updateMatrixWorld(true);

  scene.traverse((element) => {
    const matches = HOTSPOT_NAME_PATTERN.exec(element.name);
    if (!matches?.groups?.index) return;

    element.visible = keepVisible;
    positions[matches.groups.index] = element
      .getWorldPosition(new Vector3())
      .multiplyScalar(sceneScale ?? 1);
  });

  return positions;
}
