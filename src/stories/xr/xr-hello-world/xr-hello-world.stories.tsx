import type { Meta, StoryObj } from '@storybook/react';
import AppXR from './AppXR';

const meta: Meta<typeof AppXR> = {
  title: 'XR/Experiences/Hello Drei-VR',
  component: AppXR,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Full WebXR VR scene ported from the standalone XR app (`pnpm xr:dev`). ' +
          'Uses @react-three/xr v4 APIs (Interactive, Controllers, VRButton). ' +
          'Enable the Immersive Web Emulator Chrome extension and click "Enter VR" to test inside Storybook. ' +
          'Known difference from the standalone app: the `XRWebGLBinding` delete patch in `main.tsx` ' +
          'does NOT run here — that is the first thing to check if the emulator fails to enter VR.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppXR>;

export const Default: Story = {};
