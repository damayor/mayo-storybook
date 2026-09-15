import { Camera, Object3D, Spherical, Vector2, Vector3 } from 'three';
import type { HotspotsConfigType } from '../../helpers/types/commonTypes';

export const CAMERA_FOCUS = new Vector3();
export const TRANSITION_DURATION = 1000;
export const hotspotContentZIndexRange = [1100, 1000];

export const defaultHotspotsConfiguration: HotspotsConfigType = {
  imageSize: 'M',
  modalAnchor: 'top-left',
};


/**
 * Ángulos esféricos (respecto al centro de órbita) desde los que se ve un punto
 * en el centro del canvas.
 *
 * El viaje se interpola en ÁNGULOS, no en posiciones: interpolar de un punto a
 * otro en línea recta atraviesa la esfera y acerca la cámara al producto por el
 * camino — de ahí el "se acerca mucho" a mitad de animación. Girando theta y phi
 * a radio constante, la cámara recorre la superficie de la esfera y mantiene
 * siempre la misma distancia.
 *
 *            pin
 *      ·······●········ → cámara (mismo rayo, a `radius` del centro)
 *     ╱
 *   ◎ centro de órbita
 *
 * @param pinWorldPosition posición de mundo del cubo `hotspotN`
 * @param orbitTarget centro de órbita de OrbitControls (a donde mira la cámara)
 */
export const getSphericalAnglesFacingPin = (pinWorldPosition: Vector3, orbitTarget: Vector3) => {
  const directionToPin = pinWorldPosition.clone().sub(orbitTarget);

  // Un pin exactamente en el centro no define dirección alguna; se deja la
  // cámara donde está en vez de mandarla a NaN.
  if (directionToPin.lengthSq() < 1e-8) return null;

  const spherical = new Spherical().setFromVector3(directionToPin);
  return { theta: spherical.theta, phi: spherical.phi };
};

/** Ángulos esféricos actuales de la cámara respecto al centro de órbita. */
export const getCameraSpherical = (cameraPosition: Vector3, orbitTarget: Vector3) => {
  const spherical = new Spherical().setFromVector3(cameraPosition.clone().sub(orbitTarget));
  return { theta: spherical.theta, phi: spherical.phi, radius: spherical.radius };
};

/** Posición de mundo para unos ángulos esféricos y un radio dados. */
export const getPositionFromSpherical = (
  theta: number,
  phi: number,
  radius: number,
  orbitTarget: Vector3
) => new Vector3().setFromSpherical(new Spherical(radius, phi, theta)).add(orbitTarget);

/**
 * Lleva un ángulo a (-π, π] para que el giro tome siempre el camino corto.
 * Sin esto, ir de 350° a 10° recorrería 340° en vez de 20°.
 */
export const shortestAngleDelta = (from: number, to: number) => {
  const wrapped = (((to - from + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return wrapped - Math.PI;
};

export const getCanvasCenter = (size: { width: number; height: number }) => {
  const widthHalf = size.width / 2;
  const heightHalf = size.height / 2;
  return new Vector2(widthHalf, heightHalf);
};

/**
 * Proyecta una posición de mundo a píxeles del canvas.
 *
 * Solo se usa para depurar: sirve para comprobar a ojo que un pin "centrado"
 * cae de verdad en el centro del canvas y no a 200px de él.
 */
export const projectToCanvas = (
  worldPosition: Vector3,
  camera: Camera,
  size: { width: number; height: number }
) => {
  const ndc = worldPosition.clone().project(camera);
  return {
    x: ((ndc.x + 1) / 2) * size.width,
    y: ((1 - ndc.y) / 2) * size.height,
    // z en NDC > 1 significa que el punto quedó detrás de la cámara.
    isBehindCamera: ndc.z > 1,
  };
};

// El modal es fullscreen: se ancla al centro del canvas, no a la proyección del
// objeto. Drei exige la firma completa de calculatePosition.
export const getModalAnchorOrigin = (
  _el: Object3D,
  _camera: Camera,
  size: { width: number; height: number }
) => {
  const center = getCanvasCenter(size);
  return [center.x, center.y];
};
