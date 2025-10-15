
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';

const meta = {
  title: 'Html/Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
      projectTitle: "ORTHÁPTICA",
      resume: "Simulators with one-to-one scale, not only with a visual interaction but on a haptic interaction too. I've developed training simulators with mixed reality in order to acquire immersive learning or like it's called nowadays 'serious games'.",
      picture: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop",
      toolsUsed: ["virtual reality", "oculus"],
      projectField: "VR Development"
  }
};

