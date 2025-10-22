import { Vector3 } from 'three'

export const DEFAULT_CAMERA_POSITION = new Vector3(0, 4, 6)
export const DEFAULT_CAMERA_FOV = 45

export const HOTSPOTS_TORUS_URL = 'src/gltf/torus.glb'
export const SHOE_COPA_URL = 'src/gltf/copa.glb'
export const HOTSPOTS_SHOE_URL = 'src/gltf/HotspotsShoe.glb'
export const SHOE_URL = 'src/gltf/FX6167_3DFTWRIGHT_3.glb'
export const PS4_CONTROLLER_URL = 'src/gltf/PS4_controller.glb'
export const HEADPHONE_URL = 'src/gltf/Headphone.glb'
export const IPHONE_URL = 'src/gltf/iphone_3.glb' 

export const ProductModels = {
  default: SHOE_URL,
  copa:SHOE_COPA_URL,
  hotspots:HOTSPOTS_SHOE_URL,
  PS4: PS4_CONTROLLER_URL,
  Headphone: HEADPHONE_URL,
  Iphone: IPHONE_URL
}