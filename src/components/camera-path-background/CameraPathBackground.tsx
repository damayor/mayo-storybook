import { getProject } from '@theatre/core';
import { SheetProvider } from '@theatre/r3f';
import MayoCanvas from '../../stories/three/non-stories-components/mayo-canvas/mayo-canvas';
import { CameraPath } from '../../stories/three/stories-components/experiences/camera-path/CameraPath';
import theatreState from '../../stories/three/stories-components/experiences/camera-path/theatreState.json';
import type { EffectComposer } from 'postprocessing';
import { ThreePostprocessingEffects } from '../../stories/three/stories-components/postprocessing/ThreePostprocessing';

// theatreState.json must be re-exported via getTheatreState() in Storybook after any keyframe edit.
// studio.__experimental.__experimental_createContentOfSaveFileTyped('BerlinTour') gives the correct format.
const sheet = getProject('BerlinTour', { state: theatreState }).sheet('Scene');

export function CameraPathBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <MayoCanvas fullscreen background="#111111" renderShadows={false} enableOrbitControls={false}>
        <fog attach="fog" args={['#111122', 200, 900]} />
        <SheetProvider sheet={sheet}>
          <CameraPath scrollMode="page" />
        </SheetProvider>
        {/* ToDo */}
        {/* <EffectComposer multisampling={0}>
          <ThreePostprocessingEffects />
        </EffectComposer> */}
      </MayoCanvas>
    </div>
  );
}

export default CameraPathBackground;
