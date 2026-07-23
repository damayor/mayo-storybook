import { Camera, Object3D, PerspectiveCamera, Vector2, Vector3 } from 'three';
import {
  orbitMaxPolarAngle,
  orbitMinPolarAngle,
} from '../../non-stories-components/controls/controls.config';
import { DEFAULT_RADIAL_DISTANCE } from './constants/scene-constants';

export const CAMERA_FOCUS = new Vector3();
export const TRANSITION_DURATION = 1000;
export const defaultTheta = Math.PI / 2;
export const zoomTargetRadius = 1;
export const zoomThetaLimit = Math.PI / 4;
export const hotspotContentZIndexRange = [1100, 1000];

export const cameraMinYPosition = DEFAULT_RADIAL_DISTANCE * Math.cos(orbitMaxPolarAngle);
export const cameraMaxYPosition = DEFAULT_RADIAL_DISTANCE * Math.cos(orbitMinPolarAngle);

// export const contentSamplePath = '/mocks/copa-sense/hotspots.json'

export const getOrbitAngle = (cameraPosition: Vector3) => {
  const theta = Math.atan2(cameraPosition.z, cameraPosition.x);
  return theta < 0 ? theta + 2 * Math.PI : theta;
};

export const getShortestWayAngles = (startBeta: number, endBeta: number) => {
  const anglesDifference = Math.abs(endBeta - startBeta);
  const fixedStartBeta =
    anglesDifference > Math.PI && startBeta > Math.PI ? startBeta - 2 * Math.PI : startBeta;
  const fixedEndBeta =
    anglesDifference > Math.PI && endBeta > Math.PI ? endBeta - 2 * Math.PI : endBeta;
  return [fixedStartBeta, fixedEndBeta];
};

export const checkCameraPolarRange = (cameraY: number) =>
  cameraY < cameraMinYPosition || cameraY > cameraMaxYPosition
    ? cameraY < cameraMinYPosition
      ? cameraMinYPosition
      : cameraMaxYPosition
    : cameraY;

export const getCanvasCenter = (size: { width: number; height: number }) => {
  const widthHalf = size.width / 2;
  const heightHalf = size.height / 2;
  return new Vector2(widthHalf, heightHalf);
};

export const convertThetaToAzimuthAngle = (theta: number) => -theta + Math.PI / 2;

export const animateCameraSpherically = (
  radius: number,
  thetaAngle: number,
  cameraY: number,
  camera: PerspectiveCamera
) => {
  const radiusXZPlane = Math.sqrt(Math.pow(radius, 2) - Math.pow(cameraY, 2));
  const cameraRadialX = radiusXZPlane * Math.cos(thetaAngle);
  const cameraRadialZ = radiusXZPlane * Math.sin(thetaAngle);
  camera.position.set(cameraRadialX, cameraY, cameraRadialZ);
  camera.updateProjectionMatrix();
};

export const getModalAnchorOrigin = (
  el: Object3D,
  camera: Camera,
  size: { width: number; height: number }
) => {
  const center = getCanvasCenter(size);
  return [center.x, center.y];
};
