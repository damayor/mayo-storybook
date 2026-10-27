import { getProject } from '@theatre/core';
import { SheetProvider } from '@theatre/r3f';
import MayoCanvas from '../../stories/three/non-stories-components/mayo-canvas/mayo-canvas';
import {
  CameraPath,
  type ScrollMode,
} from '../../stories/three/stories-components/experiences/camera-path/CameraPath';
import theatreState from '../../stories/three/stories-components/experiences/camera-path/theatreState.json';

// theatreState.json must be re-exported via getTheatreState() in Storybook after any keyframe edit.
// studio.__experimental.__experimental_createContentOfSaveFileTyped('BerlinTour') gives the correct format.
export const sheet = getProject('BerlinTour', { state: theatreState }).sheet('Scene');

interface CameraPathBackgroundProps {
  onLoaded?: () => void;
  // 'none' lets an external driver (scripts/render-bg-video.mjs) scrub sheet.sequence.position
  scrollMode?: ScrollMode;
}

export function CameraPathBackground({
  onLoaded,
  scrollMode = 'page',
}: CameraPathBackgroundProps = {}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100lvh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <MayoCanvas fullscreen background="#111111" renderShadows={false} enableOrbitControls={false}>
        <fog attach="fog" args={['#111122', 200, 900]} />
        <SheetProvider sheet={sheet}>
          <CameraPath
            scrollMode={scrollMode}
            interactive={scrollMode !== 'none'}
            onLoaded={onLoaded}
          />
        </SheetProvider>
      </MayoCanvas>
    </div>
  );
}

export default CameraPathBackground;
