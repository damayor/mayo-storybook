import { ProductModels, SHOE_URL } from '../../helpers/constants/scene-constants';
import type { Meta, StoryObj } from '@storybook/react';
import { FootwearViews } from '../product-rotating/product-rotating.config';
import { ProductHotspots } from './product-hotspots';
import { Suspense } from 'react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';
import { Html } from '@react-three/drei';
import { Vector3 } from 'three';

const meta = {
  title: 'ThreeJs/Experiences/HotspotsPDP',
  component: ProductHotspots,
  decorators: [
    (Story) => (
      <MayoCanvas
        enableOrbitControls={false}
        environmentPreset="studio"
        gizmoType="viewCube"
        overrideCameraPos={new Vector3(0, 1, 1.5)}
      >
        <Suspense fallback={<mesh />}>
          <Story />
          <Html position={[0, -4, 0]} center as="div">
            <p className="text-gray-300 text-xs text-center w-max">
              All 3D assets displayed are property of <b>adidas</b> and are used here only for
              demonstration purposes.
            </p>
          </Html>
        </Suspense>
      </MayoCanvas>
    ),
  ],
  argTypes: {
    cameraView: {
      options: Object.keys(FootwearViews),
      control: { type: 'select' },
    },
    glbUrl: {
      control: false,
      table: { disable: true },
    },
  },
} satisfies Meta<typeof ProductHotspots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HotspotsPDP: Story = {
  args: {
    cameraView: FootwearViews.LEFT,
    glbUrl: SHOE_URL,
  },
};
