
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Html/Components/ButtonDUI',
  component: Button,
  args: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  args: {
    color: 'light',
    label: 'Ola ke ace',
  },
};

export const Dark: Story = {
  args: {
    color: 'dark',
    label: 'Ola ke ace',
  },
};

export const Primary: Story = {
  args: {
    color: 'primary',
    label: 'Ola ke ace',
  },
};