import { Group, Vector3 } from 'three';
import type { HotspotPositionsDictionary } from '../types/commonTypes';

export function getHotspotPositions(scene: Group, sceneScale?: number) {
  return scene.children
    .filter((element) => element.name.includes('hotspot'))
    .reduce((accumulated, element) => {
      element.visible = false;
      const matches = /hotspot(?<index>\d+)/gi.exec(element.name);
      return matches?.groups?.index
        ? {
            ...accumulated,
            [matches.groups.index]: element
              .getWorldPosition(new Vector3())
              .multiplyScalar(sceneScale ?? 1),
          }
        : accumulated;
    }, {} as HotspotPositionsDictionary);
}
