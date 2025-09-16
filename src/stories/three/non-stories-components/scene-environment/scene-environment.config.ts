import { Vector3 } from "three"

export const marginX = 50
export const marginY = 50
export const gizmoAlignment = 'top-right'

export const ambientLightIntensity  = 1
export const spotLightIntensity  = 2
export const spotlightAngle = 1.57 
export const spotLightPenumbra = 0.5
export const spotLightPositionY = 1
export const spotLightPosition = new Vector3(-20, spotLightPositionY, 20)

export const contactShadowsRotation = Math.PI / 2
export const contactShadowsPosition = new Vector3(0, -1, 0)
export const contactShadowsOpacity = 0.3
export const contactShadowsWidth = 10
export const contactShadowsHeight = 10
export const contactShadowsBlur = 2
export const contactShadowsFar = 2