import type { Meta, StoryObj } from '@storybook/react';
import { getProject } from '@theatre/core';
import { SheetProvider } from '@theatre/r3f';
import studio from '@theatre/studio';
import { ScrollControls } from '@react-three/drei';
import MayoCanvas from '../../../non-stories-components/mayo-canvas/mayo-canvas';
import { CameraPath } from './CameraPath';
import theatreState from './theatreState.json';

// usePersistentStorage: false — always load theatreState.json fresh instead of
// whatever Studio last persisted to the browser's local storage. Edit the file
// (or record in Studio + run getTheatreState()) and reload to see changes.
studio.initialize({ usePersistentStorage: false });
(window as any).studio = studio;

// Exports the per-project on-disk state in the format getProject(id, { state }) expects.
// studio.__experimental.createContentOfSaveFileTyped returns { definitionVersion, sheetsById, revisionHistory }
// — the exact shape Theatre.js validates. The old approach saved the full Studio event log, which breaks.
const getTheatreState = () => {
  const state = studio.__experimental.__experimental_createContentOfSaveFileTyped('BerlinTour');
  if (!state) {
    console.warn('No state found for project "BerlinTour" — add at least one keyframe first.');
    return null;
  }
  const json = JSON.stringify(state, null, 2);
  console.log(
    '%c Theatre.js state — paste into theatreState.json:',
    'color: cyan; font-weight: bold'
  );
  console.log(json);
  navigator.clipboard?.writeText(json).then(
    () => console.log('%c ✅ Copied to clipboard!', 'color: lime'),
    () => console.log('%c ⚠ Copy manually from the log above', 'color: orange')
  );
  return state;
};

// Expose on both the iframe window and the parent Storybook window so
// getTheatreState() works from the console regardless of which frame is targeted.
(window as any).getTheatreState = getTheatreState;
try {
  (window.parent as any).getTheatreState = getTheatreState;
} catch (_) {}

const sheet = getProject('BerlinTour', { state: theatreState }).sheet('Scene');

const meta: Meta<typeof CameraPath> = {
  title: 'three/Experiences/CameraPath',
  component: CameraPath,
  argTypes: {
    scrollMode: {
      control: 'select',
      options: ['native', 'page', 'none'],
      description:
        '"none" disables the scroll listener so the sequence can be scrubbed directly in the Theatre Studio panel.',
    },
  },
  decorators: [
    (Story) => (
      <MayoCanvas enableOrbitControls={false} background="#111111" renderShadows={false} fullscreen>
        <ScrollControls pages={6} damping={0.15}>
          <SheetProvider sheet={sheet}>
            <Story />
          </SheetProvider>
        </ScrollControls>
      </MayoCanvas>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CameraPath>;

export const Default: Story = {
  // 'none' while tuning keyframes/far in the Theatre Studio panel — a scroll
  // listener fights the timeline scrubber every frame. Switch to 'native' to
  // test scroll-driven playback.
  args: { scrollMode: 'none' },
};
