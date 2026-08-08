import { type StoryObj, type Meta } from '@storybook/react';
import Pool3D from './pool-3d';

const meta = {
  title: 'ThreeJs/Experiences/DeepPool',
  component: Pool3D,
} satisfies Meta<typeof Pool3D>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DeepPool: Story = {};
