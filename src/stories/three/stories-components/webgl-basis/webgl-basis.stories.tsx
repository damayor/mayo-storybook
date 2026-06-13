import { type StoryObj, type Meta } from '@storybook/react';
import WebglBasis from './webgl-basis.js';

const meta = {
  title: 'WebGL/Cube3DEditor',
  component: WebglBasis,
} satisfies Meta<typeof WebglBasis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cube3DEditor: Story = {
  globals: {
    backgrounds: { value: 'onlight' },
    theme: 'light',
  },
};