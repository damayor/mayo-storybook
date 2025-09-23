import { Suspense } from 'react';

import Terrain from './terrain.component';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';

export const TerrainManager = () => {

  return (
    <MayoCanvas enableOrbitControls={true} environmentPreset='studio' gizmoType={'viewPort'}>
      <Suspense fallback={<mesh />}>
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <Terrain />
      </Suspense>
    </MayoCanvas>

  );
};

export default TerrainManager;
