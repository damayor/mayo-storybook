import type { Meta, StoryObj } from '@storybook/react';
import FloatingCard from './floating-card';

const meta: Meta<typeof FloatingCard> = {
  title: 'Three/Experiences/SocialCard',
  component: FloatingCard,
  parameters: {
    layout: 'fullscreen',
  }
   

};

export default meta;
type Story = StoryObj<typeof FloatingCard>;

export const SocialCard: Story = {
  args: {},
};
