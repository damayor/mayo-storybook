
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './card';
import { projectsData } from './../../../../src/data/projects';


const meta = {
  title: 'Html/Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const project = projectsData["xr"]

export const Primary: Story = {
  args: {
    picture:project.images.at(0)!,
    projectField:project.projectField,
    projectTitle:project.projectPublicTitle,
    subtitle:project.subtitle,
    tags:project.tags,
    technologies:project.technologies,
  }
};

