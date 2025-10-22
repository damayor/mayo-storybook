import { Vector3 } from "three"

export const marginX = 50
export const marginY = 50
export const gizmoAlignment = 'top-right'

export const ambientLightIntensity  = 1
export const spotLightIntensity  = 2
export const spotlightAngle = 1.57 
export const spotLightPenumbra = 0.5
export const spotLightPositionY = 1
export const spotLightPosition = new Vector3(0, spotLightPositionY, 1)

export const contactShadowsRotation = Math.PI / 2
export const contactShadowsPosition = new Vector3(0, -0.3, 0)
export const contactShadowsOpacity = 0.5
export const contactShadowsWidth = 2
export const contactShadowsHeight = 2
export const contactShadowsBlur = 0.5
export const contactShadowsFar = 5