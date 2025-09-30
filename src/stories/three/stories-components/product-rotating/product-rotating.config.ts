import { Euler } from 'three'
import { type GizmoType } from '../../non-stories-components/helpers/types/commonTypes'

export const gizmoTypeConfig: GizmoType = 'viewCube'
export enum FootwearViews {
  FRONT = 'FRONT',
  BACK = 'BACK',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
}

// When enums were like legacy in TS: https://medium.com/@robmanganelly/farewell-to-enums-in-typescript-then-what-09dcbe987020
// type EnumLike<T> = T[keyof T];

// export const FootwearViews = {
//   FRONT : 0,
//   BACK : 1,
//   RIGHT : 2,
//   LEFT : 3,
//   TOP : 4,
//   BOTTOM: 5
// } as const;
// type TFootwearViews = EnumLike<typeof FootwearViews>;


export const lateralPosition = [0, 0.1, 0]
export const medialPosition = [0, 0, 0]
export const toePosition = [0, 0.2, 0]
export const heelPosition = [0, 0.2, 0]
export const topPosition = [0, 0.3, 0]
export const bottomPosition = [0, 0.3, 0]

export const lateralRotation = new Euler(-0.15, 0, 0)
export const medialRotation = new Euler(Math.PI / 4, Math.PI, 0)
export const toeRotation = new Euler(0.2, -Math.PI / 2, 0)
export const heelRotation = new Euler(0.2, Math.PI / 2, 0)
export const topRotation = new Euler(Math.PI / 4, 0, 0)
export const bottomRotation = new Euler(-Math.PI / 4, Math.PI, 0)

export function getProductRotation(view: FootwearViews) {
  switch (view) {
    case FootwearViews.FRONT:
      return lateralRotation
    case FootwearViews.BACK:
      return medialRotation
    case FootwearViews.RIGHT:
      return toeRotation
    case FootwearViews.LEFT:
      return heelRotation
    case FootwearViews.TOP:
      return topRotation
    case FootwearViews.BOTTOM:
      return bottomRotation
  }
}

export function getProductPosition(view: FootwearViews) {
  switch (view) {
    case FootwearViews.FRONT:
      return lateralPosition
    case FootwearViews.BACK:
      return medialPosition
    case FootwearViews.RIGHT:
      return toePosition
    case FootwearViews.LEFT:
      return heelPosition
    case FootwearViews.TOP:
      return topPosition
    case FootwearViews.BOTTOM:
      return bottomPosition
  }
}

export const springConfig = {
  mass: 10,
  tension: 82,
  friction: 37,
  precision: 0.001,
}
