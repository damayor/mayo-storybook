import { Vector3 } from 'three';
// import { getGLTFModelURL } from '../functions/cloudinary-utils'
import hotspotsCopaJson from '../../../non-stories-components/mocks/hotspots.json';

export const PRODUCT_SCALE_FACTOR = 9;

export const DEFAULT_CAMERA_POSITION = new Vector3(0, 0, 5);
export const DEFAULT_RADIAL_DISTANCE = DEFAULT_CAMERA_POSITION.length();
export const DEFAULT_CAMERA_FOV = 45;

export const hotspotsCopaData = hotspotsCopaJson;
