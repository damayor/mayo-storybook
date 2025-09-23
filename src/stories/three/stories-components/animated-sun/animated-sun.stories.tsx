import { type Meta, type StoryObj } from '@storybook/react'
import React from 'react'
import AnimatedSun from './animated-sun'
import type MouseTrail from '../mouse-trail/mouse-trail';

const meta = {
  title: 'Three/Views/Animated Sun',
  component: AnimatedSun,
  argTypes: {
    gizmoType: {
      options: ['none', 'viewCube', 'viewPort'],
      control: {
        type: 'select',
      },
    },
    lightPositionX: {
      control: { type: 'range', min: -30, max: 30, step: 1 },
    },
    lightPositionZ: {
      control: { type: 'range', min: -30, max: 40, step: 1 },
    },
  },
} satisfies Meta<typeof AnimatedSun>


export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    gizmoType: 'none',
    lightPositionX: -20,
    lightPositionZ: 40
  }
};
// const Template: ComponentStory<typeof AnimatedSun> = (args) => <AnimatedSun {...args} />

// export const Default = Template.bind({})
// Default.args = {

// }
