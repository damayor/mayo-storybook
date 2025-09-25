import type { Meta, StoryObj } from '@storybook/react-vite';

import FiberCanvas from './FiberCanvas';

const meta = {
  title: 'Three/Fiber Canvas',
  component: FiberCanvas
} satisfies Meta<typeof FiberCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Canvas3D: Story = {
};
