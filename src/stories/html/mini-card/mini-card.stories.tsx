
import type { Meta, StoryObj } from '@storybook/react';
import { projectsData } from '../../../data/projects';
import { MiniCard } from './mini-card';

export const projectsMini = [
    {
      projectTitle: "EventRaze",
      description: "Event management platform with admin dashboard for seamless organization.",
      tags: ['web', 'mobile'],
      technologies: ['HTML', 'CSS', 'Javascript'],
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"
    },
    {
      projectTitle: "Medical VR Trainer",
      description: "Immersive training simulator combining visual and haptic interaction for medical procedures.",
      tags: ['vr', 'game'],
      technologies: ['Unity', 'C#'],
      image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=400&fit=crop"
    },
    {
      projectTitle: "Mobile Finance App",
      description: "Cross-platform financial management tool with real-time sync and analytics.",
      tags: ['mobile'],
      technologies: ['Android', 'React', 'Tailwind'],
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop"
    },
    {
      projectTitle: "AR Shopping Experience",
      description: "Augmented reality application for virtual product visualization in retail spaces.",
      tags: ['mobile', 'vr'],
      technologies: ['Mobile Dev', 'NodeJS'],
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
    }
  ];

const meta = {
  title: 'Html/Components/MiniCard',
  component: MiniCard,
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof MiniCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const project = projectsData["xr"]

export const Primary: Story = {
  args: {
    // picture:project.images.at(0)!,
    // projectField:project.projectField,
    projectTitle:project.projectPublicTitle,
    // subtitle:project.subtitle,
    tags:project.tags,
    technologies:project.technologies,
    // title: "EventRaze",
    description: "Event management platform with admin dashboard for seamless organization.",
    // icons: ['web', 'mobile'],
    // tags: ['HTML5', 'CSS3', 'JavaScript'],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"
  }
};

