import { Suspense, useState } from 'react';
import { button, useControls } from 'leva';

import TerrainLegacy from './terrain-legacy.component';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';

export const TerrainLegacyManager = () => {
  const [seed, setSeed] = useState(Date.now());

  const { resolution, height, levels, scale } = useControls({
    generate: button(() => setSeed(Date.now())),
    resolution: { value: 100, min: 10, max: 200, step: 1 },
    height: { value: 0.12, min: 0, max: 1 },
    levels: { value: 2 , min: 1, max: 16, step: 1 },
    scale: { value: 14, min: 1, max: 16, step: 1 },
  });

  return (
    <MayoCanvas enableOrbitControls={true} environmentPreset='studio' gizmoType={'viewPort'}>
      <Suspense fallback={<mesh />}>
        <TerrainLegacy
          // seed={seed}
          size={resolution}
          height={height}
          levels={levels}
          scale={scale}
        />
        
      </Suspense>
    </MayoCanvas>

  );
};

export default TerrainLegacyManager;
