import {type StoryObj, type Meta } from '@storybook/react'
import VanillaThree from './vanilla-three';

const meta = {
  title: 'Three/Native/VanillaThree',
  component: VanillaThree,
} satisfies Meta<typeof VanillaThree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vanilla_Three: Story = {

};