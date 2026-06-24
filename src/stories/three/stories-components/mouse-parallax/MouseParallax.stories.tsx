import type { Meta, StoryObj } from '@storybook/react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';
import { MouseParallaxDemo } from './MouseParallax';

const meta: Meta<typeof MouseParallaxDemo> = {
  title: 'three/Postprocessing/MouseParallax',
  component: MouseParallaxDemo,
  argTypes: {
    lerp: {
      control: { type: 'range', min: 0.01, max: 1, step: 0.01 },
      description: 'Smoothing factor — 0 = frozen, 1 = instant snap',
    },
    strength: {
      control: { type: 'range', min: 0, max: 0.3, step: 0.001 },
      description: 'Max rotation in radians (~0.012 = subtle, ~0.15 = dramatic)',
    },
  },
  decorators: [
    (Story) => (
      <MayoCanvas background="#1a1a2e" enableOrbitControls={false}>
        <Story />
      </MayoCanvas>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MouseParallaxDemo>;

export const Snappy: Story = {
  args: {
    lerp: 1,
    strength: 0.266,
  },
};

export const Dramatic: Story = {
  args: {
    lerp: 0.06,
    strength: 0.15,
  },
};
