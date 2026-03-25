import {type StoryObj, type Meta } from '@storybook/react'
import CubeEditor from './cube-editor';

const meta = {
  title: 'Three/Native/CubeEditor',
  component: CubeEditor,
} satisfies Meta<typeof CubeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cube_Editor: Story = {

};