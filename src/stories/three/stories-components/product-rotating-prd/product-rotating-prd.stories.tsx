import { ProductModels, SHOE_URL } from '../../helpers/constants/scene-constants';
import type { Meta, StoryObj } from '@storybook/react';
import { FootwearViews } from '../product-rotating/product-rotating.config';
import { ProductRotatingPrd } from './product-rotating-prd';
import { Suspense } from 'react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';
import { Html } from '@react-three/drei';
import { Vector3 } from 'three';

const meta = {
  title: 'Three/Experiences/InteractivePDP',
  component: ProductRotatingPrd,
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
            <p className="text-gray-300 text-xs text-center w-90">
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
} satisfies Meta<typeof ProductRotatingPrd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractivePDP: Story = {
  args: {
    cameraView: FootwearViews.LEFT,
    glbUrl: SHOE_URL,
  },
};
