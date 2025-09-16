// import { BaseInstance } from "@react-three/fiber/dist/declarations/src/core/renderer"
import { Object3D } from "three"

export type GizmoType = 'none' | 'viewCube' | 'viewPort'

export type KeyToFunctionDictionaryType = { [key: string]: () => void }

export type numberOfPdpViews = 0 | 1 | 2 | 3 | 4 | 5
//This is assuming that there will always 6 product views on pdp. If that changes, better to simply use number and delete this type

//ToDo Uncomment when install types of fiber: export type R3FObject3DType = Object3D & BaseInstance