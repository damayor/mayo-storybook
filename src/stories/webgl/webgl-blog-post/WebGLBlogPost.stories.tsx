import { type Meta, type StoryObj } from '@storybook/react';
import WebGLBlogPost from './WebGLBlogPost';

const meta = {
  title: 'WebGL/Blog/Ray Tracing Post',
  component: WebGLBlogPost,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof WebGLBlogPost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RayTracingPost: Story = {
  globals: {
    backgrounds: { value: 'onlight' },
    theme: 'light',
  },
};
