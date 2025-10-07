
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';

const meta = {
  title: 'Html/Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: 'primary'
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    label: 'Ola ke ace',
  },
};

export const Black: Story = {
  args: {
    color: 'neutral'
  },
};

export const Outline: Story = {
  args: {
    color: 'outline'
  },
  globals: {
    backgrounds: { value: 'onlight' },
    theme: 'light',
    
  },
};


export const TransparentOnDark: Story = {
  args: {
    color: 'neutral',
    theme: 'ondark'
  },
  globals: {
    backgrounds: { value: 'ondark' },
    theme: 'dark',
  },
  
};

export const WhiteOnDark: Story = {
  args: {
    color: 'info'
  },
  globals: {
    backgrounds: { value: 'ondark' },
    theme: 'dark',
  },
};