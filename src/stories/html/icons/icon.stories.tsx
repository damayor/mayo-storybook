
import type { Meta, StoryObj } from '@storybook/react';
import { Icon, techIconMap } from './icon';

const meta = {
  title: 'Html/Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    technology: {
      options: Object.keys(techIconMap),
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
     technology: 'NodeJS',
     size:'medium'
  }
};

