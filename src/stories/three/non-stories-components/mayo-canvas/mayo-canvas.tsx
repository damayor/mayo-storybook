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
  // overrideCameraRot = undefined,
  renderShadows = true,
  fullscreen = false,
}: MayoCanvasProps) {
  const containerStyle = fullscreen
     ? { width: '100%', height: '100%' }
    // ? { width: '100vw', height: '100vh' }
    : { width: '800px', height: '600px', border: '1px solid black' };

  return (
    <div style={containerStyle}>
      <Canvas
        camera={{ position: overrideCameraPos ?? DEFAULT_CAMERA_POSITION, fov: DEFAULT_CAMERA_FOV }}
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
