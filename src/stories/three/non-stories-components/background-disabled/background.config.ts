import * as THREE from 'three'
import { Vector3, Color } from 'three'
// import { BackgroundProps } from './background'

export const bufferGeometry = new THREE.IcosahedronGeometry(1.5) //editeds
export const geometryPosition = new Vector3(0, 0.4, 0)
export const geometryScale = 0.7
export const metalness = 1
export const roughness = 0.5
export const emmisive = new Color(0x001166)

export const setCanvasBackground = ({
  backgroundColor,
  gradientFirstColor,
  gradientSecondColor = 'white',
  gradientDirection = 45,
  gradientRatio = 50,
}: any) => {
  return backgroundColor || gradientFirstColor
    ? backgroundColor
      ? {
          background: backgroundColor,
        }
      : {
          backgroundImage: `linear-gradient( ${gradientDirection}deg, 
            ${gradientFirstColor}, ${gradientSecondColor} ${gradientRatio}%)`,
        }
    : {}
}
