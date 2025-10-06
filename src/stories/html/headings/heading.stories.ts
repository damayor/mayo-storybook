import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';
import Heading from './heading';


// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Html/Components/Heading',
  component: Heading,
  parameters: {
    level: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Heading1: Story = {
  args: {
    level: 1,
    children: 'Heading 1'
  },
};

export const Heading2: Story = {
  args: {
    level: 2,
    children: 'Heading 2'
  },
};
export const Heading3: Story = {
  args: {
    level: 3,
    children: 'Heading 3'
  },
};
export const Heading4: Story = {
  args: {
    level: 4,
    children: 'Heading 4'
  },
};
export const Heading5: Story = {
  args: {
    level: 5,
    children: 'Heading 5'
  },
};
export const Heading6: Story = {
  args: {
    level: 6,
    children: 'Heading 6'
  },
};
