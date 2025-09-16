import {type StoryObj, type Meta } from '@storybook/react'
import TerrainManager from './terrain-manager';

const meta = {
  title: 'Three/Components/Terrain',
  component: TerrainManager,
} satisfies Meta<typeof TerrainManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Terrain: Story = {

};