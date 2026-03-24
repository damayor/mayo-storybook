import { type Meta, type StoryObj } from '@storybook/react'
import AudioInTerrainRender from './audio-renderer';
import type { Html } from '@react-three/drei';
import { Suspense } from 'react';
import { Vector3 } from 'three';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';

const meta = {
  title: 'Three/Experiences/AudioTerrain',
  component: AudioInTerrainRender,
  decorators: [
    (Story) => <MayoCanvas background='black' enableOrbitControls={true} environmentPreset='studio' gizmoType='viewCube' overrideCameraPos={new Vector3(0, 20, 3)}>
      <Suspense fallback={<mesh/>}>
        <Story/>
      </Suspense>
    </MayoCanvas>
  ],
  argTypes: {
    gizmoType: {
      options: ['none', 'viewCube', 'viewPort'],
      control: {
        type: 'select',
      },
    },
    lightPositionX: {
      control: { type: 'range', min: -30, max: 30, step: 1 },
    },
    lightPositionZ: {
      control: { type: 'range', min: -30, max: 40, step: 1 },
    },
  },
} satisfies Meta<typeof AudioInTerrainRender>


export default meta;
type Story = StoryObj<typeof meta>;
export const AudioTerrain: Story = {
  // args: {
  //   gizmoType: 'none',
  //   lightPositionX: -20,
  //   lightPositionZ: 40
  // }
};