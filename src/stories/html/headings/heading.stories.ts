import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';
import Heading from './heading';

const meta = {
  title: 'Html/Components/Heading',
  component: Heading,
  parameters: {
    level: 'centered',
  },
  tags: ['autodocs'], 
  args: { onClick: fn() },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Heading1: Story = {
  args: {
    level: 1,
    children: 'Heading 1',
    variant: 'neutral',
  },
};

export const Heading1OnDark: Story = {
  args: {
    level: 1,
    children: 'Heading 1',
    variant: 'info',
  },
  globals: {
    backgrounds: { value: 'ondark' },
    theme: 'dark',
  },
};

export const Heading2: Story = {
  args: {
    level: 2,
    children: 'Heading 2'
  },
};

export const Heading2OnDark: Story = {
  args: {
    level: 2,
    children: 'Heading 2',
    variant: 'info',
  },
  globals: {
    backgrounds: { value: 'ondark' },
    theme: 'dark',
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
// export const Heading5: Story = {
//   args: {
//     level: 5,
//     children: 'Heading 5'
//   },
// };
// export const Heading6: Story = {
//   args: {
//     level: 6,
//     children: 'Heading 6'
//   },
// };
