
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';

const meta = {
  title: 'Html/Components/ButtonDUI',
  component: Button,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Button>;

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
  globals: {
    backgrounds: { value: 'onlight' },
  },
};

export const White: Story = {
  args: {
    color: 'info'
  },
  globals: {
    backgrounds: { value: 'onlight' },
    theme: 'light',
    
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

//Is the same white
export const TransparentOnLight: Story = {
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
    color: 'neutral'
  },
  globals: {
    backgrounds: { value: 'ondark' },
    theme: 'dark',
  },
  
};

