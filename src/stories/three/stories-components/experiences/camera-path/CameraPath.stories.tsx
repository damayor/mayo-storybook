import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { getProject } from '@theatre/core';
import { SheetProvider } from '@theatre/r3f';
import type StudioType from '@theatre/studio';
import { ScrollControls } from '@react-three/drei';
import MayoCanvas from '../../../non-stories-components/mayo-canvas/mayo-canvas';
import { CameraPath } from './CameraPath';
import theatreState from './theatreState.json';

// The camera path is already recorded in theatreState.json, so Studio is OFF by default.
// Storybook bundles every story into the same page: initializing Studio at module scope
// injected its toolbar into *all* stories permanently. Flip this to true (or add
// ?theatre=1 to the Storybook URL) only when re-recording keyframes.
const ENABLE_STUDIO = new URLSearchParams(window.location.search).has('theatre');

let studio: typeof StudioType | null = null;

// Lazily imported so @theatre/studio never even loads unless we're editing.
const initStudio = async () => {
  if (studio) return;
  // usePersistentStorage: false — always load theatreState.json fresh instead of
  // whatever Studio last persisted to the browser's local storage.
  const mod = await import('@theatre/studio');
  studio = mod.default;
  studio.initialize({ usePersistentStorage: false });
  (window as any).studio = studio;
};

// Exports the per-project on-disk state in the format getProject(id, { state }) expects.
// studio.__experimental.createContentOfSaveFileTyped returns { definitionVersion, sheetsById, revisionHistory }
// — the exact shape Theatre.js validates. The old approach saved the full Studio event log, which breaks.
const getTheatreState = () => {
  if (!studio) {
    console.warn('Theatre Studio is not running — open this story with ?theatre=1 in the URL.');
    return null;
  }
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

// Studio's toolbar lives in a portal on document.body, outside React's tree, so it
// survives story navigation. Hiding it on unmount keeps other stories clean —
// Theatre has no public teardown, and re-initializing after one would throw.
const StudioLifecycle = () => {
  useEffect(() => {
    if (!ENABLE_STUDIO) return;
    let cancelled = false;
    initStudio().then(() => {
      if (!cancelled) studio?.ui.restore();
    });
    return () => {
      cancelled = true;
      studio?.ui.hide();
    };
  }, []);
  return null;
};

const meta: Meta<typeof CameraPath> = {
  title: 'ThreeJs/Experiences/CameraPath',
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
      <>
        <StudioLifecycle />
        <MayoCanvas
          enableOrbitControls={false}
          background="#111111"
          renderShadows={false}
          fullscreen
        >
          <ScrollControls pages={6} damping={0.15}>
            <SheetProvider sheet={sheet}>
              <Story />
            </SheetProvider>
          </ScrollControls>
        </MayoCanvas>
      </>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CameraPath>;

export const Default: Story = {
  // 'none' while tuning keyframes/far in the Theatre Studio panel — a scroll
  // listener fights the timeline scrubber every frame. Switch to 'native' to
  // test scroll-driven playback.
  args: { scrollMode: 'native' },
};
