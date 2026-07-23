import { Vector3 } from "three"
import { DEFAULT_RADIAL_DISTANCE } from "../../stories-components/hotspots/constants/scene-constants"

export const orbitMinPolarAngle = 0; //Math.PI / 4
export const orbitMaxPolarAngle = Math.PI / 1.4

export const enablePan = true
export const enableZoom = true

export const minZoom = 1.7
export const maxZoom = DEFAULT_RADIAL_DISTANCE

export const orbitTarget = new Vector3(0,-0.1,0)

