import {type StoryObj, type Meta } from '@storybook/react'
import WebglBasis from './webgl-basis.js';

const meta = {
  title: 'Three/WebGL/WebglBasis',
  component: WebglBasis,
} satisfies Meta<typeof WebglBasis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WebGL_Basis: Story = {
  globals: {
    backgrounds: { value: 'onlight' },
    theme: 'light',
    
  },
};