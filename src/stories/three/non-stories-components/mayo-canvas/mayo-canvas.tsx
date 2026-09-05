import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import {
  DEFAULT_CAMERA_FOV,
  DEFAULT_CAMERA_POSITION,
} from '../../helpers/constants/scene-constants';

import Controls from '../controls/controls.component';
import Gizmos from '../gizmos/gizmos.component';
import SceneEnvironment from '../scene-environment/scene-environment.component';
import type { GizmoType } from '../../helpers/types/commonTypes';
import { setCanvasBackground } from '../../stories-components/homogeneus-background/background.config';

interface MayoCanvasProps {
  children: React.ReactNode;
  enableOrbitControls?: boolean;
  environmentPreset?: 'studio';
  gizmoType?: GizmoType;
  lightPosition?: Vector3;
  background?: string;
  overrideCameraPos?: Vector3 | [number, number, number];
  /**
   * Initial camera rotation in radians, as [pitch, yaw, roll] (Euler XYZ order).
   * Think of the camera as an airplane flying toward -Z with +Y as up:
   *  - pitch (x): nose up/down. Positive tips the nose UP (looks toward the sky).
   *  - yaw   (y): nose left/right. Positive turns the nose LEFT (counter-clockwise from above).
   *  - roll  (z): banking. Positive banks the LEFT wing down (rolls counter-clockwise looking down -Z).
   * All angles in radians (Math.PI = 180°). Order matters: rotations apply x, then y, then z.
   */
  overrideCameraRot?: [number, number, number];
  renderShadows?: boolean;
  fullscreen?: boolean;
}

export default function MayoCanvas({
  children,
  enableOrbitControls = false,
  gizmoType = 'none',
  lightPosition,
  background = '#ffffff',
  overrideCameraPos = undefined,
  overrideCameraRot = undefined,
  renderShadows = true,
  fullscreen = false,
}: MayoCanvasProps) {
  // `width/height: 100%` only fills the immediate parent — if any ancestor up
  // to <body> doesn't propagate height:100%, it collapses. `position: fixed;
  // inset: 0` anchors to the viewport directly instead, regardless of the
  // ancestor chain.
  const containerStyle = fullscreen
    ? { position: 'fixed' as const, inset: 0 }
    : { width: '800px', height: '600px', border: '1px solid black' };

  return (
    <div style={containerStyle}>
      <Canvas
        camera={{
          position: overrideCameraPos ?? DEFAULT_CAMERA_POSITION,
          rotation: overrideCameraRot,
          fov: DEFAULT_CAMERA_FOV,
        }}
        gl={{ antialias: false }}
      >
        <color attach="background" args={[background]} />
        <SceneEnvironment lightPosition={lightPosition} renderShadows={renderShadows} />
        {enableOrbitControls && <Controls />}
        <Gizmos gizmoType={gizmoType} />
        {children}
      </Canvas>
    </div>
  );
}
