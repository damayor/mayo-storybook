import {type StoryObj, type Meta } from '@storybook/react'
import Pool3D from './pool3D';

const meta = {
  title: 'Three/Views/Pool_3D',
  component: Pool3D,
} satisfies Meta<typeof Pool3D>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pool_3D: Story = {

};