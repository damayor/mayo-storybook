import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { ButtonThree } from './ButtonThree';
import FiberCanvas from './FiberCanvas';

const meta = {
  title: 'ThreeJs/Fiber Canvas',
  component: FiberCanvas
} satisfies Meta<typeof FiberCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Canvas3D: Story = {
};
