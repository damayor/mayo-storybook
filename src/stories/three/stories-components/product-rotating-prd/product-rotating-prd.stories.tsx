import { ProductModels, SHOE_URL } from '../../helpers/constants/scene-constants';
import type { Meta, StoryObj } from '@storybook/react';
import { FootwearViews } from '../product-rotating/product-rotating.config';
import { ProductRotatingPrd } from './product-rotating-prd';
import { Suspense } from 'react';
import MayoCanvas from '../../non-stories-components/mayo-canvas/mayo-canvas';
import { Vector3 } from 'three';

const meta = {
  title: 'ThreeJs/Experiences/EcommerceInteractive',
  component: ProductRotatingPrd,
  decorators: [
    (Story) => (
      <div className="relative">
        <MayoCanvas
          enableOrbitControls={false}
          environmentPreset="studio"
          gizmoType="viewCube"
          overrideCameraPos={new Vector3(0, 1, 1.5)}
        >
          <Suspense fallback={<mesh />}>
            <Story />
          </Suspense>
        </MayoCanvas>
        <p className="absolute bottom-2 left-1/2 w-full -translate-x-1/2 text-center text-xs text-neutral-500">
          All 3D assets displayed are property of <b>adidas</b> and are used here only for
          demonstration purposes.
        </p>
      </div>
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

export const EcommerceInteractive: Story = {
  parameters: { showPanel: true },
  args: {
    cameraView: FootwearViews.LEFT,
    glbUrl: SHOE_URL,
  },
};
