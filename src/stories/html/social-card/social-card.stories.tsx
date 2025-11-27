
import type { Meta, StoryObj } from '@storybook/react';
import { SocialCard } from './social-card';
import { projectsData } from '../../../data/projects';


const meta = {
  title: 'Html/Components/SocialCard',
  component: SocialCard,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof SocialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const project = projectsData["xr"]

export const Primary: Story = {

};

