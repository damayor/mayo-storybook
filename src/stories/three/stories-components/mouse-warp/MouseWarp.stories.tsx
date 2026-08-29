import type { Meta, StoryObj } from '@storybook/react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';
import { MouseWarpDemo } from './MouseWarp';

const meta: Meta<typeof MouseWarpDemo> = {
  title: 'ThreeJs/Postprocessing/MouseWarp',
  component: MouseWarpDemo,
  argTypes: {
    mode: {
      control: { type: 'inline-radio' },
      options: ['funnel', 'lens'],
      description:
        'funnel = pushes UVs away from the cursor (image collapses inward — the original bug). lens = pulls UVs toward the cursor (magnifier / eye bulge).',
    },
    radius: {
      control: { type: 'range', min: 0.02, max: 0.8, step: 0.01 },
      description: 'Influence radius in aspect-corrected UV space',
    },
    strength: {
      control: { type: 'range', min: 0, max: 0.2, step: 0.001 },
      description: 'Max UV displacement',
    },
    wake: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: '0 = radially symmetric, 1 = full velocity wake bias (trail behind cursor)',
    },
  },
  decorators: [
    (Story) => (
      <MayoCanvas
        background="#111111"
        renderShadows={false}
        enableOrbitControls
        gizmoType="viewPort"
        overrideCameraPos={[-30, 0.5, 0]}
      >
        <Story />
      </MayoCanvas>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MouseWarpDemo>;

/** A circular magnifying lens that follows the cursor — readable without being cartoonish. */
export const EyeLens: Story = {
  args: { mode: 'lens', radius: 0.35, strength: 0.06, wake: 0 },
};

/** The original behaviour, kept for comparison — content is pinched inward. */
export const Funnel: Story = {
  args: { mode: 'funnel', radius: 0.3, strength: 0.05, wake: 1 },
};

/** Lens with the velocity wake enabled — the bulge smears behind the cursor as it moves. */
export const LensWithWake: Story = {
  args: { mode: 'lens', radius: 0.35, strength: 0.06, wake: 1 },
};
