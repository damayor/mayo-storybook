
import { ProductModels } from '../../non-stories-components/helpers/constants/scene-constants'
import type { Meta, StoryObj } from '@storybook/react';
import { FootwearViews } from '../product-rotating/product-rotating.config';
import ProductRotatingProd from './product-rotating-prd';

const meta = {
  title: 'Three/Views/InteractivePDP',
  component: ProductRotatingProd,
  argTypes: {
    cameraView: {
      options: Object.keys(FootwearViews),
      control: { type: 'select' },
    },
    glbUrl: {
      control: false,
      table: { disable: true },
    },
  }

} satisfies Meta<typeof ProductRotatingProd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractivePDP: Story = {
  args: {
    cameraView: FootwearViews.LEFT
  }
};



