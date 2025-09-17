import { FootwearViews } from './product-rotating.config'

import ProductRotating from './product-rotating'
import { ProductModels } from '../../../../helpers/constants/scene-constants'
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Three/Components/Rotating Product',
  component: ProductRotating,
  argTypes: {
    glbUrl: {
      options: Object.keys(ProductModels),
      mapping: ProductModels,
      control: {
        type: 'select',
      },
    },
    cameraView: {
      options: Object.keys(FootwearViews),
      control: { type: 'select' },
    },
    gizmoType: {
      options: ['none', 'viewCube', 'viewPort'],
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof ProductRotating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Card3D: Story = {
  args: {
    cameraView: FootwearViews.FRONT,
    enableOrbitControl: true,
    glbUrl: 'PS4',
    gizmoType: 'viewCube',
  }
};

