// import { BaseInstance } from '@react-three/fiber/dist/declarations/src/core/renderer'
import { Vector3 } from 'three';

export type CopyWithOptional<T, K extends keyof T> = Omit<T, K> & Partial<T>;


export type GizmoType = 'none' | 'viewCube' | 'viewPort';

export type KeyToFunctionDictionaryType = { [key: string]: () => void };

export type ProductViewModeType = 'cameraAngle' | 'productOrientation';

export const productViews = ['right', 'left', 'back', 'front', 'top', 'bottom'] as const;

export type GlbCategory = 'main' | 'secondary';

export type ProductViewType = (typeof productViews)[number];

export interface HotspotPositionsDictionary {
  [key: string]: Vector3;
}

// export type R3FGroupType = Group & BaseInstance

export const hdriPresets = [
  'none',
  'city',
  'sunset',
  'dawn',
  'night',
  'warehouse',
  'forest',
  'apartment',
  'studio',
  'park',
  'lobby',
] as const;

export const lightingPackages = ['basic', 'pbr', 'hdri'] as const;

export const colorGradingTones = [
  'Warm weather',
  'Cold weather',
  'Desaturation',
  'Green matrix',
] as const;

export type HdriPresetType = (typeof hdriPresets)[number] | undefined;

export type LightingPackageType = (typeof lightingPackages)[number];

export type ColorGradingToneType = (typeof colorGradingTones)[number];

export type UiOptionsType = {
  enableHotspots: boolean;
};

export type CameraOptionsType = {
  azimuthAngle?: number;
};

export type GlbUrlsType = {
  mainGlbUrl: React.Dispatch<React.SetStateAction<string>>;
  secondaryGlbUrl: React.Dispatch<React.SetStateAction<string>>;
};

export type HotspotDataType = {
  header?: string;
  description?: string;
  imageUrl?: string;
  meshIndex?: number;
};

export type ModalAnchorType = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';

/** Tamaño de la miniatura del modal. Tres pasos fijos: no hay razón de producto
 *  para ofrecer un continuo de píxeles. */
export type HotspotImageSizeType = 'S' | 'M' | 'L';

export type HotspotsConfigType = {
  modalAnchor: ModalAnchorType;
  imageSize: HotspotImageSizeType;
};
